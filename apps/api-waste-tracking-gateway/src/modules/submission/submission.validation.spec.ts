import { faker } from '@faker-js/faker';
import {
  validateCreateSubmissionRequest,
  validatePutReferenceRequest,
  validatePutWasteDescriptionRequest,
  validatePutDraftWasteQuantityRequest,
  validatePutExporterDetailRequest,
  validatePutImporterDetailRequest,
  validatePutDraftCollectionDateRequest,
  validateSetCarriersRequest,
  validateSetCollectionDetailRequest,
  validatePutExitLocationRequest,
  validatePutTransitCountriesRequest,
  validateSetRecoveryFacilityDetailRequest,
  validatePutSubmissionConfirmationRequest,
  validatePutSubmissionDeclarationRequest,
  validatePutSubmissionCancellationRequest,
  validatePutSubmissionWasteQuantityRequest,
  validatePutSubmissionCollectionDateRequest,
} from './submission.validation';

describe('validateCreateSubmissionRequest', () => {
  const validate = validateCreateSubmissionRequest;

  it('Rejects invalid values', () => {
    expect(validate(undefined)).toBe(false);
    expect(validate({})).toBe(false);
    expect(validate(faker.string.sample(10))).toBe(false);
    expect(validate({ ref: faker.string.sample(10) })).toBe(false);
    expect(validate({ reference: faker.number.int() })).toBe(false);
    expect(validate({ reference: faker.datatype.boolean() })).toBe(false);
    expect(validate({ reference: {} })).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(validate({ reference: faker.string.sample(10) })).toBe(true);
  });
});

describe('validatePutReferenceRequest', () => {
  const validate = validatePutReferenceRequest;

  it('Rejects invalid values', () => {
    expect(validate(faker.number.int())).toBe(false);
    expect(validate([])).toBe(false);
    expect(validate({})).toBe(false);
    expect(validate({ reference: faker.string.sample(10) })).toBe(false);
    expect(validate(undefined)).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(validate(faker.string.sample(10))).toBe(true);
  });
});

describe('validatePutWasteDescriptionRequest', () => {
  const validate = validatePutWasteDescriptionRequest;

  it('Rejects invalid values', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'Started',
        wasteCode: { type: 'NotApplicable', code: faker.string.sample(10) },
      }),
    ).toBe(false);

    expect(
      validate({
        status: 'Started',
        nationalCode: { provided: 'No', code: faker.string.sample(10) },
      }),
    ).toBe(false);

    expect(
      validate({
        status: 'Complete',
        wasteCode: { type: 'BaselAnnexIX', code: faker.string.sample(10) },
      }),
    ).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        status: 'NotStarted',
      }),
    ).toBe(true);

    expect(
      validate({
        status: 'Started',
        wasteCode: { type: 'NotApplicable' },
      }),
    ).toBe(true);

    expect(
      validate({
        status: 'Started',
        wasteCode: { type: 'BaselAnnexIX', code: faker.string.sample(10) },
      }),
    ).toBe(true);

    expect(
      validate({
        status: 'Complete',
        wasteCode: { type: 'AnnexIIIA', code: faker.string.sample(10) },
        ewcCodes: [
          {
            code: '010101',
          },
        ],
        nationalCode: { provided: 'No' },
        description: 'Waste',
      }),
    ).toBe(true);
  });
});

describe('validatePutDraftWasteQuantityRequest', () => {
  const validate = validatePutDraftWasteQuantityRequest;

  it('Rejects invalid values', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'Started',
        value: {
          type: 'NotApplicable',
          value: faker.string.sample(10),
        },
      }),
    ).toBe(false);

    expect(
      validate({
        status: 'NotStarted',
        value: {
          type: 'ActualData',
          quantityType: 'Volume',
          value: faker.number.float(),
        },
      }),
    ).toBe(false);

    expect(
      validate({
        status: 'Complete',
        value: {
          type: 'EstimateData',
          value: faker.number.float(),
        },
      }),
    ).toBe(false);

    expect(
      validate({
        status: 'Started',
        value: {
          type: 'ActualData',
          quantityType: 'Weight',
          value: faker.string.sample(10),
        },
      }),
    ).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        status: 'NotStarted',
      }),
    ).toBe(true);

    expect(
      validate({
        status: 'Started',
      }),
    ).toBe(true);

    expect(
      validate({
        status: 'Started',
        value: { type: 'NotApplicable' },
      }),
    ).toBe(true);

    expect(
      validate({
        status: 'Started',
        value: {
          type: 'ActualData',
          actualData: {
            quantityType: 'Weight',
            value: faker.number.float({ multipleOf: 0.01 }),
          },
          estimateData: {},
        },
      }),
    ).toBe(true);

    expect(
      validate({
        status: 'Complete',
        value: {
          type: 'ActualData',
          actualData: {
            quantityType: 'Weight',
            value: faker.number.float({ multipleOf: 0.01 }),
          },
          estimateData: {},
        },
      }),
    ).toBe(true);
  });
});

