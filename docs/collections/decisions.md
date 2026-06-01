# Decisions

A running register of design decisions for the collections work, plus the
open questions and parked items that go with them. The intention is that
anyone joining the work can read this page and know what has been settled,
what is still being worked through, and what has been deliberately
deferred.

Each entry follows the same shape: title, a short context, the decision
(or "to be decided"), and the consequences. Decisions that turn out to
have been wrong are not deleted — they are marked as superseded and a
link added to the entry that replaced them.

## Decided

### Extend the Phase 1 Receipt API into one end-to-end spec

**Context.** Phase 1 delivered a receiver-first Receipt of Waste API
(live/public beta). Phase 2 adds the rest of the journey — create
movement, collection, drop-off, and producer fate-of-waste tracking.
This could be built as a separate Phase 2 API alongside Phase 1, or as
an extension of the existing contract.

**Decision.** Extend Phase 1 into a single Digital Waste Tracking spec
(`api/openapi.yaml`) covering the movement end to end. The new endpoints
are added alongside the Phase 1 receipt endpoints, which are retained as
`deprecated: true` for backward compatibility, and the Phase 1 validation
envelope and reference-data lookups are reused unchanged rather than
reinvented. The standalone Phase 1 spec (`Receipt_API.yml`) and the
extended spec coexist during alpha, so vendors can see the difference
between the current contract and the extended one ahead of Phase 2
reaching public beta and production.

**Consequences.** Existing vendor integrations against the Receipt API
keep working — no clean break. One contract describes the whole journey,
so the deprecation path is visible in one place. Both specs are published
during the transition; the extended spec becomes the single forward
contract once Phase 2 reaches public beta/production, at which point the
standalone `Receipt_API.yml`'s future is revisited. The cost is carrying
some Phase 1 shape forward (e.g. the `wasteTrackingId` naming, the looser
Phase 1 `address`); those trade-offs are recorded in their own entries. A
removal timeline for the deprecated receipt endpoints *within* the
extended spec is a separate open question (see below).

### Single OpenAPI file, not `$ref`-split

**Context.** Given the decision to extend Phase 1 into one spec (above),
that spec could live as one OpenAPI file or be split into `$ref`-linked
component files from the start.

**Decision.** Single file (`api/openapi.yaml`) for now. Split into
components only if the file becomes unwieldy.

**Consequences.** Easier to navigate while the shape is still moving;
refactor cost is low if and when it's needed. The file is currently
~2,000 lines — comfortable as one file, and the threshold for splitting
is a judgement call not yet reached.

### OpenAPI 3.0.3, not 3.1

**Context.** The Phase 1 Receipt API is OpenAPI 3.0.3. The new spec
could either match Phase 1 or move to 3.1, which has better JSON Schema
alignment.

**Decision.** Stay on 3.0.3 for now.

**Consequences.** Both specs share a version; tooling reading one can
read the other. Worth revisiting once the spec stabilises.

### Receipt path parameter stays `{wasteTrackingId}`

**Context.** An earlier decision renamed the Phase 1 receipt path
parameter to `{id}`. The Level 2 restructure reversed this: with
`{movementId}` and `{transferId}` now used on the new resources, a bare
`{id}` on the receipt endpoints would be ambiguous — and the value is the
Phase 1 `wasteTrackingId`, a receipt-time identifier, not a Phase 2
`movementId`.

**Decision.** Keep the path parameter as `{wasteTrackingId}` on the
deprecated receipt endpoints. The parameter description states it is the
Phase 1 `wasteTrackingId` returned by `POST /movements/receive`, minted at
receipt, and that a Phase 2 Movement ID must not be substituted here.
Supersedes the earlier rename-to-`{id}` decision.

`wasteTrackingId` was Phase 1's only identifier because a movement was
then known only at receipt time. Phase 2 adds `movementId` (creation) and
`transferId` (drop-off) to track creation→receipt; all three use sqids
(sqids.org). Whether and how a Phase 1 `wasteTrackingId` reconciles to a
Phase 2 `movementId` is **not decided here** — it belongs to the Phase 1 →
Phase 2 migration strategy (see Open).

