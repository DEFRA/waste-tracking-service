# Pitch: Standardising the Digital Waste Tracking API

> Shape Up pitch — technical proposal only. Appetite, scoping and other
> deliverables are intentionally left out. Each open topic below is a
> placeholder we will fill in one discussion at a time.

## Problem

Today only the **Receipt of Waste** API is implemented. The rest of the
waste-movement journey (creation, collection, drop-off, producer tracking)
is planned but not yet built. That makes now the right moment to set a
**basic, consistent foundation** for the cross-cutting API conventions —
how we signal outcomes, shape responses, authenticate, page, and trace
requests — before the remaining endpoints are written.

These conventions were never standardised for the receipt endpoints, and
without an agreed baseline each new endpoint is free to invent its own.
Left unaddressed, patterns diverge, integrators have to special-case our
responses, and the cost of correcting it only grows as more of the journey
ships.

A draft OpenAPI spec (`openapi.yaml`) already sketches the full journey. We
use it here as the **working input** for drafting this standard — a place to
try conventions against real endpoints — not as a description of what is
built today.

Where a convention already exists in the **implemented** receipt endpoints
(the `waste-movement-external-api` gateway, its `waste-movement-backend`, and
the shared `waste-movement-utils`) or is provided by the CDP platform, we
prefer to **codify what already works** over inventing something new. Each
topic below therefore records both what the draft spec does and what the code
does today — they sometimes disagree, and closing that gap is part of the job.

We are not aiming for a complete API-design rulebook now. We want the
**smallest set of conventions that is consistent and can scale** into a
richer standard later if the service needs it.

## Solution

Agree one convention per concern and apply it uniformly across all
endpoints (Phase 1 deprecated paths included where practical). Keep each
convention as simple as possible while leaving room to grow. The topics
below are the scope of this pitch. **Each is left open on purpose — we will
work through them one at a time and record the decision inline.**

**Accept-with-warnings.** This is the decided, current implementation. The
service stores an operational record even when it has soft, data-quality
problems, and returns those as `validation.warnings` (D-006). It still
rejects with `400` when a request cannot be safely stored: schema/format
errors, and structural, state-integrity or authorisation violations (D-009,
D-036). In short: warn on data quality, reject on
structure/state/authorisation. We adopt this as-is; it frames the
status-code and response-format topics below.

### 1. Status codes for responses

**In the draft spec:** `2xx` + `400` + inconsistent `404`; no `401/403`, no
`5xx`, no `409`. Reference-data endpoints mention `401` in prose only.

**In the code today:** a canonical `HTTP_STATUS` set already exists in
`waste-movement-utils`. Live receipt endpoints emit `201` (create), `200`
(update), `400`, `404`, `401` (JWT), `500`, and `402` (Payment Required —
service-charge expiry). `402` is real but absent from the draft.

**Proposal:**

- **Success:** `201` for a POST that creates (body carries the new id), `200`
  for a PUT that updates (body carries any warnings). Matches the live
  gateway. `204 No Content` is not used, because responses carry a
  `validation` body.
- **Reject vs warn:** governed by the accept-with-warnings model above — a
  storable record is `2xx` with `validation.warnings`; only unstorable
  requests are rejected with `400`.
- **Baseline error set every operation documents:** `400` (validation),
  `401` (auth) and `500` (server) on every operation; `404` where the path
  has an id; `402` on service-charge-gated writes.
- **Not now:** hold off on `409` (state conflicts) and `422` (malformed vs
  semantically-invalid split) — keep `400` for all client validation, and
  note these as future refinements so we don't preclude them.

### 2. `2xx` response format

**In the draft spec:** `validation.warnings` envelope duplicated inline across
create/update/receipt responses; `createMovementResponse`,
`dropOffResponse`, `updateResponse` are near-duplicates.

**In the code today:** success is `{ wasteTrackingId, validation?: { warnings } }`
on create and `{ validation?: { warnings } }` (or `{}`) on update — the
`validation` object is included **only when warnings exist**. Warning item is
`{ key, errorType, message }`. (The live Swagger types `wasteTrackingId` as a
UUID even though the minted value is an 8-char sqid.)

**Proposal:**

- **One consistent envelope for every response:** `data` holds the payload,
  `meta` is reserved for response metadata (e.g. pagination, added later), and
  `validation` carries warnings on write operations.
