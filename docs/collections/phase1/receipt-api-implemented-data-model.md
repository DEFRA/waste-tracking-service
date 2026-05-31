# Current Receipt API Waste Movement Data Model

## Scope

This document extracts the currently implemented waste movement data model for the Phase 1 receipt-of-waste API.

It is based on the live Joi schemas and handlers in:

- `waste-movement-external-api`
- `waste-movement-backend`

It covers:

- `POST /movements/receive`
- `PUT /movements/{wasteTrackingId}/receive`
- the public request and response model exposed by the external API
- the mapping from the public model into backend persistence

It does not treat `openapi.yaml` as the source of truth for the current model. That file describes a broader future API and does not match the implemented receipt contract.

## Source Of Truth

Public API contract:

- `waste-movement-external-api/src/routes/create-receipt-movement.js`
- `waste-movement-external-api/src/routes/update-receipt-movement.js`
- `waste-movement-external-api/src/schemas/receipt.js`
- `waste-movement-external-api/src/schemas/waste.js`
- `waste-movement-external-api/src/schemas/weight.js`
- `waste-movement-external-api/src/schemas/hazardous-waste-consignment.js`

Backend mapping and persistence:

- `waste-movement-backend/src/routes/create-receipt-movement.js`
- `waste-movement-backend/src/routes/update-receipt-movement.js`
- `waste-movement-backend/src/schemas/movement.js`
- `waste-movement-backend/src/schemas/receipt.js`
- `waste-movement-backend/src/domain/wasteInput.js`
- `waste-movement-backend/src/services/movement-create.js`
- `waste-movement-backend/src/services/movement-update.js`

## Endpoint Summary

| Endpoint | Purpose | Request model | Success response |
| --- | --- | --- | --- |
| `POST /movements/receive` | Create a receipt movement when the caller does not already hold a waste tracking ID | `ReceiveMovementRequest` | `201` with `wasteTrackingId` and optional validation warnings |
| `PUT /movements/{wasteTrackingId}/receive` | Update an existing receipt movement using a known waste tracking ID | `ReceiveMovementRequest` | `200` with optional validation warnings, or `{}` |

## Public Request Model

The public request payload is a single `ReceiveMovementRequest` object.

### Top-Level Shape

```json
{
  "apiCode": "uuid",
  "dateTimeReceived": "2026-01-31T10:15:30.000Z",
  "hazardousWasteConsignmentCode": "optional string",
  "reasonForNoConsignmentCode": "optional enum",
  "yourUniqueReference": "optional string",
  "otherReferencesForMovement": [
    {
      "label": "string",
      "reference": "string"
    }
  ],
  "specialHandlingRequirements": "optional string",
  "wasteItems": [
    {
      "ewcCodes": ["200101"],
      "wasteDescription": "string",
      "physicalForm": "Solid",
      "numberOfContainers": 1,
      "typeOfContainers": "SKI",
      "weight": {
        "metric": "Tonnes",
        "amount": 1.0,
        "isEstimate": false
      },
      "containsPops": false,
      "pops": {},
      "containsHazardous": false,
      "hazardous": {},
      "disposalOrRecoveryCodes": []
    }
  ],
  "carrier": {},
  "brokerOrDealer": {},
  "receiver": {},
  "receipt": {}
}
```

### Top-Level Fields

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `apiCode` | `string (uuid)` | Yes in the public API | Used to identify the submitting organisation. The backend may replace it with `submittingOrganisation` internally. |
| `dateTimeReceived` | `string (ISO 8601 date-time)` | Yes | Receipt timestamp. |
| `hazardousWasteConsignmentCode` | `string` | Conditional | If provided, must match one of the accepted EA/NRW, SEPA, or NIEA formats. |
| `reasonForNoConsignmentCode` | `string` | Conditional | Allowed values: `NON_HAZ_WASTE_TRANSFER`, `NO_DOC_WITH_WASTE`, `HWRC_RECEIPT`. Required when hazardous EWC codes are present and no consignment code is supplied. |
| `yourUniqueReference` | `string` | No | Caller-defined reference. |
| `otherReferencesForMovement` | `array<object>` | No | Each item requires `label` and `reference`, both non-empty strings. |
| `specialHandlingRequirements` | `string` | No | Maximum length `5000`. |
| `wasteItems` | `array<WasteItem>` | Yes | Minimum `1` item. |
| `carrier` | `Carrier` | No in schema | Not marked `.required()` in the Joi schema, but present in the standard request shape and validated when supplied. |
| `brokerOrDealer` | `BrokerOrDealer` | No | Optional. |
| `receiver` | `Receiver` | Yes | Receiving site details. |
| `receipt` | `Receipt` | Yes | Currently contains receipt address only. |

