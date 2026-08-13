# Pitch: Standardising the Digital Waste Tracking API

> Shape Up pitch — technical proposal only. Appetite, scoping and other
> deliverables are intentionally left out. Each open topic below is a
> placeholder we will fill in one discussion at a time.

## Problem

The API spec (`openapi.yaml`) has grown organically across Phase 1 and
Phase 2. The domain modelling is careful, but the **cross-cutting API
conventions** — how we signal outcomes, shape responses, authenticate,
page, and trace requests — were never standardised. As a result the same
concern is handled several different ways:

- Write endpoints define `201`/`200`, `400`, and *sometimes* `404`. There
  is no `401`/`403` anywhere (despite Bearer auth), and no `5xx`.
- The success envelope (`validation.warnings`) is re-declared inline in
  ~5 places instead of being reused from one schema.
- Two unrelated error shapes coexist: `400` returns `validation.errors[]`;
  `404` returns a top-level `code`/`message`. Some `404`s have no body at all.
- The same failure class (`BusinessRuleViolation`) is a `400` in one place
  and a warning inside a `201` in another.
- Reference-data lists return unbounded arrays with no paging.
- There is no `securitySchemes` block; caller identity is split between a
  Bearer token (header) and `apiCode` (repeated in every request body).
- Nothing carries a correlation / request id for tracing or support.

Left unaddressed, every new endpoint copies one of these divergent patterns
and integrators have to special-case our responses.

## Solution

Agree one convention per concern and apply it uniformly across all
endpoints (Phase 1 deprecated paths included where practical). The topics
below are the scope of this pitch. **Each is left open on purpose — we will
work through them one at a time and record the decision inline.**

### 1. Status codes for responses

**Current state:** `2xx` + `400` + inconsistent `404`; no `401/403`, no
`5xx`, no `409`. Reference-data endpoints mention `401` in prose only.

**Proposal:** _TBD — to discuss._

### 2. `2xx` response format

**Current state:** `validation.warnings` envelope duplicated inline across
create/update/receipt responses; `createMovementResponse`,
`dropOffResponse`, `updateResponse` are near-duplicates.

**Proposal:** _TBD — to discuss._

### 3. `4xx` & `5xx` response format

**Current state:** two error shapes (`validation.errors[]` vs
`code`/`message`); some errors have no body; `BusinessRuleViolation`
inconsistently a `400` or a `2xx` warning; no `5xx` shape at all.

**Proposal:** _TBD — to discuss._

### 4. Pagination

**Current state:** reference-data lists (EWC codes in particular) return
full unbounded arrays; no page/limit parameters or paging envelope.

**Proposal:** _TBD — to discuss (is paging needed, and where?)._

### 5. Authentication — headers vs request body

**Current state:** no `securitySchemes` defined. Identity is carried twice:
a Bearer token in the `Authorization` header (per curl examples) and
`apiCode` in every request body.

**Proposal:** _TBD — to discuss._

### 6. Tracing

**Current state:** no correlation / request id on any request or response;
no way to tie a caller's request to our logs for support.

**Proposal:** _TBD — to discuss._

## Rabbit holes

_To be captured as decisions are made._

## No-gos

_To be captured as decisions are made._
