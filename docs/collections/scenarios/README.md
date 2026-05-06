# Scenarios

Journey scenarios describing how waste moves through the system end-to-end.
These are the **first** workstream: until we know what scenarios we have to
support, the data model and API are speculative.

Two sets of scenarios live here:

- **Curated scenarios** — a small set selected for User Research with Carriers,
  Receivers, Drivers, Brokers and Producers, and for vendor conversations.
  Each is rich enough to walk through with a participant.
- **Corpus** — the wider machine-enumerated set, used as a regression / test
  corpus. Every change to the data model or API must leave the corpus replayable.

## Status

Not started. Source material to be added before scenarios are written.

## Layout (to be defined)

To be agreed once the source material is in. Likely contents:

- A schema describing what a scenario is
- The curated set, one file per scenario
- The corpus, in a single bulk format
- Shared fixtures (organisations, sites, waste items) referenced by scenarios

## Working order

1. Drop in the source material (flow diagrams, scenario recap, extracted corpus)
2. Agree the scenario schema (what fields, what's required)
3. Convert the curated scenarios to the schema
4. Land the corpus in the same shape
