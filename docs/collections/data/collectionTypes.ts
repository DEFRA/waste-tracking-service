/**
 * TypeScript types for the Record Collection event.
 * POST /movements/{movementId}/collection → 201 (no new ID minted)
 *
 * A Movement carries one or more ordered collection events (D-029):
 *   - First active event must be STATIC (producer-to-driver pickup).
 *   - Every subsequent active event must be TRANSIT (driver-to-driver handover).
 * POST appends the next event; PUT corrects/soft-deletes the latest active event.
 * The sequence is closed once the Movement appears in a Drop-off's movementIds.
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
// Collection type (D-029)
// ---------------------------------------------------------------------------

/** STATIC = producer-to-driver pickup (first event). TRANSIT = driver-to-driver handover. */
export type CollectionType = 'STATIC' | 'TRANSIT'

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

  /**
   * STATIC = producer-to-driver pickup (first event, default).
   * TRANSIT = driver-to-driver handover (D-029). Optional; defaults to STATIC when omitted.
   */
  collectionType?: CollectionType

  yourUniqueReference?: string
  otherReferencesForMovement?: OtherReferenceForMovement[]

  /**
   * Soft-delete flag (D-009). Defaults to false on creation.
   * Only the latest active event in the sequence may be soft-deleted (tail-peel, D-029).
   * May be set to true only via PUT. Must not be supplied as true on POST.
   * Cannot be set once the Movement has been referenced in a Drop-off.
   */
  isDeleted?: boolean

  /** Carrier performing this collection event. Required at collection time. */
  carrier: CarrierDetails

  /**
   * The carrier this Movement was received from on a TRANSIT handover (D-029).
   * Same shape as carrier. Required when collectionType is TRANSIT; must not be
   * provided when collectionType is STATIC. Not cross-checked against the
   * preceding event's carrier — captured for the record only.
   */
  receivedFromCarrier?: CarrierDetails

  /** Collection site details. */
  collection: Collection
}

/** Collection events return a validation envelope only — no new ID is minted. */
export type RecordCollectionResponse = {
  validation?: {
    warnings?: ValidationResult[]
  }
}