describe('validatePutSubmissionWasteQuantityRequest', () => {
  const validate = validatePutSubmissionWasteQuantityRequest;

  it('Rejects invalid values', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        type: 'NotApplicable',
        value: faker.string.sample(10),
      }),
    ).toBe(false);

    expect(
      validate({
        type: 'ActualData',
        quantityType: 'Volume',
        value: faker.number.float(),
      }),
    ).toBe(false);

    expect(
      validate({
        type: 'EstimateData',
        value: faker.number.float(),
      }),
    ).toBe(false);

    expect(
      validate({
        type: 'ActualData',
        quantityType: 'Weight',
        value: faker.string.sample(10),
      }),
    ).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        type: 'ActualData',
        actualData: {
          quantityType: 'Weight',
          value: faker.number.float({ multipleOf: 0.01 }),
        },
        estimateData: {},
      }),
    ).toBe(true);

    expect(
      validate({
        type: 'EstimateData',
        actualData: {
          quantityType: 'Weight',
          value: faker.number.float({ multipleOf: 0.01 }),
        },
        estimateData: {
          quantityType: 'Weight',
          value: faker.number.float({ multipleOf: 0.01 }),
        },
      }),
    ).toBe(true);
  });
});

describe('validatePutExporterDetailRequest', () => {
  test('should return true for object with status: NotStarted', () => {
    expect(validatePutExporterDetailRequest({ status: 'NotStarted' })).toBe(
      true,
    );
  });

  test('should return true for object without faxNumber', () => {
    const data = {
      status: 'Started',
      exporterContactDetails: {
        organisationName: 'Acme Inc.',
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: '555-1234',
      },
    };
    expect(validatePutExporterDetailRequest(data)).toBe(true);
  });

  it('should return false for a request with a missing property', () => {
    const data = {
      status: 'Complete',
      exporterAddress: {
        addressLine1: '123 Main St',
        addressLine2: '',
        townCity: 'Anytown',
        postcode: '12345',
      },
      exporterContactDetails: {
        organisationName: 'Acme Inc.',
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: '555-1234',
        faxNumber: '555-5678',
      },
    };

    expect(validatePutExporterDetailRequest(data)).toBe(false);
  });

  it('should return true for a request with a missing addressLine2 and postcode', () => {
    const data = {
      status: 'Complete',
      exporterAddress: {
        addressLine1: '123 Main St',
        townCity: 'Anytown',
        country: 'UK',
      },
      exporterContactDetails: {
        organisationName: 'Acme Inc.',
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: '555-1234',
        faxNumber: '555-5678',
      },
    };
    expect(validatePutExporterDetailRequest(data)).toBe(true);
  });

  test('should return false for object with invalid exporterAddress', () => {
    const data = {
      status: 'Started',
      exporterAddress: {
        addressLine1: 123,
        townCity: 'Anytown',
        postcode: '12345',
        country: 'UK',
      },
    };
    expect(validatePutExporterDetailRequest(data)).toBe(false);
  });

  test('should return false for object with invalid exporterContactDetails', () => {
    const data = {
      status: 'Started',
      exporterContactDetails: {
        fullName: 'John Doe',
        emailAddress: 123,
      },
    };
    expect(validatePutExporterDetailRequest(data)).toBe(false);
  });

  test('should return false for object where status is not started', () => {
    const data = {
      status: 'NotStarted',
      exporterContactDetails: {
        fullName: 'John Doe',
      },
    };
    expect(validatePutExporterDetailRequest(data)).toBe(false);
  });
});

