# waste-tracking-api-design

Design repository for the extension of DEFRA's Digital Waste Tracking (DWT) API,
moving from the current receiver-first Receipt of Waste capability toward a fuller
waste-movement journey.

## Status

In design. Not for external circulation. The output of this repository will inform:

- User Research with Carriers, Receivers, Drivers, Brokers and Producers
- Conversations with Software Vendors building on the API
- The eventual extended OpenAPI specification

## How this repo is organised

The work is split into three workstreams, each in its own folder. They are
**worked on in order**, but they remain coupled: scenarios drive the data model,
the data model anchors the API spec, and the API spec is in turn validated against
the scenarios.

| Folder | Workstream | Status |
|---|---|---|
| [`scenarios/`](./scenarios) | Journey scenarios — the curated set used in User Research and the wider corpus used as a test set | not started |
| [`model/`](./model) | Data model — entities, identifiers (Movement ID, Transfer ID), state transitions | not started |
| [`api/`](./api) | OpenAPI specification — extends the existing `Receipt_API.yml` with the new events | not started |
| [`docs/`](./docs) | Cross-cutting notes — context, glossary, decision records | not started |

## Working order

1. **Scenarios first.** Until we know what journeys we have to support, the data
   model and API are speculative. The curated scenarios become the regression set:
   any change to the data model or API must leave them all replayable.
2. **Data model second.** Driven by what the scenarios need to record at each step.
3. **API spec third.** The data model plus the four events determines the endpoint
   shapes. Each scenario step should resolve to a valid API call.

When the BA's flow chart changes, the cycle restarts from scenarios.

## Source material

The starting point is the existing `Receipt_API.yml` (receiver-first, in production beta)
and the scenario analysis recap (`dwt-scenarios-recap.md`) which establishes:

- The four events: Create Movement, Record Collection, Record Drop-off, Record Receipt
- The 7-axis scenario taxonomy
- 8 curated scenarios for User Research, drawn from a 282-scenario corpus
