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

### Single OpenAPI file

**Context.** The extended API spec could either live as one OpenAPI file
or be split into `$ref`-linked component files from the start.

**Decision.** Single file (`api/openapi.yaml`) for now. Split into
components only if the file becomes unwieldy.

**Consequences.** Easier to navigate while the shape is still moving.
Refactor cost is low if and when it is needed.

### OpenAPI 3.0.3, not 3.1

**Context.** The Phase 1 Receipt API is OpenAPI 3.0.3. The new spec
could either match Phase 1 or move to 3.1, which has better JSON Schema
alignment.

**Decision.** Stay on 3.0.3 for now.

**Consequences.** Both specs share a version; tooling reading one can
read the other. Worth revisiting once the spec stabilises.

### Address schema converged to lowercase `address`

**Context.** A PascalCase `Address` was originally introduced for the
new endpoints, alongside Phase 1's lowercase `address`. Two schemas for
the same concept.

**Decision.** Drop the PascalCase version. All endpoints reference the
Phase 1 `address` schema.

**Consequences.** One canonical address shape across both generations.
Phase 1's address only requires `postcode` (not `fullAddress`), so the
new endpoints accept slightly looser address data than originally
specified. The speculative `gridReference` field has been dropped.

### Validation envelope and weight schemas deduplicated

**Context.** The new endpoints had introduced their own `ValidationResult` and `Weight` schemas alongside the Phase 1 `validationResult` and `weight`. Two schemas per concept.

**Decision.** Converge, as was done for `address`. The new `ValidationResult` was a field-for-field duplicate of the Phase 1 envelope, so its references were repointed at `validationResult` and the duplicate removed. The new `Weight` was unreferenced (a dead near-duplicate of `weight`) and was deleted; if a movement-specific weight shape is ever needed it should be added under a distinct, descriptive name rather than colliding with `weight`.

**Consequences.** One canonical validation envelope and one weight schema across both generations. No wire-format change. The deviations the deleted orphan carried (no `Grams`, zero amount allowed) were confirmed *not* wanted: Phase 2 weight allows Grams and requires amount > 0, exactly as canonical `weight` already does — see the weight placement entry below.

### Weight captured at creation (estimated) and at receipt

**Context.** After the orphan `Weight` schema was removed, no Phase 2 request body captured weight. The BA confirmed weight is recorded at two points: at the creation event (an estimate) and at receipt (the measured figure).

**Decision.** Reuse the canonical `weight` schema at both points rather than introduce a Phase 2-specific weight. At creation, `createMovementRequest.estimatedWeight` references `weight` with `isEstimate: true`. At receipt, weight is already captured by the existing `wasteItems[].weight` on the Phase 1 `receiveMovementRequest`, which the Phase 2 `POST /transfers/{transferId}/receipt` reuses — so no change was needed there. `estimatedWeight` is optional at creation.

**Consequences.** One weight schema across creation and receipt (Grams/Kilograms/Tonnes, amount > 0, `isEstimate` flag). The creation estimate and the measured receipt value may differ; both are recorded and `isEstimate` distinguishes them. Whether `estimatedWeight` should be mandatory at creation is left open for the BA.

### Receipt path parameter stays `{wasteTrackingId}`

**Context.** An earlier decision renamed the Phase 1 receipt path
parameter to `{id}` for consistency with the rest of the spec. The Level 2
restructure reversed this: with `{movementId}` and `{transferId}` now used
as path parameters on the new resources, a bare `{id}` on the receipt
endpoints would be ambiguous — and the value is specifically the Phase 1
`wasteTrackingId`, which is distinct from the Movement ID.

**Decision.** Keep the path parameter as `{wasteTrackingId}` on the
deprecated receipt endpoints. The parameter description states explicitly
that it is the Phase 1 `wasteTrackingId` returned by
`POST /movements/receive`, and that it is NOT the Movement ID. Supersedes
the earlier rename-to-`{id}` decision.

**Consequences.** No `{id}` placeholder anywhere — every path parameter
names the concrete identifier it carries (`movementId`, `transferId`,
`wasteTrackingId`). Affects only how the deprecated legacy path reads.

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
cross-check granularity open question.

### Drop-off is many-to-one against Movement IDs

**Context.** A multi-collection run delivers several Movements at once
to the same receiver site. The drop-off endpoint could either be
Movement-scoped (one drop-off per Movement, with a "primary" Movement
on the URL) or aggregate (one drop-off covering many Movements, with
the Movement IDs in the body).

**Decision.** Aggregate. `POST /movements/drop-off` takes a
`movementIds[]` array in the body. Single-collection drop-offs supply
an array of one. No "primary" Movement is selected.

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

**Decision.** When any of the Movements named in a `POST
/movements/drop-off` request carries hazardous waste, the request
must contain exactly one Movement ID. Multi-Movement drop-offs are
permitted only when all linked Movements are non-hazardous.

The constraint is data-dependent (depends on properties of the linked
Movements that the request body does not carry). It is therefore not
expressed in the OpenAPI schema, but documented on the endpoint and
validated server-side. Violations return a 400 with a clear validation
error.

**Consequences.** Multi-collection runs remain a first-class concept
for non-hazardous waste. Carriers handling hazardous waste record one
drop-off per Movement, even if the loads physically arrive together.

### Static and transit collection collapsed into a single endpoint

**Context.** The original endpoint catalogue distinguished
`POST /movements/static-collection` (producer to driver) from
`POST /movements/transit-collection` (driver to driver). When the BA
clarified that transit collection continues the same Movement ID and
captures the same shape of data (date-time, driver, location), the
distinction at the URL level stopped earning its keep.

