import Joi from 'joi'

/**
 * Single-file Receipt Joi schema.
 * POST /transfers/{transferId}/receipt
 *
 * transferId is a path parameter and is not included in this request body schema.
 * This file validates only the receipt details recorded by the receiver.
 *
 * This file keeps the Receipt schema, nested schemas, allowed values and field descriptions together.
 * Replace the import path below with the location of your existing shared validators/reference-data helpers.
 */
import {
  UK_POSTCODE_REGEX,
  IRL_POSTCODE_REGEX,
  isValidAuthorisationNumber,
  isValidCarrierRegistrationNumber,
  isValidContainerType,
  isValidDisposalOrRecoveryCode,
  isValidEwcCode,
  isHazardousEwcCode,
  isValidHazardousWasteConsignmentCode,
  isValidPhoneNumber,
  isValidPopCode
} from './validators.js'

const MEANS_OF_TRANSPORT = [
  'Road',
  'Rail',
  'Air',
  'Sea',
  'Inland Waterway',
  'Piped',
  'Other'
]

const REASONS_FOR_NO_REGISTRATION_NUMBER = [
  'ON_SITE',
  'HOUSEHOLD',
  'ONE_OFF',
  'MARINE'
]

const NO_CONSIGNMENT_REASONS = [
  'NON_HAZ_WASTE_TRANSFER',
  'NO_DOC_WITH_WASTE',
  'HWRC_RECEIPT'
]

const SOURCE_OF_COMPONENTS = [
  'NOT_PROVIDED',
  'PROVIDED_WITH_WASTE',
  'GUIDANCE',
  'OWN_TESTING'
]

const PHYSICAL_FORMS = [
  'Gas',
  'Liquid',
  'Solid',
  'Powder',
  'Sludge',
  'Mixed'
]

const WEIGHT_METRICS = [
  'Grams',
  'Kilograms',
  'Tonnes'
]

