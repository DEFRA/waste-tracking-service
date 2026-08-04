# Assessment Feedback

Records advice from the GDS Alpha service assessment (23 July 2026)
relevant to the Phase 2 collections work, alongside the current-state
findings gathered in response for each point. This is a context/findings
record, not a decision — see [Decisions](../decisions.md) for the formal
register.

## Contents

- [Point 13 — Vendor Delegation Model](#point-13--vendor-delegation-model)
- [Point 14 — Reliable Service: API Versioning](#point-14--reliable-service-api-versioning)

## Point 13 — Vendor Delegation Model

### The advice

Verbatim, from Point 13 of the assessment report:

> The team is leveraging the existing user accounts and management
> portals that allow a user to authorize software providers to act on
> that user's behalf. For Private Beta, investigate options that allow
> a user to authorise a software provider without the user needing to
> manage API keys, which might require collaboration with teams owning
> those common components so that the journey can be improved.

— GDS Alpha assessment, 23 July 2026, Point 13 (page 8). Advice given
ahead of Private Beta.

Note: the assessment doesn't prescribe a specific mechanism (e.g. OAuth)
— it names the outcome (a user authorising a provider without handling
API keys) and flags that it may need collaboration with the team(s)
owning the "common components" (the existing user accounts / management
portal) referenced in the first sentence. Anywhere this doc uses "OAuth
authorisation-grant" below, that's our own framing of one possible
mechanism, not a quote from the assessment.

### Current state: how vendor delegation works today

Two separate, unrelated auth layers exist today. The "existing user
accounts and management portal" the assessment refers to is the
organisation frontend's API-code management pages (below) — a user does
today "authorise" a provider through it, but the mechanism is copying a
raw static key, not a scoped or revocable grant.

**1. Software client authentication — OAuth2 client-credentials
(machine-to-machine), not user delegation.**
- `waste-movement-external-api/src/plugins/jwt-auth.js` validates a
  Cognito-issued JWT (scope `waste-movement-external-api-resource-srv/access`).
- A Cognito app client is manually provisioned per third-party
  integrator; credentials are shared via a secure channel, not
  self-service (`digital-waste-tracking-docs/technology/integration-architecture/interfaces/aws-cognito.md`).

**2. Vendor-to-organisation delegation — a static shared secret, not a
grant.**
- `waste-movement-backend/src/common/helpers/validate-api-code.js`
  resolves a flat, config-based allow-list (`orgApiCodes`) mapping a
  UUID `apiCode` to an `orgId`.
- `waste-organisation-backend/src/domain/organisation.js` —
  `createApiCode()` generates `crypto.randomUUID()`; no expiry, scope,
  or per-vendor consent, just enable/disable.
- User experience: the organisation copies a raw code and hands it to
  their software provider out-of-band
  (`waste-organisation-frontend/src/config/content.js`: *"If you work
  with multiple software providers, you should give each one an API
  code."*).
- A migration is already under way to resolve org identity server-side
  rather than trust a client-supplied secret directly: the shared
  schema supports `apiCode` **or** `submittingOrganisation`
  (`waste-movement-utils/src/schemas/receipt.js`,
  `.xor('apiCode', 'submittingOrganisation')`) — a precursor step, not
  yet a consent/grant model.

**Separately, human portal sign-in** uses Defra ID (OIDC
authorisation-code flow via Hapi Bell,
`waste-organisation-frontend/src/server/common/helpers/auth/open-id-provider.js`)
— this is the "existing user accounts" half of the assessment's first
sentence, and is unrelated to how a provider is then handed an API code.

### Relevant existing decisions and ADRs

- **[D-027](../decisions.md#d-027) — Per-organisation vs per-actor API
  credentials.** Locks in per-organisation, not per-actor, credentials
  for Phase 2.
- **[D-036](../decisions.md#d-036) — Write authorisation: open append,
  amend restricted to the authoring organisation.** Built on top of the
  current `apiCode` model.
- **WTS-ADR001 — API Authentication & Authorization**
  (`digital-waste-tracking-docs/technology/quality-assurance-view/sda-adr-001/sda-adr-001.md`,
  Oct 2025). Evaluated 4 options; chose Cognito client-credentials with
  manual onboarding. Option 4 ("integrate AWS Gateway with Defra
  Customer ID") was shelved as having "no approved/agreed
  timescales... not aligned with WTS go-live" — but even that option
  authenticated the vendor/gateway, not a user-authorised delegation.
  No option modelled letting the *user* authorise a provider directly.

### The "common components" angle

The closest match to "teams owning those common components" is an
early, undecided exploration:
`digital-waste-tracking-docs/technology/integration-architecture/scratchpad/epr-manage-account-as-strategic-identity-and-access-layer.md`
— "EPR Manage Account" as a strategic identity/access layer instead of
Defra ID directly. Sourced from a Slack note (9 July 2026), flagged as
"early exploration only, no decision or ADR yet," MVP target December
2026. It addresses receiver-user identity, not vendor delegation
directly, but is the one active cross-team identity conversation to
loop in.

### Gap

No repo — `waste-movement-backend`, `waste-movement-external-api`,
`waste-movement-utils`, `waste-organisation-backend`,
`waste-organisation-frontend`, `waste-tracking-id-backend`,
`digital-waste-tracking-docs`, or this repo — contains any code,
comment, ADR, or doc describing a way for a user to authorise a
provider without that provider ending up holding a static, copyable
key. The `apiCode` → `submittingOrganisation` migration is the only
movement away from raw key handling so far, and it doesn't touch who
authorises whom — it just moves org-resolution server-side.

### Open questions

- What does "without the user needing to manage API keys" mean in
  practice here — no key at all (e.g. a scoped, revocable grant instead,
  such as OAuth authorisation-code/consent), or the same key mechanism
  with a better-managed issuance/rotation journey?
- Would this change the D-027/D-036 assumptions for Phase 2, or sit
  alongside them as an additive auth path?
- If a consent-based grant replaces `apiCode`, does it replace the
  mechanism entirely or coexist during a transition (as Phase 1 →
  submittingOrganisation did)?
- Is EPR Manage Account (MVP December 2026) on a timeline compatible
  with Private Beta, or does this need an interim solution as WTS-ADR001
  Option 4 found for Alpha?

### Suggested next steps

- Loop in the team behind the EPR Manage Account exploration — the
  first genuine cross-team identity conversation this could attach to.
- Revisit WTS-ADR001's Option 4 rationale now that Private Beta changes
  the timeline calculus that shelved it.
- Flag the D-027/D-036 dependency before those decisions are treated as
  final for Phase 2.

## Point 14 — Reliable Service: API Versioning

### The advice

Verbatim, from the report's "Optional advice to help the service team
continually improve the service" section:

> The team is using the OpenAPI open standard for documenting their API
> and using API versioning at the schema level which aligns with the
> goals of this standard. For Private Beta, the team should proactively
> consider versioning of API resources (endpoints and data models) to
> mitigate the risk of a breaking change being required. It is possible
> to introduce this in a non-breaking way to the current API without the
> need to introduce version numbers in the resource URL by allowing the
> integrating system to provide the version as an HTTP header, with
> implementations using the Accept or a custom HTTP header as an
> example. This implementation is only given as an example, and the
> team is encouraged to investigate a versioning mechanism that aligns
> to their department standards.

— GDS Alpha assessment, 23 July 2026, Point 14 ("optional advice", not a
finding).

Context relayed separately (not from the report text itself, so treat as
colour rather than citable content): the team had already named
versioning as a top risk ahead of the assessment, and the panel's
response — optional advice rather than a finding — was read as
validation of that call.

### Current state: no versioning exists in any repo today

Checked across all seven repos — none implement URL path or
header-based API versioning of any kind.

- No `/v1/`, `/v2/` (or any) version segment in any route path, in any
  repo (`waste-movement-backend`, `waste-movement-external-api`,
  `waste-organisation-backend`, `waste-tracking-id-backend`).
- No `Accept-Version`, `X-API-Version`, vendor media-type (`vnd.`), or
  any content-negotiation/header-matching logic anywhere.
- Each Hapi-based API independently hardcodes a static, unused
  `info.version` string in its Swagger config — `'1.0'`
  (`waste-movement-backend/src/plugins/swagger.js`,
  `waste-movement-external-api/src/plugins/swagger.js`), `'1'`
  (`waste-organisation-backend/src/api-server.js:51`) — none tied to
  `package.json`, none reflected in routes.
  `waste-tracking-id-backend` has no Swagger plugin at all.
- `waste-movement-utils` (the shared library other services import
  from) has no versioning helper — no shared scheme exists to adopt.
- `waste-tracking-service/docs/collections/api/openapi.yaml`:
  `info.version: 0.2.5-alpha` (spec-document version, not a resource
  scheme), `servers` URL has no version path segment, no version header
  parameter defined anywhere in the spec.
- One data-record false lead: `waste-organisation-backend/src/routes/swagger-common.js:5-8`
  has an `addVersionField()` helper, but it appends a numeric `version`
  field to individual data records (optimistic concurrency, same
  pattern as `waste-inputs.revision` in waste-movement-backend) —
  unrelated to API resource versioning.

### Relevant existing decisions and precedent

- **D-023** (`../decisions.md#d-023`, status: Open) — "Phase 1 receipt
  endpoint deprecation timeline." Phase 1 endpoints are marked
  `deprecated: true` in-spec and coexist with Phase 2 equivalents at the
  same unversioned path, with no removal date set. This is the closest
  thing to an existing versioning pattern in production — an ad hoc
  "old and new side by side," not a designed scheme — and it's still an
  open decision.
- **D-003** — "OpenAPI 3.0.3, not 3.1." Spec-format version choice, not
  API/resource versioning; tangential.
- No ADR on versioning exists — `digital-waste-tracking-docs` has six
  ADRs (auth, reporting ×2, admin, spreadsheet submission, service
  charge), none about versioning.
- No DEFRA departmental API versioning standard is referenced or present
  anywhere in either docs repo — the "aligning to a departmental
  standard" part of the advice has nothing in-repo to check against yet.
- No risk-log or delivery-passport entry corroborates "versioning named
  as a risk before the assessment" — that currently rests on
  verbal/slide content, not a written record.

### Gap

This is greenfield: no existing versioning implementation to migrate
away from, and no conflicting scheme to reconcile. The ADR can be
written directly against the advice.

### Open questions

- Where is the DEFRA departmental API versioning standard the panel
  referenced, and does the team have access to it / need to request it?
- Accept-based content negotiation vs. a custom version header — is
  that department's call, or open for the team to choose?
- Does resource versioning apply retroactively to the live Phase 1
  receipt endpoints, or start clean with Phase 2?
- How does header-based versioning interact with D-023's current
  approach (deprecated Phase 1 endpoints coexisting unversioned) — does
  it replace that pattern once written?
- The advice explicitly covers "data models," not just endpoints — does
  that mean a schema-version field belongs in the Mongo documents
  themselves? Worth cross-checking against the [Phase 2 Mongo schema
  evaluation](../decisions.md#d-037) (D-037, still open) so the two
  pieces of design work don't diverge.

### Suggested next steps

- Track down the DEFRA departmental API versioning standard referenced
  by the panel, to confirm the expected header name/format.
- Write the versioning ADR (next `sda-adr-00N`) formalising:
  header-based, non-breaking, covering both endpoints and data models.
- Reconcile with D-023 once the ADR exists — decide whether it
  supersedes the current deprecated-endpoint approach.
- Check with whoever owns the D-037 Mongo schema decision on whether
  API-resource versioning and stored-document schema versioning should
  share one version identifier or stay independent.
