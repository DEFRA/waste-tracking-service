/**
 * TypeScript types for the Create Movement event.
 * POST /movements → returns movementId
 *
 * The creation record is the starting point of the waste journey. It captures
 * who is producing the waste, the estimated collection date/time, the carrier
 * transport method, and the waste item structure used by the Receipt event.
 *
 * Creation-specific business rules reflected here:
 * - apiCode is required, as per the Receipt event.
 * - Date/time fields follow the Receipt naming style: dateTimeReceived → estimatedDateTimeCollected.
 * - Object names align with the spreadsheet / Receipt shape: producer, carrier, brokerOrDealer, receiver.
 * - carrier follows the Receipt carrier structure, but only carrier.meansOfTransport is mandatory at Creation.
 *   Optional carrier fields still keep integrity rules when supplied: registrationNumber
 *   and reasonForNoRegistrationNumber are mutually exclusive; vehicleRegistration is
 *   only for Road; otherMeansOfTransport is only for Other.
 * - producer.councilMovement uses the BA spreadsheet name.
 * - receiver is required only when the movement contains hazardous waste.
 * - receiver.authorisationNumber and receiver.address are mandatory when receiver.siteName is populated.
 */

export type {
  WeightMetric,
  PhysicalForm,
  ComponentSource,
  MeansOfTransport,
  CarrierReasonForNoRegistrationNumber,
  ReasonForNoConsignmentCode,
  OtherReferenceForMovement,
  Weight,
  DisposalOrRecoveryCode,
  BusinessAddress,
  Pops,
  PopComponent,
  Hazardous,
  HazardousComponent,
  CarrierDetails,
  BrokerDetails,
  ValidationResult
} from './sharedTypes.js'

import type {
  PhysicalForm,
  MeansOfTransport,
  CarrierReasonForNoRegistrationNumber,
  ReasonForNoConsignmentCode,
  OtherReferenceForMovement,
  Weight,
  DisposalOrRecoveryCode,
  BusinessAddress,
  Pops,
  Hazardous,
  BrokerDetails,
  ValidationResult
} from './sharedTypes.js'

// ---------------------------------------------------------------------------
// Producer
// ---------------------------------------------------------------------------

export type WasteSource = 'Household' | 'Commercial' | 'Municipal'

/**
 * Producer information.
 *
 * Commercial waste requires the producer organisation, authorisation number and
 * SIC code. Household waste must not provide those business-only fields.
 * Municipal waste is accepted as a distinct waste source; its final field
 * conditionality can be tightened once BA rules are confirmed.
 *
 * Creation does not currently carry a separate collection object or collection
 * address/contact workaround fields.
 */
export type Producer = {
  wasteSource: WasteSource

  organisationName?: string
  /** Environmental permit or exemption number the producer operates under. */
  authorisationNumber?: string
  emailAddress?: string
  phoneNumber?: string
  /** Five-digit Standard Industrial Classification code for the process that created this waste. */
  sicCode?: string

  address: BusinessAddress
  /** Whether this movement is carried out by, or on behalf of, a council. */
  councilMovement: boolean
}

// ---------------------------------------------------------------------------
// Creation-specific carrier
// ---------------------------------------------------------------------------

/**
 * Carrier details at Creation.
 *
 * Same field structure as Receipt carrier, with relaxed Creation requiredness.
 * Only meansOfTransport is mandatory at Creation. Other carrier fields can be
 * supplied when known and are validated when present.
 *
 * Integrity rules still apply:
 * - registrationNumber and reasonForNoRegistrationNumber are mutually exclusive.
 * - vehicleRegistration may be supplied only when meansOfTransport is 'Road'.
 * - otherMeansOfTransport may be supplied only when meansOfTransport is 'Other'.
 */
export type Carrier = {
  meansOfTransport: MeansOfTransport
  registrationNumber?: string | null
  reasonForNoRegistrationNumber?: CarrierReasonForNoRegistrationNumber
  organisationName?: string
  vehicleRegistration?: string
  otherMeansOfTransport?: string
  emailAddress?: string
  phoneNumber?: string
  address?: BusinessAddress
}

// ---------------------------------------------------------------------------
// Broker / dealer
// ---------------------------------------------------------------------------

export type BrokerOrDealer = BrokerDetails

// ---------------------------------------------------------------------------
// Waste items at creation
// ---------------------------------------------------------------------------

/**
 * A waste item declared at movement creation.
 *
 * Creation uses the same waste item structure as Receipt.
 * disposalOrRecoveryCodes are optional at Creation because they represent an
 * intended or planned treatment outcome at most. The treatment outcome is
 * determined at Receipt.
 */
export type CreateWasteItem = {
  weight: Weight
  wasteDescription: string
  typeOfContainers: string
  physicalForm: PhysicalForm
  numberOfContainers: number
  ewcCodes: string[]
  disposalOrRecoveryCodes?: DisposalOrRecoveryCode[]
  containsPops: boolean
  pops?: Pops
  containsHazardous: boolean
  hazardous?: Hazardous
}

// ---------------------------------------------------------------------------
// Receiver at creation
// ---------------------------------------------------------------------------

export type ReceiverAddress = {
  postcode: string
  fullAddress: string
}

/**
 * Receiver recorded at Creation.
 *
 * Required only for hazardous waste. If siteName is supplied, the receiver
 * authorisation number and full address must also be supplied.
 */
export type Receiver = {
  siteName?: string
  authorisationNumber?: string
  emailAddress?: string
  phoneNumber?: string
  address?: ReceiverAddress
}

// ---------------------------------------------------------------------------
// Create Movement request / response
// ---------------------------------------------------------------------------

export type CreateMovement = {
  /** Unique identifier for the submitting organisation, as per the Receipt event. */
  apiCode: string

  /** Estimated date and time the waste will be collected. ISO 8601. */
  estimatedDateTimeCollected: string

  /** Required when any waste item carries a hazardous EWC code. Mutually exclusive with reasonForNoConsignmentCode. */
  hazardousWasteConsignmentCode?: string
  /** Required when waste is hazardous and no consignment code is provided. Mutually exclusive with hazardousWasteConsignmentCode. */
  reasonForNoConsignmentCode?: ReasonForNoConsignmentCode

  yourUniqueReference?: string
  otherReferencesForMovement?: OtherReferenceForMovement[]
  specialHandlingRequirements?: string

  producer: Producer
  /** Required object at Creation; follows Receipt carrier fields, with only meansOfTransport mandatory. */
  carrier: Carrier
  /** Optional broker/dealer details. */
  brokerOrDealer?: BrokerOrDealer
  /** Required only when the movement contains hazardous waste. */
  receiver?: Receiver
  /** At least one waste item required. */
  wasteItems: CreateWasteItem[]
}

export type CreateMovementResponse = {
  /** The Movement ID minted by the server. 8-character year-prefixed sqid. */
  movementId: string
  validation?: {
    warnings?: ValidationResult[]
  }
}