const HAZARDOUS_PROPERTY_CODES = [
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

const validateWithBooleanHelper = (predicate, message) => (value, helpers) => {
  if (!predicate(value)) {
    return helpers.message(message)
  }

  return value
}

const isProvided = (value) => value !== undefined && value !== null && value !== ''

const uniqueValues = (values) => [...new Set(values)]

const validateReceiptConsignmentRules = (movement, helpers) => {
  const hasHazardousEwcCode = movement.wasteItems?.some((wasteItem) =>
    wasteItem.ewcCodes?.some((ewcCode) => isHazardousEwcCode(ewcCode))
  )

  const hasConsignmentCode = isProvided(movement.hazardousWasteConsignmentCode)
  const hasReasonForNoConsignmentCode = isProvided(movement.reasonForNoConsignmentCode)

  if (hasConsignmentCode && hasReasonForNoConsignmentCode) {
    return helpers.message(
      'reasonForNoConsignmentCode must not be provided when hazardousWasteConsignmentCode is present.'
    )
  }

  if (hasHazardousEwcCode && !hasConsignmentCode && !hasReasonForNoConsignmentCode) {
    return helpers.message(
      'reasonForNoConsignmentCode is required when the movement contains hazardous waste and no hazardousWasteConsignmentCode is provided.'
    )
  }

  return movement
}

const weightSchema = Joi.object({
  metric: Joi.string()
    .valid(...WEIGHT_METRICS)
    .required()
    .description(
      'Used on both wasteItem.weight and disposalOrRecoveryCode.weight sub-objects.'
    ),

  isEstimate: Joi.boolean()
    .strict()
    .required()
    .description('Flags whether the weight value is an estimate.'),

  amount: Joi.number()
    .strict()
    .positive()
    .required()
    .description(
      'For wasteItem, this is the total weight of waste received. For disposalOrRecoveryCode, this is the total weight of waste being disposed of or recovered for final treatment.'
    )
}).description('Weight object containing metric, amount and estimate flag.')

const businessAddressSchema = Joi.object({
  fullAddress: Joi.string()
    .description('Business location address.'),

  postcode: Joi.alternatives()
    .try(
      Joi.string().pattern(UK_POSTCODE_REGEX),
      Joi.string().pattern(IRL_POSTCODE_REGEX)
    )
    .required()
    .description('Accepts UK and Irish postcodes.')
}).description('Business address object.')

const receiptAddressSchema = Joi.object({
  postcode: Joi.string()
    .pattern(UK_POSTCODE_REGEX)
    .required()
    .description(
      'Unlike carrier and broker addresses, the receipt address accepts UK postcodes only. Must be in valid UK postcode format.'
    ),

  fullAddress: Joi.string()
    .required()
    .description('The address where the waste is physically received.')
}).description('Address where the waste is physically received.')

const otherReferenceSchema = Joi.object({
  reference: Joi.string()
    .min(1)
    .required()
    .description('Both label and reference must be provided together as a pair.'),

  label: Joi.string()
    .min(1)
    .required()
    .description(
      'Array of label/reference pairs. If the object is included, both label and reference are required together.'
    )
}).description('Additional movement reference label/reference pair.')

const popComponentSchema = Joi.object({
  concentration: Joi.number()
    .strict()
    .positive()
    .allow(null)
    .description('If provided, must be greater than 0.'),

  code: Joi.string()
    .empty('')
    .empty(null)
    .custom(
      validateWithBooleanHelper(
        isValidPopCode,
        'pops.components[].code must be a valid code from the POP reference list.'
      )
    )
    .description('If provided, must be a valid code from the POP reference list.')
}).description('Persistent Organic Pollutant component.')

const popsSchema = Joi.object({
  sourceOfComponents: Joi.string()
    .valid(...SOURCE_OF_COMPONENTS)
    .required()
    .description('Required when containsPops is true.'),

  components: Joi.array()
    .items(popComponentSchema)
    .empty(null)
    .when('sourceOfComponents', {
      switch: [
        {
          is: Joi.valid('GUIDANCE', 'OWN_TESTING'),
          then: Joi.required()
        },
        {
          is: 'NOT_PROVIDED',
          then: Joi.forbidden()
        }
      ],
      otherwise: Joi.optional()
    })
    .description(
      'Required when containsPops is true and sourceOfComponents is GUIDANCE or OWN_TESTING. Not allowed when sourceOfComponents is NOT_PROVIDED. May be omitted when sourceOfComponents is PROVIDED_WITH_WASTE.'
    )
}).description(
  'Required when containsPops is true. Must not be provided when containsPops is false.'
)

const hazardousComponentSchema = Joi.object({
  name: Joi.string()
    .empty('')
    .empty(null)
    .description('Name of a hazardous chemical or biological component.'),

  concentration: Joi.number()
    .strict()
    .positive()
    .allow(null)
    .description('If provided, must be greater than 0.')
}).description('Hazardous chemical or biological component.')

const hazardousSchema = Joi.object({
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
      'Required when containsHazardous is true. Must be valid codes from GET /reference-data/hazardous-property-codes.'
    ),

  components: Joi.array()
    .items(hazardousComponentSchema)
    .empty(null)
    .when('sourceOfComponents', {
      switch: [
        {
          is: Joi.valid('GUIDANCE', 'OWN_TESTING'),
          then: Joi.required()
        },
        {
          is: 'NOT_PROVIDED',
          then: Joi.forbidden()
        }
      ],
      otherwise: Joi.optional()
    })
    .description(
      'Required when containsHazardous is true and sourceOfComponents is GUIDANCE or OWN_TESTING. Not allowed when sourceOfComponents is NOT_PROVIDED. May be omitted when sourceOfComponents is PROVIDED_WITH_WASTE.'
    )
}).description(
  'Required when containsHazardous is true. Must not be provided when containsHazardous is false.'
)

const disposalOrRecoveryCodeSchema = Joi.object({
  weight: weightSchema
    .required()
    .description(
      'Represents the weight of waste being disposed of or recovered for final treatment under this specific code.'
    ),

  code: Joi.string()
    .required()
    .custom(
      validateWithBooleanHelper(
        isValidDisposalOrRecoveryCode,
        'disposalOrRecoveryCode.code must be a valid disposal or recovery code.'
      )
    )
    .description(
      'Must be a valid code from GET /reference-data/disposal-or-recovery-codes.'
    )
}).description(
  'Each disposal or recovery code entry must include both a valid code and a weight.'
)

