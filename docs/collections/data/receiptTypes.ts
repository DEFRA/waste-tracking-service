/**
 * TypeScript types for the Record Receipt event.
 * POST /transfers/{transferId}/receipt
 *
 * The transferId is a path parameter and is not included in the request body.
 * The request body below contains only the receipt details recorded by the receiver.
 */

export type WeightMetric =
  | 'Grams'
  | 'Kilograms'
  | 'Tonnes'

export type PhysicalForm =
  | 'Gas'
  | 'Liquid'
  | 'Solid'
  | 'Powder'
  | 'Sludge'
  | 'Mixed'

export type ComponentSource =
  | 'NOT_PROVIDED'
  | 'PROVIDED_WITH_WASTE'
  | 'GUIDANCE'
  | 'OWN_TESTING'

export type ReasonForNoConsignmentCode =
  | 'NON_HAZ_WASTE_TRANSFER'
  | 'NO_DOC_WITH_WASTE'
  | 'HWRC_RECEIPT'

export type MeansOfTransport =
  | 'Road'
  | 'Rail'
  | 'Air'
  | 'Sea'
  | 'Inland Waterway'
  | 'Piped'
  | 'Other'

export type CarrierReasonForNoRegistrationNumber =
  | 'ON_SITE'
  | 'HOUSEHOLD'
  | 'ONE_OFF'
  | 'MARINE'

export type ReceiptMovement = {
  // Request root
  yourUniqueReference?: string
  specialHandlingRequirements?: string
  otherReferencesForMovement?: OtherReferenceForMovement[]

  hazardousWasteConsignmentCode?: string
  reasonForNoConsignmentCode?: ReasonForNoConsignmentCode

  dateTimeReceived: string
  apiCode: string

  // Main objects
  wasteItems: WasteItem[]
  receiver: Receiver
  receipt: Receipt
  carrier: Carrier
  brokerOrDealer?: BrokerOrDealer
}

export type OtherReferenceForMovement = {
  reference: string
  label: string
}

export type Weight = {
  metric: WeightMetric
  isEstimate: boolean
  amount: number
}

export type WasteItem = {
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

export type DisposalOrRecoveryCode = {
  weight: Weight
  code: string
}

export type Pops = {
  sourceOfComponents: ComponentSource
  components?: PopComponent[]
}

export type PopComponent = {
  concentration?: number
  code?: string
}

export type Hazardous = {
  sourceOfComponents: ComponentSource
  hazCodes: string[]
  components?: HazardousComponent[]
}

export type HazardousComponent = {
  name?: string
  concentration?: number
}

export type Receiver = {
  siteName: string
  regulatoryPositionStatements?: number[]
  phoneNumber?: string
  emailAddress?: string
  authorisationNumber: string
}

export type Receipt = {
  address: ReceiptAddress
}

export type ReceiptAddress = {
  postcode: string
  fullAddress: string
}

export type Carrier = {
  vehicleRegistration?: string
  registrationNumber?: string
  reasonForNoRegistrationNumber?: CarrierReasonForNoRegistrationNumber

  phoneNumber?: string
  organisationName: string
  meansOfTransport: MeansOfTransport
  emailAddress?: string

  address?: CarrierAddress
}

export type CarrierAddress = {
  postcode: string
  fullAddress?: string
}

export type BrokerOrDealer = {
  registrationNumber?: string
  phoneNumber?: string
  organisationName: string
  emailAddress?: string
  address?: BrokerOrDealerAddress
}

export type BrokerOrDealerAddress = {
  postcode: string
  fullAddress?: string
}