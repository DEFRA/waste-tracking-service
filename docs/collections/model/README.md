# Data model

The entities, identifiers, and state transitions underlying the extended
API.

## Status

Not yet started. This workstream follows once the
[API spec](../api/README.md) has stabilised, because the model is driven
by what the API needs to record at each step rather than the other way
round.

## What will be here

When the workstream begins, this folder is expected to contain:

- An entity-relationship view of the main aggregates — Movement,
  Collection, Drop-off, Receipt — and the reference data they depend on.
- A journey state diagram showing how events transition a Movement
  between states (planned → in-collection → in-transit → dropped-off →
  accepted / rejected / returned), reconciled against the four terminal
  states named in the [glossary](../glossary.md).
- A reconciliation view of how Phase 1 receipt entities (`wasteItem`,
  `wasteReceiver`, etc.) map to the entities introduced by the new
  endpoints.

The OpenAPI spec defines the wire shapes; this workstream will define
the storage and lifecycle shape that backs them.

## Working assumption

The relationship between Movement IDs and the per-event identifiers —
Movement ID is durable and immutable; Creation, Collection, Drop-off and
Receive IDs are event-level and can multiply per Movement; Transfer ID
links one or more Movements at a single drop-off — is treated as
established. The data model elaborates on it but is not expected to
change it.
