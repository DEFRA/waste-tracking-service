/**
 * TypeScript types for the Record Collection event.
 * POST /movements/{movementId}/collection → 201 (no new ID minted)
 *
 * The collection event records the physical pickup of waste at the producer
 * site. It is 1:1 with its parent Movement and is addressed via the
 * Movement ID in the URL path (D-015).
 *
 * Only actual weights are captured here — the full waste classification
 * (EWC codes, description, form, containers, haz/POPs) was declared at
 * Creation and is not repeated. wasteItems here correspond by position to
 * the wasteItems declared on the Movement.
 *
 * actualDateTimeCollected must be the actual time of collection, not the time
 * this record is submitted. For deferred recording, callers back-fill
 * the correct time.
 */

export type {
  MeansOfTransport,
  CarrierReasonForNoRegistrationNumber,
  OtherReferenceForMovement,
  Weight,
  WeightMetric,
  BusinessAddress,
  CarrierDetails,
  ValidationResult
} from './sharedTypes.js'

import type {
  OtherReferenceForMovement,
  Weight,
  CarrierDetails,
  ValidationResult
} from './sharedTypes.js'

// ---------------------------------------------------------------------------
// Collection site
// ---------------------------------------------------------------------------

export type CollectionAddress = {
  postcode: string
  fullAddress: string
}

export type Collection = {
  /** Address where the waste was physically collected. */
  address: CollectionAddress
}

// ---------------------------------------------------------------------------
// Waste item at collection
// ---------------------------------------------------------------------------

/**
 * Actual weight of a single waste item recorded at collection.
 * Corresponds by position to the wasteItems array on the parent Movement.
 * Full waste classification details are on the Movement and are not repeated here.
 */
export type CollectionWasteItem = {
  /** Actual weight measured at collection. Set isEstimate: false when weighed; true for kerbside estimates. */
  weight: Weight
}

// ---------------------------------------------------------------------------
// Record Collection request / response
// ---------------------------------------------------------------------------

export type RecordCollection = {
  /** Unique identifier of the submitting organisation produced by the Waste Tracking Service registration process. */
  apiCode: string

  /** Actual date and time waste was collected. ISO 8601. */
  actualDateTimeCollected: string

  yourUniqueReference?: string
  specialHandlingRequirements?: string
  otherReferencesForMovement?: OtherReferenceForMovement[]

  /** Carrier details confirmed at collection. Required at collection time. */
  carrier: CarrierDetails

  /** Collection site details. */
  collection: Collection

  /** Actual weights per waste item. One entry per waste item on the Movement, in creation order. */
  wasteItems: CollectionWasteItem[]
}

/** Collection events return a validation envelope only — no new ID is minted. */
export type RecordCollectionResponse = {
  validation?: {
    warnings?: ValidationResult[]
  }
}
