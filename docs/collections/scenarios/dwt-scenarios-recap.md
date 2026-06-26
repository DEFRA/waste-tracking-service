# Digital Waste Tracking — Scenario Recap

> Working note for catch-up with BA and team.
> Status: draft for review. Not for external circulation.

## 1. Context

The existing Receipt of Waste API supports a single business event — a receiver recording the arrival of waste at their site. The API extension we're scoping covers the full waste-movement journey: from the moment the movement is planned, through collection by a carrier, drop-off at a receiver, and receipt acceptance.

To inform the API design, we ran a structured analysis of the journey:

1. The BA mapped the journey on a Mural flow chart.
2. We built a tool to extract scenarios from the diagram.
3. We iterated on diagram structure and extraction logic until the output was consistent and the scenarios were canonical.
4. We produced a curated set of representative scenarios for User Research.

This document recaps where we landed: the four events, the scenario taxonomy, the curated scenarios, and a sample from the wider corpus. It's intentionally short on data-model detail — that's the next conversation.

## 2. The four events

The journey decomposes into four distinct events, each owned by a different actor and corresponding to a real-world moment in the waste's movement. Each event is a candidate for a `POST` endpoint in the extended API.

| Event | Actor | What it captures |
|---|---|---|
| **Create Movement** | Producer / Broker / Carrier | A movement is planned. A Movement ID is generated and shared with the parties involved. |
| **Record Collection** | Driver (real-time) or Carrier (retrospective) | Waste is physically picked up at the producer's site. Actual quantities and containers are recorded. |
| **Record Drop-off** | Driver | Waste is delivered to a receiver site. A Transfer ID is generated to group the Movement IDs being delivered together. |
| **Record Receipt** | Receiver | The receiver inspects the load and decides whether to accept it (in full, in part, or reject). Acceptance and treatment details are recorded. |

A few clarifications worth flagging:

- **Drop-off and Receipt are distinct events.** Drop-off is the carrier-side delivery action; Receipt is the receiver-side acceptance action. They can occur at different times and are recorded by different actors.
- **The Transfer ID groups Movement IDs.** A driver may deliver multiple Movement IDs in a single drop-off; the Transfer ID groups them at the gate, and one Receipt event per Movement ID follows. The exact relationship between Movement ID and Transfer ID is an open data-model question.
- **The Producer can observe but not record.** Producers receive the Movement ID out of band and can query the fate of their waste via a `GET` endpoint, but they don't trigger any of the four POSTs themselves.

## 3. Scenario taxonomy

Every scenario is described by a point in this 7-dimensional space. The axes are deliberately orthogonal: combining them generates scenarios systematically rather than by accident, and tagging existing scenarios against them lets us measure coverage.

| Axis | Possible values | What it tells us |
|---|---|---|
| **Initiator** | broker, carrier | Who creates the movement and mints the Movement ID |
| **Collection recording** | realtime, deferred, retrospective | Whether the driver records at the kerbside, defers it, or has it reconciled later by the carrier back-office |
| **Receipt outcome** | acceptAll, rejectAll, acceptPart-accepted, acceptPart-rejected | What the receiver decides at the gate. `acceptPart` produces two parallel flows — accepted portion and rejected portion — and both have to be tracked |
| **Receipt recording** | realtime, deferred, na | Mirror of collection-recording, on the receipt side |
| **Final state** | AWR/R, AWR/C, AWR/P, WWR/P | The terminal state: accepted at receiver, reconciled by carrier, observed by producer, or rejected and returned |
| **Cycles traversed** | multi-collection, multi-drop-off, rejection-retry | Whether the movement involves a driver's loop — collecting at multiple sites, delivering to multiple receivers, or retrying after a rejection at a different receiver |
| **Compliance** | compliant, non-compliant | Whether all events are recorded as required. Deferring collection or receipt without ever reconciling produces a non-compliant trajectory |

### Why these axes

The five non-cycle axes describe *what shape the journey takes*. The cycles axis describes *how many times the driver loops* through transit-related steps (an orthogonal concern that interacts multiplicatively if we let it). The compliance flag is derived rather than chosen, and exists to make regulatory failures first-class outcomes rather than data-quality footnotes.

What's deliberately *not* in the taxonomy: waste type (hazardous, POPs, EWC family) doesn't change the journey shape, only validation strictness — handled in the data model. Geography (England, Scotland, NI, Wales) similarly affects validation rules but not events. Transport mode is an attribute of the carrier, not the journey.

## 4. The curated scenarios for User Research

Eight scenarios were selected from the wider corpus to give UR participants representative coverage of the axes above. Each is simple enough to walk a participant through in 10-15 minutes; together they exercise every key decision in the model.

### 4.1 — Carrier baseline, real-time recording, full acceptance

**Axes:** Initiator: carrier · Collection: realtime · Receipt outcome: acceptAll · Receipt recording: realtime · Final: AWR/R · No cycles · Compliant

