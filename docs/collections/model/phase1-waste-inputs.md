# Phase 1 movement store

This note describes the current Phase 1 MongoDB storage model used by
`waste-movement-backend`.

It exists so the Phase 2 model work has a concrete description of what is
already live, and so migration discussions can refer to one small document
instead of piecing the behaviour together from code.

## Scope

Phase 1 is receipt-first. The live backend stores receipt movements keyed by
`wasteTrackingId`.

The collections in scope are:

- `waste-inputs`
- `waste-inputs-history`
- `invalid-submissions`

## What each collection is for

### `waste-inputs`

The current-state collection.

One document represents the latest known version of a single waste movement
record keyed by `wasteTrackingId`. In practice, the live routes currently
populate the receipt side of the record.

### `waste-inputs-history`

The history / audit-trail collection.

Before a successful update is applied to `waste-inputs`, the previous full
document is copied into `waste-inputs-history` with a `timestamp`. This means
history is stored as full-document snapshots rather than event deltas.

### `invalid-submissions`

Operational holding collection for update attempts that could not be applied,
for example because the target `wasteTrackingId` was not found.

## Current persisted shape

The current domain object in `waste-movement-backend` exposes these top-level
fields ([wasteInput.js](C:/Applications/EqualExperts/Defra/WasteTracking/Repos/waste-movement-backend/src/domain/wasteInput.js:1)):

```javascript
{
  wasteTrackingId,
  creation,
  collection,
  receipt,
  submittingOrganisation,
  createdAt,
  lastUpdatedAt,
  orgId,
  traceId,
  bulkId
}
```

In the live Phase 1 receipt flow, the create route currently writes:

- `wasteTrackingId`
- `traceId`
- either `orgId` or `submittingOrganisation`
- `receipt.movement`

See [create-receipt-movement.js](C:/Applications/EqualExperts/Defra/WasteTracking/Repos/waste-movement-backend/src/routes/create-receipt-movement.js:47).

The create service then adds:

- `_id = wasteTrackingId`
- `revision = 1`
- `createdAt`
- `lastUpdatedAt`

See [movement-create.js](C:/Applications/EqualExperts/Defra/WasteTracking/Repos/waste-movement-backend/src/services/movement-create.js:8).

## Example `waste-inputs` document

Illustrative shape based on the current Phase 1 receipt write path:

```javascript
{
  _id: "2578ZCY8",
  wasteTrackingId: "2578ZCY8",
  revision: 1,
  createdAt: ISODate("2026-07-14T10:00:00Z"),
  lastUpdatedAt: ISODate("2026-07-14T10:00:00Z"),
  traceId: "trace-123",

  // One of these is present depending on organisation lookup path
  orgId: "57aed195-325e-45d5-b1fb-5f201e0324cf",
  // or
  submittingOrganisation: {
    defraCustomerOrganisationId: "d829f66d-857f-401d-b5e9-5061b7dbb29d"
  },

  receipt: {
    movement: {
      dateTimeReceived: "2025-08-29T15:24:00Z",
      hazardousWasteConsignmentCode: "CJ123E/A0001",
      yourUniqueReference: "CLIENT-REF-001",
      otherReferencesForMovement: [
        {
          label: "transferNoteNumber",
          reference: "TN-12345"
        }
      ],
      specialHandlingRequirements: "Handle with care and keep upright.",
      wasteItems: [/* ... */],
      carrier: {/* ... */},
      brokerOrDealer: {/* ... */},
      receiver: {/* ... */},
      receipt: {
        address: {/* ... */}
      }
    }
  }
}
```

The exact nested payload shape is driven by the receipt request schema and can
be seen in the Phase 1 receipt examples under
[receiptEvent.js](C:/Applications/EqualExperts/Defra/WasteTracking/Repos/waste-tracking-service/docs/collections/data/receiptEvent.js:1).

## Revision model

The current backend uses document revisioning rather than event sourcing.

- create sets `revision = 1`
- each successful update increments `revision`
- the prior full document is copied into `waste-inputs-history`

The history entry is created by shallow-copying the previous live document,
adding `timestamp`, and removing `_id`
([create-history-entry.js](C:/Applications/EqualExperts/Defra/WasteTracking/Repos/waste-movement-backend/src/common/helpers/create-history-entry.js:1)).

## Example `waste-inputs-history` document

```javascript
{
  wasteTrackingId: "2578ZCY8",
  revision: 1,
  createdAt: ISODate("2026-07-14T10:00:00Z"),
  lastUpdatedAt: ISODate("2026-07-14T10:00:00Z"),
  traceId: "trace-123",
  orgId: "57aed195-325e-45d5-b1fb-5f201e0324cf",
  receipt: {
    movement: {
      /* previous snapshot */
    }
  },
  timestamp: ISODate("2026-07-14T11:00:00Z")
}
```

## Current indexes

The backend currently creates these indexes
([mongodb.js](C:/Applications/EqualExperts/Defra/WasteTracking/Repos/waste-movement-backend/src/common/helpers/mongodb.js:72)):

### `waste-inputs`

- `{ id: 1 }`
- `{ wasteTrackingId: 1, revision: 1 }`
- `{ traceId: 1 }`
- `{ bulkId: 1, revision: 1 }`

### `waste-inputs-history`

- `{ wasteTrackingId: 1, revision: 1 }`
- `{ traceId: 1 }`
- `{ bulkId: 1, revision: 1 }`

## Current update behaviour

The live update route updates `receipt.movement` in place rather than
appending a new business event object.

See [update-receipt-movement.js](C:/Applications/EqualExperts/Defra/WasteTracking/Repos/waste-movement-backend/src/routes/update-receipt-movement.js:13)
and [movement-update.js](C:/Applications/EqualExperts/Defra/WasteTracking/Repos/waste-movement-backend/src/services/movement-update.js:55).

This is a key distinction from the proposed Phase 2 model:

- Phase 1 history is snapshot-based
- Phase 2 collection is expected to be an ordered event sequence
- Phase 2 drop-off / receipt introduces Transfer as a separate aggregate

## Role during Phase 1 -> Phase 2 migration

For now, the working proposal is to keep `waste-inputs` /
`waste-inputs-history` in place during migration.

That can mean:

- the existing Phase 1 receipt endpoints continue to read and write these
  collections unchanged
- the new Phase 2 model is introduced alongside them rather than replacing
  them immediately
- any migration or coexistence layer is explicit about which endpoints write
  to the old Phase 1 store and which write to the new Phase 2 store

## Suggested coexistence rule

Until a formal migration decision is made, the safest assumption is:

- Phase 1 endpoints continue to use `waste-inputs` /
  `waste-inputs-history`
- Phase 2 endpoints use the proposed `movements` / `transfers` model
- any bridge between `wasteTrackingId` and new identifiers is handled
  deliberately rather than inferred implicitly

## Why this document exists

The Mongo schema proposal for Phase 2 references the current
`waste-inputs` / `waste-inputs-history` pattern as the baseline being
evolved from. This note is the compact description of that baseline.
