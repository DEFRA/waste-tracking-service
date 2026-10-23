# Error Handling in Waste Tracking Journeys

## Overview

In a real-world waste journey, errors and warnings can occur at any stage.

The Digital Waste Tracking API is designed to support both:

- **Technical validation errors** that prevent a record being created or updated.
- **Business validation warnings** where a record is accepted but the user should review the information provided.

Understanding when to stop processing and when to continue is important for software developers integrating with the service.

---

# Validation Model

The API uses a common validation structure throughout the journey.

## Error Response

Errors prevent the operation from succeeding.

Example:

```json
{
  "validation": {
    "errors": [
      {
        "key": "carrier.registrationNumber",
        "errorType": "NotProvided",
        "message": "\"carrier.registrationNumber\" is required"
      }
    ]
  }
}
```

Typical response:

```http
400 Bad Request
```

---

## Warning Response

Warnings allow the operation to succeed.

Example:

```json
{
  "movementId": "WM-2026-000001234",
  "validation": {
    "warnings": [
      {
        "key": "hazardousDetails",
        "errorType": "BusinessRuleViolation",
        "message": "Hazardous component information is recommended but not provided"
      }
    ]
  }
}
```

Typical response:

```http
201 Created
```

or

```http
200 OK
```

The resource has been recorded successfully.

---

# Error Types

The API defines several standard validation types.

| Error Type | Meaning |
|------------|----------|
| NotProvided | Required field missing |
| NotAllowed | Field supplied when not permitted |
| InvalidType | Wrong data type |
| InvalidFormat | Incorrect format |
| InvalidValue | Value fails validation |
| OutOfRange | Numeric value outside limits |
| BusinessRuleViolation | Business rule not satisfied |

Example:

```json
{
  "key": "wasteItems[0].weight.amount",
  "errorType": "OutOfRange",
  "message": "Weight must be greater than zero"
}
```

---

# Journey-Level Error Handling

## Step 1 – Movement Creation

```text
Create Movement
      │
      ▼
Movement ID
```

### Common Errors

#### Missing carrier details

```json
{
  "validation": {
    "errors": [
      {
        "key": "carrierDetails",
        "errorType": "NotProvided"
      }
    ]
  }
}
```

Result:

```text
Movement NOT created
Movement ID NOT issued
```

---

#### Invalid registration number

```json
{
  "validation": {
    "errors": [
      {
        "key": "carrierDetails.registrationNumber",
        "errorType": "InvalidFormat"
      }
    ]
  }
}
```

Result:

```text
Movement NOT created
```

---

# Step 2 – Collection Recording

```text
Movement
   │
   ▼
Collection
```

Endpoint:

```http
POST /movements/{movementId}/collection
```

### Common Errors

#### Unknown Movement ID

```http
404 Not Found
```

Example:

```text
WM-2026-999999999
```

does not exist.

Result:

```text
Collection NOT recorded
```

---

#### Invalid collection date

```json
{
  "validation": {
    "errors": [
      {
        "key": "collectionDateTime",
        "errorType": "InvalidFormat"
      }
    ]
  }
}
```

Result:

```text
Collection NOT recorded
```

---

# Step 3 – Transfer Creation

```text
Movement(s)
      │
      ▼
Transfer
```

Endpoint:

```http
POST /transfers
```

### Common Errors

#### Unknown Movement ID

```json
{
  "validation": {
    "errors": [
      {
        "key": "movementIds[0]",
        "errorType": "InvalidValue"
      }
    ]
  }
}
```

Result:

```text
Transfer NOT created
Transfer ID NOT issued
```

---

## Hazardous Waste Validation

Suppose:

```text
WM-001  (Hazardous)
WM-002  (Non-hazardous)
```

Attempt:

```json
{
  "movementIds": [
    "WM-001",
    "WM-002"
  ]
}
```

Response:

```json
{
  "validation": {
    "errors": [
      {
        "key": "movementIds",
        "errorType": "BusinessRuleViolation",
        "message": "Hazardous movements must be delivered in a single-movement Transfer"
      }
    ]
  }
}
```

Result:

```text
Transfer NOT created
```

---

# Step 4 – Receipt Recording

```text
Transfer
    │
    ▼
Receipt
```

Endpoint:

```http
POST /transfers/{transferId}/receipt
```

---

## Transfer Not Found

```http
404 Not Found
```

Result:

```text
Receipt NOT recorded
```

---

## Carrier Mismatch Warning

Transfer contains:

```text
CBDU123456
```

Receipt contains:

```text
CBDU654321
```

Response:

```json
{
  "validation": {
    "warnings": [
      {
        "key": "carrier.registrationNumber",
        "errorType": "BusinessRuleViolation",
        "message": "Carrier details differ from recorded drop-off"
      }
    ]
  }
}
```

Result:

```text
Receipt recorded
Warning returned
```

This is an important distinction.

The receipt succeeds despite the inconsistency.

---

## Waste Detail Difference Warning

Transfer contains:

```text
Food Waste
```

Receipt contains:

```text
Mixed Municipal Waste
```

Response:

```json
{
  "validation": {
    "warnings": [
      {
        "key": "wasteItems",
        "errorType": "BusinessRuleViolation",
        "message": "Waste details differ from drop-off record"
      }
    ]
  }
}
```

Result:

```text
Receipt recorded
Warning returned
```

---

# Step 5 – Fate of Waste Queries

```text
Movement
     │
     ▼
Fate of Waste
```

Endpoint:

```http
GET /movements/{movementId}/fate-of-waste
```

### Common Errors

#### Movement ID Not Found

```http
404 Not Found
```

Response:

```json
{
  "message": "Movement not found"
}
```

Result:

```text
No fate-of-waste information available
```

---

# Recoverable vs Non-Recoverable Errors

## Recoverable

The user can correct data and retry.

Examples:

```text
Missing postcode
Invalid EWC code
Missing carrier registration
Invalid date format
```

Typical response:

```http
400 Bad Request
```

User action:

```text
Correct data
Submit again
```

---

## Non-Recoverable

The requested resource cannot be found.

Examples:

```text
Movement ID does not exist
Transfer ID does not exist
Receipt not found
```

Typical response:

```http
404 Not Found
```

User action:

```text
Verify identifier
Locate correct record
Retry
```

---

# Recommended Software Behaviour

## For Errors

Display:

```text
Operation failed.
Please correct the highlighted fields.
```

Show each validation error against the relevant field.

Do not continue the workflow until the issue is resolved.

---

## For Warnings

Display:

```text
Operation completed with warnings.
```

Allow the workflow to continue.

Present the warning details to the user.

Example:

```text
✓ Receipt recorded

Warning:
Carrier differs from the carrier recorded in the associated Transfer.
```

---

# End-to-End Error Handling Example

```text
Create Movement
       │
       ▼
   Success
       │
       ▼

Record Collection
       │
       ▼
   Success
       │
       ▼

Create Transfer
       │
       ▼
Business Rule Violation
(Hazardous Waste Mixed)

       │
       ▼

Transfer NOT created

       │
Correct problem
       ▼

Create Transfer
       │
       ▼
Transfer Created

       │
       ▼

Record Receipt
       │
       ▼
Success with Warning

       │
       ▼

Receipt Stored
```

---

# Key Principles

```text
400 Bad Request
=
Validation Error
Record not created

404 Not Found
=
Resource does not exist

200/201 with Warnings
=
Record created or updated
but requires user review
```

Software integrations should always:

1. Check the HTTP status code.
2. Parse validation errors.
3. Parse validation warnings.
4. Display meaningful messages to users.
5. Never assume a successful response contains no warnings.
6. Treat warnings as informational and errors as blocking.