## Nested Entities

### Carrier

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `registrationNumber` | `string \| null \| ''` | Yes | Must match a valid England, SEPA, NRW, or NI carrier registration format unless omitted by the special reason flow. |
| `reasonForNoRegistrationNumber` | `string \| null \| ''` | Conditional | Allowed values: `ON_SITE`, `HOUSEHOLD`, `ONE_OFF`, `MARINE`. Required when `registrationNumber` is `null` or `''`. Forbidden otherwise. |
| `organisationName` | `string` | Yes | Carrier organisation name. |
| `address` | `Address` | No | If supplied, postcode may be UK or Ireland format. |
| `emailAddress` | `string (email)` | No | Standard email validation. |
| `phoneNumber` | `string` | No | Free text. |
| `vehicleRegistration` | `string` | Conditional | Required when `meansOfTransport` is `Road`. Forbidden for other transport modes. |
| `meansOfTransport` | `string` | Yes | Allowed values: `Road`, `Rail`, `Air`, `Sea`, `Inland Waterway`, `Piped`, `Other`. |
| `otherMeansOfTransport` | `string` | No | Present in the schema, but not currently made mandatory when `meansOfTransport` is `Other`. |

### BrokerOrDealer

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `organisationName` | `string` | Yes when object supplied | Required field inside the object. |
| `address` | `Address` | No | UK or Ireland postcode format if supplied. |
| `registrationNumber` | `string` | No | Uses the same carrier or broker registration validation as `carrier.registrationNumber`. |
| `phoneNumber` | `string` | No | Free text. |
| `emailAddress` | `string (email)` | No | Standard email validation. |

### Receiver

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `siteName` | `string` | Yes | Receiving site name. |
| `emailAddress` | `string (email)` | No | Standard email validation. |
| `phoneNumber` | `string` | No | Free text. |
| `authorisationNumber` | `string` | Yes | Must match one of the supported site authorisation number regexes. |
| `regulatoryPositionStatements` | `array<number>` | No | Positive integers only. |

### Receipt

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `address` | `ReceiptAddress` | Yes | Receipt address block. |

### Address

Used by `carrier.address` and `brokerOrDealer.address`.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `fullAddress` | `string` | No | Optional in the generic address schema. |
| `postcode` | `string` | Yes | Must match a UK postcode or Irish Eircode. |

### ReceiptAddress

Used by `receipt.address`.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `fullAddress` | `string` | Yes | Required here, unlike the generic address schema. |
| `postcode` | `string` | Yes | Must match a UK postcode. Ireland format is not accepted here. |

### WasteItem

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `ewcCodes` | `array<string>` | Yes | Minimum `1`, maximum `5`. Each code must be a valid official 6-digit EWC code. |
| `wasteDescription` | `string` | Yes | Free text description. |
| `physicalForm` | `string` | Yes | Allowed values: `Gas`, `Liquid`, `Solid`, `Powder`, `Sludge`, `Mixed`. |
| `numberOfContainers` | `integer` | Yes | Must be greater than or equal to `0`. |
| `typeOfContainers` | `string` | Yes | Must be a valid reference-data container type. |
| `weight` | `Weight` | Yes | Required weight block. |
| `containsPops` | `boolean` | Yes | Strict boolean. |
| `pops` | `Pops` | No | Nullable object with conditional rules. |
| `containsHazardous` | `boolean` | Yes | Strict boolean. |
| `hazardous` | `Hazardous` | No | Nullable object with conditional rules. |
| `disposalOrRecoveryCodes` | `array<DisposalOrRecoveryCode>` | No | Optional list of treatment codes. |

### Weight

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `metric` | `string` | Yes | Allowed values: `Grams`, `Kilograms`, `Tonnes`. |
| `amount` | `number` | Yes | Strict numeric value, must be positive. |
| `isEstimate` | `boolean` | Yes | Strict boolean. |