**Consequences.** No `{id}` placeholder anywhere — every path parameter
names the concrete identifier it carries (`movementId`, `transferId`,
`wasteTrackingId`). Affects only how the deprecated legacy path reads.
This entry no longer asserts a permanent identity relationship between
`wasteTrackingId` and `movementId`; that is left to migration.

### Receipt is linked to a drop-off via the Transfer ID (path parameter)

**Context.** A receipt should be linkable to the drop-off that preceded
it, via the Transfer ID. An earlier decision added `transferId` as an
optional field on the `POST /movements/receive` request body, so Phase 1
receivers could omit it and new flows could supply it.

**Decision.** Superseded by the Level 2 restructure. The canonical receipt
is now `POST /transfers/{transferId}/receipt`, where the Transfer ID is a
mandatory path parameter — so every receipt recorded through the new
endpoint is linked to its drop-off by construction. The deprecated Phase 1
`POST /movements/receive` keeps its original body unchanged (no
`transferId` field), preserving backward compatibility for standalone
receipts. The optional-body-field mechanism was not carried forward.

**Consequences.** Linking is structural rather than an optional payload
field: a receipt under a Transfer is always associated with that Transfer
and, through it, the originating Movement IDs. Receivers not on the new
flow continue to use the deprecated endpoint with no Transfer ID.
(Contingent on Option 1 of the receipt-migration decision — see Open.)

### Cross-check of receipt details against the linked drop-off

**Context.** A receipt recorded against a Transfer carries carrier and
waste details that are also derivable from the linked drop-off. These
could be required to match exactly, or treated as an opportunity to
cross-check.