const wasteItemSchema = Joi.object({
  weight: weightSchema
    .required()
    .description('Total weight of the waste item received.'),

  wasteDescription: Joi.string()
    .required()
    .description('Detailed description of the specific waste material.'),

  typeOfContainers: Joi.string()
    .required()
    .custom(
      validateWithBooleanHelper(
        isValidContainerType,
        'typeOfContainers must match a valid container type code from reference data.'
      )
    )
    .description(
      'Must match a valid code from GET /reference-data/container-types. Use exact case returned by the GET method.'
    ),

  physicalForm: Joi.string()
    .valid(...PHYSICAL_FORMS)
    .required()
    .description(
      'Must be exactly one of the six permitted values. Case-sensitive; use exact case shown.'
    ),

  numberOfContainers: Joi.number()
    .strict()
    .integer()
    .min(0)
    .required()
    .description(
      'Must be 0 or greater. Represents the number of containers for storing, transporting, or disposing of the waste.'
    ),

  ewcCodes: Joi.array()
    .items(
      Joi.string().custom(
        validateWithBooleanHelper(
          isValidEwcCode,
          'ewcCodes must contain valid EWC codes from the official reference list.'
        )
      )
    )
    .min(1)
    .max(5)
    .required()
    .description(
      'Must be valid codes from the official EWC catalogue. Use GET /reference-data/ewc-codes for the full reference list. POPs can exist in both hazardous and non-hazardous waste.'
    ),

  disposalOrRecoveryCodes: Joi.array()
    .items(disposalOrRecoveryCodeSchema)
    .description(
      'Each disposal or recovery code entry must include both a valid code and a weight.'
    ),

  containsPops: Joi.boolean()
    .strict()
    .required()
    .description(
      'Flags whether the waste contains Persistent Organic Pollutants. Drives conditionality of the entire pops sub-object.'
    ),

  pops: Joi.when('containsPops', {
    is: true,
    then: popsSchema.required(),
    otherwise: Joi.forbidden()
  }).description(
    'Required when containsPops is true. Must not be provided when containsPops is false.'
  ),

  containsHazardous: Joi.boolean()
    .strict()
    .required()
    .description(
      'Flags whether the waste contains hazardous properties. Drives conditionality of the entire hazardous sub-object.'
    ),

  hazardous: Joi.when('containsHazardous', {
    is: true,
    then: hazardousSchema.required(),
    otherwise: Joi.forbidden()
  }).description(
    'Required when containsHazardous is true. Must not be provided when containsHazardous is false.'
  )
}).description('Waste item received as part of the receipt movement.')

const carrierRegistrationNumberSchema = Joi.alternatives().try(
  Joi.valid(null, ''),
  Joi.string().custom(
    validateWithBooleanHelper(
      isValidCarrierRegistrationNumber,
      'carrier.registrationNumber must be in a valid carrier registration number format.'
    )
  )
)

const carrierSchema = Joi.object({
  vehicleRegistration: Joi.when('meansOfTransport', {
    is: 'Road',
    then: Joi.string().max(10).required(),
    otherwise: Joi.forbidden()
  }).description(
    "Required if meansOfTransport is 'Road'. Must not be provided if meansOfTransport is any other value."
  ),

  registrationNumber: carrierRegistrationNumberSchema
    .required()
    .description(
      'If null or empty, carrier.reasonForNoRegistrationNumber is required. If a valid value is provided, reasonForNoRegistrationNumber must not be provided. The two fields are mutually exclusive.'
    ),

  reasonForNoRegistrationNumber: Joi.string()
    .valid(...REASONS_FOR_NO_REGISTRATION_NUMBER)
    .empty('')
    .empty(null)
    .when('registrationNumber', {
      switch: [
        {
          is: null,
          then: Joi.required()
        },
        {
          is: '',
          then: Joi.required()
        }
      ],
      otherwise: Joi.forbidden()
    })
    .description(
      'Required if registrationNumber is null or empty. Must not be provided if a valid registrationNumber is given.'
    ),

  phoneNumber: Joi.string()
    .custom(
      validateWithBooleanHelper(
        isValidPhoneNumber,
        'carrier.phoneNumber must be a valid UK or international phone number.'
      )
    )
    .description('Phone number of the carrier.'),

  organisationName: Joi.string()
    .required()
    .description('Name of the carrier business.'),

  meansOfTransport: Joi.string()
    .valid(...MEANS_OF_TRANSPORT)
    .required()
    .description(
      "Drives conditionality of vehicleRegistration. 'Inland Waterway' includes a space; use exact case."
    ),

  emailAddress: Joi.string()
    .email()
    .description('Email address of the carrier.'),

  address: businessAddressSchema
    .description(
      'Carrier business address. If the address object is provided, postcode is mandatory.'
    ),

  otherMeansOfTransport: Joi.string()
    .description('Optional description when the transport method is Other.')
}).description('Carrier details for the waste movement.')