**Decision.** Replace both with `POST /movements/collection`. Whether
a collection is the first one on a Movement (static-equivalent) or a
subsequent driver-to-driver handover (transit-equivalent) is derivable
from context — earlier collections on the same Movement, location of
the event — rather than encoded in the URL.

`movementId` is carried explicitly in the request body, even though
it continues from prior events. This is defensive: it makes each
request self-describing and avoids ambiguity in PUT and GET cases.

**Consequences.** One endpoint instead of two. One schema instead of
two. The API is simpler for vendors to integrate against. The
distinction static-vs-transit lives in the data (event order and
location) rather than the URL. Supersedes the earlier "transit
collection parked" decision below.

### Carrier always required on movement creation

**Context.** Following BA discussion of hazardous-waste handling,
there was a question about whether the carrier requirement on
`POST /movements/create` should be relaxed for non-hazardous waste.

**Decision.** Carrier remains always required at creation, regardless
of hazardous status. Reaffirms the existing
"Carrier always required; broker optional" decision above.

**Consequences.** No spec change. Recorded explicitly so that the
question does not need to be re-litigated.

### Per-event IDs not exposed in the public API

**Context.** Earlier conversations specified per-event identifiers
(`CreationId`, `CollectionId`, `DropOffId`, plus the legacy `ReceiveId`
as `wasteTrackingId`) returned alongside Movement ID and Transfer ID
in API responses. On review with the team, this was identified as a
conflation of two separate concerns: server-side storage identifiers
(every event needs a unique row internally) and public API contract
identifiers (values vendors store and pass around).

**Decision.** Only Movement ID and Transfer ID are exposed in the
API contract. The per-event identifiers — for creation, collection,
drop-off, and receipt — remain in the server's storage layer but are
not returned in API responses. The Phase 1 `wasteTrackingId` is
preserved as it is (it is the Movement ID, named for backward
compatibility).

**Consequences.** Three response schemas slim down:

- `CreateMovementResponse` returns `movementId` and `validation` only.
- `RecordCollectionResponse` returns `validation` only.
- `DropOffResponse` returns `transferId` and `validation` only.

The four placeholder schemas (`CreationId`, `CollectionId`,
`DropOffId`, `ReceiveId`) are removed from `components.schemas`.
There is no dedicated collection resource schema and no public collection
ID. The collection is addressed through its parent Movement
(`GET /movements/{movementId}/collection`), and `getCollection` returns the
collection event itself. Collections within a Movement are not separately
addressable by ID in the public API.

Vendors integrating against the API have two values to track per
journey: Movement ID (durable, addresses a Movement) and Transfer ID
(addresses a drop-off across one or more Movements). Anything else
is the server's business.

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
- If a load is split at the receiver via partial rejection, that is
  modelled in the receipt's `outcome` (`acceptPart-accepted` /
  `acceptPart-rejected`), not by splitting the Movement.

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

## Open

### Transit collection — superseded

Originally listed as open ("when does a transit collection happen,
what does the API endpoint look like, what data does it carry?"),
then parked. Superseded by the
[static and transit collapsed into a single endpoint](#static-and-transit-collection-collapsed-into-a-single-endpoint)
decision above. Transit collection is now modelled as a second
collection event on the same Movement, through the unified
`POST /movements/collection` endpoint.

### Drop-off PUT semantics in multi-collection cases

`PUT /movements/{id}/drop-off` updates a drop-off record that may cover
several Movements. Whether updating via one Movement's URL updates the
shared drop-off (the current assumption) or only that Movement's view
of the drop-off (which would imply per-Movement views) is unconfirmed.

### Drop-off address derivability

`dropOffAddress` is currently optional, on the assumption that it can
be derived from the linked Movements' planned receiver. If it is
always derivable, it could be removed from the schema entirely. If
there are cases where it diverges, it should stay optional. Pending
BA input.

### Fate-of-waste timestamps in multi-event scenarios

The fate-of-waste response carries single `collectionDateTime` and
`receiptDateTime` values. In multi-collection or multi-drop-off
scenarios, what does the producer actually see? Earliest collection
and final receipt? A list of timestamps? Pending BA decision; affects
whether these fields stay scalar or become arrays.

### Treatment code split

The fate-of-waste response distinguishes `startTreatmentCode` from
`finalTreatmentCode`. Phase 1 carries one `disposalOrRecoveryCode`.
Where the second value comes from in the data model is unclear —
whether it is a single field updated as treatment progresses, or two
fields recorded at different points. Pending data-model work.

### Cross-check granularity

When `transferId` is supplied on a receipt, carrier and waste details
are cross-checked against the linked drop-off (see decided entry
above). What counts as a mismatch is not yet specified. Identical
strings? Same registration number, different address? Same EWC code,
different quantity? The server validates this; the spec needs a
clearer statement of the rules once they are agreed.

### Schema shape convergence between Phase 1 and new schemas

Both Phase 1 and the new schemas use camelCase, so there is no naming
*convention* left to reconcile. What remains open is whether to converge
the *shapes* where the two generations model the same concept under
different names (e.g. Phase 1 `carrier` vs the new `carrierDetails`).
That is a contract-level change, not cosmetic, and is not a v1 priority.

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

## Parked

### Full data ERD

Deferred until the API spec stabilises. The data model is driven by
what the API needs to record at each step, not the other way round.

### Carrier-vs-broker discriminated union on `POST /movements/create`

A `oneOf` request shape distinguishing carrier-initiated and
broker-initiated creation was drafted then dropped in favour of a
single request body with `brokerDetails` optional. The discriminated
union may come back later if it makes the contract clearer for vendors,
but is not a v1 priority.