**Decision.** Cross-check, surfacing mismatches as validation warnings
rather than hard errors. Because the Transfer ID is now the path
parameter on `POST /transfers/{transferId}/receipt` (see [receipt is
linked to a drop-off via the Transfer ID](#receipt-is-linked-to-a-drop-off-via-the-transfer-id-path-parameter)),
the cross-check is unconditional for every receipt recorded through the
new endpoint — there is no longer a "when `transferId` is supplied"
branch. It does not apply to the deprecated `POST /movements/receive`,
which carries no Transfer ID.

**Consequences.** Receivers can still record receipts when paperwork has
minor inconsistencies; the system surfaces the discrepancy without
blocking the record. The `recordReceipt` endpoint description notes that
differences are returned in `validation.warnings`, without committing to
specific comparison rules. The exact granularity of the check (string
match, field-by-field, etc.) is still to be defined — see the
cross-check granularity open question. (Contingent on Option 1 of the
receipt-migration decision — see Open.)

### Drop-off is many-to-one against Movement IDs

**Context.** A multi-collection run delivers several Movements at once
to the same receiver site. The drop-off endpoint could either be
Movement-scoped (one drop-off per Movement, with a "primary" Movement
on the URL) or aggregate (one drop-off covering many Movements, with
the Movement IDs in the body).

**Decision.** Aggregate. `POST /transfers` takes a `movementIds[]` array
in the body. Single-collection drop-offs supply an array of one. No
"primary" Movement is selected.

**Consequences.** The Transfer ID minted by the drop-off is the
aggregation point — one Transfer ID, one or more Movement IDs. The
shape of the receipt and producer-query downstream both work cleanly
off this model.

### Carrier always required; broker optional

**Context.** A movement may be initiated by a carrier or by a broker
(or producer, or receiver — all acting in the broker role here). The
carrier is always physically involved; the broker is not always
involved.

**Decision.** `carrierDetails` is required on movement creation.
`brokerDetails` is required only when the movement is broker-initiated.
The broker-vs-carrier discriminated union proposed earlier is deferred.

**Reaffirmed.** A later BA discussion asked whether the carrier
requirement could be relaxed for non-hazardous waste. Outcome: no change —
`carrierDetails` is always required at creation regardless of hazardous
status.

**Consequences.** Schema is straightforward. Server-side logic
validates that `brokerDetails` is present when needed. Reintroducing
the discriminated union is possible later without breaking clients
that already supply both forms.

### Deletion exists as non-binding proposals at each stage

**Context.** An earlier decision deferred deletion entirely ("no deletion
endpoint in this version"), partly because the original
`DELETE /movements/create` URL was malformed and the semantics (soft vs.
hard, audit, who can delete) were unresolved.

**Decision.** The spec now carries `DELETE` endpoints at each stage —
`DELETE /movements/{movementId}`,
`DELETE /movements/{movementId}/collection`, `DELETE /transfers/{transferId}`,
and `DELETE /transfers/{transferId}/receipt` — each marked
`x-stability: proposal`, with a description noting deletion rules are
pending BA confirmation. They make the shape of the contract visible; they
are not committed behaviour.

A substantive decision is still needed, per stage: when may a Movement,
Collection, drop-off (Transfer), or Receipt be deleted; soft vs. hard
delete; audit trail; and authorisation. Until that is taken the `DELETE`
operations stay `x-stability: proposal` and must not be implemented as
binding.

**Consequences.** Vendors can see deletion is coming and where, but must
not depend on it. The malformed `DELETE /movements/create` is gone,
replaced by well-formed resource-scoped paths. Supersedes the earlier
"no deletion endpoint" decision.

### Hazardous waste cannot be merged across Movements at drop-off

**Context.** A drop-off can cover one or more Movements delivered
together at the same receiver site (multi-collection runs). For
hazardous waste, regulatory and audit constraints make merging
multiple Movements under a single Transfer ID inappropriate — each
hazardous Movement needs its own Transfer ID for traceability.

**Decision.** When any of the Movements named in a `POST /transfers`
request carries hazardous waste, the request must contain exactly one
Movement ID. Multi-Movement drop-offs are permitted only when all linked
Movements are non-hazardous.

The constraint is data-dependent (depends on properties of the linked
Movements that the request body does not carry). It is therefore not
expressed in the OpenAPI schema, but documented on the endpoint and
validated server-side. Violations return a 400 with a clear validation
error.

**Consequences.** Multi-collection runs remain a first-class concept
for non-hazardous waste. Carriers handling hazardous waste record one
drop-off per Movement, even if the loads physically arrive together.

### Static and transit collection collapsed into a single endpoint — superseded

**Original decision.** Merge the separate static- and transit-collection
endpoints into one.

**Superseded.** v1 records **static collection only** (producer-to-driver)
as a single event, 1:1 with its Movement, at
`POST /movements/{movementId}/collection` (see *Level 2* and *Movement ↔
Collection is 1:1*). Transit collection (driver-to-driver) is out of scope
for v1 and parked (see Parked). With transit deferred there are no two
endpoints to collapse, so the original framing is moot.

### Per-event IDs not exposed in the public API

**Context.** Earlier conversations specified per-event identifiers
(creation, collection, drop-off, plus the legacy receive ID) returned
alongside Movement ID and Transfer ID in API responses. On review this
was identified as a conflation of two concerns: server-side storage
identifiers (every event needs a unique row internally) and public API
contract identifiers (values vendors store and pass around).

**Decision.** Only Movement ID and Transfer ID are exposed in the API
contract. The per-event identifiers — for creation, collection, drop-off,
and receipt — remain in the server's storage layer (internal UUIDs) but
are not returned in API responses. The deprecated Phase 1 receipt path
additionally exposes `wasteTrackingId`, Phase 1's receipt-time identifier —
distinct from the Movement ID, with reconciliation between the two
deferred to the migration strategy (see Open).

**Consequences.** Three response schemas slim down:

- `createMovementResponse` returns `movementId` and `validation` only.
- `recordCollectionResponse` returns `validation` only.
- `dropOffResponse` returns `transferId` and `validation` only.

The four placeholder ID schemas are removed from `components.schemas`;
internal event IDs survive only as a documentation comment. There is no
dedicated collection resource schema and no public collection ID — the
collection is addressed through its parent Movement
(`GET /movements/{movementId}/collection`), and `getCollection` returns the
collection event itself.

Vendors track two values per journey: Movement ID (durable, addresses a
Movement) and Transfer ID (addresses a drop-off across one or more
Movements). On the deprecated Phase 1 path, `wasteTrackingId` is a third.
Anything else is the server's business.

### Identifier format and capacity (year-prefixed sqids)

**Context.** Movement ID and Transfer ID are the public identifiers
vendors store and pass around. They must be short, externally shareable,
opaque, and collision-free at national volume (the service is estimated
at >100,000 transactions/year).

**Decision.** Both are generated with sqids (https://sqids.org/) in a
fixed 8-character format: a two-character year prefix (`YY`) followed by
six characters from the 36-symbol alphabet A–Z and 0–9. The deprecated
Phase 1 `wasteTrackingId` uses the same format.

Capacity per year: the six-character suffix over a 36-symbol alphabet
gives 36^6 = **2,176,782,336** (~2.18 billion) unique IDs. The `YY`
prefix partitions the space by year, so each year opens a fresh ~2.18
billion namespace and total capacity across years is effectively
unbounded. (sqids reserves a small set of combinations for its profanity
blocklist, so the usable count is marginally below the theoretical
maximum.)

**Consequences.** ~2.18 billion IDs per year exceeds the national volume
estimate by roughly four orders of magnitude — ample headroom. IDs are
opaque; callers must not parse them (the schema descriptions say so).
Movement ID and Transfer ID share the same format and are disambiguated
by the endpoint/path they appear on, not by the string itself.

Two follow-ups this surfaces, for the data/spec pass:

- The current spec is inconsistent about the prefix: `movementId`'s
  example is numeric (`25HRA0B2`, year "25") while the `wasteTrackingId`
  pattern requires two letters (`^[A-Z]{2}[A-Z0-9]{6}$`, example `YY...`).
  If the prefix is a numeric year, that regex is wrong; the canonical
  format above needs a single agreed prefix definition and matching
  patterns on all three identifier schemas.
- Whether the two ID types are minted from a shared sequence or
  partitioned per type (so a `movementId` and a `transferId` can never be
  the same string) is a server concern to confirm.

### Sub-resource reads return 404 until the event is recorded

**Context.** Collection and receipt are 1:1 sub-resources that come into
existence later than their parent: a Movement exists from creation but is
not collected until later, and a Transfer is minted at drop-off but not
received until later. So `GET /movements/{movementId}/collection` and
`GET /transfers/{transferId}/receipt` each have a window where the parent
exists but the sub-resource does not.

**Decision.** The sub-resource is addressed purely by its parent ID in the
URL and returns `200` with the event once recorded, `404` until then —
the conventional REST shape for an absent sub-resource (preferred over a
`200` with a "pending" status or a `204`). The `404` carries a
`notFoundError` body whose `code` distinguishes two cases: the parent is
missing (`MOVEMENT_NOT_FOUND` / `TRANSFER_NOT_FOUND`) versus the parent
exists but the event is not recorded yet (`COLLECTION_NOT_RECORDED` /
`RECEIPT_NOT_RECORDED`). The same applies to the `PUT` updates. Single
resources (`getMovement`, `getDropOff`) have no such window and keep a
plain `404`. The `DELETE` operations are left untouched as
`x-stability: proposal` pending the deletion decision.

**Consequences.** A polling client — the likely consumer, waiting for a
collection or receipt to appear — can tell a wrong identifier (stop) from
an event that simply has not happened yet (keep polling). This is the
minimal resolution of the earlier `CollectionResource` question: no
dedicated collection resource schema and no public collection ID. The
collection read still returns the `collectionRequest` shape; splitting it
into a separate read schema remains an option for later.

### Movement ↔ Collection and Transfer ↔ Receipt are 1:1

**Context.** While working through the Level 2 restructure (see next
entry), it became important to be precise about the relationships
between the four core concepts: Movement, Collection, Transfer, Receipt.

**Decision.** Each Movement has exactly one Collection event, and
each Transfer has exactly one Receipt event. The relationships are
1:1, not 1:many.

- A driver picking up from multiple producers on a run creates
  *multiple Movements* — each pickup is its own Movement, with its
  own Movement ID.
- A driver dropping at multiple receivers in a run mints *multiple
  Transfer IDs* — each drop-off event is its own Transfer.
- A Movement is on exactly one Transfer (Movement ↔ Transfer is
  many-to-one: many Movements aggregated under one Transfer at a
  single drop-off, but each Movement only ever appears on one
  Transfer).
- Whether a load is accepted in full, rejected, or partially accepted,
  the receipt stays 1:1 with its Transfer and the Movement is **not**
  split or duplicated; the Movement and its 1:1 Collection are unchanged.
  Phase 1 has no rejection concept (recording a receipt *is* acceptance);
  how Phase 2 represents acceptance/rejection outcomes is an open decision
  (see Open).

**Consequences.** This is the structural assumption underlying the
Level 2 restructure. The endpoint `GET /movements/{movementId}/collection`
returns a single Collection record, not a list. The endpoint
`GET /transfers/{transferId}/receipt` returns a single Receipt record.
Multi-collection journeys correspond to multiple Movements aggregated
at the drop-off; multi-drop-off journeys correspond to a driver minting
multiple Transfer IDs in one run.

### Level 2 (Richardson Maturity Model) resource model

**Context.** The original API spec used verb-shaped URL segments
(`/movements/create`, `/movements/collection`, `/movements/drop-off`,
`/movements/receive`) with every operation as POST. After a sequence
of architectural reviews, the team agreed the spec should adopt
Richardson Level 2: URLs as resource paths, HTTP methods as the verbs.

The journey was:
- A colleague raised that the `/movements/` vs `/transfers/` split was
  the natural Level 2 instinct.
- Another colleague pointed out that going further — events as
  first-class addressable resources — would unlock cacheable GETs and
  make the contract cleaner.
- The 1:1 cardinality (see previous decision) made it possible to
  adopt Level 2 without introducing additional public IDs for
  `collectionId` and `receiptId` — each sub-resource is uniquely
  addressed by its parent.

**Decision.** Adopt Level 2:

- Resources are plural collections: `/movements`, `/transfers`.
- Individual resources: `/movements/{movementId}`, `/transfers/{transferId}`.
- Sub-resources are singular (1:1): `/movements/{movementId}/collection`,
  `/transfers/{transferId}/receipt`.
- HTTP methods carry the action: `POST` creates, `GET` reads,
  `PUT` updates.
- `operationId`s stay verb-shaped (`createMovement`, `recordCollection`,
  `recordDropOff`, `recordReceipt`, etc.) — they describe the business
  event and remain stable across URL changes.

**Consequences.** Substantial spec restructure (all path keys changed
except the reference data GETs and `fate-of-waste`). GETs become
cacheable; reads can be served by CDN, proxy, browser, client-side
cache. Each event becomes an addressable resource with its own
endpoint. The fate-of-waste endpoint is kept as a deliberate
projection for the producer-facing view, alongside the resource-level
GETs.

Movement ID and Transfer ID remain the only public IDs. Per-event IDs
(`creationId`, `collectionId`, etc.) stay internal to the server. The
"Per-event IDs not exposed in the public API" decision is unchanged
by this; the Level 2 adoption *would* have required them as URL
parameters if the cardinality were 1:many, but at 1:1 the parent ID
is sufficient.

The Phase 1 receipt endpoints (`POST /movements/receive`,
`PUT /movements/{wasteTrackingId}/receive`) remain in the spec marked `deprecated:
true`. Their operationIds were renamed to `createReceiptMovementLegacy` and
`updateReceiptMovementLegacy` to free up the canonical names for the new
Transfer-scoped endpoints. A removal date for the deprecated endpoints
is an open question — see below.

This decision also resolves the earlier "Static and transit collection
collapsed into a single endpoint" decision in a more elegant way:
collection is now a 1:1 sub-resource of a Movement, and what was
called multi-collection is now multi-Movement-under-one-Transfer.

### Drop-off PUT semantics in multi-collection cases — resolved

Asked whether updating a drop-off via one Movement's URL updated the
shared drop-off or only that Movement's view. Dissolved by the Level 2
restructure: a drop-off is a Transfer addressed by `transferId`, not
addressed through any Movement. `PUT /transfers/{transferId}` updates the
single shared Transfer covering all its `movementIds`; there is no
per-Movement view. (See *Level 2 resource model*.)

## Open

### Drop-off address derivability

`dropOffAddress` is currently optional in the spec. It is undecided
whether it should be **mandatory**, stay **optional**, or be **removed
entirely** (the latter only if it's always derivable from the linked
Movements' planned receiver, `estimatedReceiverDetails`). Two facts are
relevant without settling it: the planned receiver is explicitly an
*estimate*, not authoritative; and the rejection-retry scenario (recap
4.6) can deliver to a different receiver than planned, so the actual
drop-off location may diverge from the estimate. No assumption made on
mandatory/optional/removed — pending BA input.

### Fate-of-waste timestamps in multi-event scenarios

`fateOfWasteResponse` carries scalar `collectionDateTime` and
`receiptDateTime`. The spec takes a provisional position: in
multi-collection runs `collectionDateTime` is the **earliest** collection
("when did my waste leave my site"), and in multi-drop-off scenarios
`receiptDateTime` is the **final** receipt. So the working answer is
scalar-with-a-rule, not arrays. Open: confirm with the BA that
earliest-collection / final-receipt is what the producer should see, or
whether a producer needs the full list of timestamps (which would make
these arrays). The `collectionDateTime` description already flags this as
subject to BA confirmation.

### Treatment code split

`fateOfWasteResponse` exposes two scalar codes, `startTreatmentCode` and
`finalTreatmentCode`. The receipt captures `wasteItems[].disposalOrRecoveryCodes`
— an array of `{ code, weight }` recorded at receipt — so `startTreatmentCode`
can be derived from that. `finalTreatmentCode` has no source in the current
model: its description ties it to waste "sent on for further treatment",
i.e. onward movement, which is not modelled and is itself an open question
(see *Onward movement* below). Open: whether `finalTreatmentCode` is a
distinct value recorded at a later treatment stage (requiring onward
movement to be in scope), or a single code updated as treatment progresses,
or summarised from the receipt's weighted code list. Coupled to the
onward-movement decision — likely can't be resolved before it. Pending
data-model work.

### Cross-check granularity

A receipt's carrier and waste details are cross-checked against the linked
drop-off, surfacing mismatches as validation warnings (see the decided
cross-check entry). Whether the check is **unconditional** (Option 1:
`transferId` is the receipt's path parameter) or **conditional on a
supplied `transferId`** (Option 2: optional body field) depends on the
open *Receipt migration* decision. Independent of that, what counts as a
mismatch is unspecified: identical strings? same registration number,
different address? same EWC code, different quantity? The server validates
this; the spec needs a clearer statement of the rules once agreed.

### Receipt migration: new endpoint vs extend Phase 1

How receivers move from the Phase 1 receipt to the linked Phase 2 receipt
is undecided. Both options share one internal receipt function, and both
require a prior drop-off to obtain a `transferId`, so implementation cost
and the drop-off dependency are equivalent either way — the difference is
contract shape and migration friction.

**Option 1 (current spec, favoured but not decided).** Implement
`/transfers/{transferId}/receipt` over the same internal receipt function
called by `/movements/receive`, and deprecate `/movements/receive`.
Linking is structural — the `transferId` is a mandatory path parameter, so
a new-flow receipt cannot be recorded without a Transfer, and the
cross-check against the linked drop-off is unconditional. Fits the Level 2
model already adopted: receipt is a 1:1 sub-resource of Transfer with a
cacheable, addressable `GET /transfers/{transferId}/receipt`. Cost: two
receipt endpoints coexist through the transition, the GET-receipt path is
split (by `transferId` for new, `wasteTrackingId` for legacy), and Phase 1
can't be fully retired until receivers record drop-offs.

**Option 2.** Do not add the new endpoint; keep `/movements/receive` and
add an optional `transferId` to its request body. Lowest URL churn —
existing vendors keep the same endpoint and add the field when ready; one
receipt endpoint, no "which do I call?". Cost: linking becomes
optional-by-convention (a receipt that should be linked can be recorded
without the field — a silent gap), the cross-check reverts to conditional
("when `transferId` is supplied"), and it keeps a verb-shaped,
non-resource endpoint as the canonical receipt, partially reversing the
Level 2 restructure.

**Current lean: Option 1**, on consistency with the Level 2 decisions and
because it makes linking a guarantee rather than a convention. Decision
still open.

**If Option 2 is chosen**, these entries need revisiting: *Receipt is
linked to a drop-off via the Transfer ID*, *Cross-check of receipt details
against the linked drop-off*, *Level 2 (Richardson Maturity Model)
resource model*, and *Movement ↔ Collection and Transfer ↔ Receipt are 1:1*.

### Phase 1 receipt endpoint deprecation timeline

The Level 2 restructure superseded `POST /movements/receive` and
`PUT /movements/{wasteTrackingId}/receive` with `POST /transfers/{transferId}/receipt`
and `PUT /transfers/{transferId}/receipt`. The Phase 1 endpoints remain
in the spec marked `deprecated: true` for backward compatibility, but
no removal date has been set. Open: when do existing Phase 1 clients
need to migrate, and how is that communicated to them? Options range
from indefinite deprecation (Phase 1 endpoints stay forever) to a
scheduled cutover with a removal window. A migration-by-redirect was
considered but has known issues with non-GET methods across different
HTTP client libraries.

**Contingent on the *Receipt migration* decision.** This timeline question
only arises under Option 1 (a separate `/transfers/{transferId}/receipt`
that deprecates `/movements/receive`). Under Option 2 there is no
superseded endpoint to retire and this question falls away. The identifier
side of migration is tracked separately under *`wasteTrackingId` ↔
`movementId` reconciliation*.

### `wasteTrackingId` ↔ `movementId` reconciliation

Phase 1 minted `wasteTrackingId` at receipt; Phase 2 mints `movementId` at
creation. Whether a Phase 1 record maps to a Phase 2 Movement ID (and how),
on migration, is undecided — owned by the Phase 1 → Phase 2 migration
strategy.

### Receipt acceptance / rejection outcome (new in Phase 2)

Phase 1 has no rejection model — recording a receipt means the waste was
accepted; there is no way to record a full rejection, a partial
acceptance, or waste returned to the producer. The scenario taxonomy,
however, treats `acceptAll` / `rejectAll` / `acceptPart-accepted` /
`acceptPart-rejected` as first-class receipt outcomes, and the `WWR/P`
terminal state depends on rejection existing. Phase 2 must decide whether
to introduce a receipt outcome concept and, if so, what it records
(outcome indicator, accepted vs rejected quantities, reason, what happens
to the rejected portion). Undecided; needs policy-team input. Structurally,
whatever is chosen sits on the single Receipt, not on a split Movement
(see the 1:1 decision).

### Onward movement

The diagram doesn't model what happens when waste is accepted at a transfer
station and then onward-moved to a treatment facility. May be deliberately
out of scope for v1; worth confirming. Coupled to the *Treatment code
split* question — `finalTreatmentCode` has no source unless onward movement
is modelled.

### Per-organisation vs per-actor API credentials

Phase 1 is receiver-first: a receiver registers its organisation via the
Waste Tracking Service and gets credentials (Bearer token + `apiCode`, the
*receiving organisation's* identifier). Phase 2 adds carrier/broker/producer
actors, and one organisation may hold several roles. Open: when a carrier
is in the same organisation as a registered receiver, does it need separate
credentials, or does one organisation-level registration cover all its
roles? To bring forward with identity/onboarding — not yet explored.

### Pre-generated Transfer IDs for offline drivers

If a driver has no signal at the drop-off, they cannot call
`POST /transfers` to mint a Transfer ID in the moment — yet they need one
to hand to the receiver (typically on paper) so the receipt can be
recorded against it. Open: can software vendors be issued a pool of
pre-generated Transfer IDs that a driver's app assigns offline and
reconciles/POSTs when signal returns? Sub-questions: how are pre-generated
IDs reserved without collision; do they draw from the same per-year sqids
space (see *Identifier format and capacity*); how long does a reservation
stay valid; what happens to a reserved ID that is never used; and does the
same need apply to Movement IDs (created earlier, usually with signal) or
only to Transfer IDs (minted at the drop-off moment, the most likely
offline point)? Connects to the deferred/retrospective collection-recording
scenarios, which are the offline case generally.

## Parked

### Transit collection (driver-to-driver) — parked

Deferred from v1, which records static (producer-to-driver) collection
only. There is no transit endpoint or field in the spec. Under the 1:1
Movement↔Collection model the working assumption is that a driver-to-driver
handover decomposes into a new Movement at the next pickup rather than a
second collection on the same Movement — so transit may need no dedicated
event at all. To be confirmed with the BA if/when transit is picked up.

### Carrier-vs-broker discriminated union on `POST /movements`

A `oneOf` request shape distinguishing carrier-initiated and
broker-initiated creation was drafted then dropped in favour of a
single request body with `brokerDetails` optional. The discriminated
union may come back later if it makes the contract clearer for vendors,
but is not a v1 priority.