describe('validatePutImporterDetailRequest', () => {
  test('should return true for object with status: NotStarted', () => {
    expect(validatePutImporterDetailRequest({ status: 'NotStarted' })).toBe(
      true,
    );
  });

  it('should return true for a request with a complete importer detail', () => {
    const data = {
      status: 'Started',
      importerAddressDetails: {
        organisationName: 'Acme Inc',
        address: '123 Anytown',
        country: 'UK',
      },
      importerContactDetails: {
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: '555-1234',
        faxNumber: '555-5678',
      },
    };
    expect(validatePutImporterDetailRequest(data)).toBe(true);
  });

  it('should return false for a request with a missing property', () => {
    const data = {
      status: 'Complete',
      importerContactDetails: {
        organisationName: 'Acme Inc.',
        address: '123 Anytown',
        country: undefined,
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: '555-1234',
        faxNumber: '555-5678',
      },
    };

    expect(validatePutImporterDetailRequest(data)).toBe(false);
  });

  test('should return false for object with invalid importerContactDetails', () => {
    const data = {
      status: 'Started',
      importerContactDetails: {
        organisationName: 'Acme Inc.',
        address: '123 Anytown',
        country: 'UK',
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: 5551234,
        faxNumber: '555-5678',
      },
    };
    expect(validatePutImporterDetailRequest(data)).toBe(false);
  });

  test('should return false for object where status is not started', () => {
    const data = {
      status: 'NotStarted',
      importerContactDetails: {
        fullName: 'John Doe',
      },
    };
    expect(validatePutImporterDetailRequest(data)).toBe(false);
  });
});

describe('validatePutDraftCollectionDateRequest', () => {
  const validate = validatePutDraftCollectionDateRequest;

  it('Rejects invalid values', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'NotStarted',
        value: {
          type: 'ActualDate',
        },
      }),
    ).toBe(false);

    expect(
      validate({
        status: 'Started',
      }),
    ).toBe(false);

    expect(
      validate({
        status: 'Complete',
        value: {
          type: 'EstimateData',
        },
      }),
    ).toBe(false);

    expect(
      validate({
        status: 'Complete',
        value: {
          type: 'ActualDate',
          actualDate: {
            day: 10,
            month: 12,
            year: 2020,
          },
          estimateDate: {},
        },
      }),
    ).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        status: 'NotStarted',
      }),
    ).toBe(true);

    expect(
      validate({
        status: 'Complete',
        value: {
          type: 'ActualDate',
          actualDate: {
            day: '10',
            month: '07',
            year: '2020',
          },
          estimateDate: {},
        },
      }),
    ).toBe(true);
  });
});

describe('validatePutSubmissionCollectionDateRequest', () => {
  const validate = validatePutSubmissionCollectionDateRequest;

  it('Rejects invalid values', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        type: 'ActualDate',
      }),
    ).toBe(false);

    expect(validate({})).toBe(false);

    expect(
      validate({
        type: 'EstimateData',
      }),
    ).toBe(false);

    expect(
      validate({
        type: 'ActualDate',
        actualDate: {
          day: 10,
          month: 12,
          year: 2020,
        },
        estimateDate: {},
      }),
    ).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        type: 'ActualDate',
        actualDate: {
          day: '10',
          month: '07',
          year: '2020',
        },
        estimateDate: {},
      }),
    ).toBe(true);

    expect(
      validate({
        type: 'EstimateDate',
        actualDate: {
          day: '10',
          month: '07',
          year: '2020',
        },
        estimateDate: {
          day: '10',
          month: '07',
          year: '2020',
        },
      }),
    ).toBe(true);
  });
});

