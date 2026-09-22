/**
 * Shared Joi sub-schemas, constants, and helpers used across all DWT event
 * schemas (Creation, Collection, Drop-off, Receipt).
 *
 * Import from here rather than duplicating across event files.
 * receiptJoi.js defines its own local copies for now; those can be migrated
 * here once the Phase 1 → Phase 2 transition stabilises.
 */

import Joi from 'joi'
import {
  UK_POSTCODE_REGEX,
  IRL_POSTCODE_REGEX,
  isValidCarrierRegistrationNumber,
  isValidContainerType,
  isValidEwcCode,
  isHazardousEwcCode,
  isValidPhoneNumber,
  isValidPopCode
} from './validators.js'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const MEANS_OF_TRANSPORT = [
  'Road',
  'Rail',
  'Air',
  'Sea',
  'Inland Waterway',
  'Piped',
  'Other'
]

export const REASONS_FOR_NO_REGISTRATION_NUMBER = [
  'ON_SITE',
  'HOUSEHOLD',
  'ONE_OFF',
  'MARINE'
]

export const NO_CONSIGNMENT_REASONS = [
  'NON_HAZ_WASTE_TRANSFER',
  'NO_DOC_WITH_WASTE',
  'HWRC_RECEIPT'
]

export const SOURCE_OF_COMPONENTS = [
  'NOT_PROVIDED',
  'PROVIDED_WITH_WASTE',
  'GUIDANCE',
  'OWN_TESTING'
]

export const PHYSICAL_FORMS = [
  'Gas',
  'Liquid',
  'Solid',
  'Powder',
  'Sludge',
  'Mixed'
]

export const WEIGHT_METRICS = ['Grams', 'Kilograms', 'Tonnes']

export const HAZARDOUS_PROPERTY_CODES = [
  'HP_1',
  'HP_2',
  'HP_3',
  'HP_4',
  'HP_5',
  'HP_6',
  'HP_7',
  'HP_8',
  'HP_9',
  'HP_10',
  'HP_11',
  'HP_12',
  'HP_13',
  'HP_14',
  'HP_15'
]

/**
 * Movement ID and Transfer ID format: two-digit year prefix followed by
 * six alphanumeric characters from the A–Z 0–9 alphabet (sqids, D-013).
 * Example: 25HRA0B2
 *
 * Note: the current spec is inconsistent on the prefix character set.
 * This regex implements the canonical D-013 description (numeric year).
 * Align with the identifier service once the format is confirmed.
 */
export const MOVEMENT_ID_REGEX = /^\d{2}[A-Z0-9]{6}$/i

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const validateWithBooleanHelper = (predicate, message) => (value, helpers) => {
  if (!predicate(value)) return helpers.message(message)
  return value
}

/** True when a value is present (not undefined, null, or empty string). */
export const isProvided = (value) =>
  value !== undefined && value !== null && value !== ''

/** Removes duplicate values from an array (used to deduplicate hazCodes). */
export const uniqueValues = (values) => [...new Set(values)]

// ---------------------------------------------------------------------------
// Value object schemas
// ---------------------------------------------------------------------------

export const weightSchema = Joi.object({
  metric: Joi.string()
    .valid(...WEIGHT_METRICS)
    .required()
    .description('Unit of measurement. Allowed values: Grams, Kilograms, Tonnes.'),

  isEstimate: Joi.boolean()
    .strict()
    .required()
    .description('Whether the weight value is an estimate.'),

  amount: Joi.number()
    .strict()
    .positive()
    .required()
    .description('Total weight. Must be greater than 0.')
}).description('Weight block — shared across all events and waste item types.')

/**
 * Business address used by carrier, broker, producer and receiver parties.
 * Accepts both UK postcodes and Irish Eircodes.
 * Receipt address (UK only, fullAddress required) is defined separately in receiptJoi.js.
 */
export const businessAddressSchema = Joi.object({
  fullAddress: Joi.string()
    .description('Full address line.'),

  postcode: Joi.alternatives()
    .try(
      Joi.string().pattern(UK_POSTCODE_REGEX),
      Joi.string().pattern(IRL_POSTCODE_REGEX)
    )
    .required()
    .description('Accepts UK postcodes and Irish Eircodes.')
}).description('Business address object. postcode is required; fullAddress is optional.')

export const otherReferenceSchema = Joi.object({
  reference: Joi.string()
    .min(1)
    .required()
    .description('Reference value — must be supplied together with its label.'),

  label: Joi.string()
    .min(1)
    .required()
    .description('Label identifying the reference type, e.g. transferNoteNumber, purchaseOrderNumber.')
}).description('Additional label/reference pair for the movement.')

// ---------------------------------------------------------------------------
// POPs sub-schemas
// ---------------------------------------------------------------------------

export const popComponentSchema = Joi.object({
  concentration: Joi.number()
    .strict()
    .positive()
    .allow(null)
    .description('Concentration value. If supplied, must be greater than 0.'),

  code: Joi.string()
    .empty('')
    .empty(null)
    .custom(
      validateWithBooleanHelper(
        isValidPopCode,
        'pops.components[].code must be a valid code from the POP reference list.'
      )
    )
    .description('Valid code from GET /reference-data/pop-names.')
}).description('POP component detail.')

export const popsSchema = Joi.object({
  sourceOfComponents: Joi.string()
    .valid(...SOURCE_OF_COMPONENTS)
    .required()
    .description('Required when containsPops is true.'),

  components: Joi.array()
    .items(popComponentSchema)
    .empty(null)
    .when('sourceOfComponents', {
      switch: [
        { is: Joi.valid('GUIDANCE', 'OWN_TESTING'), then: Joi.required() },
        { is: 'NOT_PROVIDED', then: Joi.forbidden() }
      ],
      otherwise: Joi.optional()
    })
    .description(
      'Required when sourceOfComponents is GUIDANCE or OWN_TESTING. ' +
      'Forbidden when sourceOfComponents is NOT_PROVIDED. ' +
      'Optional when sourceOfComponents is PROVIDED_WITH_WASTE.'
    )
}).description('POPs details — required when containsPops is true.')

