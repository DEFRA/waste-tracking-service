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

### 1. Status codes for responses

**In the draft spec:** `2xx` + `400` + inconsistent `404`; no `401/403`, no
`5xx`, no `409`. Reference-data endpoints mention `401` in prose only.

**In the code today:** a canonical `HTTP_STATUS` set already exists in
`waste-movement-utils`. Live receipt endpoints emit `201` (create), `200`
(update), `400`, `404`, `401` (JWT), `500`, and `402` (Payment Required —
service-charge expiry). `402` is real but absent from the draft.

**Proposal:** _TBD — to discuss._

### 2. `2xx` response format

**In the draft spec:** `validation.warnings` envelope duplicated inline across
create/update/receipt responses; `createMovementResponse`,
`dropOffResponse`, `updateResponse` are near-duplicates.

**In the code today:** success is `{ wasteTrackingId, validation?: { warnings } }`
on create and `{ validation?: { warnings } }` (or `{}`) on update — the
`validation` object is included **only when warnings exist**. Warning item is
`{ key, errorType, message }`. (The live Swagger types `wasteTrackingId` as a
UUID even though the minted value is an 8-char sqid.)

**Proposal:** _TBD — to discuss._

### 3. `4xx` & `5xx` response format

**In the draft spec:** two error shapes (`validation.errors[]` vs
`code`/`message`); some errors have no body; `BusinessRuleViolation`
inconsistently a `400` or a `2xx` warning; no `5xx` shape at all.

**In the code today:** also two shapes, and neither matches the draft's
`notFoundError`. `400` uses `{ validation: { errors: [{ key, errorType, message }] } }`
(its `errorType` enum includes `UnexpectedError`); `401/402/404/500` use the
default **Hapi Boom** shape `{ statusCode, error, message }`.

**Proposal:** _TBD — to discuss._

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

**In the code today:** already solved by the CDP platform — `@defra/hapi-tracing`
propagates the `x-cdp-request-id` header, surfaces it in logs as `trace.id`,
and forwards it to downstream calls. This needs **documenting** in the spec,
not inventing.

**Proposal:** _TBD — to discuss._

### 7. Governance — keeping the conventions true

Deciding the conventions is not enough; they need to stay enforced as the
remaining endpoints are added. The idea is to treat the **OpenAPI spec as
the single source of truth** and let tooling hold the line rather than
relying on review discipline:

- **Lint the spec** in CI (e.g. a Spectral ruleset) so the conventions
  agreed above become automated rules — every new path is checked against
  them on each pull request.
- **GitHub CI gate:** the spec must lint clean before merge.
- **Spec-driven request/response validation:** derive runtime validation
  from the same OpenAPI document so the implemented API cannot drift from
  the published contract.

**Proposal:** _TBD — start minimal (lint in CI), grow toward
contract-testing later._

## Rabbit holes

_To be captured as decisions are made._

## No-gos

_To be captured as decisions are made._
