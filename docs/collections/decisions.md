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

### Phase 1 schemas preserved verbatim

**Context.** The new endpoints introduced PascalCase schemas
(`CarrierDetails`, `WasteClassification`, etc.) while Phase 1 uses
lowercase (`carrier`, `wasteItem`, `address`). Mixing is not ideal but
renaming Phase 1 schemas would change the contract that existing
clients reason about.

**Decision.** Keep Phase 1 schemas exactly as-published, lowercase
naming included. The new schemas use PascalCase. Both coexist in the
same file, distinguishable by convention.

**Consequences.** Phase 1 client code keeps working. New endpoints
follow standard OpenAPI conventions. Long-term, convergence to one
naming style is on the table but not urgent.

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

### Path parameter renamed `{wasteTrackingId}` → `{id}` on receipt endpoints

**Context.** Phase 1 names the path parameter `{wasteTrackingId}`. The
new spec uses `{id}` everywhere else. OpenAPI path parameter names do
not appear in the actual URL, so the change is cosmetic.

**Decision.** Rename to `{id}` on the receipt endpoints. Add a sentence
in the parameter description noting that the value is the same as
Phase 1's `wasteTrackingId`.

**Consequences.** Consistency across the spec. No breaking change to
URLs or to client code.

### `transferId` is optional on `POST /movements/receive`

**Context.** When the receipt event is preceded by a drop-off recorded
through the new API, the receiver should be able to link the receipt
to that drop-off via the Transfer ID. But Phase 1 receivers may also
record receipts without a Transfer ID — for example when the carrier
is not on the system, or when paperwork is missing.

**Decision.** Add `transferId` as an optional field. All Phase 1
required fields remain required. When `transferId` is supplied, the
receipt is linked to the drop-off and through it to the originating
Movement IDs. When omitted, the receipt is treated as standalone, the
Phase 1 default behaviour.

**Consequences.** Phase 1 backward compatibility absolute — existing
client code keeps working unchanged. The new flow works without
breaking the old one.

### Cross-check on Transfer ID

**Context.** When `transferId` is supplied on a receipt, the request
will also carry carrier and waste details that are also derivable from
the linked drop-off. These could either be required to match exactly,
or treated as an opportunity to cross-check.

**Decision.** Carrier and waste details in the receipt request are
cross-checked against the linked drop-off. Mismatches return validation
warnings rather than hard errors.

**Consequences.** Receivers can still record receipts when paperwork
has minor inconsistencies; the system surfaces the discrepancy without
blocking the record. The exact granularity of the check (string match,
field-by-field, etc.) is still to be defined — see open questions.

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
(or producer, or receiver, all rolled up under "broker" in the
taxonomy). The carrier is always physically involved; the broker is
not always involved.

**Decision.** `carrierDetails` is required on movement creation.
`brokerDetails` is required only when the movement is broker-initiated.
The broker-vs-carrier discriminated union proposed earlier is deferred.

**Consequences.** Schema is straightforward. Server-side logic
validates that `brokerDetails` is present when needed. Reintroducing
the discriminated union is possible later without breaking clients
that already supply both forms.

### Movement deletion deferred from v1

**Context.** The endpoint catalogue originally listed
`DELETE /movements/create`, but the URL was malformed (no `{id}`) and
the semantics of deletion (soft vs. hard, audit, who can delete) had
not been worked out.

**Decision.** No deletion endpoint in this version of the spec. Will
be reintroduced as a separate piece of work.

**Consequences.** The current API is append-only with respect to
movements. Whether and how to support deletion is an open design
question for later.

### Initiator distinguished by start node in the corpus

**Context.** The Mural flow chart has two start nodes —
*Carrier has a requirement to move waste* and *Producer, Broker or
Receiver has a requirement to move waste*. The `initiator` axis in the
scenario corpus needs to derive its value from the path mechanically.

**Decision.** Paths starting with the first node are tagged
`initiator: carrier`; paths starting with the second are tagged
`initiator: broker`. Producer-initiated and receiver-initiated
movements share the second start node and are therefore included
under `broker`.

**Consequences.** The 282-scenario corpus splits 141/141. The
simplification is documented in the [glossary](glossary.md). If the
chart later distinguishes producer-initiated from broker-initiated
journeys, the rule will need revisiting.

### Multi-event roll-up rules in the corpus

**Context.** Multi-collection and multi-drop-off scenarios contain
more than one collection or receipt event, sometimes with different
recording behaviours or outcomes. The corpus describes each scenario
as a single point in the seven-axis taxonomy, so multi-event
trajectories have to roll up to one value per axis.

