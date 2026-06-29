[← Back to Top](README.md){ .md-button }

# Receipt of Waste - Data Definitions

Are you a waste receiver or software provider and want to get involved? [Sign up for our Digital Waste Tracking Service](api-software-developer-onboarding-process.md)

These data definition tables describe the information currently accepted by the implemented Phase 1 receipt-of-waste API.

This version is aligned to the current implemented request model for:

- `POST /movements/receive`
- `PUT /movements/{wasteTrackingId}/receive`

It reflects the current live request validation and persistence behaviour derived from the API implementation. It should not be treated as a future target model for accept/reject journeys unless those behaviours are explicitly implemented.

## Implementation notes

- The public API receives a flat `ReceiveMovementRequest` object.
- The external API requires `apiCode` in the public request.
- The backend may replace `apiCode` with `submittingOrganisation` before persistence.
- Receipt data is persisted under `receipt.movement` in the backend `WasteInput` aggregate.
- The current receipt model does not include explicit accept/reject outcome fields such as `receiptStatus`, `acceptedWasteItems`, `rejectedWasteItems` or `rejectionReason`.

## Movement Details

| Data field | API field | Mandatory or optional | Implemented validation / description |
| --- | --- | --- | --- |
| API Code | `apiCode` | Mandatory | The public API currently requires a UUID string. It is used to identify the submitting organisation. The backend may replace it internally with `submittingOrganisation`. |
| Date/time received | `dateTimeReceived` | Mandatory | ISO 8601 date-time string. This is the date and exact time waste was received at the site. |
| Hazardous waste consignment code | `hazardousWasteConsignmentCode` | Conditional | Optional unless required by hazardous consignment logic. If supplied, it must match one of the accepted EA/NRW, SEPA or NIEA consignment code formats. |
| Reason provided for not having a consignment number | `reasonForNoConsignmentCode` | Conditional | Required when hazardous EWC codes are present and no hazardous waste consignment code is supplied. Allowed values: `NON_HAZ_WASTE_TRANSFER`, `NO_DOC_WITH_WASTE`, `HWRC_RECEIPT`. |
| Your unique reference ID | `yourUniqueReference` | Optional | Caller-defined reference, for example a weighbridge ticket number or waste transfer note number. |
| Other references | `otherReferencesForMovement` | Optional | Array of reference objects. If supplied, each item must include a non-empty `label` and a non-empty `reference`. |
| Special handling requirement | `specialHandlingRequirements` | Optional | Handling instructions for waste that has the potential to cause harm. Maximum length: 5000 characters. |
| Waste items | `wasteItems` | Mandatory | Array of waste item objects. At least one waste item is required. |
| Carrier details | `carrier` | Optional in current schema | The top-level carrier object is not currently required by the implemented schema. If supplied, its internal fields are validated. |
| Broker or dealer details | `brokerOrDealer` | Optional | Optional object. If supplied, its internal fields are validated. |
| Receiver details | `receiver` | Mandatory | Receiving site details. |
| Receipt details | `receipt` | Mandatory | Receipt address details. |

## Waste Items

| Data field | API field | Mandatory or optional | Implemented validation / description |
| --- | --- | --- | --- |
| EWC code or codes | `wasteItems[].ewcCodes` | Mandatory | Array of official 6-digit EWC codes. Minimum 1 and maximum 5 codes per waste item. |
| Waste description | `wasteItems[].wasteDescription` | Mandatory | Free text description of the waste. |
| Physical form | `wasteItems[].physicalForm` | Mandatory | Allowed values: `Gas`, `Liquid`, `Solid`, `Powder`, `Sludge`, `Mixed`. Values are case-sensitive in the implemented contract. |
| Number of containers | `wasteItems[].numberOfContainers` | Mandatory | Integer greater than or equal to 0. |
| Type of containers | `wasteItems[].typeOfContainers` | Mandatory | Must be a valid reference-data container type. |
| Weight - unit of measurement | `wasteItems[].weight.metric` | Mandatory | Allowed values: `Grams`, `Kilograms`, `Tonnes`. |
| Weight - amount | `wasteItems[].weight.amount` | Mandatory | Positive numeric value. |
| Is the waste weight estimated? | `wasteItems[].weight.isEstimate` | Mandatory | Strict boolean value. |
| Does the waste contain POPs? | `wasteItems[].containsPops` | Mandatory | Strict boolean value. Controls whether POPs details are required. |
| POPs details | `wasteItems[].pops` | Conditional | Nullable object with conditional rules. Required details depend on `containsPops` and `pops.sourceOfComponents`. |
| Is the waste hazardous? | `wasteItems[].containsHazardous` | Mandatory | Strict boolean value. Controls whether hazardous details are required. |
| Hazardous details | `wasteItems[].hazardous` | Conditional | Nullable object with conditional rules. Required details depend on `containsHazardous` and `hazardous.sourceOfComponents`. |
| Disposal or recovery codes | `wasteItems[].disposalOrRecoveryCodes` | Optional in current schema | Optional array of disposal or recovery code objects. If supplied, each item must include a valid `code` and a required `weight` object. The current implementation does not enforce at least one D/R code per EWC code. |

