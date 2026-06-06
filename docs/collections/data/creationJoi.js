/**
 * Joi validation schema for the Create Movement event.
 * POST /movements → 201 with movementId
 *
 * This documentation-side schema is aligned to the BA Creation spreadsheet and
 * to the Receipt event naming/style where applicable.
 *
 * Creation-specific rules reflected here:
 * - apiCode is required, as per Receipt.
 * - estimatedDateTimeCollected follows the same DateTime naming style as dateTimeReceived.
 * - Root objects are producer, carrier, brokerOrDealer and receiver.
 * - Creation wasteItems use the same structure as Receipt. disposalOrRecoveryCodes are optional at Creation.
 * - Municipal is an accepted wasteSource.
 * - receiver is required only when the movement contains hazardous waste.
 * - receiver.authorisationNumber and receiver.address are required when receiver.siteName is populated.
 * - brokerOrDealer is optional.
 * - carrier follows the Receipt carrier structure, but only carrier.meansOfTransport is mandatory at Creation.
 *   Optional carrier fields still keep integrity rules when supplied:
 *   registrationNumber and reasonForNoRegistrationNumber are mutually exclusive;
 *   vehicleRegistration is only allowed for Road; otherMeansOfTransport is only allowed for Other.
 * - producer.councilMovement uses the BA spreadsheet name.
 * - No collection object or collection workaround fields are present at Creation.
 */

import Joi from 'joi'
import {
  isValidAuthorisationNumber,
  isValidContainerType,
  isValidDisposalOrRecoveryCode,
  isValidEwcCode,
  isHazardousEwcCode,
  isValidHazardousWasteConsignmentCode,
  isValidPhoneNumber
} from './validators.js'
import {
  PHYSICAL_FORMS,
  MEANS_OF_TRANSPORT,
  REASONS_FOR_NO_REGISTRATION_NUMBER,
  NO_CONSIGNMENT_REASONS,
  weightSchema,
  businessAddressSchema,
  otherReferenceSchema,
  popsSchema,
  hazardousSchema,
  brokerSchema,
  carrierRegistrationNumberSchema,
  validateWithBooleanHelper,
  isProvided
} from './sharedSchemas.js'

// ---------------------------------------------------------------------------
// Business rules
// ---------------------------------------------------------------------------

const hasHazardousEwcCode = (movement) =>
  movement.wasteItems?.some((item) =>
    item.ewcCodes?.some((code) => isHazardousEwcCode(code))
  )

const validateCreationRules = (movement, helpers) => {
  const containsHazardousEwcCode = hasHazardousEwcCode(movement)
  const hasConsignmentCode = isProvided(movement.hazardousWasteConsignmentCode)
  const hasReasonForNoConsignmentCode = isProvided(movement.reasonForNoConsignmentCode)

  if (hasConsignmentCode && hasReasonForNoConsignmentCode) {
    return helpers.message(
      'reasonForNoConsignmentCode must not be provided when hazardousWasteConsignmentCode is present.'
    )
  }

  if (containsHazardousEwcCode && !hasConsignmentCode && !hasReasonForNoConsignmentCode) {
    return helpers.message(
      'reasonForNoConsignmentCode is required when the movement contains hazardous waste and no hazardousWasteConsignmentCode is provided.'
    )
  }

  if (containsHazardousEwcCode && !isProvided(movement.receiver)) {
    return helpers.message('receiver is required when the movement contains hazardous waste.')
  }

  return movement
}

// ---------------------------------------------------------------------------
// Disposal / recovery code
// ---------------------------------------------------------------------------

const disposalOrRecoveryCodeSchema = Joi.object({
  weight: weightSchema
    .required()
    .description(
      'Represents the planned or intended weight of waste being disposed of or recovered under this specific code when known at Creation.'
    ),

  code: Joi.string()
    .required()
    .custom(
      validateWithBooleanHelper(
        isValidDisposalOrRecoveryCode,
        'disposalOrRecoveryCodes[].code must be a valid disposal or recovery code.'
      )
    )
    .description('Must be a valid code from GET /reference-data/disposal-or-recovery-codes.')
}).description(
  'Each disposal or recovery code entry must include both a valid code and a weight.'
)

