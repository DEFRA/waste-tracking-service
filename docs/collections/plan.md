# Phase 2 Collections API — Cross-Team Plan

This document tracks the delivery plan for extending the Digital Waste Tracking
external API to cover the full waste-movement journey, and for establishing a
test environment where external software integrators can authenticate and submit
data.

For background on what is being designed, start with the
[collections overview](index.md). For the API surface and the decisions behind
it, see the [API workstream](api/README.md) and the
[decisions register](decisions.md).

---

## The four events

Phase 1 captures waste at the point it arrives at a receiver site. Phase 2
broadens this to cover the journey from creation to receipt across four
business events:

| Event | Actor | Endpoint |
|---|---|---|
| **Create Movement** | Producer / Broker / Carrier | `POST /movements` |
| **Record Collection** | Driver (real-time) or Carrier (retrospective) | `POST /movements/{movementId}/collection` |
| **Record Drop-off** | Driver | `POST /transfers` |
| **Record Receipt** | Receiver | `POST /transfers/{transferId}/receipt` |

---

## Team ownership

| Repo | Phase 2 work | Team |
|---|---|---|
| `waste-movement-external-api` | New endpoint routes, Joi schemas, orchestration | **Team C** |
| `waste-movement-backend` | Movement / Collection / Transfer persistence, revised receipt | **Team C** |
| `waste-tracking-id-backend` | Transfer ID generation (same sqid format as Movement IDs, per [D-013](decisions.md#d-013)) | **Team C** |
| `waste-organisation-backend` | Carrier / broker / producer API-code issuance for test | **Team A/B** |
| `waste-organisation-frontend` | New actor registration UI (if self-serve onboarding added later) | **Team A/B** |

---

## Decisions status

### Resolved

| Decision | Summary |
|---|---|
| [D-027](decisions.md#d-027) | **Per-organisation credentials.** All actor types onboard the same way as receivers — Cognito app client plus `apiCode`. Every record is attributed to the submitting organisation. No new credential shape or registration path needed for Phase 2. |
| [D-036](decisions.md#d-036) | **Write authorisation.** Append (`POST`) is open to any authenticated organisation. Amend (`PUT`) is restricted to the authoring organisation. |
| [D-013](decisions.md#d-013) | **Identifier format.** Movement IDs and Transfer IDs both use 8-character year-prefixed sqids (`YY[A-Z0-9]{6}`). |
| [D-016](decisions.md#d-016) | **Resource model.** Richardson Maturity Level 2 — URLs name resources, HTTP methods carry the verbs. |
| [D-009](decisions.md#d-009) | **Soft-delete.** No `DELETE` endpoints. `isDeleted` flag on `PUT` only, for Movement, Collection, and Drop-off. Receipt cannot be deleted. |
| [D-034](decisions.md#d-034) | **History/revision pattern** on all `PUT` operations — same as the Phase 1 receipt `PUT`. |

### Still open — resolve before building the affected endpoints

| Decision | Blocks | Owner |
|---|---|---|
| [D-022](decisions.md#d-022) | Whether to implement `POST /transfers/{transferId}/receipt` or extend `POST /movements/receive`. Spec leans toward the new endpoint (Option 1). | Tech lead + BA |
| [D-025](decisions.md#d-025) | Receipt acceptance / rejection outcome schema. No rejection model exists in Phase 1. | BA + policy |
| [D-028](decisions.md#d-028) | Pre-generated Transfer IDs for offline drivers — affects whether `waste-tracking-id-backend` needs a reservation mechanism. | Team C |
| [D-019](decisions.md#d-019) | `GET /movements/{movementId}/fate-of-waste` response schema. URL and key are agreed; what it returns is not. | BA |

---

## Phase 0 — Alignment (before build starts)

**All teams**

- Close [D-022](decisions.md#d-022): confirm the new Transfer-scoped receipt
  endpoint (`POST /transfers/{transferId}/receipt`) is the path forward. This
  determines which receipt handler Team C builds and whether the Phase 1
  endpoint is deprecated or extended.
- Confirm the test Cognito user pool can have new app clients provisioned by
  the platform / infra team. The test pool is already running at
  `waste-movement-external-api-8ec5c.auth.eu-west-2.amazoncognito.com` —
  the question is access permissions for whoever provisions new clients.

**Team C**

- Decide the Phase 2 document model: extend the existing `WasteInput`
  document in `waste-movement-backend` (which already has `creation` and
  `collection` slots but does not populate them) or introduce a separate
  `movements` collection. This is the highest-consequence local architectural
  decision before any Phase 2 code is written. See the
  [Phase 1 implemented data model](phase1/receipt-api-implemented-data-model.md)
  for the current shape.
- Confirm whether Movement IDs and Transfer IDs are minted from a **shared**
  sequence in `waste-tracking-id-backend` (so the two can never collide) or
  from separate counters. Implement accordingly before the Transfer endpoint
  is built.

**Team A/B**

- The existing `apiCode` issuance flow in `waste-organisation-backend` is
  confirmed role-agnostic (see [registration.md](registration.md)): the JWT
  auth plugin does not inspect `isWasteReceiver`, and
  `ensureAtLeastOneApiCodeExists` fires for any organisation on first write
  regardless of actor type. No code change is needed.
- Confirm that the test environment allows calling
  `PUT /user/{userId}/organisation/{organisationId}` on
  `waste-organisation-backend` without a deployment — this is the
  zero-change path to provision a carrier org and `apiCode` in Phase 1
  (Option A in [registration.md](registration.md)).

---

## Phase 1 — Minimum viable test environment

**Goal:** an external software integrator can obtain a Bearer token, call
`GET /auth/test` successfully, and submit a `POST /movements` request.

### Team C — `waste-movement-external-api` + `waste-movement-backend`

1. Implement `POST /movements` — validates payload per the
   [API spec](api/README.md) (carrier required per
   [D-008](decisions.md#d-008); broker optional; waste items with EWC
   codes; disposal codes optional per [D-031](decisions.md#d-031)); mints a
   Movement ID via `waste-tracking-id-backend`; persists via
   `waste-movement-backend`.
2. Implement `POST /movements/{movementId}/collection` — static collection
   only at this stage (transit extension follows in Phase 3 per
   [D-029](decisions.md#d-029)).
3. The existing JWT auth in `jwt-auth.js` validates Bearer tokens from the
   Cognito JWKS endpoint and makes `client_id` available to handlers — no
   auth changes needed. The `apiCode` in the request body identifies the
   submitting organisation via the existing `waste-organisation-backend`
   lookup, unchanged from Phase 1.

### Team A/B — `waste-organisation-backend`

Provision a carrier org and `apiCode` for the first software integrator.
No code change is required — use **Option A** from
[registration.md](registration.md):

1. Call `PUT /user/{userId}/organisation/{organisationId}` with a body like
   `{ "name": "Carrier Ltd (test)", "isWasteReceiver": false }`. Use a new
   UUID for `organisationId`; any valid Defra ID user UUID for `userId`.
2. `ensureAtLeastOneApiCodeExists` fires automatically on first write,
   creating a UUID `apiCode` and persisting it.
3. Retrieve the generated code via
   `GET /organisation/{organisationId}/apiCodes`.
4. Hand the `apiCode` to the software integrator alongside the Cognito
   credentials from the Platform step below.

### Platform / infra

- Provision a Cognito app client in the test user pool for the carrier
  software integrator. Use the
  [existing onboarding process](https://github.com/DEFRA/waste-tracking-service/blob/alpha_collections/docs/api-software-developer-onboarding-process.md):
  create the client via the AWS CLI or console, assign the
  `waste-movement-external-api-resource-srv/access` scope, and distribute
  the `client_id` and `client_secret` via encrypted email.

---

## Phase 2 — Full journey

**Goal:** a software integrator can record all four events end-to-end in the
test environment.

### Team C

| Endpoint | Key rules |
|---|---|
| `PUT /movements/{movementId}` | Full update; history/revision pattern ([D-034](decisions.md#d-034)); amend restricted to authoring org ([D-036](decisions.md#d-036)) |
| `PUT /movements/{movementId}/collection` | Tail-only update / soft-delete of latest active event ([D-029](decisions.md#d-029), [D-009](decisions.md#d-009)) |
| `POST /transfers` | Drop-off; mandatory `dropOff.address` ([D-018](decisions.md#d-018)); `movementIds[]` array — many-to-one ([D-007](decisions.md#d-007)); hazardous constraint: exactly 1 movement ([D-010](decisions.md#d-010)); mints Transfer ID, except a hazardous drop-off reuses the Movement ID ([D-010](decisions.md#d-010)) |
| `PUT /transfers/{transferId}` | Soft-delete only via `isDeleted` — no field edits ([D-017](decisions.md#d-017)) |
| `POST /transfers/{transferId}/receipt` | New Phase 2 receipt (contingent on [D-022](decisions.md#d-022) Option 1); cross-checks waste vs Creation and carrier vs Movement chain ([D-006](decisions.md#d-006)); mismatches are warnings, not hard errors |
| `PUT /transfers/{transferId}/receipt` | Receipt update; history/revision pattern ([D-034](decisions.md#d-034)) |

The Phase 1 receipt endpoints (`POST /movements/receive`,
`PUT /movements/{wasteTrackingId}/receive`) remain in the spec marked
`deprecated: true`. No removal date is set — see [D-023](decisions.md#d-023).

Every end-to-end journey across the four events should produce a valid
sequence of API calls without a 4xx response; use the key journey shapes
(carrier baseline, broker-initiated, rejection-retry, deferred recording)
as integration acceptance tests.

---

## Phase 3 — Transit collection and fate-of-waste

**Goal:** cover driver-to-driver handovers and producer read-only access.

### Team C

- **Transit collection** — extend `POST /movements/{movementId}/collection`
  with append semantics. Adds `collectionType` (enum `STATIC` / `TRANSIT`)
  and `receivedFromCarrier` (required when `TRANSIT`). Server enforces that
  the first active event is always `STATIC` and subsequent events are always
  `TRANSIT`. Tail-only soft-delete applies across the sequence. Full spec in
  [D-029](decisions.md#d-029).
- **`GET /movements/{movementId}/fate-of-waste`** — producer read-only
  projection. URL is stable; response schema depends on [D-019](decisions.md#d-019)
  being resolved with the BA first.

---

## Key cross-team interface: `apiCode` and organisation identity

The current flow in `waste-movement-external-api` resolves `apiCode` →
submitting organisation via `waste-organisation-backend` before forwarding to
`waste-movement-backend`. This is the integration boundary between Team C and
Teams A/B.

With [D-027](decisions.md#d-027) decided, the mechanism is unchanged — carriers
and brokers receive `apiCode` values through the same issuance process as
receivers. Code analysis of `waste-organisation-backend` confirms that
`apiCode` issuance is not tied to the receiver role: the JWT auth plugin does
not check `isWasteReceiver`, and `ensureAtLeastOneApiCodeExists` fires for any
organisation type. Full details and the test provisioning options are in
[registration.md](registration.md).

---

## Immediate actions

| # | Action | Team |
|---|---|---|
| 1 | Close [D-022](decisions.md#d-022) — confirm new Transfer-scoped receipt endpoint | Team C + BA |
| 2 | Confirm test Cognito pool can accept new app clients for carrier integrators | Platform + Team A/B |
| 3 | ~~Confirm `apiCode` issuance is not tied to receiver role~~ — **confirmed, no code change needed** (see [registration.md](registration.md)) | Team A/B ✅ |
| 4 | Decide Phase 2 document model — three options under evaluation: aggregate, per-event-type, CQRS/event-sourcing (see [D-037](decisions.md#d-037)) | Team C |
| 5 | Decide Movement ID / Transfer ID shared vs separate counter in `waste-tracking-id-backend` | Team C |
| 6 | Implement `POST /movements` (external API + backend) | Team C |
| 7 | Provision first carrier `apiCode` in test environment | Team A/B |
| 8 | Provision first carrier Cognito app client and send credentials to integrator | Platform |
