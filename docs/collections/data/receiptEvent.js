/**
 * Example payloads for the Record Receipt event.
 * POST /transfers/{transferId}/receipt
 *
 * The transferId is a path parameter and is not included in the request body.
 * The examples below represent the receipt body only.
 */

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

export const brokerOrDealer = {
  organisationName: 'Broker Demo Ltd',
  address: {
    fullAddress: '2 Broker Yard, Test City',
    postcode: 'TE1 1ST'
  },
  registrationNumber: 'CBDU654321',
  phoneNumber: '01112223333',
  emailAddress: 'broker@example.com'
}

export const receiver = {
  siteName: 'Test Receiver',
  emailAddress: 'receiver@example.com',
  phoneNumber: '01234567890',
  authorisationNumber: 'HP3456XX',
  regulatoryPositionStatements: [343]
}

export const receipt = {
  address: {
    fullAddress: '123 Test St, Test City',
    postcode: 'TE1 1ST'
  }
}

export const wasteItems = [
  {
    ewcCodes: ['200121'],
    wasteDescription: 'Fluorescent tubes and other mercury-containing waste',
    physicalForm: 'Solid',
    numberOfContainers: 1,
    typeOfContainers: 'SKI',
    weight: {
      metric: 'Tonnes',
      amount: 1,
      isEstimate: false
    },
    containsPops: true,
    pops: {
      sourceOfComponents: 'PROVIDED_WITH_WASTE',
      components: [
        {
          code: 'END',
          concentration: 10
        }
      ]
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
    },
    disposalOrRecoveryCodes: [
      {
        code: 'R1',
        weight: {
          metric: 'Tonnes',
          amount: 0.75,
          isEstimate: false
        }
      }
    ]
  }
]

export const publicPostBody = {
  apiCode: '25b14080-5e77-4f91-9957-2482a0cb8775',
  dateTimeReceived: '2025-08-29T15:24:00Z',
  hazardousWasteConsignmentCode: 'CJ123E/A0001',
  reasonForNoConsignmentCode: null,
  yourUniqueReference: 'CLIENT-REF-001',
  otherReferencesForMovement: [
    {
      label: 'transferNoteNumber',
      reference: 'TN-12345'
    }
  ],
  specialHandlingRequirements: 'Handle with care and keep upright.',
  wasteItems,
  carrier,
  brokerOrDealer,
  receiver,
  receipt
}

const { apiCode, ...movementWithoutApiCode } = publicPostBody

// External API handler initially wraps the public POST body as movement.
export const backendCreatePayloadBeforeOrganisationLookup = {
  movement: {
    ...publicPostBody
  }
}

// If organisation lookup succeeds, apiCode is replaced with submittingOrganisation.
export const backendCreatePayloadAfterOrganisationLookup = {
  movement: {
    ...movementWithoutApiCode,
    submittingOrganisation: {
      defraCustomerOrganisationId: 'd829f66d-857f-401d-b5e9-5061b7dbb29d'
    }
  }
}

export const storedWasteInputWithApiCode = {
  wasteTrackingId: '2578ZCY8',
  orgId: '57aed195-325e-45d5-b1fb-5f201e0324cf',
  receipt: {
    movement: {
      ...publicPostBody
    }
  }
}

export const storedWasteInputWithSubmittingOrganisation = {
  wasteTrackingId: '2578ZCY8',
  submittingOrganisation: {
    defraCustomerOrganisationId: 'd829f66d-857f-401d-b5e9-5061b7dbb29d'
  },
  receipt: {
    movement: {
      ...movementWithoutApiCode
    }
  }
}