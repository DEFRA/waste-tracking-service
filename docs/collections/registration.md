# Software Provider Registration and `apiCode` Issuance

This document covers how software providers (carrier, broker, producer, and
receiver integrators) obtain the credentials they need to call the external
API, and what needs to change as Phase 2 onboards new actor types.

For the credential flow itself — Cognito client/secret exchange, JWT
structure, scope requirements — see the
[software developer onboarding process](../api-software-developer-onboarding-process.md).
For the policy decision that all actor types share the same credential shape,
see [D-027](decisions.md#d-027).

---

## How `apiCode` issuance works today

Every API request body carries an `apiCode` field. The external API resolves
this to a `defraCustomerOrganisationId` by calling
`GET /organisation/{apiCode}` on `waste-organisation-backend` before
forwarding to `waste-movement-backend`. The `apiCode` is therefore the link
between a software provider's credentials and the organisation the record is
attributed to.

`apiCode` values are created in `waste-organisation-backend`. The key
functions are in `src/domain/organisation.js`:

```js
export const createApiCode = (org, name) => {
  const apiCodes = org.apiCodes || []
  apiCodes.push({
    code: crypto.randomUUID(),   // UUID v4
    name: name || `API Code ${apiCodes.length + 1}`,
    isDisabled: false
  })
  return joi.attempt({ ...org, apiCodes }, orgSchema, ...)
}

export const ensureAtLeastOneApiCodeExists = (org) => {
  if (org.apiCodes == null) {
    return createApiCode(org)
  } else {
    return org
  }
}
```

`ensureAtLeastOneApiCodeExists` is called automatically when an organisation
record is written via
`PUT /user/{userId}/organisation/{organisationId}`.
This means an `apiCode` is created on first registration without any
explicit step.

Additional codes can be added at any time via
`POST /organisation/{organisationId}/apiCodes`.
All codes for an organisation are listed via
`GET /organisation/{organisationId}/apiCodes`.

---

## The org schema is role-agnostic

The organisation schema in `waste-organisation-backend` (`orgSchemaWithoutApiCodes`) is:

| Field | Type | Notes |
|---|---|---|
| `organisationId` | string | UUID |
| `users` | string[] | Defra ID user IDs associated with this org |
| `name` | string | Display name |
| `isWasteReceiver` | boolean | The **only** role flag that exists |
| `isDisabled` | boolean | |
| `disabledReason` | string (optional) | |
| `disableAfter` | date (optional) | Used for payment / subscription gating |

There is no `isCarrier`, `isBroker`, or `isProducer` flag. More importantly,
the JWT auth plugin in `waste-movement-external-api` (`src/plugins/jwt-auth.js`)
does **not** inspect `isWasteReceiver` — it only validates the Cognito JWT
(scope, `token_use`, JWKS signature). The `apiCode` lookup confirms the
organisation exists; role checks are not performed.

**Conclusion:** issuing an `apiCode` to a carrier or broker requires zero
code changes. The existing mechanism works for any actor type.

---

## Short-term: provisioning in the test environment

Until a self-serve registration journey exists for carriers and brokers, the
options below cover the test environment. Option A is recommended because it
requires no code change and no manual database access.

### Option A — Direct API call to `waste-organisation-backend` (recommended)

No code change required. No UI, no database access.

**Steps:**

1. Call `PUT /user/{userId}/organisation/{organisationId}` on
   `waste-organisation-backend` with a JSON body representing the new
   carrier org:
   ```json
   {
     "name": "Carrier Ltd (test)",
     "isWasteReceiver": false
   }
   ```
   - `userId`: any valid Defra ID user UUID (an admin or test user is fine —
     this field is used for multi-tenancy lookup, not to set the owner
     permanently).
   - `organisationId`: a fresh UUID for the carrier org.
   - `isWasteReceiver: false` is optional but makes intent explicit.

2. `ensureAtLeastOneApiCodeExists` fires automatically on first write,
   creating a UUID `apiCode` and persisting it alongside the org record.

3. Retrieve the generated code:
   ```
   GET /organisation/{organisationId}/apiCodes
   ```
   The response lists all `apiCode` values for the org.

4. Distribute the `apiCode` to the software integrator alongside their
   Cognito `client_id` and `client_secret`.

This is the same path that receivers currently use — D-027 formalises that
there is nothing receiver-specific in it.

### Option B — Carrier signs in via `waste-organisation-frontend`

The carrier rep signs into the frontend using their Defra ID account. On
first sign-in, `ensureAtLeastOneApiCodeExists` is triggered and an `apiCode`
is auto-generated. The rep retrieves it from the UI settings page and
forwards it to their software provider.

**Downside:** requires the carrier to have a Defra ID account and navigate a
UI designed around receiver workflows. Confusing for non-receiver actors and
not suitable as a repeatable test process.

### Option C — New admin endpoint

Add a lightweight admin endpoint to `waste-organisation-backend`
(e.g., `POST /admin/organisations`) that accepts an org name and actor type
and returns the new `organisationId` and initial `apiCode` in one call.

Cleaner developer experience than Option A but requires a code change and a
deployment. Worthwhile if the manual provisioning volume grows.

---

## Long-term: gaps that need addressing for production

The following are not blockers for Phase 2 testing but will need to be
resolved before carriers and brokers can self-register in production.

### 1. Carrier / broker registration journey

`waste-organisation-frontend` has no registration path for non-receiver
actors. Phase 1 was receiver-first: every onboarding flow assumes
`isWasteReceiver`. A new section of the frontend (or a separate portal) is
needed so that carrier and broker organisations can register themselves,
receive an `apiCode`, and manage their credentials without manual
provisioning.

This is the largest piece of work and is gated on policy decisions about
who is allowed to register and whether there is a verification step (e.g.,
confirming a carrier's CB:DU registration number).

### 2. Service charge / subscription model

The `disableAfter` field and `isDisabled` flag on the org schema support
time-limited access, which is used for receiver payment gating. If carriers
and brokers will also be subject to a service charge, the same fields apply
but:

- the payment integration is not yet wired up for non-receiver actors;
- the billing policy for new actor types has not been confirmed.

This is a policy question before it is an engineering question.

### 3. Software developer onboarding process

The existing
[onboarding process](../api-software-developer-onboarding-process.md)
is written around receivers. It should be extended to cover:

- how a carrier or broker obtains their `apiCode` (once self-serve exists);
- how the Cognito credential request works for non-receiver actor types;
- any differences in the PAT test suite a carrier/broker integration must pass.

### 4. Role flags in the org schema

Currently `isWasteReceiver` is the only role flag. If role-based access
control, reporting by actor type, or future per-role restrictions are needed,
`isCarrier`, `isBroker`, and `isProducer` flags would need to be added to
`orgSchema` in `waste-organisation-backend` and propagated to any downstream
consumers. This is not required for Phase 2 — the external API does not gate
on role today — but it is a likely future requirement once more actor types
are active on the system.
