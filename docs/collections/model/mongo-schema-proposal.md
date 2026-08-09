# Mongo schema proposal

Proposed MongoDB storage model for the extended movement journey covering:

- movement creation
- collection events
- drop-off / transfer creation
- receipt recording

This is a proposal for the server-side storage shape. It is not yet a
decided implementation.

## Design goals

- Keep one current-state aggregate per durable public identifier.
- Keep Movement and Transfer as separate aggregates because the API and
  decisions already separate them.
- Support ordered collection events on a Movement.
- Support Transfer as the aggregation point for one or more Movement IDs.
- Keep a revisioned current-state plus history pattern close to the current
  `waste-inputs` / `waste-inputs-history` approach, while treating
  `revision` as the current aggregate version after any successful mutation.
- Preserve write provenance per event so different organisations can record
  creation, collection, drop-off, and receipt against the same movement
  journey.
- Allow optional denormalised `transferIds` on Movement for read
  convenience, while treating `transfers.movementIds[]` as the primary
  relationship source of truth.

## Proposed collections

- `movements`
- `movements-history`
- `transfers`
- `transfers-history`
- `invalid-submissions`

Optional later addition if stronger audit/event replay is needed:

- `movement-events`
- `transfer-events`

### `invalid-submissions`

Operational holding collection for write attempts that could not be applied
because the target aggregate could not be found or matched at write time.

Examples:

- a collection update for a `movementId` that does not exist
- a receipt write for a `transferId` that does not exist
- an update request that references a valid identifier but fails aggregate
  ownership / matching checks

This is not intended to duplicate normal request-validation errors returned
to the caller at the API boundary. It is intended for submissions that were
accepted far enough into processing to warrant persistence for investigation,
replay, support handling, or audit.

Suggested shape:

```javascript
{
  _id: ObjectId,
  aggregateType: String, // movement | transfer
  aggregateId: String, // movementId or transferId that was targeted
  submissionType: String, // creation | collection | dropOff | receipt | update
  submittingOrganisation: {
    defraCustomerOrganisationId: String
  },
  payload: Object, // original write payload or transformed internal payload
  reason: String, // e.g. MOVEMENT_NOT_FOUND, TRANSFER_NOT_FOUND, ORG_MISMATCH
  traceId: String,
  timestamp: Date,
  replayStatus: String // optional, e.g. NEW | REPLAYED | DISCARDED
}
```

## Aggregate boundaries

### Movement aggregate

One document per `movementId`.

Owns:

- creation event data
- ordered collection events
- movement lifecycle state
- convenience `transferIds[]`

Does not own:

- drop-off as canonical data
- receipt as canonical data

### Transfer aggregate

One document per `transferId`.

Owns:

- `movementIds[]`
- drop-off event data
- receipt event data
- transfer lifecycle state

## Proposed `movements` schema

```javascript
{
  _id: String, // movementId
  movementId: String,
  transferIds: [String], // optional denormalised convenience field
  state: String, // e.g. PLANNED, IN_COLLECTION, IN_TRANSIT, DROPPED_OFF
  revision: Number,
  isDeleted: Boolean,
  createdAt: Date,
  lastUpdatedAt: Date,
  traceId: String,

  creation: {
    eventId: String, // internal UUID
    recordedAt: Date,
    submittingOrganisation: {
      defraCustomerOrganisationId: String
    },
    submittedByApiCode: String, // optional, if exact API key provenance is needed
    estimatedDateTimeCollected: Date,
    hazardousWasteConsignmentCode: String,
    yourUniqueReference: String,
    otherReferencesForMovement: [
      {
        label: String,
        reference: String
      }
    ],
    specialHandlingRequirements: String,
    producer: Object,
    carrier: Object,
    brokerOrDealer: Object,
    receiver: Object,
    wasteItems: [Object],
    validation: {
      warnings: [Object]
    }
  },

  collectionEvents: [
    {
      eventId: String, // internal UUID
      sequence: Number, // 1..n, append-only order within movement
      recordedAt: Date,
      submittingOrganisation: {
        defraCustomerOrganisationId: String
      },
      submittedByApiCode: String, // optional, if exact API key provenance is needed
      actualDateTimeCollected: Date,
      collectionType: String, // STATIC | TRANSIT
      yourUniqueReference: String,
      otherReferencesForMovement: [
        {
          label: String,
          reference: String
        }
      ],
      carrier: Object,
      receivedFromCarrier: Object,
      collection: Object,
      isDeleted: Boolean,
      validation: {
        warnings: [Object]
      }
    }
  ]
}
```

### Notes on `movements`

- `creation` is singular because `POST /movements` creates the Movement.
- `collectionEvents[]` is plural because collection is now an ordered event
  sequence on the same Movement.