## Weight

Used by `wasteItems[].weight` and `wasteItems[].disposalOrRecoveryCodes[].weight`.

| Data field | API field | Mandatory or optional | Implemented validation / description |
| --- | --- | --- | --- |
| Weight - unit of measurement | `metric` | Mandatory | Allowed values: `Grams`, `Kilograms`, `Tonnes`. |
| Weight - amount | `amount` | Mandatory | Positive numeric value. |
| Is the waste weight estimated? | `isEstimate` | Mandatory | Strict boolean value. |

## POPs Data

| Data field | API field | Mandatory or optional | Implemented validation / description |
| --- | --- | --- | --- |
| Does the waste contain persistent organic pollutants (POPs)? | `wasteItems[].containsPops` | Mandatory | Strict boolean value. If `true`, POPs source information must be provided. |
| Source of POPs component information | `wasteItems[].pops.sourceOfComponents` | Conditional | Required when `containsPops` is `true`. Allowed values: `PROVIDED_WITH_WASTE`, `GUIDANCE`, `OWN_TESTING`, `NOT_PROVIDED`. |
| POP components | `wasteItems[].pops.components` | Conditional | Required when `sourceOfComponents` is `GUIDANCE` or `OWN_TESTING`. May be omitted when `sourceOfComponents` is `PROVIDED_WITH_WASTE`. Must not be supplied as a populated array when `containsPops` is `false` or when `sourceOfComponents` is `NOT_PROVIDED`. |
| POP code | `wasteItems[].pops.components[].code` | Mandatory when component supplied | Must be a valid POP code from reference data. |
| POP concentration value | `wasteItems[].pops.components[].concentration` | Optional | If supplied, must be a positive numeric value. May be `null`. |

## Hazardous Waste Data

| Data field | API field | Mandatory or optional | Implemented validation / description |
| --- | --- | --- | --- |
| Is the waste hazardous? | `wasteItems[].containsHazardous` | Mandatory | Strict boolean value. If `true`, hazardous source information must be provided. |
| Source of hazardous component information | `wasteItems[].hazardous.sourceOfComponents` | Conditional | Required when `containsHazardous` is `true`. Allowed values: `PROVIDED_WITH_WASTE`, `GUIDANCE`, `OWN_TESTING`, `NOT_PROVIDED`. |
| Hazardous property codes | `wasteItems[].hazardous.hazCodes` | Conditional | Required when `containsHazardous` is `true` and `sourceOfComponents` is supplied. Each item must be a valid hazardous property code. Duplicate values are automatically removed by the implementation. |
| Chemical or biological components | `wasteItems[].hazardous.components` | Conditional | Required when `sourceOfComponents` is `GUIDANCE` or `OWN_TESTING`. May be omitted when `sourceOfComponents` is `PROVIDED_WITH_WASTE`. Must not be supplied as a populated array when `containsHazardous` is `false` or when `sourceOfComponents` is `NOT_PROVIDED`. |
| Chemical or biological component name | `wasteItems[].hazardous.components[].name` | Mandatory when component supplied | Free text component name, for example `Mercury`. |
| Component concentration value | `wasteItems[].hazardous.components[].concentration` | Optional | If supplied, must be a positive numeric value. May be `null`. |

## Disposal or Recovery Codes

| Data field | API field | Mandatory or optional | Implemented validation / description |
| --- | --- | --- | --- |
| Disposal / recovery code | `wasteItems[].disposalOrRecoveryCodes[].code` | Mandatory when D/R code item supplied | Must be one of the configured disposal or recovery codes. The parent `disposalOrRecoveryCodes` array is optional in the current implementation. |
| Weight - unit of measurement | `wasteItems[].disposalOrRecoveryCodes[].weight.metric` | Mandatory when D/R code item supplied | Allowed values: `Grams`, `Kilograms`, `Tonnes`. |
| Weight - amount | `wasteItems[].disposalOrRecoveryCodes[].weight.amount` | Mandatory when D/R code item supplied | Positive numeric value. |
| Is the waste weight estimated? | `wasteItems[].disposalOrRecoveryCodes[].weight.isEstimate` | Mandatory when D/R code item supplied | Strict boolean value. |

## Carrier Details

The top-level `carrier` object is optional in the current implemented schema. If `carrier` is supplied, the following fields are validated.