describe('validateSetCarriersRequest', () => {
  it('should return true for a request with a complete carrier detail and transport type shipping container', () => {
    const data = {
      status: 'Started',
      transport: true,
      values: [
        {
          id: faker.string.uuid(),
          addressDetails: {
            organisationName: 'Acme Inc',
            address: '123 Anytown',
            country: 'UK',
          },
          contactDetails: {
            fullName: 'John Doe',
            emailAddress: 'johndoe@acme.com',
            phoneNumber: '555-1234',
            faxNumber: '555-5678',
          },
          transportDetails: {
            type: 'Road',
            description: 'In my car',
          },
        },
      ],
    };
    expect(validateSetCarriersRequest(data)).toBe(true);
  });

  it('should return true for a request with a complete carrier detail and transport type trailer', () => {
    const data = {
      status: 'Started',
      transport: true,
      values: [
        {
          id: faker.string.uuid(),
          addressDetails: {
            organisationName: 'Acme Inc',
            address: '123 Anytown',
            country: 'UK',
          },
          contactDetails: {
            fullName: 'John Doe',
            emailAddress: 'johndoe@acme.com',
            phoneNumber: '555-1234',
            faxNumber: '555-5678',
          },
          transportDetails: {
            type: 'Sea',
            description: 'Somewhere beyond the sea...',
          },
        },
      ],
    };
    expect(validateSetCarriersRequest(data)).toBe(true);
  });

  it('should return true for a request with a complete carrier detail and transport type bulk vessel', () => {
    const data = {
      status: 'Started',
      transport: true,
      values: [
        {
          id: faker.string.uuid(),
          addressDetails: {
            organisationName: 'Acme Inc',
            address: '123 Anytown',
            country: 'UK',
          },
          contactDetails: {
            fullName: 'John Doe',
            emailAddress: 'johndoe@acme.com',
            phoneNumber: '555-1234',
            faxNumber: '555-5678',
          },
          transportDetails: {
            type: 'Sea',
            description: 'Somewhere beyond the sea...',
          },
        },
      ],
    };

    expect(validateSetCarriersRequest(data)).toBe(true);
  });

  it('should return false for a request with a invalid transportDetails', () => {
    const data = {
      status: 'Started',
      transport: true,
      values: [
        {
          id: faker.string.uuid(),
          addressDetails: {
            organisationName: 'Acme Inc',
            address: '123 Anytown',
            country: 'UK',
          },
          contactDetails: {
            fullName: 'John Doe',
            emailAddress: 'johndoe@acme.com',
            phoneNumber: '555-1234',
            faxNumber: '555-5678',
          },
          transportDetails: {
            type: 'BeamMeUpScotty',
            description: 'Somewhere beyond the sea...',
          },
        },
      ],
    };

    expect(validateSetCarriersRequest(data)).toBe(false);
  });

  it('should return false for a request with a missing id property', () => {
    const data = {
      status: 'Started',
      transport: true,
      values: [
        {
          addressDetails: {
            fullName: 'John Doe',
            emailAddress: 'johndoe@acme.com',
            phoneNumber: 5551234,
            faxNumber: '555-5678',
          },
          contactDetails: {
            fullName: 'John Doe',
            emailAddress: 'johndoe@acme.com',
            phoneNumber: '555-1234',
            faxNumber: '555-5678',
          },
          transportDetails: {
            type: 'Air',
            description: 'RyanAir',
          },
        },
      ],
    };

    expect(validateSetCarriersRequest(data)).toBe(false);
  });

  it('should return false for object with invalid addressDetails', () => {
    const data = {
      status: 'Started',
      transport: true,
      values: [
        {
          id: faker.string.uuid(),
          addressDetails: {
            fullName: 'John Doe',
            emailAddress: 'johndoe@acme.com',
            phoneNumber: 5551234,
            faxNumber: '555-5678',
          },
          contactDetails: {
            fullName: 'John Doe',
            emailAddress: 'johndoe@acme.com',
            phoneNumber: '555-1234',
            faxNumber: '555-5678',
          },
          transportDetails: {
            type: 'Air',
            description: 'RyanAir',
          },
        },
      ],
    };

    expect(validateSetCarriersRequest(data)).toBe(false);
  });
});

