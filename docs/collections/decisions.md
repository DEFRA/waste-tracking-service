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

Every entry carries a stable ID (`D-001`, `D-002`, …) shown on the
metadata line directly under its title, alongside its status, impact, and
area. The ID is assigned in the order the decision was first recorded and
is never reused or renumbered — so it is safe to cite a decision by its ID
elsewhere. Entries below stay in ID order; the [Index](#index) is the
ranked view, sorted by status then impact. **Impact** means structural
dependency — how much of the spec or how many other decisions rest on this
one — not urgency, so a high-urgency but self-contained item can still be
low impact.

## Index

At-a-glance view of every decision, sorted by status, then by impact (structural dependency), then by ID. The entries below stay in ID order so links stay stable; this table is the ranked view.

| ID | Decision | Status | Impact | Area |
|---|---|---|---|---|
| D-001 | [Extend the Phase 1 Receipt API into one end-to-end spec](#extend-the-phase-1-receipt-api-into-one-end-to-end-spec) | ✅ Decided | 🔴 High | **Spec scope** |
| D-005 | [Receipt is linked to a drop-off via the Transfer ID (path parameter)](#receipt-is-linked-to-a-drop-off-via-the-transfer-id-path-parameter) | ✅ Decided | 🔴 High | **Receipt** |
| D-007 | [Drop-off is many-to-one against Movement IDs](#drop-off-is-many-to-one-against-movement-ids) | ✅ Decided | 🔴 High | **Drop-off** |
| D-012 | [Per-event IDs not exposed in the public API](#per-event-ids-not-exposed-in-the-public-api) | ✅ Decided | 🔴 High | **Identifiers** |
| D-013 | [Identifier format and capacity (year-prefixed sqids)](#identifier-format-and-capacity-year-prefixed-sqids) | ✅ Decided | 🔴 High | **Identifiers** |
| D-015 | [Movement ↔ Collection and Transfer ↔ Receipt are 1:1](#movement-collection-and-transfer-receipt-are-11) | ✅ Decided | 🔴 High | **Resource model** |
| D-016 | [Level 2 (Richardson Maturity Model) resource model](#level-2-richardson-maturity-model-resource-model) | ✅ Decided | 🔴 High | **Resource model** |
| D-004 | [Receipt path parameter stays `{wasteTrackingId}`](#receipt-path-parameter-stays-wastetrackingid) | ✅ Decided | 🟠 Medium | **Identifiers** |
| D-006 | [Cross-check of receipt details against the linked drop-off](#cross-check-of-receipt-details-against-the-linked-drop-off) | ✅ Decided | 🟠 Medium | **Receipt** |
| D-008 | [Carrier always required; broker optional](#carrier-always-required-broker-optional) | ✅ Decided | 🟠 Medium | **Actors** |
| D-009 | [Soft-delete via `isDeleted`, set only on PUT](#soft-delete-via-isdeleted-set-only-on-put) | ✅ Decided | 🟠 Medium | **Lifecycle** |
| D-010 | [Hazardous waste cannot be merged across Movements at drop-off](#hazardous-waste-cannot-be-merged-across-movements-at-drop-off) | ✅ Decided | 🟠 Medium | **Drop-off** |
| D-014 | [Sub-resource 404 shape: parent-not-found vs event-not-recorded](#sub-resource-404-shape-parent-not-found-vs-event-not-recorded) | ✅ Decided | 🟠 Medium | **Lifecycle** |
| D-017 | [Drop-off PUT restricted to soft-delete only](#drop-off-put-restricted-to-soft-delete-only) | ✅ Decided | 🟠 Medium | **Lifecycle** |
| D-018 | [Drop-off address derivability](#drop-off-address-derivability) | ✅ Decided | 🟠 Medium | **Drop-off** |
| D-031 | [Disposal/recovery codes optional at Creation](#disposalrecovery-codes-optional-at-creation) | ✅ Decided | 🟠 Medium | **Collection** |
| D-032 | [Collection waste items align 1:1 by position with Creation](#collection-waste-items-align-11-by-position-with-creation) | ✅ Decided | 🟠 Medium | **Collection** |
| D-034 | [PUT operations use history/revision pattern across all events](#put-operations-use-historyrevision-pattern-across-all-events) | ✅ Decided | 🟠 Medium | **Lifecycle** |
| D-002 | [Single OpenAPI file, not `$ref`-split](#single-openapi-file-not-ref-split) | ✅ Decided | 🟢 Low | **Spec structure** |
| D-003 | [OpenAPI 3.0.3, not 3.1](#openapi-303-not-31) | ✅ Decided | 🟢 Low | **Spec structure** |
| D-011 | [Static and transit collection collapsed into a single endpoint](#static-and-transit-collection-collapsed-into-a-single-endpoint) | ✅ Decided | 🟢 Low | **Collection** |
| D-022 | [Receipt migration: new endpoint vs extend Phase 1](#receipt-migration-new-endpoint-vs-extend-phase-1) | ⏳ Open | 🔴 High | **Receipt** |
| D-025 | [Receipt acceptance / rejection outcome (new in Phase 2)](#receipt-acceptance-rejection-outcome-new-in-phase-2) | ⏳ Open | 🔴 High | **Receipt** |
| D-019 | [Fate-of-waste GET — producer journey query (proposal)](#fate-of-waste-get-producer-journey-query-proposal) | ⏳ Open | 🟠 Medium | **Fate-of-waste** |
| D-021 | [Cross-check granularity](#cross-check-granularity) | ⏳ Open | 🟠 Medium | **Receipt** |
| D-023 | [Phase 1 receipt endpoint deprecation timeline](#phase-1-receipt-endpoint-deprecation-timeline) | ⏳ Open | 🟠 Medium | **Receipt** |
| D-024 | [`wasteTrackingId` ↔ `movementId` reconciliation](#wastetrackingid-movementid-reconciliation) | ⏳ Open | 🟠 Medium | **Identifiers** |
| D-027 | [Per-organisation vs per-actor API credentials](#per-organisation-vs-per-actor-api-credentials) | ⏳ Open | 🟠 Medium | **Onboarding** |
| D-028 | [Pre-generated Transfer IDs for offline drivers](#pre-generated-transfer-ids-for-offline-drivers) | ⏳ Open | 🟠 Medium | **Identifiers** |
| D-029 | [Transit collection (driver-to-driver) — parked](#transit-collection-driver-to-driver-parked) | ⏸️ Parked | 🟢 Low | **Collection** |
| D-030 | [Carrier-vs-broker discriminated union on `POST /movements`](#carrier-vs-broker-discriminated-union-on-post-movements) | ⏸️ Parked | 🟢 Low | **Actors** |
| D-033 | [Per-event GET endpoints — parked](#per-event-get-endpoints-parked) | ⏸️ Parked | 🟢 Low | **Lifecycle** |

## Decided

<a id="d-001"></a>
### Extend the Phase 1 Receipt API into one end-to-end spec

**D-001** · ✅ Decided · Impact: 🔴 High · Area: **Spec scope** · Related: [D-016](#d-016), [D-022](#d-022)

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

<a id="d-002"></a>
### Single OpenAPI file, not `$ref`-split

**D-002** · ✅ Decided · Impact: 🟢 Low · Area: **Spec structure**

**Context.** Given the decision to extend Phase 1 into one spec (above),
that spec could live as one OpenAPI file or be split into `$ref`-linked
component files from the start.

**Decision.** Single file (`api/openapi.yaml`) for now. Split into
components only if the file becomes unwieldy.

**Consequences.** Easier to navigate while the shape is still moving;
refactor cost is low if and when it's needed. The file is currently
~2,000 lines — comfortable as one file, and the threshold for splitting
is a judgement call not yet reached.

<a id="d-003"></a>
### OpenAPI 3.0.3, not 3.1

**D-003** · ✅ Decided · Impact: 🟢 Low · Area: **Spec structure**

**Context.** The Phase 1 Receipt API is OpenAPI 3.0.3. The new spec
could either match Phase 1 or move to 3.1, which has better JSON Schema
alignment.

**Decision.** Stay on 3.0.3 for now.

**Consequences.** Both specs share a version; tooling reading one can
read the other. Worth revisiting once the spec stabilises.

<a id="d-004"></a>
### Receipt path parameter stays `{wasteTrackingId}`

**D-004** · ✅ Decided · Impact: 🟠 Medium · Area: **Identifiers** · Related: [D-024](#d-024)

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

<a id="d-005"></a>
### Receipt is linked to a drop-off via the Transfer ID (path parameter)

**D-005** · ✅ Decided · Impact: 🔴 High · Area: **Receipt** · Related: [D-006](#d-006), [D-016](#d-016), [D-022](#d-022)

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

<a id="d-006"></a>
### Cross-check of receipt details against the linked drop-off

**D-006** · ✅ Decided · Impact: 🟠 Medium · Area: **Receipt** · Related: [D-005](#d-005), [D-021](#d-021), [D-022](#d-022)

**Context.** A receipt recorded against a Transfer carries carrier and
waste details that overlap with details already recorded earlier in the
movement journey. These could be required to match exactly, or treated as
an opportunity to cross-check. An earlier draft of this decision named the
linked drop-off as the comparison source. That no longer holds: the
drop-off payload is a lighter, carrier-declared place model that carries
no waste details (see [drop-off place declared by the carrier](#d-007)
and the drop-off schema), so it cannot be the source for a waste-detail
cross-check.

**Decision.** Cross-check, surfacing mismatches as validation warnings
rather than hard errors. The comparison sources are:

- **Waste details** — compared against the *Movement record*: the waste
  classification declared at **Creation** plus the actual weights recorded
  at **Collection**. The receipt reaches these via the Transfer → Movement
  IDs link (see [D-007](#d-007)); the **drop-off event is excluded** from
  the waste cross-check because it carries no waste details.
- **Carrier details** — compared against the carrier recorded on the
  linked Movement chain (creation / collection / drop-off all carry a
  carrier block).

Because the Transfer ID is the path parameter on
`POST /transfers/{transferId}/receipt` (see [receipt is linked to a
drop-off via the Transfer ID](#receipt-is-linked-to-a-drop-off-via-the-transfer-id-path-parameter)),
the cross-check is unconditional for every receipt recorded through the
new endpoint — there is no "when `transferId` is supplied" branch. It does
not apply to the deprecated `POST /movements/receive`, which carries no
Transfer ID.

**Consequences.** Receivers can still record receipts when paperwork has
minor inconsistencies; the system surfaces the discrepancy without
blocking the record. The `recordReceipt` endpoint description notes that
differences are returned in `validation.warnings`, without committing to
specific comparison rules. Note the weight chain the cross-check can
exploit: Creation weights are estimates, Collection weights are actuals,
and the receipt records what arrived — so a receipt-vs-collection weight
delta is a meaningful, expected signal rather than necessarily an error.
The exact granularity of the check (string match, field-by-field, weight
tolerance, etc.) is still to be defined — see the cross-check granularity
open question. (Contingent on Option 1 of the receipt-migration decision —
see Open.)

<a id="d-007"></a>
### Drop-off is many-to-one against Movement IDs

**D-007** · ✅ Decided · Impact: 🔴 High · Area: **Drop-off** · Related: [D-009](#d-009), [D-015](#d-015), [D-018](#d-018), [D-017](#d-017)

**Context.** A multi-collection run delivers several Movements at once
to the same receiver site. The drop-off endpoint could either be
Movement-scoped (one drop-off per Movement, with a "primary" Movement
on the URL) or aggregate (one drop-off covering many Movements, with
the Movement IDs in the body).

**Decision.** Aggregate. `POST /transfers` takes a `movementIds[]` array
in the body. Single-collection drop-offs supply an array of one. No
"primary" Movement is selected.

**Consequences.** The Transfer ID minted by a single drop-off is the
aggregation point for that event — one Transfer ID, one or more Movement
IDs. This is many-to-one *per drop-off event*, not a lifetime constraint
on the Movement: nothing in the model stops the same Movement ID from
being referenced by more than one drop-off, so the overall
Movement↔Transfer relationship is many-to-many, not many-to-one. Two
cases produce this directly:

- A single collection spanning more than one EWC code/waste stream is
  delivered to different specialist receivers — each delivery is its own
  drop-off, same Movement ID referenced in both.
- A load is partially rejected at the first receiver: the accepted
  portion rides on one drop-off/Transfer, and the rejected portion is
  redirected to a second receiver on a different drop-off/Transfer.
  Whether the redirected portion keeps the original Movement ID or is
  minted a new one is **not decided here** — see [drop-off address
  derivability](#d-018), which already touches the same rejection-retry
  path from the address side.

The shape of the receipt and producer-query downstream both work cleanly
off this model either way.

<a id="d-008"></a>
### Carrier always required; broker optional

**D-008** · ✅ Decided · Impact: 🟠 Medium · Area: **Actors** · Related: [D-030](#d-030)

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

<a id="d-009"></a>
### Soft-delete via `isDeleted`, set only on PUT

**D-009** · ✅ Decided · Impact: 🟠 Medium · Area: **Lifecycle** · Related: [D-007](#d-007), [D-014](#d-014), [D-015](#d-015), [D-034](#d-034), [D-017](#d-017)

**Context.** An earlier decision deferred deletion entirely ("no deletion
endpoint in this version"), then a later pass added `DELETE` endpoints at
each stage (`DELETE /movements/{movementId}`,
`DELETE /movements/{movementId}/collection`, `DELETE /transfers/{transferId}`,
`DELETE /transfers/{transferId}/receipt`), each marked `x-stability:
proposal` and non-binding, pending a substantive decision on deletion
rules (soft vs. hard, audit, authorisation). Those proposal endpoints have
since been removed from the spec; no `DELETE` operation exists today. This
entry replaces that proposal with the decided mechanism.

**Decision.** No hard deletion and no `DELETE` endpoint, on any event.
Instead, `Movement`, `Collection` and `Drop-off` each carry a boolean
`isDeleted` field (default `false`) on their existing request/resource
schema. `Receipt` does not get this field at all — once recorded, a
receipt cannot be marked deleted, full stop, because it is the terminal
event in the chain.

The rules, applied uniformly across the three deletable events:

- **PUT-only.** `isDeleted` may only be set to `true` via the event's
  `PUT` (update). A `POST` (create) request that supplies `isDeleted: true`
  is rejected with a `NotAllowed` validation error; `POST` requests may
  omit the field or send `false`.
- **No subsequent event.** An event may be marked deleted only while no
  later event in the chain has been recorded against it:
  - A Movement cannot be deleted once its Collection has been recorded.
  - A Collection cannot be deleted once its Movement has been referenced
    in a Drop-off.
  - A Drop-off (Transfer) cannot be deleted once a Receipt has been
    recorded against it.

  This checks whether the later event's record *exists*, not whether it
  is itself currently active — once a Collection has been recorded against
  a Movement, that Movement stays locked from deletion even if the
  Collection is later deleted too. The chain of what-was-recorded is
  preserved; deleting a later event does not reopen an earlier one.
  Violating this returns a `BusinessRuleViolation` validation error.
- **Deleted blocks what comes next.** While an event is `isDeleted: true`,
  no event later in the chain may be recorded or updated against it:
  - Collection cannot be recorded/updated against a deleted Movement.
  - A Movement that is deleted (with or without a Collection) cannot be
    named in a Drop-off's `movementIds`; nor can a Movement whose
    Collection is deleted.
  - Receipt cannot be recorded/updated against a deleted Transfer.

  Each of these is a `BusinessRuleViolation` validation error, not a
  warning — the operation is rejected (400), consistent with how the
  user framed this: a "not permitted" operation, not an advisory.
- **Reversible.** A deleted event can be undeleted by a subsequent `PUT`
  with `isDeleted: false`. No extra precondition is needed on undelete:
  because nothing later could have been recorded while the event was
  deleted (previous rule), the "no subsequent event" invariant always
  still holds at the point of undeleting.

**Open sub-question, flagged rather than assumed.** "No subsequent event"
is read here as *no record of that event exists*, regardless of whether
that record is itself later deleted (the stricter reading — see the bullet
above). The looser reading — deleting a Collection frees its Movement to
be deleted too — was considered and rejected for this entry, on the basis
that it could let two soft-deletes in sequence quietly erase the fact that
a Collection ever happened. Worth a sense-check with the BA if a vendor
scenario surfaces where the stricter reading is unworkable in practice.

**Consequences.** Vendors get a single, symmetric mechanism across
Movement, Collection and Drop-off rather than four bespoke proposal
endpoints. No new public identifiers or endpoints are introduced — the
field lives on the schemas already used by the existing `POST`/`PUT`
operations. Server-side validation grows: every `POST`/`PUT` on Collection
and Drop-off must now also check the deletion state of what it references,
in addition to the existence checks already in place ([D-014](#d-014)).
Supersedes the earlier "non-binding DELETE proposal" decision; the
malformed `DELETE /movements/create` from the original deferred-deletion
decision remains gone.

<a id="d-010"></a>
### Hazardous waste cannot be merged across Movements at drop-off

**D-010** · ✅ Decided · Impact: 🟠 Medium · Area: **Drop-off** · Related: [D-007](#d-007)

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

<a id="d-011"></a>
### Static and transit collection collapsed into a single endpoint

**D-011** · ✅ Decided · Impact: 🟢 Low · Area: **Collection** · Related: [D-016](#d-016), [D-029](#d-029)

**Original decision.** Merge the separate static- and transit-collection
endpoints into one.

**Superseded.** v1 records **static collection only** (producer-to-driver)
as a single event, 1:1 with its Movement, at
`POST /movements/{movementId}/collection` (see *Level 2* and *Movement ↔
Collection is 1:1*). Transit collection (driver-to-driver) is out of scope
for v1 and parked (see Parked). With transit deferred there are no two
endpoints to collapse, so the original framing is moot.

<a id="d-012"></a>
### Per-event IDs not exposed in the public API

**D-012** · ✅ Decided · Impact: 🔴 High · Area: **Identifiers** · Related: [D-016](#d-016)

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
collection is addressed through its parent Movement via the sub-resource
path defined in [D-033](#d-033).

Vendors track two values per journey: Movement ID (durable, addresses a
Movement) and Transfer ID (addresses a drop-off across one or more
Movements). On the deprecated Phase 1 path, `wasteTrackingId` is a third.
Anything else is the server's business.

<a id="d-013"></a>
### Identifier format and capacity (year-prefixed sqids)

**D-013** · ✅ Decided · Impact: 🔴 High · Area: **Identifiers** · Related: [D-024](#d-024), [D-028](#d-028)

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

<a id="d-014"></a>
### Sub-resource 404 shape: parent-not-found vs event-not-recorded

**D-014** · ✅ Decided · Impact: 🟠 Medium · Area: **Lifecycle** · Related: [D-009](#d-009), [D-015](#d-015), [D-033](#d-033)

**Context.** Collection and receipt are 1:1 sub-resources that come into
existence later than their parent: a Movement exists from creation but has
no collection until one is recorded, and a Transfer is minted at drop-off
but has no receipt until one is recorded. `POST` and `PUT` operations on
these sub-resource paths can fail with a 404 for two distinct reasons: the
parent identifier is wrong (the parent record does not exist), or the
parent exists but the event has not been recorded yet (relevant to `PUT`,
which requires a prior `POST`).

**Decision.** Sub-resource operations return a `notFoundError` body on 404,
whose `code` field distinguishes the two cases:

- `MOVEMENT_NOT_FOUND` / `TRANSFER_NOT_FOUND` — the parent does not
  exist. Applies to `POST` and `PUT` on sub-resource paths (and to `GET`
  when reinstated — see [D-033](#d-033)).
- `COLLECTION_NOT_RECORDED` / `RECEIPT_NOT_RECORDED` — the parent exists
  but the event has not been recorded yet. Applies to `PUT` only (call
  `POST` first); also to `GET` when reinstated.

Top-level single resources (`/movements/{movementId}`,
`/transfers/{transferId}`) have only one way to be missing and keep a
plain `404` with no distinguishing code.

**Consequences.** Callers can tell a wrong identifier (stop, fix the ID)
from a missing sub-event (for `POST` callers: the parent does not exist;
for `PUT` callers: record the event with `POST` first). The
`notFoundError` schema is shared across all four event sub-resource paths.

<a id="d-015"></a>
### Movement ↔ Collection and Transfer ↔ Receipt are 1:1

**D-015** · ✅ Decided · Impact: 🔴 High · Area: **Resource model** · Related: [D-009](#d-009), [D-016](#d-016), [D-025](#d-025)

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
Level 2 restructure. Each sub-resource endpoint addresses a single event
record, not a list — see [D-033](#d-033) for the parked read definitions.
Multi-collection journeys correspond to multiple Movements aggregated at
the drop-off; multi-drop-off journeys correspond to a driver minting
multiple Transfer IDs in one run.

<a id="d-016"></a>
### Level 2 (Richardson Maturity Model) resource model

**D-016** · ✅ Decided · Impact: 🔴 High · Area: **Resource model** · Related: [D-011](#d-011), [D-012](#d-012), [D-015](#d-015), [D-017](#d-017)

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
- HTTP methods carry the action: `POST` creates, `PUT` updates.
- `operationId`s stay verb-shaped (`createMovement`, `recordCollection`,
  `recordDropOff`, `recordReceipt`, etc.) — they describe the business
  event and remain stable across URL changes.

**Consequences.** Substantial spec restructure (all path keys changed
except the reference data endpoints).

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

<a id="d-017"></a>
### Drop-off PUT restricted to soft-delete only

**D-017** · ✅ Decided · Impact: 🟠 Medium · Area: **Lifecycle** · Related: [D-007](#d-007), [D-009](#d-009), [D-016](#d-016), [D-018](#d-018), [D-034](#d-034)

**Context.** A drop-off is a Transfer addressed by `transferId`
(`PUT /transfers/{transferId}`), covering all the Movements named in its
`movementIds`; there is no per-Movement view of a drop-off — that was settled by
the Level 2 restructure (see [D-016](#d-016)). A drop-off records a physical
handover of waste at a place at a point in time: the carrier-declared site, the
aggregated Movement IDs, the carrier, and the actual timestamp. As an audit fact
about something that has already happened, policy requires it to be immutable
once recorded.

**Decision.** The drop-off `PUT` is de-potentiated. Once a drop-off is
registered, the only property that may change is `isDeleted` (the soft-delete
flag from [D-009](#d-009)). `PUT /transfers/{transferId}` does not accept
`dropOffRequest`; it accepts a restricted `dropOffUpdateRequest` carrying only
`isDeleted` — plus `apiCode` for caller identity, which is not a property of the
drop-off record and so does not breach immutability. Any other field is rejected
with a `NotAllowed` validation error (`additionalProperties: false`). The
history/revision pattern ([D-034](#d-034)) still applies to the `isDeleted`
mutation.

Correcting a recorded drop-off is therefore not an in-place edit: soft-delete the
erroneous Transfer (`isDeleted: true`) and record a fresh drop-off via
`POST /transfers` — subject to D-009's rule that a Transfer cannot be deleted
once a Receipt has been recorded against it.

**Consequences.**
- `PUT /transfers/{transferId}` (`updateDropOff`) is a soft-delete toggle only;
  its body is `dropOffUpdateRequest`, not `dropOffRequest`. Movement and
  Collection `PUT`s are unchanged and still accept full updates, so drop-off is
  asymmetric with them (see open question).
- [D-018](#d-018) follows from this: `dropOff.address` is required on
  `POST /transfers` only, since it is not part of the `PUT` body.
- [D-007](#d-007): the many-to-many Movement↔Transfer relationship is fixed at
  `POST` and cannot be altered by a later `PUT`; re-aggregation means
  delete + re-create.

**Open questions — for BA / policy:**
1. **Cross-event symmetry.** Should the same immutability apply to Movement and
   Collection `PUT`s, or is drop-off deliberately the only immutable event? The
   asymmetry should be intentional, not incidental.
2. **Correction after receipt.** Under D-009 a Transfer cannot be soft-deleted
   once a Receipt exists. With in-place edit also removed, a drop-off with a
   recorded receipt has no correction path. Acceptable, or is an exception
   needed?
3. **`apiCode` in the restricted body.** Confirm `apiCode` stays as caller
   identity (vs. relying solely on the Bearer token). If auth is token-only,
   `isDeleted` is the entire body.

<a id="d-018"></a>
### Drop-off address derivability

**D-018** · ✅ Decided · Impact: 🟠 Medium · Area: **Drop-off** · Related: [D-007](#d-007), [D-017](#d-017)

**Context.** The drop-off address (`dropOff.address`) was initially optional in
the spec. The open question was whether it should be **mandatory**, stay
**optional**, or be **removed entirely** (the latter only if always derivable
from the linked Movements' planned receiver). Two facts were relevant: the
planned receiver is an *estimate*, not authoritative; and the rejection-retry
scenario (recap 4.6) can deliver to a different receiver than planned, so the
actual drop-off location can diverge from the estimate.

**Decision.** The drop-off address is **mandatory**. Both `fullAddress` and
`postcode` are required within `dropOff.address`. The address records where waste
was physically dropped off — a material audit fact that cannot be reliably derived
from the planned receiver, particularly in rejection-retry scenarios. Requiring it
at the point of recording prevents gaps in the audit trail.

**Consequences.** `dropOff.address` is a required field on `POST /transfers`
(reflected in the OpenAPI spec as `dropOffSite` `required: [siteName, address]`);
callers must supply it even when the actual drop-off location matches their
planned receiver estimate. It is not part of the drop-off `PUT` body, which is
restricted to `isDeleted` (`dropOffUpdateRequest`, see [D-017](#d-017)), so the
address is captured once at `POST` and never re-edited.

<a id="d-031"></a>
### Disposal/recovery codes optional at Creation

**D-031** · ✅ Decided · Impact: 🟠 Medium · Area: **Collection** · Related: [D-006](#d-006), [D-019](#d-019)

**Context.** `wasteItems[].disposalOrRecoveryCodes` is the treatment
outcome — what the receiver does with the waste (R-codes for recovery,
D-codes for disposal). An early Creation draft made the array required
(`min(1)`) per waste item, which is stricter than the live Receipt
contract, where the same field is optional.

**Decision.** Optional at Creation. At Creation the codes represent an
*intended / planned* treatment at most; the authoritative treatment
outcome is determined by the receiver and recorded at Receipt. This also
restores parity with the Phase 1 Receipt model (where the field is
optional) and avoids forcing the planning party to assert a treatment it
cannot yet know.

**Consequences.** Creation `wasteItems` may carry `disposalOrRecoveryCodes`
when an intended treatment is known, but validation does not require it.
Receipt remains the source of truth for treatment. Feeds the treatment-code
split question ([D-019](#d-019)): a planned code at Creation is not the
same as `startTreatmentCode`/`finalTreatmentCode` derived at Receipt.

<a id="d-032"></a>
### Collection waste items align 1:1 by position with Creation

**D-032** · ✅ Decided · Impact: 🟠 Medium · Area: **Collection** · Related: [D-006](#d-006), [D-015](#d-015)

**Context.** The Collection event records *actual weights only* — full
waste classification (EWC codes, description, containers, haz/POPs) lives
on the Movement from Creation and is not repeated at Collection. The
Collection `wasteItems` array therefore needs a way to map each weight back
to the waste item it updates. There is no per-item identifier in the model.

**Decision.** Map by array position. The Collection `wasteItems` array must
contain exactly one entry per waste item declared at Creation, in the same
order; entry *n* at Collection updates the actual weight of waste item *n*
from Creation. To make this enforceable, **the Collection `wasteItems`
length must equal the Creation `wasteItems` length** — a length mismatch is
a validation error, not a warning.

**Consequences.** Vendors must preserve waste-item ordering between their
Creation and Collection calls; reordering silently misattributes weights,
and the length check is the only structural guard. The length-equality rule
is data-dependent (it compares against the stored Movement) so it is
enforced server-side, not expressible in the standalone request schema. If
this positional contract proves fragile in vendor UR, revisit by adding a
stable per-item identifier minted at Creation and echoed at Collection —
recorded here so the trade-off is visible rather than assumed.

<a id="d-034"></a>
### PUT operations use history/revision pattern across all events

**D-034** · ✅ Decided · Impact: 🟠 Medium · Area: **Lifecycle** · Related: [D-009](#d-009), [D-014](#d-014), [D-016](#d-016), [D-017](#d-017)

**Context.** The Phase 1 receipt `PUT /movements/{wasteTrackingId}/receive` is implemented with a history/revision pattern: before applying an update, the current live record is snapshotted into a separate history store, and a server-side revision counter on the live record is incremented. This gives a full audit trail of every mutation without exposing multiple versions through the public API. The revision counter also acts as an optimistic concurrency guard, preventing two concurrent PUTs from silently overwriting each other.

**Decision.** Extend the same pattern to all Phase 2 PUT operations: `updateMovement`, `updateCollection`, `updateDropOff`, and `updateReceipt`. Every PUT snapshots the current state to a history store before writing the new state, and increments the revision counter on the live record. The history store and revision counter are server-side implementation details — they are not part of the public API contract.

**Consequences.** Every mutation across all four events is fully auditable at the server level. The public API contract is unchanged: each PUT returns the updated record (or a validation envelope), not a version list. Clients see a single live record per resource, identical to the pre-decision behaviour.

## Open

<a id="d-019"></a>
### Fate-of-waste GET — producer journey query (proposal)

**D-019** · ⏳ Open · Impact: 🟠 Medium · Area: **Fate-of-waste**

**Context.** A producer passes their Movement ID to a carrier and cannot
record any of the four journey events themselves. A fate-of-waste endpoint
gives producers a read-only window onto what happened to their waste: what
was collected, when, where it ended up, and how it was treated. The
Movement ID is the natural and unique key for this query — it is the
producer's only persistent reference to the journey, and uniquely
identifies a single waste movement across all four events.

**Current state.** `GET /movements/{movementId}/fate-of-waste` exists in
the spec marked `x-stability: proposal`. The response schema has been
stripped: the endpoint URL and `movementId` as the lookup key are
considered stable; what the endpoint returns is not yet defined, pending
resolution of the questions below.

**Open questions — to confirm with BA and policy team:**

1. **Timestamp cardinality.** Does the producer see a single
   `collectionDateTime` (e.g. earliest collection across multi-collection
   runs) and a single `receiptDateTime` (e.g. final receipt across
   multi-drop-off scenarios)? Or arrays of timestamps? The provisional
   model was scalar-with-a-rule; needs BA confirmation.

2. **Treatment code source and shape.** `startTreatmentCode` can be
   derived from the receipt's `wasteItems[].disposalOrRecoveryCodes`
   array. `finalTreatmentCode` has no source in the current model — it
   implies onward movement (see question 3). Confirm: is treatment
   outcome a single derivable code, a summary across the weighted list,
   or not surfaced until onward movement is in scope?

3. **Onward movement scope.** When waste is accepted at a transfer station
   and moved on to a treatment facility, does that second leg fall within
   v1 scope? `finalTreatmentCode` cannot be defined until this is
   answered. Likely out of scope for v1 — confirm with policy team.

4. **Projection scope.** What fields should the producer see beyond
   identifiers and timestamps? Waste classification at each stage?
   Receiver site name? Carrier identity? To be defined once policy intent
   is clear.

<a id="d-021"></a>
### Cross-check granularity

**D-021** · ⏳ Open · Impact: 🟠 Medium · Area: **Receipt** · Related: [D-006](#d-006), [D-022](#d-022)

A receipt's waste details are cross-checked against the linked Movement
record (Creation classification + Collection weights), and its carrier
details against the carrier on the Movement chain — surfacing mismatches
as validation warnings (see the decided cross-check entry; the drop-off is
not a source for the waste check). Whether the check is **unconditional**
(Option 1: `transferId` is the receipt's path parameter) or **conditional
on a supplied `transferId`** (Option 2: optional body field) depends on the
open *Receipt migration* decision. Independent of that, what counts as a
mismatch is unspecified: identical strings? same registration number,
different address? same EWC code, different quantity? And for weight
specifically, what tolerance — given Creation is an estimate, Collection an
actual, and the receipt what arrived, some drift is expected by design. The
server validates this; the spec needs a clearer statement of the rules once
agreed.

<a id="d-022"></a>
### Receipt migration: new endpoint vs extend Phase 1

**D-022** · ⏳ Open · Impact: 🔴 High · Area: **Receipt** · Related: [D-005](#d-005), [D-006](#d-006), [D-015](#d-015), [D-016](#d-016), [D-023](#d-023)

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
cacheable, addressable read endpoint (see [D-033](#d-033)). Cost: two
receipt endpoints coexist through the transition, and Phase 1
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

<a id="d-023"></a>
### Phase 1 receipt endpoint deprecation timeline

**D-023** · ⏳ Open · Impact: 🟠 Medium · Area: **Receipt** · Related: [D-022](#d-022)

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

<a id="d-024"></a>
### `wasteTrackingId` ↔ `movementId` reconciliation

**D-024** · ⏳ Open · Impact: 🟠 Medium · Area: **Identifiers** · Related: [D-004](#d-004)

Phase 1 minted `wasteTrackingId` at receipt; Phase 2 mints `movementId` at
creation. Whether a Phase 1 record maps to a Phase 2 Movement ID (and how),
on migration, is undecided — owned by the Phase 1 → Phase 2 migration
strategy.

<a id="d-025"></a>
### Receipt acceptance / rejection outcome (new in Phase 2)

**D-025** · ⏳ Open · Impact: 🔴 High · Area: **Receipt** · Related: [D-015](#d-015)

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

<a id="d-027"></a>
### Per-organisation vs per-actor API credentials

**D-027** · ⏳ Open · Impact: 🟠 Medium · Area: **Onboarding** · Related: [D-008](#d-008)

Phase 1 is receiver-first: a receiver registers its organisation via the
Waste Tracking Service and gets credentials (Bearer token + `apiCode`, the
*receiving organisation's* identifier). Phase 2 adds carrier/broker/producer
actors, and one organisation may hold several roles. Open: when a carrier
is in the same organisation as a registered receiver, does it need separate
credentials, or does one organisation-level registration cover all its
roles? To bring forward with identity/onboarding — not yet explored.

<a id="d-028"></a>
### Pre-generated Transfer IDs for offline drivers

**D-028** · ⏳ Open · Impact: 🟠 Medium · Area: **Identifiers** · Related: [D-013](#d-013)

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

<a id="d-029"></a>
### Transit collection (driver-to-driver) — parked

**D-029** · ⏸️ Parked · Impact: 🟢 Low · Area: **Collection** · Related: [D-011](#d-011), [D-015](#d-015)

Deferred from v1, which records static (producer-to-driver) collection
only. There is no transit endpoint or field in the spec. Under the 1:1
Movement↔Collection model the working assumption is that a driver-to-driver
handover decomposes into a new Movement at the next pickup rather than a
second collection on the same Movement — so transit may need no dedicated
event at all. To be confirmed with the BA if/when transit is picked up.

<a id="d-030"></a>
### Carrier-vs-broker discriminated union on `POST /movements`

**D-030** · ⏸️ Parked · Impact: 🟢 Low · Area: **Actors** · Related: [D-008](#d-008)

A `oneOf` request shape distinguishing carrier-initiated and
broker-initiated creation was drafted then dropped in favour of a
single request body with `brokerDetails` optional. The discriminated
union may come back later if it makes the contract clearer for vendors,
but is not a v1 priority.

<a id="d-033"></a>
### Per-event GET endpoints — parked

**D-033** · ⏸️ Parked · Impact: 🟢 Low · Area: **Lifecycle** · Related: [D-014](#d-014), [D-016](#d-016)

Following BA discussion, the four per-event GET operations have been
removed from `openapi.yaml` and deferred to a future iteration:

- `GET /movements/{movementId}` (`getMovement`)
- `GET /movements/{movementId}/collection` (`getCollection`)
- `GET /transfers/{transferId}` (`getDropOff`)
- `GET /transfers/{transferId}/receipt` (`getReceipt`)

The Level 2 resource paths and HTTP method structure ([D-016](#d-016)) are
unchanged — `POST` and `PUT` operations on all four event paths remain.
The GETs are absent because their response schemas and projection scope
are not yet agreed; they will be defined in a future iteration.

The `notFoundError` shape and distinguishing error codes
(`MOVEMENT_NOT_FOUND`, `COLLECTION_NOT_RECORDED`, `TRANSFER_NOT_FOUND`,
`RECEIPT_NOT_RECORDED`) from [D-014](#d-014) remain active in the spec for
`POST` and `PUT` responses on sub-resource paths.

**Note.** `GET /movements/{movementId}/fate-of-waste` (`getFateOfWaste`)
is the producer-facing read-only projection — it is a separate concern
and is **not** parked.
