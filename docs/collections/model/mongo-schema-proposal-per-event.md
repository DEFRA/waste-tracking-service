# Mongo schema proposal — Per-event-type collections

This document describes **Option B** for Phase 2 storage: one MongoDB
collection per business event type. It sits alongside the aggregate model
([mongo-schema-proposal.md](./mongo-schema-proposal.md)) and the evaluated-but-rejected
CQRS model ([mongo-schema-proposal-CQRS.md](./mongo-schema-proposal-CQRS.md))
as the three options under evaluation in [D-037](../decisions.md#d-037).

This is a **proposal under evaluation**, not a decided implementation.

---

## Core concept

The aggregate model stores all data for a Movement's lifetime in one document
(creation + collection events embedded). The per-event model separates each
business event into its own collection:

| Business event | Endpoint | Collection |
|---|---|---|
| Movement creation | `POST /movements` | `movement-creations` |
| Collection recording | `POST /movements/{movementId}/collection` | `collection-events` |
| Drop-off / Transfer creation | `POST /transfers` | `transfer-dropoffs` |
| Receipt recording | `POST /transfers/{transferId}/receipt` | `receipt-events` |

Each collection is the canonical home for one event type and is indexed
independently. Cross-event reads — for GETs and for constraint checking —
require joining across collections, either with a MongoDB `$lookup` or
multiple sequential reads in the application layer.

The Phase 1 collections (`waste-inputs`, `waste-inputs-history`) are
unchanged. This model introduces entirely new collections and coexists with
Phase 1 in the same database without collision.

---

## Collections overview

| Collection | Role | Phase | Source of truth |
|---|---|---|---|
| `movement-creations` | Movement creation event | 2 | Yes |
| `movement-creations-history` | Pre-amendment snapshots | 2 | Yes |
| `collection-events` | Collection events (STATIC + TRANSIT) | 2 | Yes |
| `collection-events-history` | Pre-amendment snapshots | 2 | Yes |
| `transfer-dropoffs` | Drop-off event (Transfer creation) | 2 | Yes |
| `transfer-dropoffs-history` | Pre-amendment snapshots | 2 | Yes |
| `receipt-events` | Receipt event | 2 | Yes |
| `receipt-events-history` | Pre-amendment snapshots | 2 | Yes |
| `invalid-submissions` | Unprocessable submissions | 1 + 2 | Partial |
| `waste-inputs` | Phase 1 aggregate | 1 only | Yes |
| `waste-inputs-history` | Phase 1 snapshots | 1 only | Yes |

---

## State management

A Movement transitions through lifecycle states as later events are recorded:

```
PLANNED  →  IN_COLLECTION  →  DROPPED_OFF
```

With events in separate collections, state has no natural single home.
Two options are viable:

**Option B1 — Denormalised state on `movement-creations`.** The `state`
field lives on the creation document and is updated by subsequent event
writes (collection recorded → `IN_COLLECTION`; movement referenced in a
drop-off → `DROPPED_OFF`). Writes that update state must also update the
creation document in the same MongoDB session, making it a multi-document
transaction.

**Option B2 — Read-time derivation.** No `state` field is stored. Every
GET computes state by checking which downstream events exist. Simple to
implement; expensive for any query that filters by state across many
Movements (requires a multi-collection aggregation pipeline).

This proposal uses **Option B1** (denormalised state) for consistency with
the aggregate model pattern and to keep `GET /movements/{movementId}` a
two-collection read rather than a four-collection computation. The
transaction requirement is documented under Write-path mapping.

---

## Concurrency model

The Phase 1 pattern ([D-034](../decisions.md#d-034)) uses `{ _id, revision }`
in an `updateOne` filter as an optimistic concurrency guard — if another
writer mutated the document since it was read, the revision no longer matches
and the update safely fails. This applies to:

- `PUT /movements/{movementId}` — amendment guarded by `revision` on
  `movement-creations`.
- `PUT /movements/{movementId}/collection` — amendment guarded by `revision`
  on the targeted `collection-events` document.
- `PUT /transfers/{transferId}` — soft-delete guarded by `revision` on
  `transfer-dropoffs`.
- `PUT /transfers/{transferId}/receipt` — amendment guarded by `revision` on
  `receipt-events`.

For **appending** a new collection event (`POST /movements/{movementId}/collection`),
there is no existing document to guard against. The concurrency risk is two
concurrent requests both computing `sequence: 3` and both trying to insert.
The guard is a **unique compound index on `{ movementId, sequence }`** in
`collection-events` — the second writer gets a duplicate-key error (MongoDB
code `11000`) and must retry. This replaces the aggregate model's `revision`
increment for collection-event appends.

---

## Document shapes

### `movement-creations`

One document per `movementId`.

```javascript
{
  _id: String,                 // movementId (sqid — e.g. "26ABC123")
  movementId: String,
  state: String,               // PLANNED | IN_COLLECTION | DROPPED_OFF (B1: denormalised)
  revision: Number,            // incremented on PUT /movements amendment
  isDeleted: Boolean,
  createdAt: Date,
  lastUpdatedAt: Date,
  traceId: String,
  submittingOrganisation: {
    defraCustomerOrganisationId: String
  },
  submittedByApiCode: String,  // optional

  estimatedDateTimeCollected: Date,
  hazardousWasteConsignmentCode: String,    // optional
  yourUniqueReference: String,              // optional
  otherReferencesForMovement: [
    { label: String, reference: String }
  ],
  specialHandlingRequirements: String,      // optional

  carrier: Object,
  brokerOrDealer: Object,                   // optional
  producer: Object,
  receiver: Object,
  wasteItems: [Object],                     // EWC codes, estimated weights, haz/POPs

  validation: {
    warnings: [Object]
  }
}
```

Notes:

- `state` is the denormalised signal updated by downstream event writes
  (Option B1). If Option B2 is chosen, remove `state` and derive it at
  read time.
- `revision` guards only `PUT /movements` amendments. It does not guard
  collection event appends — those are guarded by the unique index on
  `collection-events.{ movementId, sequence }`.
- `hazardousWasteConsignmentCode` is needed here so that `POST /transfers`
  can check the hazardous constraint ([D-010](../decisions.md#d-010)) with
  a single read on `movement-creations`.
- `wasteItems` is here for the receipt cross-check ([D-006](../decisions.md#d-006)).

### `movement-creations-history`

Full-document snapshot of `movement-creations` before each successful
`PUT /movements` amendment. Pattern identical to Phase 1 `waste-inputs-history`.

```javascript
{
  ...previousMovementCreationDocument,
  movementId: String,
  timestamp: Date
}
```

---

### `collection-events`

One document per collection event. A Movement with transit handovers
([D-029](../decisions.md#d-029)) has multiple documents here — one `STATIC`
and one or more `TRANSIT` events, each with a distinct `sequence`.

```javascript
{
  _id: ObjectId,               // MongoDB-assigned; not exposed in the public API (D-012)
  movementId: String,          // FK to movement-creations
  sequence: Number,            // 1-based; unique per movementId (guarded by compound index)
  revision: Number,            // incremented on PUT amendment of this event
  isDeleted: Boolean,          // soft-delete (D-009); only the latest active event is eligible
  recordedAt: Date,
  lastUpdatedAt: Date,
  traceId: String,
  submittingOrganisation: {
    defraCustomerOrganisationId: String
  },
  submittedByApiCode: String,  // optional

  collectionType: String,      // STATIC | TRANSIT (D-029)
  actualDateTimeCollected: Date,
  yourUniqueReference: String, // optional
  otherReferencesForMovement: [
    { label: String, reference: String }
  ],
  carrier: Object,
  receivedFromCarrier: Object, // required when collectionType is TRANSIT (D-029)

  validation: {
    warnings: [Object]
  }
}
```

Notes:

- `sequence` starts at `1` for the first collection event on a Movement and
  increments for each transit handover. The unique index on
  `{ movementId, sequence }` is the concurrency guard for appends.
- `_id` is a MongoDB `ObjectId`, not a public sqid — per [D-012](../decisions.md#d-012),
  per-event IDs are not exposed in the public API. The combination of
  `movementId` + `sequence` addresses a collection event for amendment.
- `isDeleted` applies per-event, but only the latest active event is eligible
  for soft-delete (tail-only rule, [D-029](../decisions.md#d-029)).
- No `wasteItems` — weights are not captured at collection ([D-032](../decisions.md#d-032)).

### `collection-events-history`

Full-document snapshot of a `collection-events` document before each
successful `PUT /movements/{movementId}/collection` amendment.

```javascript
{
  ...previousCollectionEventDocument,
  movementId: String,
  sequence: Number,
  timestamp: Date
}
```

---

### `transfer-dropoffs`

One document per `transferId`. Records the drop-off event
(`POST /transfers`). `isDeleted` is the only mutable field via
`PUT /transfers/{transferId}` ([D-017](../decisions.md#d-017)).

```javascript
{
  _id: String,                 // transferId (sqid — e.g. "26XYZ456")
  transferId: String,
  movementIds: [String],       // FK array to movement-creations (D-007)
  revision: Number,            // incremented on PUT soft-delete
  isDeleted: Boolean,
  createdAt: Date,
  lastUpdatedAt: Date,
  traceId: String,
  submittingOrganisation: {
    defraCustomerOrganisationId: String
  },
  submittedByApiCode: String,  // optional

  actualDateTimeDropOff: Date,
  yourUniqueReference: String, // optional
  otherReferencesForMovement: [
    { label: String, reference: String }
  ],

  carrier: Object,             // captured here for D-006 cross-check at receipt
  dropOff: {
    siteName: String,
    exemptionNumber: String,   // optional
    address: {                 // mandatory (D-018)
      fullAddress: String,
      postcode: String
    }
  },

  validation: {
    warnings: [Object]
  }
}
```

Notes:

- `movementIds[]` is the source of truth for the Movement→Transfer
  relationship ([D-007](../decisions.md#d-007)). The aggregate model stores
  a denormalised `transferIds[]` on each Movement; in this model, that
  denormalisation is optional — the `transfer-dropoffs.movementIds` index
  supports reverse lookups.
- `carrier` is stored here because the receipt cross-check
  ([D-006](../decisions.md#d-006)) compares the receipt carrier against the
  drop-off carrier. Having it here means `handleRecordReceipt` reads one
  document (`transfer-dropoffs`) and gets both the existence check and the
  carrier value — no additional read needed.
- `isDeleted` guards the drop-off lifecycle. A drop-off cannot be deleted
  once a receipt exists ([D-009](../decisions.md#d-009)) — checked by
  querying `receipt-events` for the `transferId` before applying the
  soft-delete.

### `transfer-dropoffs-history`

Full-document snapshot of `transfer-dropoffs` before each successful
`PUT /transfers/{transferId}` soft-delete toggle.

```javascript
{
  ...previousTransferDropoffDocument,
  transferId: String,
  timestamp: Date
}
```

---

### `receipt-events`

One document per `transferId`. Created by
`POST /transfers/{transferId}/receipt`.

```javascript
{
  _id: String,                 // transferId — 1:1 with transfer-dropoffs (D-015)
  transferId: String,          // FK to transfer-dropoffs
  revision: Number,            // incremented on PUT /transfers/{transferId}/receipt
  recordedAt: Date,
  lastUpdatedAt: Date,
  traceId: String,
  submittingOrganisation: {
    defraCustomerOrganisationId: String
  },
  submittedByApiCode: String,  // optional

  dateTimeReceived: Date,
  hazardousWasteConsignmentCode: String,   // optional
  reasonForNoConsignmentCode: String,      // optional
  yourUniqueReference: String,             // optional
  otherReferencesForMovement: [
    { label: String, reference: String }
  ],
  specialHandlingRequirements: String,     // optional

  carrier: Object,
  brokerOrDealer: Object,                  // optional
  receiver: Object,
  receipt: {
    address: Object
  },
  wasteItems: [Object],        // EWC codes, actual weights, disposal codes (D-031)
  outcome: {
    status: String,            // reserved — see D-025
    reason: String
  },
  validation: {
    warnings: [Object]         // includes D-006 carrier mismatch warning if present
  }
}
```

Notes:

- `_id` is the `transferId` — a Transfer has at most one receipt
  ([D-015](../decisions.md#d-015)), so the `transferId` is a valid unique
  key. A second `POST` to the same `transferId` gets a duplicate-key error
  (natural idempotency guard).
- Receipt has no `isDeleted`. Once recorded, a receipt cannot be deleted
  ([D-009](../decisions.md#d-009)). The receipt `PUT` amends in place and
  snapshots to history; there is no soft-delete toggle.
- `revision` guards `PUT /transfers/{transferId}/receipt` amendments — same
  pattern as Phase 1 `waste-inputs` revision guard ([D-034](../decisions.md#d-034)).

### `receipt-events-history`

Full-document snapshot of `receipt-events` before each successful
`PUT /transfers/{transferId}/receipt` amendment.

```javascript
{
  ...previousReceiptEventDocument,
  transferId: String,
  timestamp: Date
}
```

---

## Write-path mapping

### `POST /movements`

1. Validate Joi schema at route boundary.
2. Mint `movementId` via `waste-tracking-id-backend`.
3. `insertOne` into `movement-creations` with `revision: 1`, `state: 'PLANNED'`,
   `isDeleted: false`.
4. Return `{ movementId }`.

No cross-collection reads. Single collection write. No transaction needed.

---

### `POST /movements/{movementId}/collection`

1. Validate Joi schema.
2. Read `movement-creations` by `movementId`.
   - `MOVEMENT_NOT_FOUND` (404) if absent.
   - `BusinessRuleViolation` (400) if `isDeleted: true` ([D-009](../decisions.md#d-009)).
3. Check closed-sequence rule ([D-029](../decisions.md#d-029)): query
   `transfer-dropoffs` for any document whose `movementIds` includes this
   `movementId`. If found, the collection sequence is closed — reject with
   `BusinessRuleViolation`.
4. Read `collection-events` for this `movementId`, sorted by `sequence`.
   - Derive current `sequence` as `(max existing sequence) + 1`, or `1` if
     none exist.
   - Enforce ordering ([D-029](../decisions.md#d-029)): if `sequence === 1`,
     `collectionType` must be `STATIC`; if `sequence > 1`, must be `TRANSIT`.
5. `insertOne` into `collection-events` with the computed `sequence`. If
   another concurrent writer already inserted at this `sequence`, MongoDB
   raises a duplicate-key error on `{ movementId, sequence }` — surface as
   `ConcurrencyError` and let the caller retry.
6. In the same MongoDB session, `updateOne` on `movement-creations`:
   `{ $set: { state: 'IN_COLLECTION', lastUpdatedAt } }`. This step does not
   increment `revision` — `revision` on the creation document guards only
   `PUT /movements` amendments; the collection append is guarded by the
   unique index.
7. Return `HTTP 201`.

Cross-collection reads: `movement-creations` (existence + deleted guard),
`transfer-dropoffs` (closed-sequence check), `collection-events` (ordering
check + sequence derivation). The `movement-creations` update in step 6
requires a multi-document write if both the `collection-events` insert and
the state update are to be atomic.

---

### `POST /transfers`

1. Validate Joi schema.
2. Read `movement-creations` for each `movementId` in `payload.movementIds[]`.
   - Fail if any is absent or `isDeleted: true`.
   - Check `collection-events` for each `movementId`: reject if any has an
     active (non-deleted) collection event with `isDeleted: true` at the
     movement level — i.e. a Movement whose Collection is deleted ([D-009](../decisions.md#d-009)).
3. D-010 hazardous check ([D-010](../decisions.md#d-010)): if any referenced
   `movement-creations` document has a non-empty `hazardousWasteConsignmentCode`
   or contains hazardous items in `wasteItems[]`, `movementIds.length` must
   equal `1`. Reject with `BusinessRuleViolation` if not.
4. Mint `transferId` via `waste-tracking-id-backend`.
5. `insertOne` into `transfer-dropoffs` with `revision: 1`, `isDeleted: false`.
6. In the same MongoDB session, `updateMany` on `movement-creations` for each
   `movementId`: `{ $set: { state: 'DROPPED_OFF', lastUpdatedAt } }`.
7. Return `{ transferId }`.

Cross-collection reads: `movement-creations` (existence, deleted, hazardous)
and `collection-events` (deleted status per movement). The `movement-creations`
state update (step 6) requires a multi-document transaction if atomicity with
the `transfer-dropoffs` insert is required.

---

### `POST /transfers/{transferId}/receipt`

1. Validate Joi schema.
2. Read `transfer-dropoffs` by `transferId`.
   - `TRANSFER_NOT_FOUND` (404) if absent.
   - `BusinessRuleViolation` (400) if `isDeleted: true`.
3. Check for duplicate receipt: query `receipt-events` by `transferId`.
   If a document already exists, return `ValidationError` ("Receipt already
   recorded — use `PUT /transfers/{transferId}/receipt` to amend").
4. D-006 carrier cross-check ([D-006](../decisions.md#d-006)): compare
   `payload.carrier` against `transfer-dropoffs.carrier`. Mismatch → push a
   `CARRIER_MISMATCH` warning to `validation.warnings`. Not a hard error.
5. D-036 authoring: `submittingOrganisation` is stamped from the authenticated
   caller and stored on the receipt document.
6. `insertOne` into `receipt-events`. The `_id` is the `transferId` — a
   duplicate-key error here means a concurrent `POST` already completed; the
   application layer catches this and returns the same `ValidationError` as
   step 3.
7. Return `{ warnings }`.

Cross-collection reads: `transfer-dropoffs` (one read — provides existence
check, deleted guard, and the carrier needed for D-006 in a single document).
No additional Movement reads are needed for the carrier check because the
carrier is stored directly on `transfer-dropoffs`.

This is the simplest write path in this model: two collections, one read and
one insert, no transaction required.

---

### `PUT /movements/{movementId}/collection` (amendment)

1. Read `movement-creations` (existence + deleted guard).
2. Read `collection-events` for this `movementId` to find the latest active
   event (highest `sequence` where `isDeleted: false`).
   - `COLLECTION_NOT_RECORDED` (404) if none exist.
3. D-036 authorisation: `submittingOrganisation` on the latest event must
   match the authenticated caller.
4. Read-then-write with revision guard: snapshot the current event to
   `collection-events-history`; `updateOne` with
   `{ movementId, sequence: latestSeq, revision: currentRevision }` filter;
   increment `revision`. Concurrent writer detected by 0 matched documents.
5. Return `HTTP 200`.

---

### `PUT /transfers/{transferId}` (soft-delete)

1. Read `transfer-dropoffs` (existence guard).
2. If `isDeleted: true`, check `receipt-events` — reject if a receipt exists
   ([D-009](../decisions.md#d-009): a Transfer cannot be deleted once a
   receipt has been recorded).
3. D-036 authorisation: `submittingOrganisation` on `transfer-dropoffs` must
   match authenticated caller.
4. Snapshot `transfer-dropoffs` to `transfer-dropoffs-history`.
5. `updateOne` on `transfer-dropoffs` with `{ _id, revision }` filter;
   set `isDeleted`; increment `revision`.
6. Return `HTTP 200`.

---

## Indexes

### `movement-creations`

Required:

- `{ _id: 1 }` — implicit; unique
- `{ movementId: 1 }` — unique
- `{ state: 1, lastUpdatedAt: -1 }` — list queries filtered by state
- `{ 'submittingOrganisation.defraCustomerOrganisationId': 1 }` — org queries
- `{ traceId: 1 }`

Conditional / query-driven:

- `{ 'wasteItems.hazardousWasteConsignmentCode': 1 }` — D-010 hazardous check
- `{ 'creation.estimatedDateTimeCollected': 1 }`
- `{ 'creation.yourUniqueReference': 1 }`

### `movement-creations-history`

- `{ movementId: 1, revision: -1 }`
- `{ movementId: 1, timestamp: -1 }`
- `{ traceId: 1 }`

### `collection-events`

Required:

- `{ movementId: 1, sequence: 1 }` **unique** — concurrency guard for appends;
  also the primary query key for loading all events for a Movement
- `{ movementId: 1, isDeleted: 1, sequence: -1 }` — latest active event lookup
- `{ 'submittingOrganisation.defraCustomerOrganisationId': 1 }`
- `{ traceId: 1 }`

Conditional / query-driven:

- `{ actualDateTimeCollected: 1 }` — date-range queries across all collection events
- `{ collectionType: 1 }` — if queries filtering by STATIC / TRANSIT are needed

### `collection-events-history`

- `{ movementId: 1, sequence: 1, revision: -1 }`
- `{ movementId: 1, timestamp: -1 }`
- `{ traceId: 1 }`

### `transfer-dropoffs`

Required:

- `{ _id: 1 }` — implicit; unique
- `{ transferId: 1 }` — unique
- `{ movementIds: 1 }` — reverse lookup: which Transfer covers a given Movement
- `{ state: 1, lastUpdatedAt: -1 }`
- `{ 'submittingOrganisation.defraCustomerOrganisationId': 1 }`
- `{ traceId: 1 }`

Conditional / query-driven:

- `{ actualDateTimeDropOff: 1 }`
- `{ 'dropOff.address.postcode': 1 }`

### `transfer-dropoffs-history`

- `{ transferId: 1, revision: -1 }`
- `{ transferId: 1, timestamp: -1 }`
- `{ traceId: 1 }`

### `receipt-events`

Required:

- `{ _id: 1 }` — implicit; unique; keyed on `transferId`
- `{ transferId: 1 }` — unique
- `{ 'submittingOrganisation.defraCustomerOrganisationId': 1 }`
- `{ traceId: 1 }`

Conditional / query-driven:

- `{ dateTimeReceived: 1 }`
- `{ 'receiver.authorisationNumber': 1 }`
- `{ 'wasteItems.ewcCode': 1 }`

### `receipt-events-history`

- `{ transferId: 1, revision: -1 }`
- `{ transferId: 1, timestamp: -1 }`
- `{ traceId: 1 }`

---

## GET read patterns

Per-event collections shift cost from writes to reads. The patterns below
illustrate what each common GET requires.

### `GET /movements/{movementId}`

Requires two reads:

1. `movement-creations.findOne({ _id: movementId })` — creation data, state,
   `isDeleted`.
2. `collection-events.find({ movementId }).sort({ sequence: 1 })` — ordered
   collection event array.

The application assembles the response from both results. If `state` is
denormalized (Option B1), step 1 also gives the current lifecycle state
without a third read. If using Option B2 (read-time derivation), a third
read on `transfer-dropoffs` is needed to compute `DROPPED_OFF`.

### `GET /transfers/{transferId}`

Requires two reads:

1. `transfer-dropoffs.findOne({ _id: transferId })` — drop-off data.
2. `receipt-events.findOne({ _id: transferId })` — receipt data, or `null`
   if not yet recorded.

The application assembles the response from both.

### `GET /movements/{movementId}/fate-of-waste` ([D-019](../decisions.md#d-019))

Requires reads across up to all four event collections:

1. `movement-creations` — waste classification, estimated weights, producer.
2. `collection-events` — collection timestamps and carrier chain.
3. `transfer-dropoffs` — drop-off date, site, carrier.
4. `receipt-events` — actual weights, treatment codes, outcome.

This is the most complex read in the model. An aggregation pipeline using
`$lookup` can serve it in one round trip from the database, but the pipeline
is non-trivial. A MongoDB view wrapping this pipeline is the natural
implementation, and is what the Data Architect's original proposal meant by
"resolve at the view level."

---

## How this model relates to the Phase 1 receipt implementation

Phase 1 (`POST /movements/receive` / `PUT /movements/{wasteTrackingId}/receive`)
writes to `waste-inputs` / `waste-inputs-history` — unchanged in this model.

The Phase 2 receipt (`POST /transfers/{transferId}/receipt`) writes to
`receipt-events`. The two receipt handlers share no storage path: the Phase 1
handler continues to use the `waste-inputs` aggregate; the Phase 2 handler
uses `receipt-events`. The revision/history pattern ([D-034](../decisions.md#d-034))
applies to both, but through separate collection pairs.

The carrier cross-check ([D-006](../decisions.md#d-006)) is particularly clean
in this model at Phase 2 receipt time: the `transfer-dropoffs` document
stores the drop-off carrier directly on the event document. A single read of
`transfer-dropoffs` by `transferId` gives both the existence check and the
carrier — no aggregate rehydration or separate reads needed. This contrasts
with the aggregate model, where the carrier must be extracted from the
embedded `dropOff` sub-document on the `transfers` aggregate.

---

## Key differences from Option A (aggregate model)

| Aspect | Option A — Aggregate | Option B — Per-event |
|---|---|---|
| Collections | 2 (`movements`, `transfers`) + 2 history | 4 event + 4 history |
| GET /movements/{id} | 1 read | 2 reads (creation + collection-events) |
| GET /transfers/{id} | 1 read | 2 reads (dropoff + receipt) |
| Fate-of-waste GET | 1–2 reads | 4 reads or 1 `$lookup` pipeline |
| POST collection: concurrency guard | `revision` on `movements` aggregate | Unique index on `{ movementId, sequence }` |
| Transit collection (D-029) | Array embedded in `movements` document | Separate documents in `collection-events` |
| Query by event type | Requires `$match` + `$project` on embedded fields | Direct query on the event collection |
| Independent scalability | Single collection per aggregate | Each event type independently indexed |
| D-034 history | 2 history collections | 4 history collections |
| Phase 1 coexistence | Zero coupling | Zero coupling |
| State machine home | On `movements` document | Denormalized on `movement-creations` or computed at read time |
| Multi-document transactions | Not required on happy paths | Required for state updates on collection-event writes |

---

## Genuine advantages over Option A

**1. Independent event-type queries.** Querying "all collection events recorded
by carrier X this month across all Movements" is a direct query on
`collection-events` with a compound index. In the aggregate model, the same
query requires scanning and unwinding the `collectionEvents[]` array on every
`movements` document — less efficient at large volume and harder to index
selectively.

**2. Bounded document growth.** In the aggregate model, a Movement with many
transit handovers ([D-029](../decisions.md#d-029)) accumulates collection
events inside a single document. There is no explicit cap, but MongoDB's 16 MB
document size limit and BSON overhead make unbounded array growth a latent
risk. Per-event collections grow horizontally (more documents) not vertically
(larger documents).

**3. Simpler migration unit.** Adding a new Phase 3 event type (for example,
a treatment-handover event) means adding a new collection and handler. In the
aggregate model, it means adding a new embedded sub-document or array to an
existing collection that already has live data.

**4. Natural home for cross-event-type operational queries.** A regulator's
query for "all drop-offs for carrier X that have no receipt" is a set
difference between `transfer-dropoffs` and `receipt-events`, joined on
`transferId`. This is a natural `$lookup` in the per-event model. In the
aggregate model, it requires a query on `transfers` where `receipt: null` and
`dropOff.carrier.cbDuNumber: x` — achievable but the carrier is nested inside
the `dropOff` sub-document, requiring a deep-path index.

---

## Known gaps and open points

- **State management decision.** Option B1 (denormalised `state` on
  `movement-creations`) introduces multi-document transaction requirements
  on every collection-event write and every transfer-creation write. Option
  B2 (read-time derivation) avoids transactions but makes state-filtered
  queries expensive. A decision on which approach to take is needed before
  implementation.

- **Transaction scope.** Two of the four POST write paths require coordinated
  writes across collections: `POST /movements/{id}/collection` (insert
  `collection-events` + update `movement-creations.state`) and `POST /transfers`
  (insert `transfer-dropoffs` + update `movement-creations.state` for each
  referenced Movement). Whether to wrap these in MongoDB multi-document
  transactions or to accept a small window of state inconsistency with an
  eventual-consistency repair path needs deciding before production.

- **Fate-of-waste GET implementation.** The most complex read in this model.
  Whether to implement as four sequential application-layer reads, a MongoDB
  aggregation pipeline (written as a view), or a dedicated read-model
  document built at write time needs deciding before [D-019](../decisions.md#d-019)
  is resolved.

- **Collection-events history addressing.** In the aggregate model, a history
  entry is addressed by `{ movementId, revision }`. In this model, a
  collection-events history entry needs `{ movementId, sequence, revision }` to
  be unambiguous. The history collection shape above includes both.

- **`invalid-submissions` shape.** The existing shape from
  [mongo-schema-proposal.md](./mongo-schema-proposal.md) applies unchanged —
  it is event-type-aware via `submissionType` and `aggregateType` fields.
