/**
 * Joi validation schema for the Record Collection event.
 * POST /movements/{movementId}/collection → 201 (validation envelope only)
 *
 * The movementId is validated as a path parameter by the route — not
 * included in this request body schema.
 *
 * Key behaviours:
 * - apiCode is mandatory, matching the registered submitting organisation.
 * - actualDateTimeCollected must be the actual collection time, not submission time.
 * - collectionType is optional; defaults to STATIC. TRANSIT records a driver-to-driver handover (D-029).
 * - receivedFromCarrier is required when collectionType is TRANSIT; forbidden when STATIC. Enforced server-side.
 * - carrier is mandatory at collection time.
 * - collection.address is mandatory and contains postcode and fullAddress.
 */

import Joi from 'joi'
import {
  businessAddressSchema,
  otherReferenceSchema,
  carrierSchema
} from './sharedSchemas.js'

// ---------------------------------------------------------------------------
// Collection site
// ---------------------------------------------------------------------------

const collectionAddressSchema = businessAddressSchema
  .keys({
    fullAddress: Joi.string()
      .required()
      .description('Full address where the waste was physically collected.')
  })
  .required()
  .description('Collection address. Both postcode and fullAddress are required.')

const collectionSchema = Joi.object({
  address: collectionAddressSchema
    .required()
    .description('Address where the waste was physically collected.')
})
  .required()
  .description('Collection site details.')

// ---------------------------------------------------------------------------
// Root schema
// ---------------------------------------------------------------------------

export const recordCollectionSchema = Joi.object({
  apiCode: Joi.string()
    .uuid()
    .required()
    .description(
      'Unique identifier of the submitting organisation produced by the Waste Tracking Service registration process.'
    ),

  actualDateTimeCollected: Joi.date()
    .iso()
    .required()
    .description(
      'Actual date and time waste was collected. ' +
      'For deferred or retrospective recording, use the real collection time — ' +
      'not the time this request is submitted.'
    ),

  collectionType: Joi.string()
    .valid('STATIC', 'TRANSIT')
    .default('STATIC')
    .description(
      'Whether this event is a STATIC producer-to-driver pickup or a TRANSIT driver-to-driver handover (D-029). ' +
      'Optional; defaults to STATIC when omitted. ' +
      'Server enforces ordering: the first active event must be STATIC; every subsequent active event must be TRANSIT.'
    ),

  yourUniqueReference: Joi.string()
    .description(
      "Caller's own reference for this collection event. " +
      'For example, a weighbridge ticket number or trip sheet reference.'
    ),

  otherReferencesForMovement: Joi.array()
    .items(otherReferenceSchema)
    .description('Additional label/reference pairs for this collection event.'),

  isDeleted: Joi.boolean()
    .strict()
    .default(false)
    .description(
      'Soft-delete flag (D-009). Defaults to false on creation. ' +
      'May be set to true only via PUT to soft-delete the collection, subject to downstream constraints. ' +
      'Supplying true on a POST is not permitted — the service layer returns a validation warning and treats the value as false. ' +
      'A collection cannot be deleted once its parent Movement has been referenced in a Drop-off.'
    ),

  carrier: carrierSchema
    .required()
    .description(
      'Carrier details confirmed at collection. ' +
      'Required even if unchanged from creation (D-008). ' +
      'Provides the authoritative carrier record for this event.'
    ),

  receivedFromCarrier: carrierSchema
    .description(
      'The carrier this Movement was received from on a TRANSIT handover (D-029). ' +
      'Same shape as carrier. ' +
      'Required when collectionType is TRANSIT; must not be provided when collectionType is STATIC. ' +
      'Enforced server-side. Captured for the record only — not cross-checked against the preceding event.'
    ),

  collection: collectionSchema
}).description(
  'Record Collection request payload. ' +
  'POST /movements/{movementId}/collection → 201 with optional validation warnings.'
)

export default recordCollectionSchema
