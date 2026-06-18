/**
 * Example payloads for the Record Collection event.
 * POST /movements/{movementId}/collection
 *
 * The movementId is a path parameter — not present in the request body.
 * Carrier is required at collection time.
 */

// Re-export the carrier fixture from creation so tests can reuse it.
export { carrier } from './creationEvent.js'

import { carrier } from './creationEvent.js'

// ---------------------------------------------------------------------------
// Sub-objects
// ---------------------------------------------------------------------------

export const collection = {
  address: {
    fullAddress: '10 Industrial Way, Test City',
    postcode: 'TE1 2PQ'
  }
}

/**
 * Actual weights per waste item.
 * One entry per item declared at creation, in the same order.
 * The 0.5t estimate at creation was adjusted to 0.48t on collection.
 */
export const wasteItems = [
  {
    weight: {
      metric: 'Tonnes',
      amount: 0.48,
      isEstimate: false // Weighed at collection
    }
  }
]

// ---------------------------------------------------------------------------
// Request bodies
// ---------------------------------------------------------------------------

// Real-time recording — driver records at the moment of collection
export const publicPostBody = {
  apiCode: '25b14080-5e77-4f91-9957-2482a0cb8775',
  actualDateTimeCollected: '2025-09-15T08:34:00Z', // Actual time of collection
  yourUniqueReference: 'DRIVER-TRIP-001',
  specialHandlingRequirements: 'Handle with care and keep upright.',
  otherReferencesForMovement: [
    {
      label: 'weighbridgeTicket',
      reference: 'WB-20250915-001'
    }
  ],
  isDeleted: false,
  carrier,
  collection,
  wasteItems
}

// Deferred recording — driver couldn't record at the time (no signal, paper-only site)
// actualDateTimeCollected is still the ACTUAL collection time, not the submission time
export const deferredPostBody = {
  apiCode: '25b14080-5e77-4f91-9957-2482a0cb8775',
  actualDateTimeCollected: '2025-09-15T08:34:00Z',
  yourUniqueReference: 'DRIVER-TRIP-001-DEFERRED',
  isDeleted: false,
  carrier,
  collection,
  wasteItems
}

// Minimal valid payload — only required fields
export const minimalPostBody = {
  apiCode: '25b14080-5e77-4f91-9957-2482a0cb8775',
  actualDateTimeCollected: '2025-09-15T08:34:00Z',
  isDeleted: false,
  carrier,
  collection,
  wasteItems
}

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

// Success — no new identifier minted; movement addressed by path movementId
export const recordCollectionResponse = {} // 201 Created, empty body on success

export const recordCollectionResponseWithWarnings = {
  validation: {
    warnings: [
      {
        key: 'carrier.registrationNumber',
        errorType: 'NotProvided',
        message: 'Carrier registration number was not provided at collection.'
      }
    ]
  }
}

// ---------------------------------------------------------------------------
// 404 shape (D-014) — distinguishes missing movement from unrecorded collection
// ---------------------------------------------------------------------------

export const movementNotFoundError = {
  code: 'MOVEMENT_NOT_FOUND',
  message: 'No movement found for the provided movementId.'
}

export const collectionNotYetRecordedError = {
  code: 'COLLECTION_NOT_RECORDED',
  message: 'No collection has been recorded for this movement yet.'
}
