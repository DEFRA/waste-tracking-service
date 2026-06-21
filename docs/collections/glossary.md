# Glossary

A reference for terms used across this section. Identifier vocabulary in
particular is worth establishing up front, because several IDs look
similar and refer to different things.

## Identifiers

### Movement ID

The identifier of a waste movement, minted when a movement is created via
`POST /movements`. It is immutable once issued and lives across the
whole journey of that movement, from creation through collection,
drop-off, and receipt. Software vendors and integrators store and pass
this value through their systems.

Phase 1 had no creation event, so a movement was known only at receipt
time and was identified by a `wasteTrackingId`. The Movement ID is
**distinct** from the `wasteTrackingId` — they are minted by different
events at different points in the lifecycle (creation vs receipt), and are
not the same value. Both use sqids (sqids.org). How a Phase 1
`wasteTrackingId` reconciles to a Phase 2 Movement ID is a
migration-strategy question, not settled here.

### `wasteTrackingId`

Phase 1's identifier for a received waste movement, minted at receipt by
`POST /movements/receive`. Phase 1 had no creation event, so this was the
only handle on a movement. Retained on the deprecated receipt endpoints
for backward compatibility. Distinct from the Phase 2 Movement ID (see
above); reconciliation between the two is deferred to the migration
strategy. Format: 8-character sqid, two-letter prefix.

### Transfer ID

The identifier of a drop-off event, minted when the carrier records a
drop-off via `POST /transfers`. A single Transfer ID covers one or
more Movement IDs delivered together at the same receiver site, which
is what makes multi-collection runs possible.

The driver passes the Transfer ID on to the receiver — typically on
paper, sometimes digitally — and the receiver records the receipt
against it via `POST /transfers/{transferId}/receipt`.

### Creation ID, Collection ID, Drop-off ID, Receive ID

Per-event identifiers, distinct from the Movement ID and Transfer ID.
Each event of a given type has its own ID. They are useful for audit
purposes and for referring to specific events without conflating the
event with the entity it acts on.

For example, a movement with two collections has one Movement ID, two
Collection IDs (one per collection event), one Drop-off ID and one
Transfer ID at delivery, and a single Receive ID at the receiver site.

### WT-ID

A legacy term from early Phase 1 documentation for the `wasteTrackingId`
(see its entry above). Mentioned here so readers of older documents
recognise it. It is **not** another name for the Phase 2 Movement ID.

## Resource hierarchy

The API is organised around two top-level resources — Movements and
Transfers — each with a sub-resource that captures the event happening
to it. The sub-resources are 1:1: each Movement has exactly one
Collection, each Transfer has exactly one Receipt. A Movement is on
exactly one Transfer; a Transfer can aggregate multiple Movements.

```
/movements/{movementId}/collection      ← 1:1 (the pickup)
/transfers/{transferId}/receipt         ← 1:1 (the acceptance)
/transfers/{transferId}                 ← contains a list of Movement IDs
```

This shape has two practical consequences worth knowing:

- **Multi-collection runs are multi-Movement.** A driver picking up
  from three producers in a single run creates three Movements, each
  with its own Movement ID and its own Collection event. The
  Movements are then aggregated under a single Transfer ID at the
  drop-off.
- **Multi-drop-off runs are multi-Transfer.** A driver dropping at
  two receivers in a single run mints two Transfer IDs — one per
  drop-off event. The Movements being delivered are split across the
  two Transfers.

If a load is partially rejected at the receiver, that is recorded on the
single Receipt, not by creating new Movements — the Movement is unchanged.
How the partial outcome is represented on the receipt is a data-model
question still being worked through and is not yet in the API spec.

A recorded drop-off is **immutable**: once a Transfer has been registered via
`POST /transfers`, the only property that can change is its soft-delete flag
`isDeleted`. `PUT /transfers/{transferId}` accepts that flag alone — the place,
carrier, timestamp and Movement IDs cannot be re-edited. To correct a drop-off,
soft-delete it and record a fresh one (see D-017 in the
[decisions register](decisions.md)).

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

### Collection

A collection event is the act of waste passing from a producer into a
driver's care, recorded against a specific Movement. Each Movement has
exactly one Collection event — a driver picking up multiple loads on a
run is recording one Collection per Movement, not multiple Collections
on a single Movement.

Earlier drafts of the API distinguished "static collection" (producer
to driver) from "transit collection" (driver-to-driver handover). The
final model collapses this distinction: every collection is just the
collection event for its Movement. A driver-to-driver handover is
modelled by ending one Movement at a drop-off and creating a new
Movement at the next pickup, rather than as a separate event type.

Endpoint: `POST /movements/{movementId}/collection`.

### Producer-tracking

A read-only flow in which the producer queries the fate of their waste
via `GET /movements/{id}/fate-of-waste`. The endpoint exposes a
deliberately limited subset of information, focused on classification
across stages, collection and receipt timestamps, and the treatment
codes applied at the receiver. The producer does not see operational
detail like the identity of the driver.

### Cross-check

The validation of a receipt's carrier and waste details against the
linked drop-off. Mismatches return validation warnings rather than hard
errors, so the receipt is still recorded when the paperwork chain has
minor inconsistencies. The granularity of the check is undefined and
tracked in the [decisions register](decisions.md). How the receipt links
to the drop-off — and therefore whether the cross-check is unconditional
or conditional on a supplied Transfer ID — depends on the open
receipt-migration decision; see the register.