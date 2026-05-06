# Data model

Entities, identifiers, and state transitions for the extended waste-movement model.

## Status

Not started. Will be worked on **after** the scenarios workstream lands, because
the model is driven by what the scenarios need to record at each event.

## Layout (to be defined)

To be agreed once scenarios are in place. Likely contents:

- ERDs per aggregate (Movement, Collection, Drop-off, Receipt, plus reference data)
- A journey state diagram showing the four events and any cycles
- A glossary disambiguating Movement ID, Transfer ID, and the legacy WT-ID

## Source material to incorporate

The existing ERDs in the project (`CARRIER_DETAILS.mermaid`, `WASTE_ITEMS.mermaid`,
`COLLECTION_MOVEMENT_DETAILS.mermaid`, `CREATION_MOVEMENT_DETAILS.mermaid`, etc.)
are the starting point. They were drawn against the receiver-first model and need
to be reconciled with the four-event journey.