**Decision.** Worst-case wins. For collection and receipt recording,
any deferred-and-not-reconciled event makes the scenario `deferred`;
any retrospectively-reconciled event makes it `retrospective`;
otherwise `realtime`. For receipt outcome, precedence is `rejectAll`
> `acceptPart-rejected` > `acceptPart-accepted` > `acceptAll`.

**Consequences.** The taxonomy stays compact and queryable. The
detail of a multi-event scenario is still in the path; the axes
capture the most consequential event because that is what UR
participants and auditors will care most about.

### `na` is a valid value on event-related axes

**Context.** Producer-tracking scenarios — where a producer queries
the fate of their waste without any collection or receipt event being
recorded — appear in the corpus. The original axis enums had no value
to describe "this event type does not occur".

**Decision.** Add `na` to the `collectionRecording`, `receiptOutcome`,
and `receiptRecording` enums. The semantics of `na` is "structurally
absent, by design", distinct from "ambiguous" or "missing data".

**Consequences.** Producer-tracking paths validate cleanly under the
schema. They are kept in the corpus because they exercise the
producer's read-only query path through the API.

### Curated scenarios are editorial, separate from the corpus

**Context.** The Import app originally produced both the full corpus
and a curated subset for User Research. Mixing them in one tool meant
editorial choices were invisible and hard to revise.

**Decision.** Curation logic is removed from the Import app. The
Import app is extraction-only. Curated scenarios for User Research
are a separate, human-maintained selection that consumes the corpus
and is diff-checked against it on each re-extraction.

**Consequences.** The corpus is mechanically reproducible from the
Mural chart. The curated set is owned by the team and can be reasoned
about independently. See the
[Import app changes note](docs/import-app-changes.md) for the full
pipeline.

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

### Cycle combinations — multi-collection + multi-drop-off permitted

**Context.** The corpus originally enforced strict cycle exclusivity:
each scenario could traverse at most one of the three loop edges
(`multi-collection`, `multi-drop-off`, `rejection-retry`). The rule
was justified at the time as keeping the corpus to "distinct journey
shapes." On review of the curated set, the team noticed that the
combination of *multi-collection and multi-drop-off in the same
scenario* is a perfectly realistic journey — a driver picking up
from several producers and dropping at several receivers in one run
— and the corpus contained no example of it.

**Decision.** Relax cycle exclusivity to permit one specific
additional combination: `multi-collection + multi-drop-off`. All
other combinations remain excluded — `rejection-retry` in particular
is still single-loop only. Each loop is still traversed at most once
per scenario, so the new combination produces paths with two
collections and two drop-offs.

Encoded in the schema as a `oneOf` listing the five allowed values
of the `cycles` array (empty, each of the three single loops, and
the combined `[multi-collection, multi-drop-off]` tuple).

**Consequences.** The corpus grows. The Import app's extraction
logic relaxes the cycle-exclusivity rule for this one combination
only. Earlier corpus snapshots remain valid against the new schema
(no scenario carrying an old single-loop tuple is invalidated). New
scenarios appear with `cycles: ['multi-collection', 'multi-drop-off']`.

The `[multi-collection, multi-drop-off]` tuple must be emitted in
alphabetical order to match the schema's `const`-based constraint;
the Import app's extraction code is responsible for sorting.

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
`CollectionResource` (the GET response item) loses its `collectionId`
field; collections within a Movement are not separately addressable by
ID in the public API.

The corpus's step `expect.returns` lists need refreshing to drop the
internal IDs — `[movementId, creationId, validation]` becomes
`[movementId, validation]`, and so on. This is a follow-up for the
Import app prompt; the schema's `expect.returns` enum can be tightened
at the same time.

Vendors integrating against the API have two values to track per
journey: Movement ID (durable, addresses a Movement) and Transfer ID
(addresses a drop-off across one or more Movements). Anything else
is the server's business.

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

### Parameter naming on the new spec — long-term convergence

Phase 1 schemas use lowercase, the new schemas use PascalCase. The
two coexist for now (see decided entry). Whether to converge to one
style — and which — is an open call for when the spec is more stable.

## Parked

### Curated scenarios

Will follow once the corpus is stable enough to draw from with
confidence and the API spec has stabilised enough that walking a UR
participant through a scenario is realistic.

### Full data ERD

Deferred until the API spec stabilises. The data model is driven by
what the API needs to record at each step, not the other way round.

### Carrier-vs-broker discriminated union on `POST /movements/create`

A `oneOf` request shape distinguishing carrier-initiated and
broker-initiated creation was drafted then dropped in favour of a
single request body with `brokerDetails` optional. The discriminated
union may come back later if it makes the contract clearer for vendors,
but is not a v1 priority.
