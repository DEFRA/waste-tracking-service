/**
 * TypeScript types for the Record Drop-off event.
 * POST /transfers → 201 with transferId
 *
 * The drop-off event records the carrier-declared place where one or more
 * Movements are dropped off or left. It mints a Transfer ID that may be used
 * by an official receiver to record a receipt, but a receipt event may not
 * always follow — for example, when waste is dropped at an exempt place.
 *
 * Key design decisions:
 *   D-007 — drop-off aggregates one or more Movement IDs (movementIds array)
 *   D-010 — hazardous waste: exactly one Movement ID per drop-off
 *   D-012 — Transfer ID is the only public identifier minted here
 *   D-013 — Transfer ID is an 8-character year-prefixed sqid
 *
 * Note: receiver details are NOT on the drop-off. The drop-off place is a
 * lighter site model declared by the carrier and is distinct from the official
 * receiver site used by POST /transfers/{transferId}/receipt. A receipt may
 * not always follow a drop-off.
 */

export type {
  MeansOfTransport,
  CarrierReasonForNoRegistrationNumber,
  OtherReferenceForMovement,
  CarrierDetails,
  ValidationResult
} from './sharedTypes.js'

import type {
  OtherReferenceForMovement,
  CarrierDetails,
  ValidationResult
} from './sharedTypes.js'

// ---------------------------------------------------------------------------
// Drop-off site
// ---------------------------------------------------------------------------

export type DropOffAddress = {
  postcode: string
  fullAddress: string
}

/**
 * Drop-off place declared by the carrier.
 *
 * This is not necessarily an official receiver site and does not require a
 * receiver authorisation number. Some drop-offs may be to exempt places that
 * store, treat, use or dispose of waste, in which case exemptionNumber may be
 * supplied. A receipt event may not always follow a drop-off.
 */
export type DropOff = {
  /** Name of the carrier-declared site/place where the waste is dropped off or left. */
  siteName: string

  /**
   * Optional exemption number for exempt places that store, treat, use or dispose of waste.
   * For example, a WEX number. Distinct from receiver.authorisationNumber.
   */
  exemptionNumber?: string

  /** Mandatory physical address where the waste was dropped off. Both fullAddress and postcode are required. */
  address: DropOffAddress
}

// ---------------------------------------------------------------------------
// Record Drop-off request / response
// ---------------------------------------------------------------------------

export type RecordDropOff = {
  /** Unique identifier of the submitting organisation produced by registration. */
  apiCode: string

  /**
   * One or more Movement IDs delivered in this drop-off.
   * - Single-collection runs: array of one.
   * - Multi-collection runs: all Movement IDs delivered together at the same site.
   * - Hazardous waste (D-010): exactly one Movement ID is allowed per drop-off.
   */
  movementIds: string[]

  /** Actual date and time of the drop-off. ISO 8601. */
  actualDateTimeDropOff: string

  yourUniqueReference?: string
  otherReferencesForMovement?: OtherReferenceForMovement[]

  /**
   * Soft-delete flag (D-009). Defaults to false on creation.
   * May be set to true only via PUT. Supplying true on a POST returns a validation
   * warning and the value is treated as false by the service layer.
   * Cannot be set to true once a Receipt has been recorded against this Transfer.
   */
  isDeleted?: boolean

  /** Carrier performing the drop-off. Required and aligned to Collection/Receipt carrier rules. */
  carrier: CarrierDetails

  /** Carrier-declared drop-off place details. This is a lighter site model than the receipt receiver. */
  dropOff: DropOff
}

export type RecordDropOffResponse = {
  /**
   * The Transfer ID minted by the server.
   * 8-character year-prefixed sqid (D-013).
   * The driver may pass this value to the receiver so they can record
   * the receipt via POST /transfers/{transferId}/receipt, where applicable.
   */
  transferId: string
  /**
   * Optional validation warnings. For now, server-side business-rule checks
   * such as hazardous aggregation may be surfaced as BusinessRuleViolation warnings.
   */
  validation?: {
    warnings?: ValidationResult[]
  }
}

// ---------------------------------------------------------------------------
// Update Drop-off — PUT /transfers/{transferId}
//
// A recorded drop-off is immutable except for soft-delete (D-017). The PUT body
// is restricted to apiCode (caller identity) and isDeleted (D-009); any other
// field is rejected (NotAllowed). To correct a drop-off, soft-delete it and
// record a fresh one via POST /transfers.
// ---------------------------------------------------------------------------

export type UpdateDropOff = {
  /** Unique identifier of the submitting organisation produced by registration. Caller identity only. */
  apiCode: string

  /**
   * Soft-delete flag (D-009) — the only property that may change on a recorded
   * drop-off (D-017). true soft-deletes the transfer; false restores it. Cannot
   * be set to true once a Receipt has been recorded against this Transfer.
   */
  isDeleted: boolean
}

export type UpdateDropOffResponse = {
  /** Validation envelope only — the updated record is not echoed (the identifier is in the path). */
  validation?: {
    warnings?: ValidationResult[]
  }
}