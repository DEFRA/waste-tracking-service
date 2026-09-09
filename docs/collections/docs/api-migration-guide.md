# Migration Guide: Receipt of Waste API → Collections API

!!! info
    *“The Collections API sits within the Phase 2 ‘Complete Collection of Waste’ scope. It complements the Phase 1 Receipt of Waste API by enabling end‑to‑end tracking from creation through collection, drop‑off (transfer) and receipt.”*

This guide explains how to migrate or extend an existing **Receipt of Waste API** integration to support the new **Collections API** introduced in Phase 2. It covers conceptual differences, endpoint changes, data model updates, business rules, and recommended migration steps.

---

## 1. Overview

Phase 1 (Receipt API) focused solely on the **final stage** of the waste journey: the receiver recording a receipt. Phase 2 introduces the **Movement** and **Collection** stages, enabling full Collection tracking.

The new workflow becomes:

Movement → Collection → Transfer → Receipt

---

## 2. Conceptual Differences

### Phase 1 — Receipt API
- Only covers the **receipt** stage.
- Assumes a Transfer already exists.
- No concept of Movement or Collection.
- Validation envelope established here.

### Phase 2 — Collections API
- Adds **Movement** creation.
- Adds **Collection** recording.
- Supports full end‑to‑end Collection.
- Reuses Phase 1 validation envelope.

> *“One Movement has exactly one collection event… Multi‑collection journeys are represented by multiple Movements.”*

---

## 3. Identifier Changes

| Identifier | Phase 1 | Phase 2 |
|-----------|----------|----------|
| MovementId | ❌ Not used | ✔️ Introduced; minted on POST /movements |
| TransferId | ✔️ Used | ✔️ Still used; may link multiple Movements |
| ReceiptId | ✔️ Used | ✔️ Unchanged |

MovementId is **opaque** and must not be parsed.

> *“MovementId: server‑minted, opaque… Do not parse.”*

---

## 4. Endpoint Comparison

### Phase 1 — Receipt API
- POST /receipts  
- GET /receipts/{id}  
- GET /transfers/{id}

### Phase 2 — Collections API
- POST /movements  
- GET /movements/{movementId}  
- PUT /movements/{movementId}  
- POST /movements/{movementId}/collection  
- PUT /movements/{movementId}/collection  
- GET /movements/{movementId}/collection  

### Migration Impact
- Receipt API remains unchanged.
- New Movement + Collection steps must be added **before** Transfer + Receipt.

---

## 5. Data Model Differences

### Phase 1
- Focused on Transfer and Receipt details.

### Phase 2
Adds:
- Movement  
- CollectionRequest  
- CollectionResource  

### Required for Collection
- `collectionDateTime` (ISO 8601)  
- `carrierDetails`

> *“Required: collectionDateTime (ISO 8601), carrierDetails.”*

### Optional
- collectionAddress  
- driverDetails  
- actualWaste  

### Migration Impact
Software must now:
- Store MovementIds.
- Capture collection timestamps.
- Capture driver and pickup address.
- Handle optional actual waste observations.

## 6. Business Rule Changes

### Phase 1
- Transfer must exist before Receipt.
- Hazardous rules apply at receipt stage.

### Phase 2
- Exactly **one** collection per Movement.
- Multi‑pickup routes require multiple Movements.
- Hazardous Movements **cannot** be aggregated.

> **If any linked Movement is hazardous, a Transfer must cover exactly one Movement.**

---

## 7. Validation & Error Handling

Both APIs use the **Phase 1 validation envelope**, including:
- `warnings`
- `errors`
- `errorType` values such as `NotProvided`, `InvalidFormat`, `BusinessRuleViolation`

> *“Reuses the Phase 1 validation envelope (warnings/errors vocabulary).”*

### Example 400
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

---

8. Authentication & Onboarding
No changes:

OAuth 2.0 Bearer tokens

Client ID + secret

API Codes

9. Required Developer Changes
Carriers/Brokers
Add Movement creation.

Add Collection recording.

Store MovementIds.

Capture driver + pickup details.

Receivers
Minimal changes.

Must accept Transfers referencing multiple MovementIds.

Software Vendors
Update data models.

Update workflows.

Enforce one‑collection‑per‑Movement.

Update hazardous aggregation logic.

10. Recommended Migration Strategy
Step 1 — Add Movement support
Implement POST + GET /movements.

Step 2 — Add Collection support
Implement POST + PUT + GET /movements/{movementId}/collection.

Step 3 — Update Transfer logic
Allow multiple MovementIds for non‑hazardous.

Enforce 1:1 for hazardous.

Step 4 — Keep Receipt API unchanged
No migration required.

Step 5 — Run Production Approval Tests
Validates Movement → Collection → Transfer → Receipt.

| Area | Receipt API (Phase 1) | Collections API (Phase 2) | Migration Impact |
| --- | --- | --- | --- |
| Collection stage | Receipt only | Movement + Collection | Add two new stages |
| Identifiers | TransferId, ReceiptId | MovementId, TransferId | Store MovementId |
| Required data | Receipt details | Collection timestamp + carrier | Add new fields |
| Hazardous rules | At receipt | At transfer | Update aggregation logic |
| Validation | Phase 1 envelope | Same envelope | Reuse logic |
| Authentication | OAuth2 | OAuth2 | No change |
| Client changes | Minimal | Significant | Update workflows |

12. Support
Developers: WasteTracking_Developers@defra.gov.uk

Receivers: WasteTracking_Testing@defra.gov.uk