// ---------------------------------------------------------------------------
// Waste item at creation
// ---------------------------------------------------------------------------

/**
 * Creation uses the same waste item structure as Receipt. disposalOrRecoveryCodes
 * are optional at Creation because they represent intended/planned treatment at
 * most; the treatment outcome is determined at Receipt.
 */
const createWasteItemSchema = Joi.object({
  weight: weightSchema
    .required()
    .description('Total weight of the waste item.'),

  wasteDescription: Joi.string()
    .required()
    .description('Detailed description of the specific waste material.'),

  typeOfContainers: Joi.string()
    .required()
    .custom(
      validateWithBooleanHelper(
        isValidContainerType,
        'typeOfContainers must match a valid container type code from GET /reference-data/container-types.'
      )
    )
    .description('Must match a valid code from GET /reference-data/container-types. Use exact case returned by the GET method.'),

  physicalForm: Joi.string()
    .valid(...PHYSICAL_FORMS)
    .required()
    .description('Must be exactly one of the permitted values. Case-sensitive; use exact case shown.'),

  numberOfContainers: Joi.number()
    .strict()
    .integer()
    .min(0)
    .required()
    .description('Must be 0 or greater. Represents the number of containers for storing, transporting, or disposing of the waste.'),

  ewcCodes: Joi.array()
    .items(
      Joi.string().custom(
        validateWithBooleanHelper(
          isValidEwcCode,
          'ewcCodes must contain valid codes from GET /reference-data/ewc-codes.'
        )
      )
    )
    .min(1)
    .max(5)
    .required()
    .description('Must be valid codes from the official EWC catalogue. Minimum 1, maximum 5 per waste item.'),

  disposalOrRecoveryCodes: Joi.array()
    .items(disposalOrRecoveryCodeSchema)
    .optional()
    .description(
      'Optional at Creation. Represents intended or planned treatment information when known. ' +
      'Each disposal or recovery code entry must include both a valid code and a weight.'
    ),

  containsPops: Joi.boolean()
    .strict()
    .required()
    .description('Flags whether the waste contains Persistent Organic Pollutants. Drives conditionality of the entire pops sub-object.'),

  pops: Joi.when('containsPops', {
    is: true,
    then: popsSchema.required(),
    otherwise: Joi.forbidden()
  }).description('Required when containsPops is true. Must not be provided when containsPops is false.'),

  containsHazardous: Joi.boolean()
    .strict()
    .required()
    .description('Flags whether the waste contains hazardous properties. Drives conditionality of the entire hazardous sub-object.'),

  hazardous: Joi.when('containsHazardous', {
    is: true,
    then: hazardousSchema.required(),
    otherwise: Joi.forbidden()
  }).description('Required when containsHazardous is true. Must not be provided when containsHazardous is false.')
}).description('Waste item declared as part of the created movement.')

// ---------------------------------------------------------------------------
// Receiver at creation
// ---------------------------------------------------------------------------

const receiverAddressSchema = businessAddressSchema.keys({
  fullAddress: Joi.string()
    .required()
    .description('Full receiver site address.'),

  postcode: businessAddressSchema.extract('postcode')
    .required()
    .description('Receiver site postcode.')
}).description('Receiver site address. Required with fullAddress and postcode when receiver.siteName is populated.')

const receiverSchema = Joi.object({
  siteName: Joi.string()
    .description('Name of the intended receiving site.'),

  authorisationNumber: Joi.when('siteName', {
    is: Joi.exist(),
    then: Joi.string()
      .custom(
        validateWithBooleanHelper(
          isValidAuthorisationNumber,
          'receiver.authorisationNumber must be in a valid UK format.'
        )
      )
      .required(),
    otherwise: Joi.string()
      .custom(
        validateWithBooleanHelper(
          isValidAuthorisationNumber,
          'receiver.authorisationNumber must be in a valid UK format.'
        )
      )
      .optional()
  }).description('Required when receiver.siteName is populated. Must be a valid site authorisation number.'),

  emailAddress: Joi.string()
    .email()
    .description('Receiver site contact email address.'),

  phoneNumber: Joi.string()
    .custom(
      validateWithBooleanHelper(
        isValidPhoneNumber,
        'receiver.phoneNumber must be a valid phone number.'
      )
    )
    .description('Receiver site contact phone number.'),

  address: Joi.when('siteName', {
    is: Joi.exist(),
    then: receiverAddressSchema.required(),
    otherwise: receiverAddressSchema.optional()
  }).description('Required when receiver.siteName is populated. Must include postcode and fullAddress.')
}).description(
  'Receiver details at Creation. Required only when the movement contains hazardous waste. ' +
  'If siteName is populated, authorisationNumber and address are mandatory.'
)

