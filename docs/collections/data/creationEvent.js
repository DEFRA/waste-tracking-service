/**
 * Example payloads for the Create Movement event.
 * POST /movements
 *
 * Mirrors the structure of receiptEvent.js — individual named exports for each
 * sub-object so tests can compose or override parts independently.
 *
 * Creation-specific alignment notes:
 * - apiCode is present as per Receipt.
 * - estimatedDateTimeCollected follows the Receipt date/time naming style.
 * - Object names are producer, carrier, brokerOrDealer and receiver.
 * - wasteItems use the same structure as Receipt. disposalOrRecoveryCodes are optional at Creation.
 * - carrier follows the Receipt carrier structure, but only requires meansOfTransport at Creation.
 *   Optional carrier fields still retain integrity rules when supplied.
 *   This example includes extra carrier details.
 */

// ---------------------------------------------------------------------------
// Sub-objects
// ---------------------------------------------------------------------------

export const producer = {
  wasteSource: 'Commercial',
  organisationName: 'ACME Waste Producers Ltd',
  authorisationNumber: 'EAS/P/123456',
  address: {
    fullAddress: '10 Industrial Way, Test City',
    postcode: 'TE1 2PQ'
  },
  emailAddress: 'producer@example.com',
  phoneNumber: '01234567890',
  sicCode: '38110', // Collection of non-hazardous waste
  councilMovement: false
}

export const municipalProducer = {
  wasteSource: 'Municipal',
  organisationName: 'Test Council',
  address: {
    fullAddress: 'Council Depot, Test City',
    postcode: 'TE1 5CD'
  },
  emailAddress: 'waste.services@example.gov.uk',
  phoneNumber: '01234567890',
  councilMovement: true
}

export const carrier = {
  registrationNumber: 'CBDU123456',
  organisationName: 'Test Carrier Ltd',
  address: {
    fullAddress: '1 Carrier Way, Test City',
    postcode: 'TE1 1ST'
  },
  emailAddress: 'carrier@example.com',
  phoneNumber: '01234567890',
  meansOfTransport: 'Road',
  vehicleRegistration: 'AB12 CDE'
}

// Minimal valid carrier at Creation — meansOfTransport is the only mandatory carrier field.
// vehicleRegistration is optional for Road at Creation, but if provided it is only valid for Road.
export const minimalCreationCarrier = {
  meansOfTransport: 'Road'
}

// reasonForNoRegistrationNumber is optional at Creation, but must not be supplied
// together with a valid registrationNumber.
// otherMeansOfTransport is optional, but only valid when meansOfTransport is Other.
export const carrierWithoutRegistrationNumber = {
  meansOfTransport: 'Other',
  reasonForNoRegistrationNumber: 'ONE_OFF',
  otherMeansOfTransport: 'Trailer moved by site equipment'
}

export const brokerOrDealer = {
  organisationName: 'Broker Demo Ltd',
  registrationNumber: 'CBDU654321',
  address: {
    fullAddress: '2 Broker Yard, Test City',
    postcode: 'TE1 1ST'
  },
  emailAddress: 'broker@example.com',
  phoneNumber: '01112223333'
}

// Required at Creation only for hazardous waste. If siteName is populated,
// authorisationNumber and address are mandatory.
export const receiver = {
  siteName: 'Test Receiver Site',
  authorisationNumber: 'HP3456XX',
  emailAddress: 'receiver@example.com',
  phoneNumber: '01234567890',
  address: {
    fullAddress: '99 Receiver Road, Test City',
    postcode: 'TE1 3RX'
  }
}

export const wasteItems = [
  {
    ewcCodes: ['200121'],
    wasteDescription: 'Fluorescent tubes and other mercury-containing waste',
    physicalForm: 'Solid',
    numberOfContainers: 4,
    typeOfContainers: 'SKI',
    weight: {
      metric: 'Tonnes',
      amount: 0.5,
      isEstimate: true
    },
    // Optional at Creation — intended/planned treatment only.
    // The treatment outcome is determined at Receipt.
    disposalOrRecoveryCodes: [
      {
        code: 'R1',
        weight: {
          metric: 'Tonnes',
          amount: 0.5,
          isEstimate: true
        }
      }
    ],
    containsPops: true,
    pops: {
      sourceOfComponents: 'PROVIDED_WITH_WASTE'
      // components omitted — source is PROVIDED_WITH_WASTE so list is optional
    },
    containsHazardous: true,
    hazardous: {
      sourceOfComponents: 'GUIDANCE',
      hazCodes: ['HP_4'],
      components: [
        {
          name: 'Mercury',
          concentration: 5
        }
      ]
    }
  }
]

// ---------------------------------------------------------------------------
// Request bodies
// ---------------------------------------------------------------------------

// Carrier-initiated movement (no brokerOrDealer)
export const publicPostBody = {
  apiCode: '25b14080-5e77-4f91-9957-2482a0cb8775',
  estimatedDateTimeCollected: '2025-09-15T08:00:00Z',
  hazardousWasteConsignmentCode: 'CJ123E/A0001',
  yourUniqueReference: 'CARRIER-JOB-001',
  otherReferencesForMovement: [
    {
      label: 'purchaseOrderNumber',
      reference: 'PO-98765'
    }
  ],
  specialHandlingRequirements: 'Handle with care and keep upright.',
  producer,
  carrier,
  receiver,
  wasteItems
  // brokerOrDealer omitted — optional
}

// Broker/dealer-initiated movement
export const brokerInitiatedPostBody = {
  ...publicPostBody,
  brokerOrDealer
}

// Minimal Creation carrier example inside an otherwise valid hazardous movement.
export const minimalCarrierPostBody = {
  ...publicPostBody,
  carrier: minimalCreationCarrier
}

// ---------------------------------------------------------------------------
// Variant: household waste (simpler producer, no org/permit/SIC fields)
// ---------------------------------------------------------------------------

export const householdProducer = {
  wasteSource: 'Household',
  address: {
    fullAddress: '5 Elm Street, Test Town',
    postcode: 'TE2 4HH'
  },
  councilMovement: true
  // organisationName, authorisationNumber, sicCode, emailAddress, phoneNumber — all forbidden for Household
}

// ---------------------------------------------------------------------------
// Variant: non-hazardous movement — receiver optional
// ---------------------------------------------------------------------------

export const nonHazardousWasteItems = [
  {
    ewcCodes: ['200101'],
    wasteDescription: 'Paper and cardboard',
    physicalForm: 'Solid',
    numberOfContainers: 2,
    typeOfContainers: 'BAG',
    weight: {
      metric: 'Tonnes',
      amount: 0.2,
      isEstimate: true
    },
    // disposalOrRecoveryCodes omitted — optional at Creation.
    containsPops: false,
    containsHazardous: false
  }
]

export const nonHazardousPostBodyWithoutReceiver = {
  apiCode: '25b14080-5e77-4f91-9957-2482a0cb8775',
  estimatedDateTimeCollected: '2025-09-15T08:00:00Z',
  yourUniqueReference: 'CARRIER-JOB-002',
  producer,
  carrier: minimalCreationCarrier,
  wasteItems: nonHazardousWasteItems
}

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

// Server mints and returns the Movement ID
export const createMovementResponse = {
  movementId: '25HRA0B2'
}

export const createMovementResponseWithWarnings = {
  movementId: '25HRA0B2',
  validation: {
    warnings: [
      {
        key: 'receiver.authorisationNumber',
        errorType: 'NotProvided',
        message: 'Receiver authorisation number was not provided at creation.'
      }
    ]
  }
}