// ---------------------------------------------------------------------------
// Hazardous sub-schemas
// ---------------------------------------------------------------------------

export const hazardousComponentSchema = Joi.object({
  name: Joi.string()
    .empty('')
    .empty(null)
    .description('Name of the hazardous chemical or biological component.'),

  concentration: Joi.number()
    .strict()
    .positive()
    .allow(null)
    .description('Concentration value. If supplied, must be greater than 0.')
}).description('Hazardous component detail.')

export const hazardousSchema = Joi.object({
  sourceOfComponents: Joi.string()
    .valid(...SOURCE_OF_COMPONENTS)
    .required()
    .description('Required when containsHazardous is true.'),

  hazCodes: Joi.array()
    .items(Joi.string().valid(...HAZARDOUS_PROPERTY_CODES))
    .min(1)
    .custom((values) => uniqueValues(values))
    .required()
    .description(
      'Valid codes from GET /reference-data/hazardous-property-codes. Duplicate values are removed.'
    ),

  components: Joi.array()
    .items(hazardousComponentSchema)
    .empty(null)
    .when('sourceOfComponents', {
      switch: [
        { is: Joi.valid('GUIDANCE', 'OWN_TESTING'), then: Joi.required() },
        { is: 'NOT_PROVIDED', then: Joi.forbidden() }
      ],
      otherwise: Joi.optional()
    })
    .description(
      'Required when sourceOfComponents is GUIDANCE or OWN_TESTING. ' +
      'Forbidden when sourceOfComponents is NOT_PROVIDED.'
    )
}).description('Hazardous details — required when containsHazardous is true.')

// ---------------------------------------------------------------------------
// Party schemas
// ---------------------------------------------------------------------------

export const carrierRegistrationNumberSchema = Joi.alternatives().try(
  Joi.valid(null, ''),
  Joi.string().custom(
    validateWithBooleanHelper(
      isValidCarrierRegistrationNumber,
      'carrier.registrationNumber must be in a valid carrier registration number format.'
    )
  )
)

/**
 * Carrier schema — shared across Creation, Collection, Drop-off, and Receipt.
 * Required on every event per D-008.
 */
export const carrierSchema = Joi.object({
  vehicleRegistration: Joi.when('meansOfTransport', {
    is: 'Road',
    then: Joi.string().max(10).required(),
    otherwise: Joi.forbidden()
  }).description("Required when meansOfTransport is 'Road'. Forbidden for all other modes."),

  registrationNumber: carrierRegistrationNumberSchema
    .required()
    .description(
      'Null or empty → reasonForNoRegistrationNumber is required. ' +
      'Valid value → reasonForNoRegistrationNumber must not be provided. The two fields are mutually exclusive.'
    ),

  reasonForNoRegistrationNumber: Joi.string()
    .valid(...REASONS_FOR_NO_REGISTRATION_NUMBER)
    .empty('')
    .empty(null)
    .when('registrationNumber', {
      switch: [
        { is: null, then: Joi.required() },
        { is: '', then: Joi.required() }
      ],
      otherwise: Joi.forbidden()
    })
    .description(
      'Required when registrationNumber is null or empty. Forbidden when a valid registrationNumber is supplied.'
    ),

  organisationName: Joi.string()
    .required()
    .description('Carrier organisation name.'),

  meansOfTransport: Joi.string()
    .valid(...MEANS_OF_TRANSPORT)
    .required()
    .description(
      "Controls conditionality of vehicleRegistration. 'Inland Waterway' includes a space — use exact case."
    ),

  otherMeansOfTransport: Joi.string()
    .description("Description of transport method when meansOfTransport is 'Other'."),

  emailAddress: Joi.string()
    .email()
    .description('Carrier contact email address.'),

  phoneNumber: Joi.string()
    .custom(
      validateWithBooleanHelper(
        isValidPhoneNumber,
        'carrier.phoneNumber must be a valid UK or international phone number.'
      )
    )
    .description('Carrier contact phone number.'),

  address: businessAddressSchema
    .description('Carrier business address. postcode is required when address object is provided.')
}).description('Carrier organisation and transport details. Required on all events (D-008).')

/**
 * Broker schema — required when the movement is broker-initiated (D-008).
 * Shares the same registration number format as the carrier.
 */
export const brokerSchema = Joi.object({
  registrationNumber: carrierRegistrationNumberSchema
    .description(
      'If provided, must follow the same format rules as carrier.registrationNumber.'
    ),

  organisationName: Joi.string()
    .required()
    .description('Broker or dealer organisation name. Required when the brokerDetails object is included.'),

  emailAddress: Joi.string()
    .email()
    .description('Broker/dealer contact email address.'),

  phoneNumber: Joi.string()
    .custom(
      validateWithBooleanHelper(
        isValidPhoneNumber,
        'brokerDetails.phoneNumber must be a valid UK or international phone number.'
      )
    )
    .description('Broker/dealer contact phone number.'),

  address: businessAddressSchema
    .description('Broker or dealer business address.')
}).description('Broker or dealer details — required when the movement is broker-initiated.')

/**
 * Driver details schema — minimal for now; full model to be defined as the
 * spec matures (matches the driverDetails placeholder in openapi.yaml).
 */
export const driverDetailsSchema = Joi.object({
  name: Joi.string()
    .description('Name of the driver performing the collection or drop-off.')
}).description('Driver details. Currently carries name only.')