// ---------------------------------------------------------------------------
// Producer
// ---------------------------------------------------------------------------

const SIC_CODE_REGEX = /^\d{5}$/

const producerSchema = Joi.object({
  wasteSource: Joi.string()
    .valid('Household', 'Commercial', 'Municipal')
    .required()
    .description('Whether the waste originates from household, commercial or municipal sources.'),

  organisationName: Joi.when('wasteSource', {
    switch: [
      { is: 'Commercial', then: Joi.string().required() },
      { is: 'Household', then: Joi.forbidden() }
    ],
    otherwise: Joi.string().optional()
  }).description('Producer organisation name. Required for Commercial waste; not applicable for Household; optional for Municipal.'),

  authorisationNumber: Joi.when('wasteSource', {
    switch: [
      {
        is: 'Commercial',
        then: Joi.string()
          .custom(
            validateWithBooleanHelper(
              isValidAuthorisationNumber,
              'producer.authorisationNumber must be in a valid UK format.'
            )
          )
          .required()
      },
      { is: 'Household', then: Joi.forbidden() }
    ],
    otherwise: Joi.string()
      .custom(
        validateWithBooleanHelper(
          isValidAuthorisationNumber,
          'producer.authorisationNumber must be in a valid UK format.'
        )
      )
      .optional()
  }).description('Producer environmental permit or exemption number. Required for Commercial, optional for Municipal, not applicable for Household.'),

  sicCode: Joi.when('wasteSource', {
    switch: [
      { is: 'Commercial', then: Joi.string().pattern(SIC_CODE_REGEX).required() },
      { is: 'Household', then: Joi.forbidden() }
    ],
    otherwise: Joi.string().pattern(SIC_CODE_REGEX).optional()
  }).description('Five-digit Standard Industrial Classification code. Required for Commercial, optional for Municipal, not applicable for Household.'),

  emailAddress: Joi.when('wasteSource', {
    is: 'Household',
    then: Joi.forbidden(),
    otherwise: Joi.string().email().optional()
  }).description('Producer contact email address. Not applicable for Household waste.'),

  phoneNumber: Joi.when('wasteSource', {
    is: 'Household',
    then: Joi.forbidden(),
    otherwise: Joi.string()
      .custom(
        validateWithBooleanHelper(
          isValidPhoneNumber,
          'producer.phoneNumber must be a valid phone number.'
        )
      )
      .optional()
  }).description('Producer contact phone number. Not applicable for Household waste.'),

  address: businessAddressSchema
    .required()
    .description('Producer site address.'),

  councilMovement: Joi.boolean()
    .strict()
    .required()
    .description('Whether this movement is carried out by, or on behalf of, a council.')
}).description('Producer organisation details.')

// ---------------------------------------------------------------------------
// Carrier at creation
// ---------------------------------------------------------------------------

