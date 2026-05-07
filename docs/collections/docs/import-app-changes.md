# Import app — scope changes for the corpus pipeline

This note records the decision to narrow the Import app's responsibility to
**extraction only**, and how the corpus pipeline will work going forward.

## Background

The Import app reads the BA's Mural flow chart and produces a list of
waste-movement scenarios. In its current form it does two things:

1. **Extraction.** Walks the Mural graph and enumerates every distinct path
   from start to terminal node, applying the loop-bounding and
   cycle-exclusivity rules.
2. **Curation.** Selects a small subset of scenarios deemed representative
   for User Research, and emits them as a separate output.

## Decision

The Import app will be reduced to **extraction only**. Curation is removed
from the app and handled separately.

The reasoning:

- **Extraction is mechanical, curation is editorial.** Extraction has a
  deterministic input → output relationship: same flow chart in, same corpus
  out. Curation involves judgement calls about which scenarios make compelling
  User Research sessions, which exercise the right axes, and which are easy
  enough to walk a participant through in a single sitting. Mixing these in
  one tool makes the editorial choices invisible and hard to revise.
- **The corpus is the regression set.** The corpus is what the data model and
  API spec are validated against — every scenario must remain replayable as a
  valid event sequence. Curated scenarios are *also* validated against the
  corpus (to flag drift when the flow chart changes), so they consume the
  corpus rather than living in parallel to it.
- **One source of truth per artefact.** The corpus lives in
  `docs/collections/scenarios/corpus.yaml`, owned by the Import app's output.
  Curated scenarios live elsewhere, owned by humans. Mixing them risks the
  Import app silently overwriting curated content on the next run.

## Pipeline going forward

```text
Mural board (BA-owned source of truth for the journey)
    │
    │  re-extracted on demand
    ▼
Import app (Node.js / TypeScript, extraction only)
    │
    │  emits
    ▼
docs/collections/scenarios/corpus.yaml (committed, diffable)
    │
    │  validated by CI against
    ▼
docs/collections/scenarios/scenario.schema.json
    │
    │  consumed by
    ▼
Curated scenarios (human-maintained, separate workstream)
    │
    │  diff-checked against the corpus to flag drift
    ▼
User Research material
```

## Output format

The Import app writes a single YAML file: `corpus.yaml`. The file is a list of
entries, each conforming to `scenario.schema.json`. YAML is preferred over
JSON for the corpus because it produces readable diffs in pull requests when
the chart changes; the schema is JSON Schema and validates both formats.

A typical entry looks like:

```yaml
- id: C-0001
  name: Carrier, real-time collection, accept-all, no cycles
  axes:
    initiator: carrier
    collectionRecording: realtime
    receiptOutcome: acceptAll
    receiptRecording: realtime
    finalState: AWR/R
    cycles: []
    compliance: compliant
  path:
    - Producer, Broker or Receiver has a requirement to move waste
    - Create Movement
    - ...
  source:
    muralBoardId: <id>
    extractedAt: 2026-05-06T09:00:00Z
    nodeCount: 44
    edgeCount: 51
```

## ID stability

IDs are of the form `C-NNNN`, zero-padded. The Import app SHOULD assign IDs
deterministically — for example by hashing the path or by sorting paths
canonically before numbering — so that re-running extraction on an unchanged
chart produces the same IDs. Where a scenario's path changes (because the
chart changed), it gets a new ID; where it disappears entirely, its old ID
is not reused. This keeps the diff between extractions readable and makes
external references to scenarios (e.g. from User Research notes) durable.

## What happens to the existing curation logic

It is removed from the Import app codebase. If curation suggestions remain
useful — for example a script that proposes candidate scenarios that cover
all axis values with the smallest scenario count — that logic is moved to a
separate, optional helper script. It is not part of the corpus pipeline.

## CI expectations

Once the pipeline lands, CI should:

1. Validate `corpus.yaml` against `scenario.schema.json` on every pull request.
2. Report a summary of the diff against the previous corpus when `corpus.yaml`
   changes (added, removed, axis-tuple-changed).
3. Cross-check that any curated scenarios still appear in the corpus, or fail
   the build with a clear "scenario X has drifted, please review" message.

These expectations are documented here for forward reference; the CI workflows
themselves are out of scope for this note.
