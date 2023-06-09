import { faker } from '@faker-js/faker';
import Ajv from 'ajv/dist/jtd';
import {
  GetDraftByIdResponse,
  GetDraftsResponse,
  SetDraftCollectionDateByIdRequest,
  SetDraftCustomerReferenceByIdResponse,
  SetDraftWasteQuantityByIdRequest,
  ListDraftCarriersResponse,
  CreateDraftCarriersRequest,
  SetDraftCarriersRequest,
  DeleteDraftCarriersRequest,
  SetDraftExitLocationByIdRequest,
  SetDraftTransitCountriesRequest,
} from './dto';
import {
  getDraftByIdResponse,
  getDraftsResponse,
  setDraftCustomerReferenceByIdResponse,
  setDraftWasteQuantityByIdRequest,
  setDraftCollectionDateByIdRequest,
  listDraftCarriersResponse,
  createDraftCarriersRequest,
  setDraftCarriersRequest,
  deleteDraftCarriersRequest,
  setDraftExitLocationByIdRequest,
  setDraftTransitCountriesRequest,
} from './schema';

const ajv = new Ajv();

describe('getDraftsResponse', () => {
  const validate = ajv.compile<GetDraftsResponse>(getDraftsResponse);

  it('is compatible with success value', () => {
    const value: GetDraftsResponse = {
      success: true,
      value: [
        {
          id: faker.datatype.uuid(),
          reference: null,
          wasteDescription: { status: 'NotStarted' },
          wasteQuantity: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: { status: 'NotStarted' },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
        },
      ],
    };

    expect(validate(value)).toBe(true);
  });

  it('is compatible with error value', () => {
    validate({
      success: false,
      error: {
        statusCode: 400,
        name: 'BadRequest',
        message: 'Bad request',
      },
    });
  });
});

describe('getDraftByIdResponse', () => {
  const validate = ajv.compile<GetDraftByIdResponse>(getDraftByIdResponse);

  it('is compatible with dto value', () => {
    const value: GetDraftByIdResponse = {
      success: true,
      value: {
        id: faker.datatype.uuid(),
        reference: null,
        wasteDescription: {
          status: 'Complete',
          wasteCode: { type: 'NotApplicable' },
          ewcCodes: [],
          nationalCode: { provided: 'No' },
          description: '',
        },
        wasteQuantity: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'NotStarted' },
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftCustomerReferenceByIdResponse', () => {
  const validate = ajv.compile<SetDraftCustomerReferenceByIdResponse>(
    setDraftCustomerReferenceByIdResponse
  );

  it('is compatible with dto value', () => {
    const value: SetDraftCustomerReferenceByIdResponse = {
      success: true,
      value: undefined,
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftWasteQuantityByIdRequest', () => {
  const validate = ajv.compile<SetDraftWasteQuantityByIdRequest>(
    setDraftWasteQuantityByIdRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftWasteQuantityByIdRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: { status: 'NotStarted' },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: { status: 'Started' },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Started',
        value: { type: 'ActualData' },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Complete',
        value: {
          type: 'ActualData',
          quantityType: 'Volume',
          value: 12,
        },
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftCollectionDateByIdRequest', () => {
  const validate = ajv.compile<SetDraftCollectionDateByIdRequest>(
    setDraftCollectionDateByIdRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftCollectionDateByIdRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: { status: 'NotStarted' },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Complete',
        value: {
          type: 'ActualDate',
          year: '1970',
          month: '00',
          day: '01',
        },
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('listDraftCarriersResponse', () => {
  const validate = ajv.compile<ListDraftCarriersResponse>(
    listDraftCarriersResponse
  );

  it('is compatible with success value', () => {
    const value: ListDraftCarriersResponse = {
      success: true,
      value: {
        status: 'Complete',
        transport: true,
        values: [
          {
            id: faker.datatype.uuid(),
            addressDetails: {
              organisationName: faker.datatype.string(),
              address: faker.datatype.string(),
              country: faker.datatype.string(),
            },
            contactDetails: {
              fullName: faker.datatype.string(),
              emailAddress: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
            },
            transportDetails: {
              type: 'ShippingContainer',
              shippingContainerNumber: faker.datatype.string(),
            },
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);
  });

  it('is compatible with error value', () => {
    validate({
      success: false,
      error: {
        statusCode: 400,
        name: 'BadRequest',
        message: 'Bad request',
      },
    });
  });
});

describe('createDraftCarriersRequest', () => {
  const validate = ajv.compile<CreateDraftCarriersRequest>(
    createDraftCarriersRequest
  );

  it('is compatible with dto values', () => {
    const value: CreateDraftCarriersRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Started',
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftCarrierRequest', () => {
  const validate = ajv.compile<SetDraftCarriersRequest>(
    setDraftCarriersRequest
  );

  it('is compatible with dto values', () => {
    const carrierId = faker.datatype.uuid();
    let value: SetDraftCarriersRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      carrierId: carrierId,
      value: {
        status: 'Started',
        transport: true,
        values: [
          {
            id: carrierId,
            addressDetails: {
              organisationName: faker.datatype.string(),
              address: faker.datatype.string(),
              country: faker.datatype.string(),
            },
            contactDetails: {
              fullName: faker.datatype.string(),
              emailAddress: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
            },
            transportDetails: {
              type: 'ShippingContainer',
              shippingContainerNumber: faker.datatype.string(),
            },
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      carrierId: carrierId,
      value: {
        status: 'NotStarted',
        transport: true,
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      carrierId: carrierId,
      value: {
        status: 'Started',
        transport: false,
        values: [
          {
            id: carrierId,
            addressDetails: {
              organisationName: faker.datatype.string(),
              address: faker.datatype.string(),
              country: faker.datatype.string(),
            },
            contactDetails: {
              fullName: faker.datatype.string(),
              emailAddress: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
            },
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('deleteDraftCarrierRequest', () => {
  const validate = ajv.compile<DeleteDraftCarriersRequest>(
    deleteDraftCarriersRequest
  );

  it('is compatible with dto values', () => {
    const value: DeleteDraftCarriersRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      carrierId: faker.datatype.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftExitLocationByIdRequest', () => {
  const validate = ajv.compile<SetDraftExitLocationByIdRequest>(
    setDraftExitLocationByIdRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftExitLocationByIdRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: faker.datatype.string(),
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Complete',
        exitLocation: {
          provided: 'No',
        },
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftTransitCountriesRequest', () => {
  const validate = ajv.compile<SetDraftTransitCountriesRequest>(
    setDraftTransitCountriesRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftTransitCountriesRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'NotStarted',
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Started',
        values: ['N.Ireland', 'Wales'],
      },
    };

    expect(validate(value)).toBe(true);
    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Complete',
        values: ['N.Ireland', 'Wales', 'England'],
      },
    };

    expect(validate(value)).toBe(true);
  });
});