- `submittingOrganisation` is stored on each business event rather than once
  at Movement level, because creation and later collection events may be
  recorded by different organisations.
- `transferIds[]` is included for now because it may make read models simpler,
  but it should be treated as derived from `transfers.movementIds[]`.

## Proposed `transfers` schema

For a hazardous drop-off, `transferId` is not freshly minted: it is the sole
`movementId` referenced in the request ([D-010](../decisions.md#d-010)
guarantees there is exactly one). For a non-hazardous drop-off, `transferId`
is minted independently as before.

```javascript
{
  _id: String, // transferId — for a hazardous drop-off, equals the sole
               // referenced movementId
  transferId: String,
  movementIds: [String],
  state: String, // e.g. DROPPED_OFF, RECEIVED, REJECTED, PARTIALLY_ACCEPTED
  revision: Number,
  isDeleted: Boolean,
  createdAt: Date,
  lastUpdatedAt: Date,
  traceId: String,

  dropOff: {
    eventId: String, // internal UUID
    recordedAt: Date,
    submittingOrganisation: {
      defraCustomerOrganisationId: String
    },
    submittedByApiCode: String, // optional, if exact API key provenance is needed
    actualDateTimeDropOff: Date,
    yourUniqueReference: String,
    otherReferencesForMovement: [
      {
        label: String,
        reference: String
      }
    ],
    carrier: Object,
    dropOff: {
      siteName: String,
      exemptionNumber: String,
      address: Object
    },
    isDeleted: Boolean,
    validation: {
      warnings: [Object]
    }
  },

  receipt: {
    eventId: String, // internal UUID
    recordedAt: Date,
    submittingOrganisation: {
      defraCustomerOrganisationId: String
    },
    submittedByApiCode: String, // optional, if exact API key provenance is needed
    dateTimeReceived: Date,
    hazardousWasteConsignmentCode: String,
    reasonForNoConsignmentCode: String,
    yourUniqueReference: String,
    otherReferencesForMovement: [
      {
        label: String,
        reference: String
      }
    ],
    specialHandlingRequirements: String,
    carrier: Object,
    brokerOrDealer: Object,
    receiver: Object,
    receipt: {
      address: Object
    },
    wasteItems: [Object],
    outcome: {
      status: String, // reserved for future receipt acceptance / rejection modelling
      reason: String
    },
    validation: {
      warnings: [Object]
    }
  }
}
```

### Notes on `transfers`

- `movementIds[]` is the canonical relationship from Transfer to Movement.
- `dropOff` is singular because one Transfer is minted per drop-off event.
- `receipt` is singular because receipt is modelled as one receipt per Transfer.
- `submittingOrganisation` is stored on both `dropOff` and `receipt`, because
  those events may be written by different organisations against the same
  `transferId`.
- `submittedByApiCode` is optional but useful if one organisation can hold
  multiple API keys and exact key-level provenance matters for audit.
- `outcome` is reserved because receipt acceptance / rejection is still an open
  design point.

## Proposed history collections

### `movements-history`

Snapshot of the full previous Movement document before each successful
mutation of an existing Movement aggregate.

```javascript
{
  ...previousMovementDocument,
  movementId: String,
  timestamp: Date
}
```

### `transfers-history`

Snapshot of the full previous Transfer document before each successful
mutation of an existing Transfer aggregate.

```javascript
{
  ...previousTransferDocument,
  transferId: String,
  timestamp: Date
}
```

## Proposed indexes

### `movements`

Required:

- `{ _id: 1 }`
- `{ movementId: 1 }` unique
- `{ 'creation.submittingOrganisation.defraCustomerOrganisationId': 1 }`
- `{ 'collectionEvents.submittingOrganisation.defraCustomerOrganisationId': 1 }`
- `{ state: 1, lastUpdatedAt: -1 }`
- `{ traceId: 1 }`
- `{ transferIds: 1 }`

Conditional / query-driven:

- `{ 'collectionEvents.eventId': 1 }`
- `{ 'collectionEvents.actualDateTimeCollected': 1 }`
- `{ 'creation.estimatedDateTimeCollected': 1 }`
- `{ 'creation.yourUniqueReference': 1 }`

### `movements-history`

- `{ movementId: 1, revision: -1 }`
- `{ movementId: 1, timestamp: -1 }`
- `{ traceId: 1 }`

### `transfers`

Required:

- `{ _id: 1 }`
- `{ transferId: 1 }` unique
- `{ movementIds: 1 }`
- `{ 'dropOff.submittingOrganisation.defraCustomerOrganisationId': 1 }`
- `{ 'receipt.submittingOrganisation.defraCustomerOrganisationId': 1 }`
- `{ state: 1, lastUpdatedAt: -1 }`
- `{ traceId: 1 }`

Conditional / query-driven:

- `{ 'dropOff.actualDateTimeDropOff': 1 }`
- `{ 'receipt.dateTimeReceived': 1 }`
- `{ 'receipt.receiver.authorisationNumber': 1 }`
- `{ 'receipt.eventId': 1 }`
- `{ 'dropOff.eventId': 1 }`

### `transfers-history`

- `{ transferId: 1, revision: -1 }`
- `{ transferId: 1, timestamp: -1 }`
- `{ traceId: 1 }`

## Source-of-truth rules

- `movements._id` / `movementId` is the durable public identifier for a
  Movement.
- `transfers._id` / `transferId` is the durable public identifier for a
  Transfer. For a hazardous drop-off, `transferId` equals the sole
  `movementId` on the transfer rather than being independently minted (see
  `POST /transfers` above and [D-010](../decisions.md#d-010)).
- `revision` is the current version number of the aggregate document, not of
  an individual nested event.
- New aggregates are created at `revision: 1`.
- Every successful mutation of an existing aggregate increments `revision`,
  regardless of whether the API operation is a `POST` or a `PUT`.
- Event-level `submittingOrganisation` is the source of truth for who wrote
  creation, collection, drop-off, and receipt.
- Optional event-level `submittedByApiCode` is the source of truth for which
  API key wrote the event when multiple keys exist for one organisation.
- `transfers.movementIds[]` is the source of truth for Movement-to-Transfer
  membership.
- `movements.transferIds[]` is denormalised convenience data only.
- History collections are source-of-truth for past snapshots, not for
  individual business events.

## Write-path mapping

- `POST /movements`
  - insert one `movements` document
  - set `revision` to `1`
  - set `creation`
  - set `collectionEvents` to `[]`
  - set `transferIds` to `[]`

- `POST /movements/{movementId}/collection`
  - append one item to `collectionEvents`
  - increment `revision`
  - write prior snapshot to `movements-history`

- `PUT /movements/{movementId}`
  - mutate `creation` or movement-level fields
  - increment `revision`
  - write prior snapshot to `movements-history`

- `PUT /movements/{movementId}/collection`
  - mutate the allowed collection event
  - increment `revision`
  - write prior snapshot to `movements-history`

- `POST /transfers`
  - insert one `transfers` document
  - set `revision` to `1`
  - set `movementIds[]`
  - set `dropOff`
  - set `receipt` to `null` or omit
  - determine `transferId`: if the request is a hazardous drop-off (always
    exactly one `movementId`, per [D-010](../decisions.md#d-010)), reuse
    that `movementId` as `transferId` — no new identifier is minted.
    Otherwise, mint `transferId` via `waste-tracking-id-backend` as today.
  - optionally update each referenced Movement to append `transferId` to
    `transferIds[]`

- `POST /transfers/{transferId}/receipt`
  - populate `receipt`
  - increment `revision`
  - write prior snapshot to `transfers-history`

- `PUT /transfers/{transferId}`
  - mutate the allowed drop-off fields, currently soft-delete only
  - increment `revision`
  - write prior snapshot to `transfers-history`

- `PUT /transfers/{transferId}/receipt`
  - mutate `receipt`
  - increment `revision`
  - write prior snapshot to `transfers-history`

## Why not keep everything in `waste-inputs`

The current `waste-inputs` model is receipt-first and Phase 1-specific:

See [Phase 1 movement store](./phase1-waste-inputs.md) for the compact
description of the current `waste-inputs` / `waste-inputs-history`
behaviour that this proposal is evolving from.

- it is keyed by `wasteTrackingId`
- it stores receipt-centric payload under `receipt.movement`
- it uses snapshot history rather than event collections

That shape does not naturally fit:

- Movement creation happening before receipt
- ordered `collectionEvents[]`
- Transfer as a first-class aggregate spanning one or more `movementIds`
- receipt belonging to a Transfer rather than directly to a Movement

## Open points

- Whether to persist `submittedByApiCode` in plaintext, hashed form, or as a
  separate API-key identifier if audit needs exact key provenance without
  exposing the raw code in operational reads.
- Whether receipt outcome should remain embedded in `receipt` or become a
  further nested sub-document with richer status modelling.
- Whether `transferIds[]` on Movement proves worth the denormalisation cost.
- Whether event-level collections are needed in addition to history snapshots. Three options are under evaluation — aggregate (this document), per-event-type, and CQRS/event-sourcing (see [`mongo-schema-proposal-CQRS.md`](./mongo-schema-proposal-CQRS.md)) — tracked as [D-037](../decisions.md#d-037).
- Whether soft-delete metadata should be per aggregate only, per event only,
  or both.