**Story.** A carrier moves their own waste. Driver collects, records the collection in their mobile app, drives to the receiver, drops off, and the receiver accepts the full load and records the receipt at the gate.

**What it stresses.** The simplest happy path. Real-time recording on both sides. Single-Movement, single-drop-off. Establishes the baseline against which non-compliant or complex variants are compared.

### 4.2 — Broker baseline, real-time recording, full acceptance

**Axes:** Initiator: broker · Collection: realtime · Receipt outcome: acceptAll · Receipt recording: realtime · Final: AWR/R · No cycles · Compliant

**Story.** A broker arranges a movement on behalf of a producer. The Movement ID is shared with the producer (who can track it) and with the carrier (whose driver collects and delivers). Receipt is recorded in real-time.

**What it stresses.** Same shape as 4.1 but with broker-mediated initiation. Useful for probing how brokers want to interact with the API and whether the producer's tracking lane is visible enough.

### 4.3 — Carrier, deferred collection, full rejection at gate

**Axes:** Initiator: carrier · Collection: deferred · Receipt outcome: rejectAll · Final: WWR/P · No cycles · **Non-compliant**

**Story.** A carrier moves their own waste. Driver couldn't record the collection at the time (no signal, busy site, paper-only process). The receiver rejects the entire load at the gate. The driver returns the waste to the producer's site. The collection is never reconciled afterwards.

**What it stresses.** What happens when something goes wrong end-to-end and no one closes the loop. This is a regulatory failure path: how should the system surface it? What alerts should fire? Who is accountable? Critical material for vendor conversations.

### 4.4 — Broker, deferred collection, full rejection at gate

**Axes:** Initiator: broker · Collection: deferred · Receipt outcome: rejectAll · Final: WWR/P · No cycles · **Non-compliant**

**Story.** Mirror of 4.3 but broker-initiated. The producer is now in the loop (they have the Movement ID and can track) — does the producer's view show the rejection? When? Who notifies them?

**What it stresses.** Producer visibility into failure paths. Differs from 4.3 specifically because of the producer-tracking lane.

### 4.5 — Carrier, retrospective collection, partial acceptance

**Axes:** Initiator: carrier · Collection: retrospective · Receipt outcome: acceptPart-accepted · Final: AWR/C · No cycles · Compliant

**Story.** A carrier moves their own waste. Driver couldn't record at collection but the carrier's back-office reconciles it later that day. At the receiver, the load is partially accepted — some accepted, some rejected. The accepted portion proceeds to receipt; the rejected portion is dealt with separately (next scenario covers that branch). Eventually the carrier reconciles the whole thing at AWR/C.

**What it stresses.** The retrospective recording flow — proving deferred recording can be made compliant if the carrier follows up. Also introduces partial acceptance from the accepted-portion side.

### 4.6 — Carrier, deferred collection, partial rejection with retry at alternative site

**Axes:** Initiator: carrier · Collection: deferred · Receipt outcome: acceptPart-rejected → retry → acceptAll · Receipt recording: deferred · Final: AWR/R · **Cycle: rejection-retry** · **Non-compliant**

**Story.** A carrier moves their own waste. Driver doesn't record at collection. At the first receiver the load is partially rejected — the rejected portion is sent on to a different receiver instead of back to the producer. The second receiver accepts the rejected portion in full. Receipt is deferred and never followed up.

**What it stresses.** The rejection-retry cycle — driver redirecting rejected waste to an alternative site rather than back to the producer. Tests whether the same Movement ID continues into the new drop-off, and what state the movement is in between rejections.

### 4.7 — Producer-tracking standalone

**Axes:** Initiator: carrier · No operational events · Final: AWR/P · No cycles · Compliant

**Story.** A carrier creates a movement and shares the Movement ID with the producer. The producer queries the fate of their waste. (In the diagram this currently appears as a standalone scenario, though strictly it should run in parallel with one of the operational scenarios above.)

**What it stresses.** The producer's read-only experience. What information is available, when, and at what level of detail? This is the only scenario where the producer is the active user.

### 4.8 — Broker, deferred collection, partial acceptance ending at carrier reconciliation

**Axes:** Initiator: broker · Collection: deferred · Receipt outcome: acceptPart-accepted · Receipt recording: na · Final: AWR/C · No cycles · **Non-compliant**

**Story.** Broker initiates. Driver doesn't record at collection. At the receiver, partial acceptance — accepted portion is taken (no receipt recorded at the gate), driver returns to depot, carrier reconciles at AWR/C. The collection deferral was never resolved, so the movement is non-compliant.

**What it stresses.** A complex non-compliant path that ends at AWR/C rather than AWR/R or WWR/P. Useful for testing whether non-compliance is detected and surfaced regardless of which terminal state the movement ends in.

### Coverage summary

Across the eight curated scenarios:

- Both initiators (broker, carrier) appear
- All three collection-recording modes (realtime, deferred, retrospective) appear
- All four receipt outcomes (acceptAll, rejectAll, acceptPart-accepted, acceptPart-rejected) appear
- All four final states (AWR/R, AWR/C, AWR/P, WWR/P) appear
- Both compliance values (compliant, non-compliant) appear

**One coverage gap:** the multi-collection and multi-drop-off cycles aren't represented in the curated set — only rejection-retry made it in (scenario 4.6). They exist in the wider corpus and should be added if cycle exploration is a UR priority. See section 5 for representatives.

## 5. The wider corpus — representative samples

The full enumeration produces 282 scenarios when cycle-exclusivity is enforced (each path traverses at most one of the three loop edges). This corpus is available as JSON and is intended as a *test corpus* for the eventual API: every realistic event sequence we expect the system to handle is enumerable from it.

A few representative samples that complement the curated set, particularly around cycles:

| Sample | Initiator | Coll. rec. | Receipt outcome | Cycle | Notes |
|---|---|---|---|---|---|
| Multi-collection consolidated drop-off | Broker | realtime | acceptAll | multi-collection | Driver collects from 2 producer sites, consolidates into one Transfer ID at receiver. The "headline" use case for the API. |
| Multi-drop-off with retrospective collection | Carrier | retrospective | acceptAll × 2 | multi-drop-off | One driver carries Movement IDs A and B, drops them at two different receivers, then reconciles collection retrospectively. Tests cross-Movement coordination. |
| Rejection-retry into partial acceptance | Broker | realtime | rejectAll → retry → acceptPart-accepted | rejection-retry | Full rejection at first receiver, redirect to alternative, partial acceptance at second receiver. Stresses the carrier-decides-where-rejected-waste-goes routing. |
| Compliant deferred recording with retrospective resolution | Carrier | retrospective | acceptAll | none | The "deferred but resolved" baseline. Compares directly against 4.3 (deferred and never resolved → non-compliant). |

Distribution across the 282:

- By initiator: ~40% broker-initiated, ~60% carrier-initiated
- By cycle: ~15% multi-collection, ~25% multi-drop-off, ~20% rejection-retry, ~40% no cycles
- By compliance: ~50% compliant, ~50% non-compliant

The non-compliant percentage is high because *every* deferred-and-not-reconciled trajectory is non-compliant, and the algorithm enumerates these alongside the compliant ones to make regulatory failure modes visible. They're not the majority of *real-world* movements — they're the majority of *enumerable failure paths*.

## 6. Open questions for the BA / team

A handful of points the diagram and the extracted scenarios couldn't resolve on their own. Light touch — flagging for discussion, not pre-resolving.

- **Transfer ID derivation.** Does Transfer ID derive deterministically from the Movement IDs being grouped, or is it an independent identifier? Affects how the API is structured and how clients can compute identifiers in advance.
- **Same Movement ID on rejection-retry.** When rejected waste is redirected to an alternative receiver, does it continue under the original Movement ID or get a new one? Likely the original (regulatory chain unbroken), but worth confirming.
- **Producer-tracking lane semantics.** Currently modelled as a standalone scenario (4.7). It probably should be a parallel lane that overlays every operational scenario, but the diagram notation doesn't easily express that. Is the BA happy with the standalone representation for now?
- **Onward movement.** The diagram doesn't model what happens when waste is accepted at a transfer station and then onward-moved to a treatment facility. May be deliberately out of scope for v1; worth confirming.
- **Partial-acceptance receipt fields.** When a receiver partially accepts, the receipt event at that site needs to record both the accepted *and* rejected quantities (so the audit trail is complete). Confirm this with policy team.
- **Two `ignore` nodes** (`31` and `0-1777852362338`) — leftover Mural artefacts, cosmetic. Worth tidying up before a future re-extraction.

## 7. What's next

With the scenario set stable, the next step is the data model and API spec:

1. **Data model.** Reconcile the existing ERDs (CARRIER_DETAILS, COLLECTION_MOVEMENT_DETAILS, etc.) with the four-event model. Define how Movement ID and Transfer ID relate. Resolve the policy questions in section 6.
2. **API spec.** Extend the existing `Receipt_API.yml` with the three new POST endpoints (Create, Collection, Drop-off) and the Producer GET. Each curated scenario in section 4 should produce a valid sequence of API calls; if it doesn't, the spec is incomplete.
3. **Mock and visualise.** Build a mock API that responds to the spec, and a visual flow UI that walks through the scenarios using the mock. This is the artefact for software-vendor UR.

The 282-scenario test corpus is the validation set throughout. Every change to the data model or API should leave the corpus enumerable; scenarios that become unrepresentable indicate either a model gap or a scenario that wasn't real to begin with.

---

*Generated from Mural board extraction. 282 scenarios, 8 curated. See `/mural-flow-diagram-import` for the extraction tool and `curated.json` for the machine-readable scenario set.*