### Pops

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `sourceOfComponents` | `string` | Conditional | Allowed values: `PROVIDED_WITH_WASTE`, `GUIDANCE`, `OWN_TESTING`, `NOT_PROVIDED`. Required when `containsPops` is `true`. |
| `components` | `array<PopComponent> \| null` | Conditional | Not required when `sourceOfComponents` is `PROVIDED_WITH_WASTE`. Required when `sourceOfComponents` is `GUIDANCE` or `OWN_TESTING`. Not allowed when `containsPops` is `false` or when `sourceOfComponents` is `NOT_PROVIDED` and an array with items is supplied. |

### PopComponent

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `code` | `string` | Yes | Must be a valid POP code from reference data. |
| `concentration` | `number \| null` | No | If present, must be a positive number. |

### Hazardous

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `sourceOfComponents` | `string` | Conditional | Allowed values: `PROVIDED_WITH_WASTE`, `GUIDANCE`, `OWN_TESTING`, `NOT_PROVIDED`. Required when `containsHazardous` is `true`. |
| `hazCodes` | `array<string>` | Conditional | Each item must be a valid hazardous property code. The array is automatically deduplicated. Required when `containsHazardous` is `true` and `sourceOfComponents` is supplied. |
| `components` | `array<HazardousComponent> \| null` | Conditional | Same presence rules as POPs components. |

### HazardousComponent

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `name` | `string` | Yes | Component name. |
| `concentration` | `number \| null` | No | If present, must be a positive number. |

### DisposalOrRecoveryCode

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `code` | `string` | Yes | Must be one of the configured disposal or recovery codes. |
| `weight` | `Weight` | Yes | Required weight block for that code. |

## Cross-Field Business Rules

### Hazardous consignment logic

- Hazardous EWC codes are derived from the `wasteItems[*].ewcCodes` values.
- If hazardous EWC codes are present and `hazardousWasteConsignmentCode` is omitted, `reasonForNoConsignmentCode` becomes mandatory.
- If `hazardousWasteConsignmentCode` is explicitly `null` and no `reasonForNoConsignmentCode` is supplied, validation fails.
- `reasonForNoConsignmentCode` must be one of:
  - `NON_HAZ_WASTE_TRANSFER`
  - `NO_DOC_WITH_WASTE`
  - `HWRC_RECEIPT`

### Carrier registration logic

- `carrier.registrationNumber` is always present in the public schema, but it may be `null` or `''`.
- If it is `null` or `''`, `carrier.reasonForNoRegistrationNumber` is required.
- If a real registration number is supplied, `carrier.reasonForNoRegistrationNumber` is forbidden.

### Transport logic

- `carrier.vehicleRegistration` is required for `meansOfTransport = Road`.
- `carrier.vehicleRegistration` is forbidden for any other transport mode.

### POPs and hazardous detail logic

- `containsPops` and `containsHazardous` are both required booleans.
- If either flag is `true`, the corresponding object must provide `sourceOfComponents`.
- For `GUIDANCE` and `OWN_TESTING`, components are required.
- For `PROVIDED_WITH_WASTE`, components may be omitted.
- For `NOT_PROVIDED`, components must not be supplied as a populated array.
- If the corresponding `contains...` flag is `false`, populated component arrays are not allowed.

## Public Response Model

### Create Response

Actual success response from the current handler:

```json
{
  "wasteTrackingId": "uuid",
  "validation": {
    "warnings": [
      {
        "key": "field.path",
        "errorType": "NotProvided",
        "message": "warning text"
      }
    ]
  }
}
```

Notes:

- `wasteTrackingId` is always returned on success.
- `validation` is only returned when warnings exist.
- The route Swagger schema also advertises `carrierMovementId`, but the current handler does not populate it.

### Update Response

Current success shape:

- `{}` when there are no warnings
- `{"validation":{"warnings":[...]}}` when warnings exist

### Error Response

Validation failures use this shape:

```json
{
  "validation": {
    "errors": [
      {
        "key": "field.path",
        "errorType": "InvalidValue",
        "message": "validation error message"
      }
    ]
  }
}
```

