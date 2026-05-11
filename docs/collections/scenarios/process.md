# How the scenarios were generated

This page describes how we produced a corpus of waste-movement scenarios from
this [flow chart](https://app.mural.co/t/coredefra2548/m/coredefra2548/1776935463797/9487480e6a1ff55531f6e05f5925c462ec1bf9f3), what the scenarios represent, and how the taxonomy of
seven axes was arrived at.

The corpus is intentionally exhaustive: every realistic event sequence the
extended API will need to handle is enumerable from it. It is **not** a
hand-picked set, and it makes no claim about which scenarios are most worth
testing with users — that is a separate editorial step that happens elsewhere.

## Source: the Mural flow chart

The starting point is the [flow chart](https://app.mural.co/t/coredefra2548/m/coredefra2548/1776935463797/9487480e6a1ff55531f6e05f5925c462ec1bf9f3) maintained in Mural. It models
the waste-movement journey as a directed graph:

- **Nodes** are either *states* the waste / actor is in (e.g. *Driver with Waste in transit (WWT/D)*, *Receiver with Waste at the receiver site (WWR/R)*) or *actions* an actor takes (e.g. *Record Collection using Movement ID (real time)*, *Drop Off Waste and give Transfer ID to Receiver*).
- **Decision points** are special nodes whose outgoing edges represent a choice — for example *[Accept all]* / *[Accept part]* / *[Reject all]* at the receiver-inspection step.
- **Edges** connect nodes in the order events happen. Some edges form loops, modelling multi-collection runs, multi-drop-off runs, and rejection-retry cycles.

The chart has **two start nodes** corresponding to who initiates the movement:
*Carrier has a requirement to move waste* and *Producer, Broker or Receiver
has a requirement to move waste*. Most of the journey is shared between them
downstream, so each start node typically reaches the same set of terminal
states via parallel paths.

The chart is the **single source of truth for journey shape**. Whenever the
journey changes — a new decision point, a new terminal state, a new loop — the
chart is updated and the corpus is re-extracted from it.

## Extraction

A small Node.js tool ("the Import app") reads the Mural board and walks the
graph from each start node to every reachable terminal node, enumerating each
distinct path. Each path becomes one scenario: an ordered list of nodes from
start to end, including every decision branch taken and every state visited.

Two rules constrain the enumeration to keep the corpus finite and meaningful:

- **Loops are bounded.** Each loop edge — *[More collections]*, *[More drop off and/or collections]*, *[Can be sent to another site]* — may be traversed at most a small number of times. In the current run, each loop is traversed at most once, which captures the qualitative difference between "no loop" and "loop taken" without producing arbitrarily long paths.
- **Cycle combinations.** A single scenario may traverse none of the loop edges, exactly one of them, or specifically the combination of `multi-collection` and `multi-drop-off`. Combinations involving `rejection-retry` are not enumerated, on the basis that a driver picking up from multiple producers, getting rejected at a receiver, and rerouting the rejected portion is an unrealistic compound trajectory. The combined `multi-collection + multi-drop-off` is realistic — a milk-round style pickup followed by multi-site delivery — and is enumerated.

The current extraction produces **282 scenarios**, evenly split between the
two start nodes (141 each).

## Format of an extracted path

Each extracted scenario is a linear sequence — the path from start to end.
For example, a broker-initiated happy path begins:

```text
Producer, Broker or Receiver has a requirement to move waste
  → Create Movement
  → Share Movement ID with Carrier
  → Carrier before Waste moves (BWM/C)
  → Share Movement ID with Driver
  → Driver with Waste collected (WWC/D)
  → Arrives at collection location
  → Collect waste
  → [Recording now]
  → Record Collection using Movement ID (real time)
  → ...
  → Waste received at the Receiver site (AWR/R - End)
```

The decision-point markers in square brackets — *[Recording now]*, *[Accept all]*, *[More collections]*, *[Back to producer]*, and so on — are what differentiate one scenario from another. Two scenarios can share long stretches of nodes and only diverge at one decision point; they are nonetheless distinct scenarios because the choice has downstream consequences for what's recorded and what state the movement ends in.

## From paths to a taxonomy: the seven axes

A list of 282 paths is hard to reason about directly. Sorting them by length
or grouping them by terminal state gives a partial view. To make the corpus
**queryable**, **comparable**, and **stable across re-extractions**, every
scenario is also described as a point in a small, orthogonal taxonomy.

The taxonomy was derived empirically: we identified the decision points in
the chart that produce qualitatively different journeys (recording behaviour,
receipt outcome, terminal state, loops) and grouped them into axes where the
values are mutually exclusive within an axis but independent across axes.
The result is seven axes.

| Axis | Possible values | What it tells us |
|---|---|---|
| **Initiator** | `carrier`, `broker` | Who creates the movement and mints the Movement ID. Determined by which start node the path begins from. `broker` is the umbrella term for any non-carrier-initiated movement (broker-initiated, producer-initiated, or receiver-initiated all share the same start node and downstream paths). |
| **Collection recording** | `realtime`, `deferred`, `retrospective`, `na` | Whether the driver records collection at the kerbside, defers it, or has it reconciled later by the carrier's back-office. `na` applies when no collection event occurs (producer-tracking-only paths). |
| **Receipt outcome** | `acceptAll`, `rejectAll`, `acceptPart-accepted`, `acceptPart-rejected`, `na` | What the receiver decides at the gate. `acceptPart` produces two parallel flows — accepted portion and rejected portion — and both have to be tracked. `na` applies when no receipt event occurs (producer-tracking-only paths). |
| **Receipt recording** | `realtime`, `deferred`, `na` | Mirror of collection recording, on the receipt side. `na` applies when no receipt event occurs (full rejection, producer-tracking only). |
| **Final state** | `AWR/R`, `AWR/C`, `AWR/P`, `WWR/P` | The terminal state: accepted-at-receiver, reconciled-by-carrier, observed-by-producer, or rejected-and-returned. |
| **Cycles traversed** | `multi-collection`, `multi-drop-off`, `rejection-retry` (or none, or the `multi-collection + multi-drop-off` combination) | Whether the movement involves a driver loop. Combinations are constrained: see the cycle-combinations rule above. |
| **Compliance** | `compliant`, `non-compliant` | Whether all events are recorded as required. Deferring collection or receipt without ever reconciling produces a non-compliant trajectory. |

### Why these axes

The first five axes describe *what shape the journey takes*. The cycles axis
describes *how many times the driver loops* through transit-related steps —
an orthogonal concern. The compliance flag is **derived** rather than chosen:
it falls out of the recording axes (a deferred-and-not-reconciled trajectory
is non-compliant by definition) and is stored explicitly so regulatory failure
modes are first-class outcomes rather than data-quality footnotes.

### What's deliberately not in the taxonomy

- **Waste type** (hazardous, POPs, EWC family) does not change the journey shape, only validation strictness. It belongs in the data model.
- **Geography** (England, Scotland, Northern Ireland, Wales) similarly affects validation rules but not events.
- **Transport mode** is an attribute of the carrier, not the journey.

Including these in the taxonomy would multiply the corpus without producing
qualitatively different journeys. The discipline of keeping the axes narrow
is what keeps the corpus finite and the diff between extractions readable.

## Tagging every scenario

Once the axes are defined, each of the 282 extracted paths is tagged against
them by walking the path and reading off the axis values from the start node
and the decision points it traversed. For example:

- A path beginning with *Carrier has a requirement to move waste* has `initiator: carrier`. A path beginning with *Producer, Broker or Receiver has a requirement to move waste* has `initiator: broker`.
- A path that goes through *[Recording now]* at collection has `collectionRecording: realtime`.
- A path that goes through *[Recording deferred]* at collection and is never reconciled has `collectionRecording: deferred` and `compliance: non-compliant`.
- A path that goes through *[Recording deferred]* and later through *Record Collection using Movement ID (retrospective)* has `collectionRecording: retrospective` and `compliance: compliant`.
- A path that goes through *[More collections]* has `cycles: ['multi-collection']`.

The tagging is mechanical: the same path always produces the same axis tuple,
which is what makes the corpus stable across re-runs.

### Multi-event scenarios

Multi-collection and multi-drop-off scenarios contain more than one collection
or receipt event, and those events can have different recording behaviours or
outcomes. The taxonomy still describes the scenario as a single point — values
are rolled up to the most-problematic / most-interesting event:

- **Collection recording**: any deferred-and-not-reconciled event makes the scenario `deferred`; any retrospectively-reconciled event makes it `retrospective`; otherwise `realtime`.
- **Receipt recording**: same precedence as collection recording.
- **Receipt outcome**: precedence is `rejectAll` > `acceptPart-rejected` > `acceptPart-accepted` > `acceptAll`.

The principle is consistent: when a journey contains multiple events of the
same kind, the scenario-level value reflects the most consequential one,
because that is what UR participants and auditors will care most about.

### Producer-tracking scenarios

A small number of paths (currently two of the 282) describe the producer
querying the fate of their waste — *Create Movement → Share Movement ID with
Producer → Check on the fate of their waste → AWR/P*. These have no collection
event, no drop-off, and no receipt, so all three event-related axes take the
value `na`. They terminate at `AWR/P` (waste tracked by the producer) and
are always compliant. They are kept in the corpus because they exercise the
producer's read-only query path through the API.

## How re-extraction works

When the Mural chart changes — a new decision point added, a state
renamed, a loop edge removed — the extraction is re-run end-to-end:

1. The Import app reads the updated chart.
2. It produces a new corpus (potentially with a different scenario count).
3. The new corpus is committed to git, replacing the previous one.
4. CI compares the new corpus against the previous one and reports diffs:
   added scenarios, removed scenarios, scenarios whose axis tuple changed.
5. Any downstream artefacts that reference scenarios — for instance scenarios
   selected for User Research — are diff-checked against the new corpus to
   flag drift, where a previously-valid scenario no longer appears or has
   moved to a different point in the taxonomy.

The corpus is therefore not a one-off output; it is a **living artefact** that
tracks the journey model and is regenerated whenever the model changes. The
git history of the corpus file is, in effect, the history of the journey model.