| Data field | API field | Mandatory or optional | Implemented validation / description |
| --- | --- | --- | --- |
| Carrier registration number | `carrier.registrationNumber` | Mandatory inside supplied carrier object | May be a registration number, `null` or an empty string. If a registration number is supplied, it must match a valid England, SEPA, NRW or NI carrier registration format. |
| Reason for no carrier registration number | `carrier.reasonForNoRegistrationNumber` | Conditional | Required when `carrier.registrationNumber` is `null` or an empty string. Forbidden when a real registration number is supplied. Allowed values: `ON_SITE`, `HOUSEHOLD`, `ONE_OFF`, `MARINE`. |
| Carrier organisation name | `carrier.organisationName` | Mandatory inside supplied carrier object | Carrier organisation name. |
| Carrier address | `carrier.address.fullAddress` | Optional | Optional full address. If the `address` object is supplied, `postcode` is required. |
| Carrier postcode | `carrier.address.postcode` | Mandatory when carrier address supplied | Must match a UK postcode or Irish Eircode. |
| Carrier contact email address | `carrier.emailAddress` | Optional | Must be a valid email address if supplied. |
| Carrier contact phone number | `carrier.phoneNumber` | Optional | Free text. |
| Vehicle registration number | `carrier.vehicleRegistration` | Conditional | Required when `carrier.meansOfTransport` is `Road`. Forbidden for other transport modes. |
| Means of transport | `carrier.meansOfTransport` | Mandatory inside supplied carrier object | Allowed values: `Road`, `Rail`, `Air`, `Sea`, `Inland Waterway`, `Piped`, `Other`. |
| Other means of transport | `carrier.otherMeansOfTransport` | Optional in current schema | Present in the implemented schema but not currently mandatory when `meansOfTransport` is `Other`. |

## Broker or Dealer Details

The top-level `brokerOrDealer` object is optional. If supplied, the following fields are validated.

| Data field | API field | Mandatory or optional | Implemented validation / description |
| --- | --- | --- | --- |
| Broker or dealer organisation name | `brokerOrDealer.organisationName` | Mandatory when broker/dealer object supplied | Required field inside the supplied object. |
| Broker or dealer address | `brokerOrDealer.address.fullAddress` | Optional | Optional full address. If the `address` object is supplied, `postcode` is required. |
| Broker or dealer postcode | `brokerOrDealer.address.postcode` | Mandatory when broker/dealer address supplied | Must match a UK postcode or Irish Eircode. |
| Broker or dealer email | `brokerOrDealer.emailAddress` | Optional | Must be a valid email address if supplied. |
| Broker or dealer phone number | `brokerOrDealer.phoneNumber` | Optional | Free text. |
| Broker or dealer registration number | `brokerOrDealer.registrationNumber` | Optional | Uses the same carrier or broker registration validation as `carrier.registrationNumber`. |

## Waste Receiver Details

| Data field | API field | Mandatory or optional | Implemented validation / description |
| --- | --- | --- | --- |
| Receiver site name | `receiver.siteName` | Mandatory | Receiving site name. |
| Receiver email | `receiver.emailAddress` | Optional | Must be a valid email address if supplied. |
| Receiver phone number | `receiver.phoneNumber` | Optional | Free text. |
| Receiver's authorisation number | `receiver.authorisationNumber` | Mandatory | Must match one of the supported site authorisation number formats. |
| Regulatory position statements | `receiver.regulatoryPositionStatements` | Optional | Array of positive integers. The current implementation expects numeric RPS references rather than free text statements. |

## Receipt

| Data field | API field | Mandatory or optional | Implemented validation / description |
| --- | --- | --- | --- |
| Receipt address | `receipt.address.fullAddress` | Mandatory | Full receipt address. Required here even though full address is optional for carrier and broker/dealer addresses. |
| Receipt postcode | `receipt.address.postcode` | Mandatory | Must match a UK postcode. Irish Eircode format is not accepted for the receipt address in the current implementation. |

## Cross-field business rules

### Hazardous consignment logic

- Hazardous EWC codes are derived from `wasteItems[].ewcCodes`.
- If hazardous EWC codes are present and `hazardousWasteConsignmentCode` is omitted, `reasonForNoConsignmentCode` is mandatory.
- If `hazardousWasteConsignmentCode` is explicitly `null` and no `reasonForNoConsignmentCode` is supplied, validation fails.
- `reasonForNoConsignmentCode` must be one of:
  - `NON_HAZ_WASTE_TRANSFER`
  - `NO_DOC_WITH_WASTE`
  - `HWRC_RECEIPT`

### Carrier registration logic

