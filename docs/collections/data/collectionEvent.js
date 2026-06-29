/**
 * Example payloads for the Record Collection event.
 * POST /movements/{movementId}/collection
 *
 * The movementId is a path parameter — not present in the request body.
 * POST appends the next event in the Movement's ordered collection sequence (D-029):
 *   - First active event must be STATIC (producer-to-driver pickup).
 *   - Subsequent active events must be TRANSIT (driver-to-driver handover).
 * Carrier is required at collection time.
 */

// Re-export carrier fixtures so tests can reuse them.
export { carrier } from './creationEvent.js'

import { carrier } from './creationEvent.js'

// Carrier that handed the waste to the second driver on a transit leg.
export const receivedFromCarrier = {
  organisationName: 'First Leg Haulage Ltd',
  registrationNumber: 'CB1234ZZ',
  meansOfTransport: 'Road',
  vehicleRegistration: 'FL21 ABC'
}

// ---------------------------------------------------------------------------
// Sub-objects
// ---------------------------------------------------------------------------

export const collection = {
  address: {
    fullAddress: '10 Industrial Way, Test City',
    postcode: 'TE1 2PQ'
  }
}

// ---------------------------------------------------------------------------
// Request bodies
// ---------------------------------------------------------------------------

// Real-time recording — driver records at the moment of collection
export const publicPostBody = {
  apiCode: '25b14080-5e77-4f91-9957-2482a0cb8775',
  actualDateTimeCollected: '2025-09-15T08:34:00Z', // Actual time of collection
  yourUniqueReference: 'DRIVER-TRIP-001',
  otherReferencesForMovement: [
    {
      label: 'weighbridgeTicket',
      reference: 'WB-20250915-001'
    }
  ],
  isDeleted: false,
  carrier,
  collection
}

// Deferred recording — driver couldn't record at the time (no signal, paper-only site)
// actualDateTimeCollected is still the ACTUAL collection time, not the submission time
export const deferredPostBody = {
  apiCode: '25b14080-5e77-4f91-9957-2482a0cb8775',
  actualDateTimeCollected: '2025-09-15T08:34:00Z',
  yourUniqueReference: 'DRIVER-TRIP-001-DEFERRED',
  isDeleted: false,
  carrier,
  collection
}

// Minimal valid payload — only required fields
export const minimalPostBody = {
  apiCode: '25b14080-5e77-4f91-9957-2482a0cb8775',
  actualDateTimeCollected: '2025-09-15T08:34:00Z',
  isDeleted: false,
  carrier,
  collection
}

// ---------------------------------------------------------------------------
// Transit collection — second driver receives the load from the first (D-029)
// collectionType must be TRANSIT; receivedFromCarrier is required.
// This is a second POST on the same movementId, appending to the sequence.
// ---------------------------------------------------------------------------

export const transitPostBody = {
  apiCode: '25b14080-5e77-4f91-9957-2482a0cb8775',
  actualDateTimeCollected: '2025-09-15T14:10:00Z',
  collectionType: 'TRANSIT',
  yourUniqueReference: 'DRIVER-TRIP-002',
  isDeleted: false,
  carrier: {
    organisationName: 'Second Leg Haulage Ltd',
    registrationNumber: 'CB5678YY',
    meansOfTransport: 'Road',
    vehicleRegistration: 'SL21 DEF'
  },
  receivedFromCarrier,
  collection
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