- **`validation` always present on writes:** create/update responses always
  include `validation.warnings` — an empty array when clean — so the shape is
  predictable and clients need no null-check. Reads/lists omit `validation`
  (nothing is validated on a read).
- **Create returns the new id inside `data`,** e.g. `data: { movementId }`.
  It stays an *object* deliberately, so it can be extended to the full created
  resource later without a breaking change. (A `Location` header remains an
  option.)
- **Warnings and errors share one item shape** — `{ key, errorType, message }`.
  `validation.warnings` here and `validation.errors` (topic 3) differ only by
  the array name.

```json
// 201 create
{ "data": { "movementId": "25HRA0B2" }, "validation": { "warnings": [] } }
// 200 update
{ "data": null, "validation": { "warnings": [] } }
// 200 list (reference data)
{ "data": [ /* items */ ], "meta": {} }
```

Note this envelope is a change from today's flat shape, so it applies to the
new endpoints; the deprecated Phase 1 receipt endpoints may keep their
existing flat response. Collapsing the duplicated inline schemas into one
reusable definition, and fixing the `wasteTrackingId` typing, is left for when
we write the OpenAPI spec.

### 3. `4xx` & `5xx` response format

**In the draft spec:** two error shapes (`validation.errors[]` vs
`code`/`message`); some errors have no body; `BusinessRuleViolation`
inconsistently a `400` or a `2xx` warning; no `5xx` shape at all.

**In the code today:** also two shapes, and neither matches the draft's
`notFoundError`. `400` uses `{ validation: { errors: [{ key, errorType, message }] } }`
(its `errorType` enum includes `UnexpectedError`); `401/402/404/500` use the
default **Hapi Boom** shape `{ statusCode, error, message }`.

**Proposal:**

- **One unified failure envelope for every `4xx`/`5xx`:** the presence of
  `error` means the request failed. Field-level problems (`400`) ride in
  `error.details[]`, reusing the shared item shape `{ key, errorType, message }`
  (topic 2). Non-validation failures omit `details`.

  ```json
  // 400 — validation
  { "error": { "code": "VALIDATION_FAILED", "message": "…",
               "details": [ { "key": "wasteItems[0].weight", "errorType": "NotProvided", "message": "…" } ] },
    "traceId": "…" }
  // 404 / 401 / 500
  { "error": { "code": "MOVEMENT_NOT_FOUND", "message": "…" }, "traceId": "…" }
  ```

- **Machine-readable `error.code`:** a stable top-level enum for programmatic
  handling — e.g. `VALIDATION_FAILED`, `UNAUTHORIZED`, `PAYMENT_REQUIRED`,
  `INTERNAL_ERROR`, and the `404` variants below — separate from the per-field
  `errorType`.

- **`404` distinguished by `error.code` (D-014):** `MOVEMENT_NOT_FOUND` /
  `TRANSFER_NOT_FOUND` (parent missing) vs `COLLECTION_NOT_RECORDED` /
  `RECEIPT_NOT_RECORDED` (parent exists, event not recorded yet). This replaces
  the draft's separate `notFoundError` shape; the status stays `404`.

- **Per-field `errorType` enum, adopted as-is from the code:** `NotProvided`,
  `NotAllowed`, `InvalidType`, `InvalidFormat`, `InvalidValue`, `OutOfRange`,
  `BusinessRuleViolation`, `UnexpectedError`.

- **`traceId` top-level on every error body** (topic 6). **`5xx`** uses the same
  envelope, with `message` never leaking internals (stack traces, downstream
  errors).

Implementation note: a single `onPreResponse` mapper reshapes all Boom errors
into this envelope (the code already does this for `400` only).

### 4. Pagination

**In the draft spec:** reference-data lists (EWC codes in particular) return
full unbounded arrays; no page/limit parameters or paging envelope.

**In the code today:** the same — handlers return the whole list (e.g. all of
`validEwcCodes`); no paging anywhere.

**Proposal:** _TBD — to discuss (is paging needed, and where?)._

### 5. Authentication — headers vs request body

**In the draft spec:** no `securitySchemes` defined; a Bearer token appears in
curl examples while `apiCode` sits in every request body.

**In the code today:** there are **two credentials doing two jobs**, and one
of them travels in the body:

- The **JWT Bearer** token (AWS Cognito, the default auth strategy) carries
  `client_id` — it *authenticates the calling software* and is forwarded
  downstream as `x-dwt-client-id`.
- The **`apiCode`** in the request body *authorizes acting for a waste
  organisation*. It is not just a label: the backend rejects an unknown
  `apiCode` (`validate-api-code.js`), and on update it must resolve to the
  **same org that created the record** or the write is refused
  (`validate-organisation.js`). It also gates the service charge (`402`).

So `apiCode` is effectively an **authorization credential carried in the
request body** — a shared, bearer-like secret, yet typed as a plain
`uuid` with no secret handling. Critically, **nothing binds the two**: any
valid JWT combined with any valid `apiCode` is accepted, so `apiCode` alone
decides which organisation you may act as. (A migration is already under way
to resolve `apiCode` → `submittingOrganisation` in the gateway and strip it
before forwarding; the backend accepts either via `.xor(...)`.)

The question for the standard: should organisation authorization move to a
header / the token rather than the body, and how do we bind it to the
authenticated caller?

**Proposal:** _TBD — to discuss._

### 6. Tracing

**In the draft spec:** no correlation / request id modelled on any request or
response.

**In the code today:** the CDP platform propagates a trace id *internally* —
`@defra/hapi-tracing` reads the inbound `x-cdp-request-id` header, surfaces it
in logs as `trace.id`, and forwards it to downstream calls. But it is
**read-only inbound and never returned to the client**, and it is **not
generated** when the header is absent. So a client currently has no way to
learn the trace id for a request.

**Requirement:** a client must be able to obtain the trace id for their
request, so that when something goes wrong they can quote it back to us and we
can find that request in our logs.

**Proposal:**

1. **Guarantee a trace id exists** for every request — use CDP's inbound
   `x-cdp-request-id`; if it is absent, generate one server-side so every
   request is traceable.
2. **Echo it back on every response** (success *and* error) under a
   **public** header, **`x-request-id`**. The value is the internal CDP trace
   id, but the public name deliberately does **not** leak the platform — we
   keep `x-cdp-request-id` for inbound/internal use only and map the same
   value onto `x-request-id` on the way out. This is the core change.
3. **Surface it in the error body too** — a top-level `traceId` on `4xx`/`5xx`
   responses — so a developer sees it without inspecting headers (ties into
   the error-format decision in topic 3).
4. **Document it** in the OpenAPI spec: the `x-request-id` response header on
   all responses, the `traceId` field on the error schema, and guidance to
   include it when contacting support.

Keep it minimal: the header echo is the essential part; the error-body field
is a developer-friendly addition. If cross-vendor distributed tracing is ever
needed, a standard `traceparent` header can be added alongside without
breaking `x-request-id`.

### 7. Governance — keeping the conventions true

Deciding the conventions is not enough; they need to stay enforced as the
remaining endpoints are added. The idea is to treat the **OpenAPI spec as
the single source of truth** and let tooling hold the line rather than
relying on review discipline:

- **Lint the spec** in CI so the conventions agreed above become automated
  rules checked on each pull request. Caveat: no OpenAPI linter (Spectral or
  similar) currently appears on the Defra org-wide radar *or* the CDP tools
  radar, so this specific step may not have an approved tool — confirm before
  relying on it. **GitHub Actions** (the CI itself) is approved.
- **Spec-driven request/response validation:** derive runtime validation
  from the same OpenAPI document so the implemented API cannot drift from
  the published contract.
- **Grow toward contract testing** — on-radar options exist: **PACT**
  (adopt), **Schemathesis** (consider, OpenAPI-driven), **Wiremock** (in
  trial).

> **Alternative if linting tooling is constrained:** capture the conventions
> as a markdown rules file and validate the spec against it via LLM review —
> which has approved substrate on the radar (Azure OpenAI, GitHub Copilot),
> rather than needing a new tool admitted.

**Proposal:** _TBD — CI gate via GitHub Actions; spec-conformance via an
approved contract-testing tool (PACT/Schemathesis) rather than a linter;
markdown-rules + LLM review as the fallback where no linter is available._

## Rabbit holes

_To be captured as decisions are made._

## No-gos

_To be captured as decisions are made._