The supported `errorType` values are:

- `NotProvided`
- `NotAllowed`
- `InvalidType`
- `InvalidFormat`
- `InvalidValue`
- `OutOfRange`
- `BusinessRuleViolation`
- `UnexpectedError`

Update also returns `404` when the movement does not exist.

## Backend Request Wrapper

The backend does not accept the public payload directly. It accepts:

```json
{
  "movement": {
    "...ReceiveMovementRequest or enriched variant...": true
  }
}
```

In the backend schema, `movement` uses a slightly different version of `ReceiveMovementRequest`:

- it allows either `apiCode` or `submittingOrganisation`
- it enforces `.xor('apiCode', 'submittingOrganisation')`

This is because the external API may enrich the request before forwarding it.

## Mapping From Public API To Backend Persistence

### External API enrichment

Before the external API calls the backend, it attempts to resolve the organisation behind `apiCode` by calling the waste organisation backend.

If resolution succeeds:

- `apiCode` is removed from the forwarded request
- `submittingOrganisation.defraCustomerOrganisationId` is added

If resolution fails:

- the request is forwarded with `apiCode`
- no `submittingOrganisation` field is added

### Backend create mapping

The backend stores receipt data in a `WasteInput` aggregate.

Core create mapping:

| Public or forwarded field | Persisted location | Notes |
| --- | --- | --- |
| `wasteTrackingId` | `_id`, `wasteTrackingId` | `_id` is set to the same value. |
| `movement.*` | `receipt.movement` | Main receipt payload is nested under `receipt.movement`. |
| `submittingOrganisation.defraCustomerOrganisationId` | `submittingOrganisation.defraCustomerOrganisationId` | Used when the external API could resolve the organisation from `apiCode`. |
| `apiCode` | `receipt.movement.apiCode` or omitted | Persisted only when the request was not enriched to `submittingOrganisation`. |
| derived organisation ID | `orgId` | Stored only in the non-enriched path. |
| request trace ID | `traceId` | Request metadata. |
| system timestamp | `createdAt`, `lastUpdatedAt` | Added on create. |
| system revision | `revision` | Initial value is `1`. |

### Backend update mapping

On update the backend:

1. loads the existing `waste-inputs` record by `_id = wasteTrackingId`
2. validates organisation identity using either `submittingOrganisation` or `apiCode`
3. writes a history entry to `waste-inputs-history`
4. updates `receipt.movement`
5. updates `submittingOrganisation` when present
6. increments `revision`
7. updates `lastUpdatedAt` and `traceId`

### Persisted WasteInput shape used by receipt flows

```json
{
  "_id": "wasteTrackingId",
  "wasteTrackingId": "wasteTrackingId",
  "receipt": {
    "movement": {
      "...receipt payload...": true
    }
  },
  "submittingOrganisation": {
    "defraCustomerOrganisationId": "string"
  },
  "orgId": "string",
  "traceId": "string",
  "revision": 2,
  "createdAt": "date",
  "lastUpdatedAt": "date",
  "bulkId": "optional string"
}
```

Notes:

- `WasteInput` also has `creation` and `collection` slots in the domain class, but they are not populated by the receipt endpoints described here.
- `bulkId` exists in the domain shape but is not part of the public receipt API contract.

## Important Mismatches And Caveats

1. The public external API requires `apiCode`, but the backend route accepts either `apiCode` or `submittingOrganisation`.
2. The public request is a flat `ReceiveMovementRequest`, but the backend route accepts `{ movement: ReceiveMovementRequest }`.
3. The backend persists the payload under `receipt.movement`, not at the document root.
4. The organisation identity may be stored either as `submittingOrganisation.defraCustomerOrganisationId` or as `orgId`, depending on whether enrichment happened before persistence.
5. The create route Swagger schema documents `carrierMovementId`, but the current external handler does not return it.
6. `carrier` is not marked required in the Joi schema even though it is part of the normal receipt payload shape.
7. `otherMeansOfTransport` exists but is not currently enforced when `meansOfTransport` is `Other`.

## Suggested Use Of This Model

Use this document when you need to:

- reason about the live request and response contract
- map public payload fields to stored receipt documents
- assess how validation rules affect client integrations
- explain on-call issues where the external API shape and backend storage shape differ