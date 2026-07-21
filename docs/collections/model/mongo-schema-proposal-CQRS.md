# Mongo schema proposal — CQRS / Event Sourcing

This document describes an alternative Phase 2 storage model based on
Command Query Responsibility Segregation (CQRS) with event sourcing. It
is a **proposal under evaluation** and sits alongside the aggregate-based
proposal in [mongo-schema-proposal.md](./mongo-schema-proposal.md).

Before reading this document, it is worth understanding how the aggregate
model differs from the Phase 1 model — see
[Phase 1 movement store](./phase1-waste-inputs.md) for that baseline.

## Decision context

The aggregate model was decided in
[D-037](../decisions.md#d-037). This proposal represents a third model
that was not compared in D-037; it addresses all five of D-037's reasons
against per-event-type collections but does not yet supersede it. If the
team adopts this approach after a spike, D-037 and
[D-034](../decisions.md#d-034) (the history/revision pattern) will need
to be superseded by a new decision.

A full evaluation of this approach against every decision in the register
and against the live Phase 1 implementation is available as an
[interactive evaluation report][eval-artifact].

An annotated code sketch of the four Phase 2 write paths is available as
an [interactive architecture sketch][sketch-artifact].

[sketch-artifact]: https://claude.ai/code/artifact/65564a71-55db-4329-9910-b7b5e07b3133
[eval-artifact]:   https://claude.ai/code/artifact/f52d0e9b-f90d-44d0-b956-0dafbe9a5fb0

---

## Core concept

In the aggregate model, the `movements` and `transfers` documents are the
source of truth — they are written directly and mutated in place.

In the CQRS / event-sourcing model:

- An immutable **event store** (`events` collection) is the only source
  of truth. Nothing is ever updated or deleted from it.
- **Projections** (`movements` and `transfers` collections) are derived
  from the event store and rebuilt at any time by replaying events. They
  are read models — their document shapes are identical to the ones in
  `mongo-schema-proposal.md`, but they are derived rather than primary.
- **Aggregate roots** are in-memory objects rehydrated by replaying a
  stream for a single request. They enforce domain invariants before each
  write. They are never persisted.

The write path for every Phase 2 endpoint follows the same pattern:

1. Load the event stream for the aggregate (where the aggregate already
   exists).
2. Rehydrate the aggregate root from the stream and enforce invariants.
3. Build the event.
4. Append the event to the stream (concurrency guard via unique index).
5. Update the projection synchronously in the same request.

---

## Collections

### Overview

| Collection          | Role           | Source of truth | Phase |
|---------------------|----------------|-----------------|-------|
| `events`            | Event store    | Yes             | 2     |
| `movements`         | Projection     | No — derived    | 2     |
| `transfers`         | Projection     | No — derived    | 2     |
| `invalid-submissions` | Operational  | Partial         | 1 + 2 |
| `waste-inputs`      | Aggregate (Phase 1) | Yes        | 1 only |
| `waste-inputs-history` | Snapshots (Phase 1) | Yes     | 1 only |

The Phase 1 collections (`waste-inputs`, `waste-inputs-history`) are
unchanged. Phase 2 does not read from or write to them. The two models
coexist in the same MongoDB database without collision.

---

## The event store (`events`)

### Purpose

Append-only log of all business facts across both Movement and Transfer
aggregates. The only write operation is `insertOne`. Documents are never
updated or deleted.

### Stream naming

Every event belongs to a named stream. The stream ID encodes both the
aggregate type and its public identifier:

| Aggregate  | Stream ID format        | Example                        |
|------------|-------------------------|--------------------------------|
| Movement   | `movement-{movementId}` | `movement-25ABC123`            |
| Transfer   | `transfer-{transferId}` | `transfer-25XYZ456`            |

### Document shape

```javascript
{
  _id:            ObjectId,          // MongoDB-assigned; not exposed in the public API
  streamId:       String,            // e.g. "movement-25ABC123"
  sequenceNumber: Number,            // 1-based, monotonically increasing per stream
  eventType:      String,            // see event types below
  payload:        Object,            // event-specific business data
  metadata: {
    submittingOrganisation: {
      defraCustomerOrganisationId: String
    },
    apiCode:  String,                // optional: which API key was used
    traceId:  String
  },
  recordedAt:     Date               // server timestamp at append time
}
```

### Concurrency guard

A unique compound index on `{ streamId: 1, sequenceNumber: 1 }` is the
only concurrency control. Two writers trying to append at position `n+1`
on the same stream produce a duplicate-key error (MongoDB code `11000`),
which the application layer surfaces as a `ConcurrencyError`. No
application-level `revision` field or session lock is needed.

This replaces the `{ _id, revision }` filter used in the Phase 1
`updateWasteInput` service.

---

## Event types

All events for Phase 2 are listed below. `MovementCreated` and
`TransferCreated` each start a new stream (`sequenceNumber: 1`). All
others append to an existing stream.

### Movement stream (`movement-{movementId}`)

#### `MovementCreated`

Appended by `POST /movements`. Starts the movement stream.

```javascript
{
  eventType: 'MovementCreated',
  payload: {
    movementId:                 String,  // sqid — e.g. "25ABC123"
    estimatedDateTimeCollected: Date,
    hazardousWasteConsignmentCode: String,   // optional
    yourUniqueReference:        String,      // optional
    otherReferencesForMovement: [{ label: String, reference: String }],
    specialHandlingRequirements: String,     // optional
    carrier:       Object,
    brokerOrDealer: Object,                  // optional
    producer:      Object,
    receiver:      Object,
    wasteItems:    [Object],                 // EWC codes, weights (estimated), haz/POPs
    validation: {
      warnings: [Object]                     // cross-check results at creation time
    }
  }
}
```

#### `CollectionRecorded`

Appended by `POST /movements/{movementId}/collection`.

```javascript
{
  eventType: 'CollectionRecorded',
  payload: {
    movementId:              String,
    sequence:                Number,  // 1-based; derived from aggregate at append time
    collectionType:          String,  // 'STATIC' | 'TRANSIT'
    actualDateTimeCollected: Date,
    yourUniqueReference:     String,  // optional
    otherReferencesForMovement: [{ label: String, reference: String }],
    carrier:             Object,
    receivedFromCarrier: Object       // required when collectionType is 'TRANSIT'
  }
}
```

#### `CollectionAmended`

Appended by `PUT /movements/{movementId}/collection`. Represents a
correction or soft-delete of the latest active collection event. The
aggregate applies this during rehydration.

```javascript
{
  eventType: 'CollectionAmended',
  payload: {
    movementId: String,
    sequence:   Number,    // which collection event is being amended
    isDeleted:  Boolean,
    // amended fields when isDeleted is false:
    collectionType:          String,   // optional
    actualDateTimeCollected: Date,     // optional
    carrier:                 Object    // optional
  }
}
```

#### `MovementDeleted`

Appended by `PUT /movements/{movementId}` when `isDeleted: true`. The
aggregate enforces that no `CollectionRecorded` event exists in the
stream before allowing this.

```javascript
{
  eventType: 'MovementDeleted',
  payload: {
    movementId: String
  }
}
```

#### `MovementUndeleted`

Appended by `PUT /movements/{movementId}` when `isDeleted: false`.

```javascript
{
  eventType: 'MovementUndeleted',
  payload: {
    movementId: String
  }
}
```

---

### Transfer stream (`transfer-{transferId}`)

#### `TransferCreated`

Appended by `POST /transfers`. Starts the transfer stream.

```javascript
{
  eventType: 'TransferCreated',
  payload: {
    transferId:            String,    // sqid — e.g. "25XYZ456"
    movementIds:           [String],  // one or more movementIds linked at this drop-off
    actualDateTimeDropOff: Date,
    yourUniqueReference:   String,    // optional
    otherReferencesForMovement: [{ label: String, reference: String }],
    carrier: Object,
    dropOff: {
      siteName:        String,
      exemptionNumber: String,        // optional
      address: {
        fullAddress: String,
        postcode:    String
      }
    }
  }
}
```

#### `WasteReceived`

Appended by `POST /transfers/{transferId}/receipt`.

```javascript
{
  eventType: 'WasteReceived',
  payload: {
    transferId:       String,
    dateTimeReceived: Date,
    hazardousWasteConsignmentCode:    String,   // optional
    reasonForNoConsignmentCode:       String,   // optional
    yourUniqueReference:              String,   // optional
    otherReferencesForMovement: [{ label: String, reference: String }],
    specialHandlingRequirements: String,        // optional
    carrier:       Object,
    brokerOrDealer: Object,                     // optional
    receiver:      Object,
    receipt: {
      address: Object
    },
    wasteItems:    [Object],     // EWC codes, actual weights, haz/POPs, disposal codes
    outcome: {
      status: String,            // reserved: see D-025
      reason: String
    },
    validation: {
      warnings: [Object]         // includes D-006 carrier mismatch if present
    }
  }
}
```

#### `ReceiptAmended`

Appended by `PUT /transfers/{transferId}/receipt`. Only the authoring
organisation may append this (D-036).

```javascript
{
  eventType: 'ReceiptAmended',
  payload: {
    transferId: String,
    // amended fields:
    dateTimeReceived: Date,     // optional
    carrier:          Object,   // optional
    receiver:         Object,   // optional
    wasteItems:       [Object], // optional
    outcome:          Object,   // optional
    validation: {
      warnings: [Object]
    }
  }
}
```

#### `TransferDeleted`

Appended by `PUT /transfers/{transferId}` when `isDeleted: true`. The
aggregate enforces that no `WasteReceived` event exists in the stream.

```javascript
{
  eventType: 'TransferDeleted',
  payload: {
    transferId: String
  }
}
```

#### `TransferUndeleted`

Appended by `PUT /transfers/{transferId}` when `isDeleted: false`.

```javascript
{
  eventType: 'TransferUndeleted',
  payload: {
    transferId: String
  }
}
```

---

## Projection collections

### Purpose

`movements` and `transfers` are read models rebuilt from the event store.
They exist to serve GET requests without replaying event streams on every
read. Their document shapes are identical to the shapes in
[mongo-schema-proposal.md](./mongo-schema-proposal.md) — the only
difference is that they are derived, not primary.

If a projection document is lost or corrupted, it is rebuilt by replaying
the corresponding stream. If a projection field name needs changing, the
fix is to update the projection handler and replay. No data is ever lost
because the event store is the source of truth.

### `movements` projection

One document per `movementId`. Built by applying `MovementCreated`,
`CollectionRecorded`, `CollectionAmended`, `MovementDeleted`, and
`MovementUndeleted` events in sequence order.

```javascript
{
  _id:           String,   // movementId
  movementId:    String,
  state:         String,   // 'PLANNED' | 'IN_COLLECTION' | 'IN_TRANSIT'
  revision:      Number,   // sequenceNumber of the last applied event
  isDeleted:     Boolean,
  createdAt:     Date,
  lastUpdatedAt: Date,
  traceId:       String,

  creation: {
    recordedAt:                   Date,
    submittingOrganisation:       { defraCustomerOrganisationId: String },
    estimatedDateTimeCollected:   Date,
    hazardousWasteConsignmentCode: String,
    yourUniqueReference:          String,
    otherReferencesForMovement:   [{ label: String, reference: String }],
    specialHandlingRequirements:  String,
    carrier:       Object,
    brokerOrDealer: Object,
    producer:      Object,
    receiver:      Object,
    wasteItems:    [Object],
    validation:    { warnings: [Object] }
  },

  collectionEvents: [
    {
      sequence:                Number,
      recordedAt:              Date,
      submittingOrganisation:  { defraCustomerOrganisationId: String },
      collectionType:          String,   // 'STATIC' | 'TRANSIT'
      actualDateTimeCollected: Date,
      yourUniqueReference:     String,
      otherReferencesForMovement: [{ label: String, reference: String }],
      carrier:             Object,
      receivedFromCarrier: Object,
      isDeleted:           Boolean,
      validation:          { warnings: [Object] }
    }
  ],

  transferIds: [String]   // denormalised convenience field; pushed by applyTransferCreated
}
```

The `revision` field on the projection carries the `sequenceNumber` of
the last event applied. It is used by consumers that want to know the
current version of a document. It is **not** used as a concurrency guard
on writes — that role belongs to the unique index on the `events`
collection.

### `transfers` projection

One document per `transferId`. Built by applying `TransferCreated`,
`WasteReceived`, `ReceiptAmended`, `TransferDeleted`, and
`TransferUndeleted` events in sequence order.

```javascript
{
  _id:           String,   // transferId
  transferId:    String,
  movementIds:   [String],
  state:         String,   // 'DROPPED_OFF' | 'RECEIVED'
  revision:      Number,   // sequenceNumber of the last applied event
  isDeleted:     Boolean,
  createdAt:     Date,
  lastUpdatedAt: Date,
  traceId:       String,

  dropOff: {
    recordedAt:              Date,
    submittingOrganisation:  { defraCustomerOrganisationId: String },
    actualDateTimeDropOff:   Date,
    yourUniqueReference:     String,
    otherReferencesForMovement: [{ label: String, reference: String }],
    carrier:  Object,
    dropOff: {
      siteName:        String,
      exemptionNumber: String,
      address:         Object
    },
    isDeleted:  Boolean
  },

  receipt: null | {
    recordedAt:              Date,
    submittingOrganisation:  { defraCustomerOrganisationId: String },
    dateTimeReceived:        Date,
    hazardousWasteConsignmentCode: String,
    reasonForNoConsignmentCode:    String,
    yourUniqueReference:     String,
    otherReferencesForMovement: [{ label: String, reference: String }],
    specialHandlingRequirements: String,
    carrier:       Object,
    brokerOrDealer: Object,
    receiver:      Object,
    receipt:       Object,
    wasteItems:    [Object],
    outcome:       Object,
    validation:    { warnings: [Object] }
  }
}
```

### Notes on projections

- The document shapes above match `mongo-schema-proposal.md` except for
  `revision`: in the aggregate model `revision` is the concurrency guard;
  here it is informational only.
- Neither `movements-history` nor `transfers-history` collections are
  needed. The event store is the history. Corrections appear as
  `CollectionAmended` / `ReceiptAmended` events alongside their originals;
  the full amendment trail is always recoverable by reading the stream.
- `movements.transferIds[]` is denormalised convenience data, pushed by
  the `applyTransferCreated` projection handler when a new transfer is
  created. It is not the source of truth for the Movement–Transfer
  relationship; `transfers.movementIds[]` is.

---

## Aggregate roots

Aggregate roots are pure in-memory objects. They are rebuilt by replaying
a stream on each command request. They are never persisted to MongoDB.

### `MovementAggregate`

Tracks the minimum state needed to enforce invariants on the movement
stream:

| Field             | Set by                   | Purpose                               |
|-------------------|--------------------------|---------------------------------------|
| `movementId`      | `MovementCreated`        | Identity                              |
| `state`           | each event               | Lifecycle state                       |
| `isDeleted`       | `MovementDeleted/Undeleted` | Deletion guard                    |
| `sequenceNumber`  | every event              | Expected position for next append     |
| `collectionEvents`| `CollectionRecorded/Amended` | Ordered summary for D-029 checks |
| `creationAuthor`  | `MovementCreated.metadata` | D-036 amend-authorisation check     |

Key invariants enforced:

- `assertNotDeleted()` — blocks all writes to a deleted movement.
- `assertCollectionTypeValid(type)` — D-029: first active event must be
  `STATIC`; subsequent events must be `TRANSIT`.
- `assertCollectionSequenceNotClosed(db)` — D-029: blocks collection
  writes once the movement appears in any transfer (cross-projection read
  on `movements.transferIds`; see known gap below).
- `assertLatestCollectionDeletable()` — D-009 + D-029: soft-delete is
  tail-only.
- `assertDeletionPermitted()` — D-009: movement cannot be deleted once a
  collection event has been recorded.
- `assertAmendAuthorisedBy(org)` — D-036: only the creation author may
  amend.

### `TransferAggregate`

| Field            | Set by               | Purpose                                       |
|------------------|----------------------|-----------------------------------------------|
| `transferId`     | `TransferCreated`    | Identity                                      |
| `state`          | each event           | Lifecycle state                               |
| `isDeleted`      | `TransferDeleted/Undeleted` | Deletion guard                        |
| `sequenceNumber` | every event          | Expected position for next append             |
| `movementIds`    | `TransferCreated`    | Referenced movements                          |
| `hasReceipt`     | `WasteReceived`      | Blocks duplicate receipts                     |
| `dropOffCarrier` | `TransferCreated`    | D-006 carrier cross-check at receipt (free — no extra read) |
| `dropOffAuthor`  | `TransferCreated.metadata` | D-036 drop-off amend-authorisation      |
| `receiptAuthor`  | `WasteReceived.metadata`   | D-036 receipt amend-authorisation       |

Key invariants enforced:

- `assertNotDeleted()` — blocks all writes to a deleted transfer.
- `assertReceiptNotYetRecorded()` — D-015: only one receipt per transfer.
- `assertDeletionPermitted()` — D-009: transfer cannot be deleted once a
  receipt exists.
- `checkCarrierMatch(carrier)` — D-006: compares receipt carrier against
  `dropOffCarrier`; returns a warning object or `null`. No DB read needed.
- `assertDropOffAmendAuthorisedBy(org)` / `assertReceiptAmendAuthorisedBy(org)` — D-036.

---

## Write-path mapping

The four Phase 2 POST endpoints and their CQRS write paths:

### `POST /movements`

1. Validate Joi schema at route boundary.
2. Call `handleCreateMovement(db, command)`.
3. Build `MovementCreated` event.
4. `appendEvent(db, 'movement-{id}', 0, event)` — new stream; `seq=0`
   means the unique index rejects any duplicate `movementId`.
5. `applyMovementCreated(db, storedEvent)` — `insertOne` into
   `movements`.
6. Return `{ movementId }`.

### `POST /movements/{movementId}/collection`

1. Validate Joi schema.
2. Call `handleRecordCollection(db, command)`.
3. `loadStream(db, 'movement-{id}')` — throws `MOVEMENT_NOT_FOUND` if
   stream does not exist.
4. `MovementAggregate.rehydrate(events)`.
5. `agg.assertNotDeleted()`.
6. Cross-projection check: `movements.transferIds.length > 0` → throw
   if the collection sequence is closed (D-029).
7. `agg.assertCollectionTypeValid(payload.collectionType)` — D-029.
8. Build `CollectionRecorded` event with `sequence:
   agg.nextCollectionSequence()`.
9. `appendEvent(db, 'movement-{id}', agg.sequenceNumber, event)` —
   concurrent write blocked by unique index.
10. `applyCollectionRecorded(db, storedEvent)` — `$push` to
    `collectionEvents[]`, update `state` and `revision`.
11. Return `HTTP 201`.

### `POST /transfers`

1. Validate Joi schema.
2. Call `handleCreateTransfer(db, command)`.
3. Cross-projection check: all `movementIds` exist in `movements` with
   `isDeleted: false`.
4. Cross-projection check (D-010): if any referenced movement carries
   hazardous waste items, `movementIds.length` must equal `1`.
5. Build `TransferCreated` event.
6. `appendEvent(db, 'transfer-{id}', 0, event)` — new stream.
7. `applyTransferCreated(db, storedEvent)` — `insertOne` into
   `transfers`; `$push transferId` to each referenced `movements`
   document.
8. Return `{ transferId }`.

### `POST /transfers/{transferId}/receipt`

1. Validate Joi schema.
2. Call `handleRecordReceipt(db, command)`.
3. `loadStream(db, 'transfer-{id}')` — throws `TRANSFER_NOT_FOUND` if
   stream does not exist.
4. `TransferAggregate.rehydrate(events)`.
5. `agg.assertNotDeleted()`.
6. `agg.assertReceiptNotYetRecorded()`.
7. `agg.checkCarrierMatch(payload.carrier)` — D-006 warning (no extra
   DB read; carrier captured during rehydration from `TransferCreated`).
8. Build `WasteReceived` event; embed warnings in `payload.validation`.
9. `appendEvent(db, 'transfer-{id}', agg.sequenceNumber, event)`.
10. `applyWasteReceived(db, storedEvent)` — `$set receipt` on
    `transfers`, update `state` and `revision`.
11. Return `{ warnings }`.

---

## Indexes

### `events`

Required:

- `{ streamId: 1, sequenceNumber: 1 }` **unique** — the concurrency
  guard; must exist before any Phase 2 write.
- `{ streamId: 1 }` — supports `loadStream` queries.
- `{ eventType: 1, recordedAt: -1 }` — operational queries by event
  type.
- `{ 'metadata.traceId': 1 }` — request tracing.

### `movements` (projection)

Required:

- `{ _id: 1 }` (implicit on `movementId`)
- `{ movementId: 1 }` unique
- `{ traceId: 1 }`
- `{ transferIds: 1 }`
- `{ state: 1, lastUpdatedAt: -1 }`
- `{ 'creation.submittingOrganisation.defraCustomerOrganisationId': 1 }`

Conditional / query-driven:

- `{ 'collectionEvents.submittingOrganisation.defraCustomerOrganisationId': 1 }`
- `{ 'creation.estimatedDateTimeCollected': 1 }`

### `transfers` (projection)

Required:

- `{ _id: 1 }` (implicit on `transferId`)
- `{ transferId: 1 }` unique
- `{ movementIds: 1 }`
- `{ traceId: 1 }`
- `{ state: 1, lastUpdatedAt: -1 }`
- `{ 'dropOff.submittingOrganisation.defraCustomerOrganisationId': 1 }`
- `{ 'receipt.submittingOrganisation.defraCustomerOrganisationId': 1 }`

Conditional / query-driven:

- `{ 'dropOff.actualDateTimeDropOff': 1 }`
- `{ 'receipt.dateTimeReceived': 1 }`
- `{ 'receipt.receiver.authorisationNumber': 1 }`

---

## Projection rebuild

Because the event store is the source of truth, any projection document
can be rebuilt at any time without data loss.

```javascript
// Rebuild a single movement projection from its event stream.
rebuildMovementProjection(db, movementId)

// Rebuild a single transfer projection from its event stream.
rebuildTransferProjection(db, transferId)
```

A full replay (all movements or all transfers) iterates every distinct
`streamId` prefixed `movement-` or `transfer-` and calls the
corresponding rebuild function. This is the recovery path if a projection
becomes stale due to a failed write step.

---

## Concurrency model comparison

| Concern              | Phase 1 (aggregate)                        | Phase 2 CQRS                              |
|----------------------|--------------------------------------------|-------------------------------------------|
| Guard mechanism      | `{ _id, revision }` in `updateOne` filter | Unique `(streamId, sequenceNumber)` index |
| Concurrent write     | Second writer's `updateOne` matches 0 docs | MongoDB `11000` duplicate-key error       |
| Application response | Return mismatch / retry                    | Raise `ConcurrencyError`; caller retries  |
| Atomic multi-step    | `mongoClient.startSession()` + transaction | Wrap `appendEvent` + projection in session (optional; see open points) |
| History / audit      | Full-document snapshot in `*-history`      | Event log — every fact is permanent       |

---

## Key differences from `mongo-schema-proposal.md`

| Aspect                | Aggregate model                   | CQRS / Event Sourcing                         |
|-----------------------|-----------------------------------|-----------------------------------------------|
| Source of truth       | `movements`, `transfers` docs     | `events` collection                           |
| Write path            | Direct `insertOne` / `updateOne`  | Append event → update projection              |
| History               | `-history` snapshot collections   | Not needed — event log is the history         |
| Concurrency guard     | `revision` field in update filter | Unique `(streamId, sequenceNumber)` index     |
| Correction / amend    | Mutate in place; snapshot to history | Append `*Amended` event; projection replays |
| Rebuild after bug     | Not possible without full history | Replay stream → rebuild projection            |
| Collections removed   | —                                 | `movements-history`, `transfers-history`      |

---

## Known gaps and open points

These items are not yet resolved in this proposal. A full gap analysis
against all 37 decisions is in the [evaluation report][eval-artifact].

- **Two-step write atomicity.** `appendEvent` and the projection update
  are two separate MongoDB operations. If the projection update fails
  after a successful append, the projection is behind the event store.
  Options: wrap both in a MongoDB multi-document transaction (same
  session, consistent with Phase 1 approach), or accept eventual
  consistency with a startup reconciliation check and the rebuild
  functions above. Decision needed before production.

- **Cross-projection check for the closed sequence rule (D-029).** The
  `MovementAggregate` cannot know that a Movement has been dropped off
  from its own stream alone (the `TransferCreated` event goes to the
  transfer stream, not the movement stream). The check is implemented as
  a cross-projection read (`movements.transferIds.length > 0`) in
  `handleRecordCollection`. This is correct and efficient but means the
  command touches both the event stream and the projection. Needs
  documenting as an explicit design choice.

- **PUT command handlers not yet designed.** The sketch covers the four
  Phase 2 POST endpoints only. Amendment and soft-delete handlers
  (`CollectionAmended`, `MovementDeleted`, `ReceiptAmended`,
  `TransferDeleted`, and their `*Undeleted` counterparts) need designing
  with the D-009 lifecycle rules and D-036 authorisation checks in place.

- **D-022 (receipt migration) should be closed as Option 1.** Grafting
  CQRS logic into the existing Phase 1 `POST /movements/receive` handler
  would create a handler that switches paradigms on a flag. The new
  Transfer-scoped endpoint is the clean path.

- **`invalid-submissions` collection.** Phase 2 commands that fail after
  beginning processing (e.g. `movementId` not found, org mismatch) should
  persist to `invalid-submissions` consistently with Phase 1 behaviour.
  The shape in `mongo-schema-proposal.md` applies unchanged.

- **Event schema versioning.** Once `MovementCreated` or
  `TransferCreated` event payloads are in production, their shapes are
  permanent — or an upcaster function is needed to transform old events
  before rehydration. Field names should be finalised before the first
  production write.
