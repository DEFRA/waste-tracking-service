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
 * - carrier is mandatory at collection time.
 * - collection.address is mandatory and contains postcode and fullAddress.
 * - wasteItems carries actual weights only; full classification is on the Movement.
 * - wasteItems array must contain one entry per waste item on the Movement (positional).
 */

import Joi from 'joi'
import {
  weightSchema,
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
// Collection waste item — actual weight only
// ---------------------------------------------------------------------------

const collectionWasteItemSchema = Joi.object({
  weight: weightSchema
    .required()
    .description(
      'Actual weight of this waste item at collection. ' +
      'Set isEstimate: false when weighed on a calibrated scale; true for kerbside estimates. ' +
      'Corresponds by position to the wasteItems array on the parent Movement.'
    )
}).description(
  'Per-item actual weight recorded at collection. ' +
  'Full waste classification details (EWC codes, description, containers) remain on the Movement.'
)

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

  yourUniqueReference: Joi.string()
    .description(
      "Caller's own reference for this collection event. " +
      'For example, a weighbridge ticket number or trip sheet reference.'
    ),

  specialHandlingRequirements: Joi.string()
    .max(5000)
    .description('Special handling instructions relevant to the collection event.'),

  otherReferencesForMovement: Joi.array()
    .items(otherReferenceSchema)
    .description('Additional label/reference pairs for this collection event.'),

  carrier: carrierSchema
    .required()
    .description(
      'Carrier details confirmed at collection. ' +
      'Required even if unchanged from creation (D-008). ' +
      'Provides the authoritative carrier record for this event.'
    ),

  collection: collectionSchema,

  wasteItems: Joi.array()
    .items(collectionWasteItemSchema)
    .min(1)
    .required()
    .description(
      'Actual weights per waste item. ' +
      'Must contain one entry per waste item declared at creation, in the same positional order.'
    )
}).description(
  'Record Collection request payload. ' +
  'POST /movements/{movementId}/collection → 201 with optional validation warnings.'
)

export default recordCollectionSchema
