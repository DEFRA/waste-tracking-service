# Data model

The entities, identifiers, and state transitions underlying the extended
API.

## Status

Started at proposal level. This workstream now contains draft notes on the
current Phase 1 storage model and a proposed MongoDB shape for Phase 2.
It is still exploratory rather than settled design: the
[API spec](../api/README.md) and decisions register remain the primary
drivers, and the model will continue to evolve as those stabilise.

## What will be here

This folder is expected to grow into:

- An entity-relationship view of the main aggregates — Movement,
  Collection, Drop-off, Receipt — and the reference data they depend on.
- A journey state diagram showing how events transition a Movement
  between states (planned → in-collection → in-transit → dropped-off →
  accepted / rejected / returned), reconciled against the four terminal
  states named in the [glossary](../glossary.md).
- A reconciliation view of how Phase 1 receipt entities (`wasteItem`,
  `wasteReceiver`, etc.) map to the entities introduced by the new
  endpoints.

The OpenAPI spec defines the wire shapes; this workstream describes the
storage and lifecycle shape that may back them.

## Current proposals

- [Phase 1 movement store](./phase1-waste-inputs.md) - what the current
  `waste-inputs` / `waste-inputs-history` collections store, how revisioning
  works, and how they may be retained during migration.
- [Mongo schema proposal](./mongo-schema-proposal.md) - proposed current-state
  collections, history collections, document shapes, and index list for
  Movements and Transfers, including event-level organisation provenance.
- [Mongo schema proposal — CQRS / Event Sourcing](./mongo-schema-proposal-CQRS.md) -
  alternative Phase 2 storage model based on an append-only event store with
  derived projections; under evaluation alongside the aggregate model above.

## Working assumption

The relationship between Movement IDs and the per-event identifiers —
Movement ID is durable and immutable; Creation, Collection, Drop-off and
Receive IDs are event-level and can multiply per Movement; Transfer ID
links one or more Movements at a single drop-off — is treated as
established. The data model elaborates on it but is not expected to
change it.
