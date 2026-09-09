/**
 * Shared types used across all DWT event schemas (Creation, Collection,
 * Drop-off, Receipt). Import from here rather than from individual event
 * files to avoid duplication.
 *
 * Receipt-specific types (ReceiptAddress, Receipt, Receiver) remain in
 * receiptTypes.ts to avoid disturbing the Phase 1 contract.
 */

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export type WeightMetric = 'Grams' | 'Kilograms' | 'Tonnes'

export type PhysicalForm = 'Gas' | 'Liquid' | 'Solid' | 'Powder' | 'Sludge' | 'Mixed'

export type ComponentSource =
  | 'NOT_PROVIDED'
  | 'PROVIDED_WITH_WASTE'
  | 'GUIDANCE'
  | 'OWN_TESTING'

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

export type ReasonForNoConsignmentCode =
  | 'NON_HAZ_WASTE_TRANSFER'
  | 'NO_DOC_WITH_WASTE'
  | 'HWRC_RECEIPT'

// ---------------------------------------------------------------------------
// Common value objects
// ---------------------------------------------------------------------------

export type Weight = {
  metric: WeightMetric
  isEstimate: boolean
  amount: number
}

export type DisposalOrRecoveryCode = {
  /** Valid code from GET /reference-data/disposal-or-recovery-codes. */
  code: string
  /** Weight of waste being disposed of or recovered under this code. */
  weight: Weight
}

/**
 * Business address used by carrier, broker, producer and receiver parties.
 * fullAddress is optional by default; postcode is always required.
 * Event-specific schemas can tighten this, for example Creation receiver
 * requires both fullAddress and postcode when receiver.siteName is populated.
 */
export type BusinessAddress = {
  fullAddress?: string
  postcode: string
}

export type OtherReferenceForMovement = {
  /** Label identifying the reference type, e.g. "transferNoteNumber" */
  label: string
  /** The reference value. */
  reference: string
}

export type ValidationResult = {
  key: string
  errorType: string
  message: string
}

// ---------------------------------------------------------------------------
// Waste classification sub-types
// ---------------------------------------------------------------------------

export type PopComponent = {
  /** Must be a valid code from GET /reference-data/pop-names */
  code?: string
  concentration?: number | null
}

export type Pops = {
  sourceOfComponents: ComponentSource
  /**
   * Required when sourceOfComponents is GUIDANCE or OWN_TESTING.
   * Forbidden when sourceOfComponents is NOT_PROVIDED.
   * Optional when sourceOfComponents is PROVIDED_WITH_WASTE.
   */
  components?: PopComponent[]
}

export type HazardousComponent = {
  name?: string
  concentration?: number | null
}

export type Hazardous = {
  sourceOfComponents: ComponentSource
  /** Valid codes from GET /reference-data/hazardous-property-codes. Duplicates removed. */
  hazCodes: string[]
  /**
   * Required when sourceOfComponents is GUIDANCE or OWN_TESTING.
   * Forbidden when sourceOfComponents is NOT_PROVIDED.
   */
  components?: HazardousComponent[]
}

// ---------------------------------------------------------------------------
// Party types shared across events
// ---------------------------------------------------------------------------

/**
 * Carrier organisation and transport details.
 *
 * Some events tighten this shape. For Creation, only meansOfTransport is
 * mandatory, so creationTypes.ts defines a Creation-specific Carrier type.
 */
export type CarrierDetails = {
  /**
   * May be null or empty string when a reason is supplied instead.
   * Must match a valid England / SEPA / NRW / NI carrier registration format
   * when a value is provided.
   */
  registrationNumber?: string | null
  /**
   * Required when registrationNumber is null or empty on events that need a
   * full carrier record. Creation treats this as optional.
   */
  reasonForNoRegistrationNumber?: CarrierReasonForNoRegistrationNumber
  organisationName: string
  meansOfTransport: MeansOfTransport
  /** Required when meansOfTransport is Road on events that need vehicle detail. */
  vehicleRegistration?: string
  /** Description when meansOfTransport is Other. */
  otherMeansOfTransport?: string
  emailAddress?: string
  phoneNumber?: string
  address?: BusinessAddress
}

/**
 * Broker or dealer who arranged the movement.
 * Required only when the movement is broker/dealer initiated.
 */
export type BrokerDetails = {
  organisationName: string
  registrationNumber?: string | null
  emailAddress?: string
  phoneNumber?: string
  address?: BusinessAddress
}

/**
 * Driver performing a collection or drop-off event.
 * Distinct from the carrier organisation. Currently carries name only —
 * full driver model to be defined as the spec matures.
 */
export type DriverDetails = {
  name?: string
}
