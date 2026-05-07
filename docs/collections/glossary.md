# Glossary

A reference for terms used across this section. Identifier vocabulary in
particular is worth establishing up front, because several IDs look
similar and refer to different things.

## Identifiers

### Movement ID

The identifier of a waste movement, minted when a movement is created via
`POST /movements/create`. It is immutable once issued and lives across the
whole journey of that movement, from creation through collection,
drop-off, and receipt. Software vendors and integrators store and pass
this value through their systems.

In Phase 1 documentation the same value is referred to as the
`wasteTrackingId`. The two terms describe the same thing.

### Transfer ID

The identifier of a drop-off event, minted when the carrier records a
drop-off via `POST /movements/drop-off`. A single Transfer ID can cover
one or more Movement IDs delivered together at the same receiver site,
which is what makes multi-collection runs possible.

The driver passes the Transfer ID on to the receiver — typically on
paper, sometimes digitally — and the receiver supplies it on
`POST /movements/receive` to link the receipt back to the drop-off.

### Creation ID, Collection ID, Drop-off ID, Receive ID

Per-event identifiers, distinct from the Movement ID and Transfer ID.
Each event of a given type has its own ID. They are useful for audit
purposes and for referring to specific events without conflating the
event with the entity it acts on.

For example, a movement with two collections has one Movement ID, two
Collection IDs (one per collection event), one Drop-off ID and one
Transfer ID at delivery, and a single Receive ID at the receiver site.

### WT-ID

A legacy term used in some early Phase 1 documentation. Synonymous with
Movement ID and `wasteTrackingId`. Mentioned here so readers of older
documents know they are looking at the same value.

## Actors and roles

### Producer

The party producing the waste. The producer's site is where collection
takes place. In broker-initiated movements the producer can also query
the fate of their waste through the producer-tracking flow.

### Carrier

The party physically moving the waste. The carrier is always required
on a movement — even when the movement is initiated by someone else,
there has to be a carrier on the record. Carriers hold a CB:DU
(Carrier, Broker, Dealer Upper-tier) registration in England and Wales.

### Broker

A party arranging a movement on behalf of a producer. In the API,
broker details are required only when the movement is broker-initiated.

In the scenario taxonomy, the term `broker` is used as an umbrella for
any non-carrier-initiated movement — so a movement initiated by a
producer or a receiver, not just by a registered broker, also has
`initiator: broker` in the corpus. This is a deliberate simplification:
all three start their journeys at the same node in the BA's flow chart
and produce the same downstream paths.

### Driver

The individual physically operating the vehicle for a carrier. Currently
identified at event level (collection, drop-off) but treated as a
sub-actor of the carrier rather than an independent party. The data
model around drivers will firm up as we work through it.

### Receiver

The party operating the site where waste is delivered. Holds an
environmental permit (or equivalent authorisation) that determines
which waste types they may accept. Records the receipt of waste and
its initial treatment outcome.

## Journey terms

### Initiator

The party who creates the movement and, in doing so, mints the Movement
ID. In the scenario taxonomy the value is either `carrier` or `broker`
(see "Broker" above for what `broker` covers).

### Static collection

A collection event where waste passes from a producer to a driver, at a
producer site. This is the standard kind of collection and the only one
modelled in the current API.

### Transit collection

A collection event where waste passes from one driver to another at a
transit point — for example a depot, transfer station, or layby. Not
modelled in the current API. The endpoint shape is parked pending BA
confirmation.

### Producer-tracking

A read-only flow in which the producer queries the fate of their waste
via `GET /movements/{id}/fate-of-waste`. The endpoint exposes a
deliberately limited subset of information, focused on classification
across stages, collection and receipt timestamps, and the treatment
codes applied at the receiver. The producer does not see operational
detail like the identity of the driver.

### Cross-check

When a receipt is recorded with a Transfer ID supplied
(`POST /movements/receive` with `transferId` in the body), the carrier
and waste details in the receipt request are validated against the
linked drop-off. Mismatches return validation warnings rather than
hard errors, on the basis that the receipt should still be recorded
even when the paperwork chain has minor inconsistencies. The granularity
of the check is currently undefined and tracked in the
[decisions register](decisions.md).

## State codes

The waste-movement journey terminates in one of four named states.
The codes are used in the scenario corpus's `finalState` axis.

| Code | Meaning |
|---|---|
| `AWR/R` | Accepted-at-Receiver, recorded by the Receiver. The standard happy path. |
| `AWR/C` | Accepted-at-Receiver, reconciled by the Carrier later. The receipt happened but the carrier had to retrospectively reconcile a deferred collection. |
| `AWR/P` | Accepted-at-Receiver, observed by the Producer. The producer-tracking lane: the producer has visibility of the journey end state. |
| `WWR/P` | Waste Returned with Producer. The waste was rejected at the receiver and returned to the producer's site. |

Intermediate states (`BWM/C`, `WWC/D`, `WWT/D`, etc.) appear in the
scenario corpus paths but are not used as terminal states. The full
list is part of the [scenario generation process](scenarios/process.md).