const brokerOrDealerSchema = Joi.object({
  registrationNumber: carrierRegistrationNumberSchema
    .description(
      'Optional. If provided, must follow the same format rules as carrier.registrationNumber.'
    ),

  phoneNumber: Joi.string()
    .custom(
      validateWithBooleanHelper(
        isValidPhoneNumber,
        'brokerOrDealer.phoneNumber must be a valid UK or international phone number.'
      )
    )
    .description('Broker/dealer phone number.'),

  organisationName: Joi.string()
    .required()
    .description(
      'Name of the broker or dealer who arranged the transfer. Required if the brokerOrDealer object is included.'
    ),

  emailAddress: Joi.string()
    .email()
    .description('Broker/dealer email address.'),

  address: businessAddressSchema
    .description(
      'Broker or dealer business address. If the address object is provided, postcode is mandatory.'
    )
}).description('Broker or dealer details, if one arranged the transfer.')

const receiverSchema = Joi.object({
  siteName: Joi.string()
    .required()
    .description('Name of the site receiving the waste.'),

  regulatoryPositionStatements: Joi.array()
    .items(Joi.number().strict().integer().positive())
    .description(
      'RPS numbers where the regulator does not require a permit for certain activities. Each must be a positive integer.'
    ),

  phoneNumber: Joi.string()
    .custom(
      validateWithBooleanHelper(
        isValidPhoneNumber,
        'receiver.phoneNumber must be a valid UK or Irish phone number.'
      )
    )
    .description('Phone number of the receiving organisation.'),

  emailAddress: Joi.string()
    .email()
    .description('Email address of the receiving organisation.'),

  authorisationNumber: Joi.string()
    .strict()
    .custom(
      validateWithBooleanHelper(
        isValidAuthorisationNumber,
        'Site authorisation number must be in a valid UK format.'
      )
    )
    .required()
    .description(
      "One authorisation number per receipt. Must match a valid UK format pattern. Invalid format returns: 'Site authorisation number must be in a valid UK format'."
    )
}).description('Receiving organisation and site details.')

const receiptSiteSchema = Joi.object({
  address: receiptAddressSchema
    .required()
    .description('Address where the waste is physically received.')
}).description('Physical receipt site details.')

export const receiptMovementSchema = Joi.object({
  yourUniqueReference: Joi.string()
    .description(
      "No specific business rules. For operator's own reference purposes."
    ),

  specialHandlingRequirements: Joi.string()
    .max(5000)
    .description(
      'Required for abnormal hazardous waste or non-hazardous waste with harmful chemical, biological or physical characteristics.'
    ),

  otherReferencesForMovement: Joi.array()
    .items(otherReferenceSchema)
    .description(
      'Optional array of label/reference pairs. If an object is included, both label and reference are required together.'
    ),

  hazardousWasteConsignmentCode: Joi.string()
    .empty('')
    .empty(null)
    .custom(
      validateWithBooleanHelper(
        isValidHazardousWasteConsignmentCode,
        'hazardousWasteConsignmentCode must match one of the accepted region-specific consignment code formats.'
      )
    )
    .description(
      'Mandatory if any EWC code in the movement is hazardous. Must match any of the region-specific formats exactly. Not required if all EWC codes are non-hazardous.'
    ),

  reasonForNoConsignmentCode: Joi.string()
    .valid(...NO_CONSIGNMENT_REASONS)
    .empty('')
    .empty(null)
    .description(
      'Required if waste is hazardous and no hazardousWasteConsignmentCode is provided. Must not be provided if a consignment code is present. The two fields are mutually exclusive.'
    ),

  dateTimeReceived: Joi.date()
    .iso()
    .required()
    .description(
      'Date and exact time waste was received at site. UTC is the global standard; BST is UTC+1 from late March to late October. Both formats accepted.'
    ),

  apiCode: Joi.string()
    .uuid()
    .required()
    .description(
      'Unique identifier of the receiving organisation produced by the Waste Tracking Service registration process.'
    ),

  wasteItems: Joi.array()
    .items(wasteItemSchema)
    .min(1)
    .required()
    .description('At least one waste item is required.'),

  receiver: receiverSchema.required(),

  receipt: receiptSiteSchema.required(),

  carrier: carrierSchema.required(),

  brokerOrDealer: brokerOrDealerSchema.optional()
})
  .custom(validateReceiptConsignmentRules, 'receipt movement consignment business rules')
  .description('Receipt movement event payload.')

// Alias retained for projects that currently import receiptJoi.
export const receiptJoi = receiptMovementSchema

export default receiptMovementSchema