- If `carrier` is supplied, `carrier.registrationNumber` is required inside the carrier object, but it may be `null` or an empty string.
- If `carrier.registrationNumber` is `null` or an empty string, `carrier.reasonForNoRegistrationNumber` is mandatory.
- If a real carrier registration number is supplied, `carrier.reasonForNoRegistrationNumber` is forbidden.

### Transport logic

- `carrier.vehicleRegistration` is required when `carrier.meansOfTransport` is `Road`.
- `carrier.vehicleRegistration` is forbidden for any other transport mode.
- `carrier.otherMeansOfTransport` exists in the schema but is not currently mandatory when `carrier.meansOfTransport` is `Other`.

### POPs and hazardous detail logic

- `containsPops` and `containsHazardous` are both mandatory booleans on every waste item.
- If either flag is `true`, the corresponding object must provide `sourceOfComponents`.
- For `GUIDANCE` and `OWN_TESTING`, component arrays are required.
- For `PROVIDED_WITH_WASTE`, component arrays may be omitted.
- For `NOT_PROVIDED`, component arrays must not be supplied as populated arrays.
- If the corresponding `contains...` flag is `false`, populated component arrays are not allowed.

## Public API response model

### Create receipt movement response

`POST /movements/receive` returns `201` on success.

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

- `wasteTrackingId` is returned on success.
- `validation` is only returned when warnings exist.
- The route Swagger schema advertises `carrierMovementId`, but the current handler does not populate it.

### Update receipt movement response

`PUT /movements/{wasteTrackingId}/receive` returns `200` on success.

- `{}` when there are no warnings.
- `{"validation":{"warnings":[...]}}` when warnings exist.

### Validation error response

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

Supported `errorType` values:

- `NotProvided`
- `NotAllowed`
- `InvalidType`
- `InvalidFormat`
- `InvalidValue`
- `OutOfRange`
- `BusinessRuleViolation`
- `UnexpectedError`

Update also returns `404` when the movement does not exist.

## Backend persistence notes

The backend route receives a wrapper object:

```json
{
  "movement": {
    "...ReceiveMovementRequest": true
  }
}
```

The backend schema allows either `apiCode` or `submittingOrganisation` and enforces that only one of those identity fields is supplied.

When persisted, the receipt payload is stored under:

```json
{
  "receipt": {
    "movement": {
      "...receipt payload...": true
    }
  }
}
```

The persisted `WasteInput` record may also contain implementation metadata such as `wasteTrackingId`, `submittingOrganisation`, `orgId`, `traceId`, `revision`, `createdAt`, `lastUpdatedAt` and `bulkId`.

## Alignment decisions captured in this update

The following changes were made to align this document with the current implementation:

1. `API Code` now documents the implemented UUID requirement rather than the previously assumed 6-digit receiver code.
2. `carrier` is documented as optional at top level, with mandatory fields only applying when the object is supplied.
3. `disposalOrRecoveryCodes` is documented as optional at waste-item level, matching the current schema.
4. `receiver.siteName` is documented as mandatory.
5. Conditional rules have been added for consignment code, carrier registration, vehicle registration, POPs and hazardous details.
6. `sourceOfComponents` has been added for both POPs and hazardous details.
7. The introduction now makes clear that the current implemented model does not yet include explicit accept/reject outcome fields.

## Open questions for product / policy alignment

These are not blockers for documenting the current implementation, but they are the main decisions to confirm if the implementation needs to move towards the assumed business model.

| Point | Current implementation reflected in this document | Question to confirm |
| --- | --- | --- |
| 1. API Code | `apiCode` is a UUID. | Should the public API really accept a 6-digit receiver code instead, or is the UUID now the intended external identifier? |
| 2. Carrier mandatory status | `carrier` is optional at top level. | Should receipt submissions always require carrier details? |
| 3. Disposal/recovery codes | `disposalOrRecoveryCodes` is optional. | Should the API enforce at least one D/R code per EWC code? |
| 4. Receiver site name | `receiver.siteName` is mandatory. | Should this remain mandatory, or should it be optional/derived from the authorisation number? |
| 5. Conditional validation | Conditional rules are documented as implemented. | Are the current conditionals acceptable for public documentation, especially vehicle registration being required for road transport? |
| 6. POPs/hazardous source fields | `sourceOfComponents` is now documented. | Are these enum labels acceptable as public API values, or should more user-friendly public values be introduced? |
| 7. Accept/reject outcome | No explicit accept/reject fields are currently implemented. | Should rejection/partial rejection be added to this receipt model, or handled by a later endpoint/model? |

## Changelog

You can find the changelog for this document in the [Receipt API v1.0 Data Definitions](https://github.com/DEFRA/waste-tracking-service/wiki/Receipt-API-Data-Definitions) GitHub wiki.

<br/>

Page last updated on May 29th 2026 for alignment with the current implemented receipt API model.