describe('validateSetCollectionDetailRequest', () => {
  it('should return true for object with status: NotStarted', () => {
    expect(validateSetCollectionDetailRequest({ status: 'NotStarted' })).toBe(
      true,
    );
  });

  it('should return true for object without faxNumber', () => {
    const data = {
      status: 'Started',
      contactDetails: {
        organisationName: 'Acme Inc.',
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: '555-1234',
      },
    };
    expect(validateSetCollectionDetailRequest(data)).toBe(true);
  });

  it('should return false for a request with a missing property', () => {
    const data = {
      status: 'Complete',
      address: {
        addressLine1: '123 Main St',
        addressLine2: '',
        townCity: 'Anytown',
        postcode: '12345',
      },
      contactDetails: {
        organisationName: 'Acme Inc.',
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: '555-1234',
        faxNumber: '555-5678',
      },
    };

    expect(validateSetCollectionDetailRequest(data)).toBe(false);
  });

  it('should return true for a request with a missing addressLine2', () => {
    const data = {
      status: 'Complete',
      address: {
        addressLine1: '123 Main St',
        townCity: 'Anytown',
        postcode: '12345',
        country: 'UK',
      },
      contactDetails: {
        organisationName: 'Acme Inc.',
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: '555-1234',
        faxNumber: '555-5678',
      },
    };
    expect(validateSetCollectionDetailRequest(data)).toBe(true);
  });

  it('should return true for a request with a missing postcode', () => {
    const data = {
      status: 'Complete',
      address: {
        addressLine1: '123 Main St',
        townCity: 'Anytown',
        country: 'UK',
      },
      contactDetails: {
        organisationName: 'Acme Inc.',
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: '555-1234',
        faxNumber: '555-5678',
      },
    };
    expect(validateSetCollectionDetailRequest(data)).toBe(true);
  });

  it('should return false for object with invalid address', () => {
    const data = {
      status: 'Started',
      address: {
        addressLine1: 123,
        townCity: 'Anytown',
        postcode: '12345',
        country: 'UK',
      },
    };
    expect(validateSetCollectionDetailRequest(data)).toBe(false);
  });

  it('should return false for object with invalid contactDetails', () => {
    const data = {
      status: 'Started',
      contactDetails: {
        fullName: 'John Doe',
        emailAddress: 123,
      },
    };
    expect(validateSetCollectionDetailRequest(data)).toBe(false);
  });

  it('should return false for object where status is not started', () => {
    const data = {
      status: 'NotStarted',
      contactDetails: {
        fullName: 'John Doe',
      },
    };
    expect(validateSetCollectionDetailRequest(data)).toBe(false);
  });
});

describe('validatePutExitLocationRequest', () => {
  const validate = validatePutExitLocationRequest;

  it('Rejects an invalid request', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'Complete',
        exitLocation: {
          provided: 'No',
          value: faker.string.sample(),
        },
      }),
    ).toBe(false);

    expect(
      validate({
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
        },
      }),
    ).toBe(false);
  });

  it('Accepts a valid request', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: faker.string.sample(),
        },
      }),
    ).toBe(true);

    expect(
      validate({
        status: 'Complete',
        exitLocation: {
          provided: 'No',
        },
      }),
    ).toBe(true);
  });
});

describe('validatePutTransitCountriesRequest', () => {
  const validate = validatePutTransitCountriesRequest;

  it('Rejects an invalid request', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'Complete',
        values: {},
      }),
    ).toBe(false);

    expect(
      validate({
        status: 'Started',
        values: [1, 2, 3],
      }),
    ).toBe(false);

    expect(
      validate({
        status: 'NotStarted',
        values: ['N.Ireland', 'Wales'],
      }),
    ).toBe(false);
  });

  it('Accepts a valid request', () => {
    expect(
      validate({
        status: 'NotStarted',
      }),
    ).toBe(true);

    expect(
      validate({
        status: 'Started',
        values: [],
      }),
    ).toBe(true);

    expect(
      validate({
        status: 'Complete',
        values: ['N.Ireland', 'Wales'],
      }),
    ).toBe(true);
  });
});

