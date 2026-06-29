# Collections

This section documents the design work to extend the Digital Waste Tracking
service from its current receiver-first capability toward a fuller
waste-movement journey. It exists to support User Research with carriers,
receivers, drivers, brokers and producers, and to give software vendors
building on the API a single place to track the design as it evolves.

The work is in alpha. Pages here describe a design in progress, not a
shipped product. Where something is unsettled, it is flagged as such.

## What we are designing

The current production capability — covered by the
[Receipt of Waste API](https://defra.github.io/waste-tracking-service/production/api-landing-page/) —
captures waste at the point it arrives at a receiver site. The extension
broadens this to cover the journey from creation to receipt, around four
business events:

- **Create Movement** — a producer, broker, or carrier registers an
  intended waste movement and is given a Movement ID.
- **Record Collection** — the driver records that waste has been
  picked up.
- **Record Drop-off** — the driver records that waste has been
  delivered, and is given a Transfer ID covering one or more Movements
  delivered together.
- **Record Receipt** — the receiver records what they have accepted,
  optionally linked back to the upstream drop-off via the Transfer ID.
  This is the existing Phase 1 capability, now part of a longer chain.

A separate read-only flow lets the producer query the fate of their waste
once a movement has reached a terminal state.

## How this section is organised

The work is split into three workstreams, plus cross-cutting reference
material.

[**Scenarios.**](scenarios/README.md) The journey scenarios driving the
design. Includes a 282-scenario corpus mechanically extracted from the
BA's flow chart and tagged against a seven-axis taxonomy. The
[scenario generation process](scenarios/process.md) explains how the
corpus is produced.

[**Data model.**](model/README.md) The entities, identifiers, and state
transitions that underlie the API. Currently a placeholder; the model
will be developed once the API spec stabilises.

[**API.**](api/README.md) The OpenAPI specification for the extended
service. Covers fourteen paths across creation, collection, drop-off,
receipt, fate-of-waste, and reference data. Includes Phase 1 receipt
endpoints preserved verbatim.

[**Decisions.**](decisions.md) A running register of design decisions,
open questions, and parked items.

[**Glossary.**](glossary.md) Disambiguation of identifier and actor
vocabulary — Movement ID vs. Transfer ID vs. WT-ID, what counts as a
broker, and so on.

## Where to start

If you are a software vendor or developer integrating with the API, start
at the [API workstream](api/README.md). If you want to understand the
journey shapes the API has to support, start with the
[scenario generation process](scenarios/process.md). If you are joining
the project and want to know what has been decided so far, the
[decisions register](decisions.md) is the fastest way in.

## Status

| Workstream | Status |
|---|---|
| Scenarios — corpus | Drafted. 282 scenarios extracted, schema-validated. |
| Scenarios — curated set | Not yet started. Follows once the corpus stabilises. |
| Data model | Not yet started. Follows once the API stabilises. |
| API — extended endpoints | Drafted. Subject to review and BA confirmation on several open points (see decisions register). |
| API — Phase 1 receipt | Preserved unchanged. |