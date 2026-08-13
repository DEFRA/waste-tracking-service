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

**Proposal:** _TBD — to discuss._

### 2. `2xx` response format

**In the draft spec:** `validation.warnings` envelope duplicated inline across
create/update/receipt responses; `createMovementResponse`,
`dropOffResponse`, `updateResponse` are near-duplicates.

**Proposal:** _TBD — to discuss._

### 3. `4xx` & `5xx` response format

**In the draft spec:** two error shapes (`validation.errors[]` vs
`code`/`message`); some errors have no body; `BusinessRuleViolation`
inconsistently a `400` or a `2xx` warning; no `5xx` shape at all.

**Proposal:** _TBD — to discuss._

### 4. Pagination

**In the draft spec:** reference-data lists (EWC codes in particular) return
full unbounded arrays; no page/limit parameters or paging envelope.

**Proposal:** _TBD — to discuss (is paging needed, and where?)._

### 5. Authentication — headers vs request body

**In the draft spec:** no `securitySchemes` defined. Identity is carried twice:
a Bearer token in the `Authorization` header (per curl examples) and
`apiCode` in every request body.

**Proposal:** _TBD — to discuss._

### 6. Tracing

**In the draft spec:** no correlation / request id on any request or response;
no way to tie a caller's request to our logs for support.

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