describe('validateSetRecoveryFacilityDetailRequest', () => {
  it('should return true for a request with a valid Laboratory and code type = disposalCode', () => {
    const data = {
      status: 'Started',
      values: [
        {
          id: faker.string.uuid(),
          recoveryFacilityType: {
            type: 'Laboratory',
            disposalCode: faker.string.sample(),
          },
          addressDetails: {
            name: faker.string.sample(),
            address: faker.string.sample(),
            country: faker.string.sample(),
          },
          contactDetails: {
            fullName: faker.string.sample(),
            emailAddress: faker.string.sample(),
            phoneNumber: faker.string.sample(),
            faxNumber: faker.string.sample(),
          },
        },
      ],
    };
    expect(validateSetRecoveryFacilityDetailRequest(data)).toBe(true);
  });

  it('should return true for a request with a valid InterimSite and code type = recoveryCode', () => {
    const data = {
      status: 'Started',
      values: [
        {
          id: faker.string.uuid(),
          recoveryFacilityType: {
            type: 'InterimSite',
            recoveryCode: faker.string.sample(),
          },
          addressDetails: {
            name: faker.string.sample(),
            address: faker.string.sample(),
            country: faker.string.sample(),
          },
          contactDetails: {
            fullName: faker.string.sample(),
            emailAddress: faker.string.sample(),
            phoneNumber: faker.string.sample(),
            faxNumber: faker.string.sample(),
          },
        },
      ],
    };
    expect(validateSetRecoveryFacilityDetailRequest(data)).toBe(true);
  });

  it('should return false for a request with an invalid Laboratory and code type = recoveryCode', () => {
    const data = {
      status: 'Started',
      values: [
        {
          id: faker.string.uuid(),
          recoveryFacilityType: {
            type: 'Laboratory',
            recoveryCode: faker.string.sample(),
          },
          addressDetails: {
            name: faker.string.sample(),
            address: faker.string.sample(),
            country: faker.string.sample(),
          },
          contactDetails: {
            fullName: faker.string.sample(),
            emailAddress: faker.string.sample(),
            phoneNumber: faker.string.sample(),
            faxNumber: faker.string.sample(),
          },
        },
      ],
    };
    expect(validateSetRecoveryFacilityDetailRequest(data)).toBe(false);
  });

  it('should return false for a request with a missing mandatory property', () => {
    const data = {
      status: 'Started',
      values: [
        {
          id: faker.string.uuid(),
          recoveryFacilityType: {
            type: 'InterimSite',
            recoveryCode: faker.string.sample(),
          },
          addressDetails: {
            name: faker.string.sample(),
            country: faker.string.sample(),
          },
          contactDetails: {
            fullName: faker.string.sample(),
            emailAddress: faker.string.sample(),
            phoneNumber: faker.string.sample(),
            faxNumber: faker.string.sample(),
          },
        },
      ],
    };
    expect(validateSetRecoveryFacilityDetailRequest(data)).toBe(false);
  });

  it('should return false for object with invalid addressDetails', () => {
    const data = {
      status: 'Started',
      values: [
        {
          id: faker.string.uuid(),
          recoveryFacilityType: {
            type: 'InterimSite',
            recoveryCode: faker.string.sample(),
          },
          addressDetails: {
            name: faker.string.sample(),
            address: faker.number.bigInt(),
            country: faker.string.sample(),
          },
          contactDetails: {
            fullName: faker.string.sample(),
            emailAddress: faker.string.sample(),
            phoneNumber: faker.string.sample(),
            faxNumber: faker.string.sample(),
          },
        },
      ],
    };
    expect(validateSetRecoveryFacilityDetailRequest(data)).toBe(false);
  });
});

describe('validatePutSubmissionConfirmationRequest', () => {
  const validate = validatePutSubmissionConfirmationRequest;

  it('Rejects an invalid request', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'Complete',
      }),
    ).toBe(false);
  });

  it('Accepts a valid request', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'NotStarted',
      }),
    ).toBe(true);

    expect(
      validate({
        status: 'Complete',
        confirmation: true,
      }),
    ).toBe(true);
  });
});

describe('validatePutSubmissionDeclarationRequest', () => {
  const validate = validatePutSubmissionDeclarationRequest;

  it('Rejects an invalid request', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'Test',
      }),
    ).toBe(false);
  });

  it('Accepts a valid request', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'NotStarted',
      }),
    ).toBe(true);

    expect(
      validate({
        status: 'Complete',
      }),
    ).toBe(true);
  });
});

describe('validatePutSubmissionCancellationRequest', () => {
  const validate = validatePutSubmissionCancellationRequest;

  it('Rejects an invalid request', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        type: 'Test',
      }),
    ).toBe(false);
  });

  it('Accepts a valid request', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        type: 'ChangeOfRecoveryFacilityOrLaboratory',
      }),
    ).toBe(true);

    expect(
      validate({
        type: 'Other',
        reason: 'Reason',
      }),
    ).toBe(true);
  });
});
