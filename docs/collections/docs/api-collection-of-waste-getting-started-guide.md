---
title: Getting Started Guide
---

!!! Info
    Currently in development

#  Collections API - Getting Started Guide

The Collections API covers Phase 2, the end-to-end collection of waste. It enables global digital waste tracking from waste movement creation through to collection, drop‑off (transfer) and receipt.

## Overview

The **Collections API** allows carriers, brokers, and software vendors to digitally record the moment waste is collected from a producer or during a driver‑to‑driver handover. It forms the second stage of the Digital Waste Tracking Project.

[![Phase 2](dwt-diagram1.png)](dwt-diagram1.png)

This page provides a developer‑friendly guide to the endpoints, data structures, workflows, and validation rules found within the Collection API.

## API Status

!!! Warning
    This version of the Waste Collection API is currently in alpha and evolving alongside user research.

## Core Concepts

The core concepts of the Collections API are:

- The Movement creation event
- The Collection event
- The Transfer of Waste/Drop Off event
- The Receipt of Waste event

### Movement Creation Event
A Movement represents creation of a complete end-to-end planned waste journey. It's created via `POST /movements` which return a server‑minted **movementId**.

### Collection Event
A single recording event where waste passes into a driver’s care. Each Movement has **exactly one** collection. It uses the **MovementId** as a URL path parameter.

**Note:** A Movement has exactly one collection event. Multi‑collection journeys are represented by multiple Movements.

### Transfer/Drop Off Event
A transfer is a drop‑off at a receiver site. At this stage the **transferId** is minted.

**Note:** Non‑hazardous Movements may be aggregated into a single Transfer.

### Receipt Event
Receiver confirms acceptance of waste linked to the **transferId**. It uses it as a URL path parameter.

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mermaid Diagram Example</title>
    <!-- Load Mermaid from CDN -->
    <script type="module">
        import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";
        // Initialize Mermaid
        mermaid.initialize({ startOnLoad: true });
    </script>
</head>
<body>
    <h3>Wasteflow diagram showing multiple movements and collections</h3>
    <div class="mermaid">

flowchart TD

    M1["Movement A<br/>WM-2026-000001234"]
    M2["Movement B<br/>WM-2026-000001235"]
    M3["Movement C<br/>WM-2026-000001236"]

    C1["Collection"]
    C2["Collection"]
    C3["Collection"]

    T["Transfer<br/>TR-2026-000005678"]

    R["Receipt"]

    F["Fate of Waste"]

    M1 --> C1 --> T
    M2 --> C2 --> T
    M3 --> C3 --> T

    T --> R

    R --> F 
</div>
</body>
</html>

## Key Points

- Currently in Alpha   
- Uses the Phase 1 validation envelope  
- `movementId` and `transferId` are consistent across the API  
- Features may change — check the changelog when published. 

## Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/movements` | Create a Movement |
| GET | `/movements/{movementId}` | Retrieve Movement |
| PUT | `/movements/{movementId}` | Update Movement |
| POST | `/movements/{movementId}/collection` | Record collection |
| PUT | `/movements/{movementId}/collection` | Update collection |
| GET | `/movements/{movementId}/collection` | Retrieve collection |

## Authentication

Use OAuth 2.0 Bearer tokens.

```http
Authorization: Bearer <token>
Content-Type: application/json
```

Click this link for the [API Authentication Guide](api-authentication-guide.md)
## Base URLs

```text
Test:       waste-tracking.integration.api.defra.gov.uk
Production: waste-tracking.api.defra.gov.uk
```

## Workflow: Movement → Collection → Transfer → Receipt

### 1. Create a Movement

```http
POST /movements
```

**Example request**

```json
{
  "wasteClassification": {},
  "hazardousDetails": {},
  "popsDetails": {},
  "producerDetails": {
    "organisationName": "Producer Org"
  },
  "carrierDetails": {
    "organisationName": "Carrier Ltd"
  }
}
```

**Example response**

```json
{
  "movementId": "WM-2026-000001234",
  "validation": 
    { "warnings": [] }
}
```

### 2. Record the Collection

```http
POST /movements/{movementId}/collection
```

**Example request**

```json
{
  "collectionDateTime": "2026-07-01T09:15:00Z",
  "carrierDetails": { "organisationName": "Carrier Ltd" },
  "collectionAddress": {
    "fullAddress": "Unit 5, Business Park, Sampletown",
    "postcode": "AB1 2CD"
  },
  "driverDetails": { "name": "Alex Driver" },
  "actualWaste": {}
}
```

### 3. Update the Collection

```http
PUT /movements/{movementId}/collection
```

**Example request**

```json
{
  "collectionDateTime": "2026-07-01T10:05:00Z",
  "carrierDetails": { "organisationName": "Carrier Ltd" },
  "collectionAddress": {
    "fullAddress": "Unit 5, Business Park, Sampletown",
    "postcode": "AB1 2CD"
  },
  "driverDetails": { "name": "Jordan Lee" }
}
```

### 4. Retrieve the Collection

```http
GET /movements/{movementId}/collection
```

**Example response**

```json
{
  "collectionDateTime": "2026-07-01T10:05:00Z",
  "carrierDetails": { "organisationName": "Carrier Ltd" },
  "collectionAddress": {
    "fullAddress": "Unit 5, Business Park, Sampletown",
    "postcode": "AB1 2CD"
  },
  "driverDetails": { "name": "Jordan Lee" },
  "actualWaste": {}
}
```

### 5. Record a Transfer (drop-off)

A Transfer records a delivery of one or more Movements to a receiving site.
When the Transfer is successfully recorded, the API generates a Transfer ID.

```http
POST /transfers
```

**Example Request**

```json

{
  "dropOffDateTime": "2026-07-01T14:30:00Z",
  "movementIds": [
    "WM-2026-000001234"
  ],
  "dropOffAddress": {
    "fullAddress": "Sample Waste Facility, Industrial Estate",
    "postcode": "XY1 9ZZ"
  },
  "carrierDetails": {
    "organisationName": "Carrier Ltd",
    "registrationNumber": "CBDU123456"
  },
  "driverDetails": {
    "name": "Alex Driver"
  }
}
```

**Example Response**

```json
{
  "transferId": "TR-2026-000005678",
  "validation": {
    "warnings": []
  }
}
```

## Data Model Summary

### Required Fields (CollectionRequest)
- `collectionDateTime` (ISO 8601)
- `carrierDetails`

### Optional Fields
- `collectionAddress`
- `driverDetails`
- `actualWaste`

### Identifiers
- **MovementId** — opaque, do not parse  
- **TransferId** — minted at drop‑off  

## Validation & Error Handling

!!! info
    4xx responses include errors with key, errorType, message… aligned to Phase 1 vocabulary.

### Example 400 Bad Request

```json
{
  "validation": {
    "errors": [
      {
        "key": "collectionDateTime",
        "errorType": "InvalidFormat",
        "message": "\"collectionDateTime\" must be an ISO 8601 date-time"
      }
    ]
  }
}
```

### 404 Not Found
Returned if:
- Movement does not exist  
- Collection not yet recorded  

## Rate Limits

- Soft limit: **200 requests per second**
- Short bursts tolerated  
- Sustained excess → HTTP 429  

Implement exponential backoff.

## Developer Prerequisites

- Complete onboarding  
- Obtain client ID & secret  
- Request OAuth token  
- Acquire test API Code  
- Pass Production Approval Tests  

## Support

- Developers: **WasteTracking_Developers@defra.gov.uk**  
- Receivers: **WasteTracking_Testing@defra.gov.uk**  
