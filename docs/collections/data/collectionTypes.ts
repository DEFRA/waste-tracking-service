/**
 * TypeScript types for the Record Collection event.
 * POST /movements/{movementId}/collection → 201 (no new ID minted)
 *
 * The collection event records the physical pickup of waste at the producer
 * site. It is 1:1 with its parent Movement and is addressed via the
 * Movement ID in the URL path (D-015).
 *
 * actualDateTimeCollected must be the actual time of collection, not the time
 * this record is submitted. For deferred recording, callers back-fill
 * the correct time.
 */

export type {
  MeansOfTransport,
  CarrierReasonForNoRegistrationNumber,
  OtherReferenceForMovement,
  BusinessAddress,
  CarrierDetails,
  ValidationResult
} from './sharedTypes.js'

import type {
  OtherReferenceForMovement,
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

  /**
   * Soft-delete flag (D-009). Defaults to false on creation.
   * May be set to true only via PUT. Supplying true on a POST returns a validation
   * warning and the value is treated as false by the service layer.
   * Cannot be set to true once the parent Movement has been referenced in a Drop-off.
   */
  isDeleted?: boolean

  /** Carrier details confirmed at collection. Required at collection time. */
  carrier: CarrierDetails

  /** Collection site details. */
  collection: Collection
}

/** Collection events return a validation envelope only — no new ID is minted. */
export type RecordCollectionResponse = {
  validation?: {
    warnings?: ValidationResult[]
  }
}