const creationCarrierSchema = Joi.object({
  meansOfTransport: Joi.string()
    .valid(...MEANS_OF_TRANSPORT)
    .required()
    .description('Only mandatory carrier field at Creation. Use exact case.'),

  registrationNumber: carrierRegistrationNumberSchema
    .optional()
    .description(
      'Optional at Creation. If provided, must be in a valid carrier registration number format. ' +
      'Must not be supplied together with carrier.reasonForNoRegistrationNumber.'
    ),

  reasonForNoRegistrationNumber: Joi.string()
    .valid(...REASONS_FOR_NO_REGISTRATION_NUMBER)
    .empty('')
    .empty(null)
    .when('registrationNumber', {
      not: Joi.valid(null, '').optional(),
      then: Joi.forbidden(),
      otherwise: Joi.optional()
    })
    .description(
      'Optional at Creation when carrier.registrationNumber is not supplied, null, or empty. ' +
      'Must not be supplied when a valid registrationNumber is provided.'
    ),

  organisationName: Joi.string()
    .optional()
    .description('Carrier organisation name. Optional at Creation.'),

  vehicleRegistration: Joi.when('meansOfTransport', {
    is: 'Road',
    then: Joi.string().max(10).optional(),
    otherwise: Joi.forbidden()
  }).description(
    "Optional at Creation when meansOfTransport is 'Road'. " +
    'Must not be provided when meansOfTransport is any other value.'
  ),

  otherMeansOfTransport: Joi.when('meansOfTransport', {
    is: 'Other',
    then: Joi.string().optional(),
    otherwise: Joi.forbidden()
  }).description(
    "Optional description when meansOfTransport is 'Other'. " +
    'Must not be provided for any other transport method.'
  ),

  emailAddress: Joi.string()
    .email()
    .optional()
    .description('Carrier contact email address. Optional at Creation.'),

  phoneNumber: Joi.string()
    .custom(
      validateWithBooleanHelper(
        isValidPhoneNumber,
        'carrier.phoneNumber must be a valid UK or international phone number.'
      )
    )
    .optional()
    .description('Carrier contact phone number. Optional at Creation.'),

  address: businessAddressSchema
    .optional()
    .description('Carrier business address. Optional at Creation.')
})
  .description(
    'Carrier details at Creation. Same field structure as Receipt carrier, with only meansOfTransport mandatory. ' +
    'Optional fields retain integrity rules when supplied.'
  )

// ---------------------------------------------------------------------------
// Root schema
// ---------------------------------------------------------------------------

export const createMovementSchema = Joi.object({
  apiCode: Joi.string()
    .uuid()
    .required()
    .description('Unique identifier of the submitting organisation produced by the Waste Tracking Service registration process.'),

  estimatedDateTimeCollected: Joi.date()
    .iso()
    .required()
    .description('Estimated date and time the waste will be collected. Actual time is recorded by the Collection event and may differ.'),

  hazardousWasteConsignmentCode: Joi.string()
    .empty('')
    .empty(null)
    .custom(
      validateWithBooleanHelper(
        isValidHazardousWasteConsignmentCode,
        'hazardousWasteConsignmentCode must match one of the accepted region-specific consignment code formats.'
      )
    )
    .description('Required when any waste item carries a hazardous EWC code. Must not be provided alongside reasonForNoConsignmentCode.'),

  reasonForNoConsignmentCode: Joi.string()
    .valid(...NO_CONSIGNMENT_REASONS)
    .empty('')
    .empty(null)
    .description('Required when waste is hazardous and no hazardousWasteConsignmentCode is provided. Must not be provided alongside hazardousWasteConsignmentCode.'),

  yourUniqueReference: Joi.string()
    .description("Caller's own reference — no format rules enforced."),

  otherReferencesForMovement: Joi.array()
    .items(otherReferenceSchema)
    .description('Additional label/reference pairs for this movement.'),

  specialHandlingRequirements: Joi.string()
    .max(5000)
    .description('Special handling instructions, e.g. fragile, hazardous, temperature-sensitive or other operational notes.'),

  producer: producerSchema
    .required(),

  carrier: creationCarrierSchema
    .required()
    .description('Carrier details. Required object at Creation, using the Receipt carrier field structure with meansOfTransport as the only mandatory carrier field.'),

  brokerOrDealer: brokerSchema
    .optional()
    .description('Optional broker/dealer details.'),

  receiver: receiverSchema
    .optional(),

  wasteItems: Joi.array()
    .items(createWasteItemSchema)
    .min(1)
    .required()
    .description('At least one waste item is required. Creation uses the same waste item structure as Receipt.')
})
  .custom(validateCreationRules, 'creation movement business rules')
  .description('Create Movement request payload. POST /movements → 201 with movementId.')

// Alias retained for projects that currently import creationJoi.
export const creationJoi = createMovementSchema

export default createMovementSchema
