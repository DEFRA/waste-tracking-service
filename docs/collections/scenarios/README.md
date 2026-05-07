# Scenarios

Journey scenarios describing how waste moves through the system end-to-end.
This is the first workstream in the collections section: the data model
and API spec are validated against the scenarios, so the scenarios are
where the design starts.

Two sets of scenarios live here.

The **corpus** is the wider machine-enumerated set — currently 282
scenarios, mechanically extracted from the BA's flow chart and tagged
against a seven-axis taxonomy. Every change to the data model or API has
to leave the corpus replayable; the corpus is the regression set.

The **curated scenarios** will be a smaller set selected for User Research
with carriers, receivers, drivers, brokers and producers, and for vendor
conversations. Each curated scenario is intended to be rich enough to
walk through with a participant in a single sitting. The curated set is
not yet started.

## What is here

- [Process](process.md) — how the corpus is generated from the Mural
  flow chart, including the seven-axis taxonomy and what is deliberately
  not in it.
- `corpus.yaml` — the 282 extracted scenarios, regenerated whenever the
  Mural chart changes.
- `scenario.schema.json` — the JSON Schema corpus entries are validated
  against. Both `corpus.yaml` and any future curated scenario file
  conform to this schema.

## Status

| Item | Status |
|---|---|
| Corpus extraction pipeline | In place. Import app produces `corpus.yaml`. |
| Corpus | 282 scenarios, schema-validated. |
| Schema | Stable for the corpus. May extend when curated scenarios add per-step detail. |
| Curated set | Not yet started. Will follow once the API spec stabilises. |

## How re-extraction works

The corpus is regenerated whenever the Mural chart changes. The Import
app is extraction-only — it walks the chart, enumerates paths, tags each
against the seven axes, and writes a fresh `corpus.yaml`. The decision
to keep curation out of the app is recorded in
[the import app changes note](../docs/import-app-changes.md).