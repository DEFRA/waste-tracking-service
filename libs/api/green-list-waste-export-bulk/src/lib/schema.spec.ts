import { faker } from '@faker-js/faker';
import Ajv from 'ajv/dist/jtd';
import {
  AddContentToBatchRequest,
  AddContentToBatchResponse,
  GetBatchContentRequest,
  GetBatchContentResponse,
  GetBatchRequest,
  GetBatchResponse,
  UpdateBatchRequest,
  UpdateBatchResponse,
} from './dto';
import {
  addContentToBatchRequest,
  addContentToBatchResponse,
  getBatchContentRequest,
  getBatchContentResponse,
  getBatchRequest,
  getBatchResponse,
  updateBatchRequest,
  updateBatchResponse,
} from './schema';

const ajv = new Ajv();

describe('addContentToBatchRequest', () => {
  const validate = ajv.compile<AddContentToBatchRequest>(
    addContentToBatchRequest,
  );

  it('is compatible with dto values', () => {
    let value: AddContentToBatchRequest = {
      accountId: faker.string.uuid(),
      content: {
        type: 'text/csv',
        compression: 'Snappy',
        value: faker.string.sample(),
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      accountId: faker.string.uuid(),
      batchId: faker.string.uuid(),
      content: {
        type: 'text/csv',
        compression: 'Snappy',
        value: faker.string.sample(),
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('addContentToBatchResponse', () => {
  const validate = ajv.compile<AddContentToBatchResponse>(
    addContentToBatchResponse,
  );

  it('is compatible with dto values', () => {
    const value: AddContentToBatchResponse = {
      success: true,
      value: {
        batchId: faker.string.uuid(),
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getBatchRequest', () => {
  const validate = ajv.compile<GetBatchRequest>(getBatchRequest);

  it('is compatible with dto values', () => {
    const value: GetBatchRequest = {
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getBatchResponse', () => {
  const validate = ajv.compile<GetBatchResponse>(getBatchResponse);

  it('is compatible with dto value', () => {
    let value: GetBatchResponse = {
      success: true,
      value: {
        id: faker.string.uuid(),
        state: {
          status: 'Processing',
          timestamp: new Date(),
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      success: true,
      value: {
        id: faker.string.uuid(),
        state: {
          status: 'FailedCsvValidation',
          timestamp: new Date(),
          error: 'CSV_RECORD_INCONSISTENT_COLUMNS',
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      success: true,
      value: {
        id: faker.string.uuid(),
        state: {
          status: 'FailedValidation',
          timestamp: new Date(),
          rowErrors: [
            {
              rowNumber: 3,
              errorAmount: 9,
              errorDetails: [
                'Enter a uniqure reference',
                'Enter a second EWC code in correct format',
                'Waste description must be less than 100 characheters',
                'Enter a real phone number for the importer',
                'Enter a real collection date',
                'Enter the first carrier country',
                'Enter the first carrier email address',
                'Enter the first recovery facility or laboratory address',
                'Enter the first recovery code of the first laboratory facility',
              ],
            },
            {
              rowNumber: 12,
              errorAmount: 6,
              errorDetails: [
                'Enter a real phone number for the importer',
                'Enter a real collection date',
                'Enter the first carrier country',
                'Enter the first carrier email address',
                'Enter the first recovery facility or laboratory address',
                'Enter the first recovery code of the first laboratory facility',
              ],
            },
            {
              rowNumber: 24,
              errorAmount: 5,
              errorDetails: [
                'Enter a uniqure reference',
                'Enter a second EWC code in correct format',
                'Waste description must be less than 100 characheters',
                'Enter a real phone number for the importer',
                'Enter a real collection date',
              ],
            },
            {
              rowNumber: 34,
              errorAmount: 1,
              errorDetails: [
                'Waste description must be less than 100 characheters',
              ],
            },
          ],
          columnErrors: [
            {
              errorAmount: 9,
              columnName: 'Organisation contact person phone number',
              errorDetails: [
                {
                  rowNumber: 2,
                  errorReason: 'Enter contact phone number',
                },
                {
                  rowNumber: 3,
                  errorReason: 'Enter a valid contact phone number',
                },
                {
                  rowNumber: 12,
                  errorReason: 'Enter contact phone number',
                },
                {
                  rowNumber: 24,
                  errorReason: 'Enter contact phone number',
                },
                {
                  rowNumber: 27,
                  errorReason: 'Enter contact phone number',
                },
                {
                  rowNumber: 32,
                  errorReason: 'Enter a valid contact phone number',
                },
                {
                  rowNumber: 41,
                  errorReason: 'Enter a valid contact phone number',
                },
                {
                  rowNumber: 56,
                  errorReason: 'Enter contact phone number',
                },
                {
                  rowNumber: 63,
                  errorReason: 'Enter a valid contact phone number',
                },
              ],
            },
          ],
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      success: true,
      value: {
        id: faker.string.uuid(),
        state: {
          status: 'PassedValidation',
          timestamp: new Date(),
          hasEstimates: false,
          submissions: [
            {
              reference: 'testRef',
              wasteDescription: {
                wasteCode: {
                  type: 'AnnexIIIA',
                  code: 'B1010 and B1050',
                },
                ewcCodes: [
                  {
                    code: '010101',
                  },
                  {
                    code: '010102',
                  },
                ],
                nationalCode: {
                  provided: 'No',
                },
                description: 'test',
              },
              wasteQuantity: {
                type: 'ActualData',
                estimateData: {},
                actualData: {
                  quantityType: 'Weight',
                  unit: 'Tonne',
                  value: 2,
                },
              },
              exporterDetail: {
                exporterAddress: {
                  addressLine1: '1 Some Street',
                  townCity: 'London',
                  postcode: 'EC2N4AY',
                  country: 'England',
                },
                exporterContactDetails: {
                  organisationName: 'Test organisation 1',
                  fullName: 'John Smith',
                  emailAddress: 'test1@test.com',
                  phoneNumber: '07888888888',
                },
              },
              importerDetail: {
                importerAddressDetails: {
                  organisationName: 'Test organisation 2',
                  address: '2 Some Street, Kabul, 1001',
                  country: 'Afghanistan [AF]',
                },
                importerContactDetails: {
                  fullName: 'Jane Smith',
                  emailAddress: 'test2@test.com',
                  phoneNumber: '0033140000000',
                  faxNumber: '0033140000000',
                },
              },
              collectionDate: {
                type: 'ActualDate',
                actualDate: {
                  day: '01',
                  month: '01',
                  year: '2050',
                },
                estimateDate: {},
              },
              carriers: [
                {
                  addressDetails: {
                    organisationName: 'Test organisation 3',
                    address: 'Some address, London, EC2N4AY',
                    country: 'United Kingdom (England) [GB-ENG]',
                  },
                  contactDetails: {
                    fullName: 'John Doe',
                    emailAddress: 'test3@test.com',
                    phoneNumber: '07888888844',
                    faxNumber: '07888888844',
                  },
                  transportDetails: {
                    type: 'InlandWaterways',
                    description: 'details',
                  },
                },
                {
                  addressDetails: {
                    organisationName: 'Test organisation 4',
                    address: '3 Some Street, Paris, 75002',
                    country: 'France [FR]',
                  },
                  contactDetails: {
                    fullName: 'Jane Doe',
                    emailAddress: 'test4@test.com',
                    phoneNumber: '0033140000044',
                  },
                  transportDetails: {
                    type: 'Road',
                  },
                },
              ],
              collectionDetail: {
                address: {
                  addressLine1: '5 Some Street',
                  townCity: 'London',
                  postcode: 'EC2N4AY',
                  country: 'England',
                },
                contactDetails: {
                  organisationName: 'Test organisation 5',
                  fullName: 'John Johnson',
                  emailAddress: 'test5@test.com',
                  phoneNumber: '07888888855',
                  faxNumber: '07888888855',
                },
              },
              ukExitLocation: {
                provided: 'Yes',
                value: 'Dover',
              },
              transitCountries: ['France [FR]', 'Belgium [BE]'],
              recoveryFacilityDetail: [
                {
                  addressDetails: {
                    name: 'Test organisation 6',
                    address: '4 Some Street, Paris, 75002',
                    country: 'France [FR]',
                  },
                  contactDetails: {
                    fullName: 'Jean Philip',
                    emailAddress: 'test6@test.com',
                    phoneNumber: '0033140000066',
                  },
                  recoveryFacilityType: {
                    type: 'RecoveryFacility',
                    recoveryCode: 'R1',
                  },
                },
              ],
            },
          ],
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      success: true,
      value: {
        id: faker.string.uuid(),
        state: {
          status: 'Submitting',
          timestamp: new Date(),
          hasEstimates: false,
          transactionId: '2307_5678ABCD',
          submissions: [
            {
              reference: 'testRef',
              wasteDescription: {
                wasteCode: {
                  type: 'AnnexIIIA',
                  code: 'B1010 and B1050',
                },
                ewcCodes: [
                  {
                    code: '010101',
                  },
                  {
                    code: '010102',
                  },
                ],
                nationalCode: {
                  provided: 'No',
                },
                description: 'test',
              },
              wasteQuantity: {
                type: 'ActualData',
                estimateData: {},
                actualData: {
                  quantityType: 'Weight',
                  unit: 'Tonne',
                  value: 2,
                },
              },
              exporterDetail: {
                exporterAddress: {
                  addressLine1: '1 Some Street',
                  townCity: 'London',
                  postcode: 'EC2N4AY',
                  country: 'England',
                },
                exporterContactDetails: {
                  organisationName: 'Test organisation 1',
                  fullName: 'John Smith',
                  emailAddress: 'test1@test.com',
                  phoneNumber: '07888888888',
                },
              },
              importerDetail: {
                importerAddressDetails: {
                  organisationName: 'Test organisation 2',
                  address: '2 Some Street, Kabul, 1001',
                  country: 'Afghanistan [AF]',
                },
                importerContactDetails: {
                  fullName: 'Jane Smith',
                  emailAddress: 'test2@test.com',
                  phoneNumber: '0033140000000',
                  faxNumber: '0033140000000',
                },
              },
              collectionDate: {
                type: 'ActualDate',
                actualDate: {
                  day: '01',
                  month: '01',
                  year: '2050',
                },
                estimateDate: {},
              },
              carriers: [
                {
                  addressDetails: {
                    organisationName: 'Test organisation 3',
                    address: 'Some address, London, EC2N4AY',
                    country: 'United Kingdom (England) [GB-ENG]',
                  },
                  contactDetails: {
                    fullName: 'John Doe',
                    emailAddress: 'test3@test.com',
                    phoneNumber: '07888888844',
                    faxNumber: '07888888844',
                  },
                  transportDetails: {
                    type: 'InlandWaterways',
                    description: 'details',
                  },
                },
                {
                  addressDetails: {
                    organisationName: 'Test organisation 4',
                    address: '3 Some Street, Paris, 75002',
                    country: 'France [FR]',
                  },
                  contactDetails: {
                    fullName: 'Jane Doe',
                    emailAddress: 'test4@test.com',
                    phoneNumber: '0033140000044',
                  },
                  transportDetails: {
                    type: 'Road',
                  },
                },
              ],
              collectionDetail: {
                address: {
                  addressLine1: '5 Some Street',
                  townCity: 'London',
                  postcode: 'EC2N4AY',
                  country: 'England',
                },
                contactDetails: {
                  organisationName: 'Test organisation 5',
                  fullName: 'John Johnson',
                  emailAddress: 'test5@test.com',
                  phoneNumber: '07888888855',
                  faxNumber: '07888888855',
                },
              },
              ukExitLocation: {
                provided: 'Yes',
                value: 'Dover',
              },
              transitCountries: ['France [FR]', 'Belgium [BE]'],
              recoveryFacilityDetail: [
                {
                  addressDetails: {
                    name: 'Test organisation 6',
                    address: '4 Some Street, Paris, 75002',
                    country: 'France [FR]',
                  },
                  contactDetails: {
                    fullName: 'Jean Philip',
                    emailAddress: 'test6@test.com',
                    phoneNumber: '0033140000066',
                  },
                  recoveryFacilityType: {
                    type: 'RecoveryFacility',
                    recoveryCode: 'R1',
                  },
                },
              ],
            },
          ],
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      success: true,
      value: {
        id: faker.string.uuid(),
        state: {
          status: 'Submitted',
          transactionId: '3497_1224DCBA',
          timestamp: new Date(),
          hasEstimates: true,
          submissions: [
            {
              id: faker.string.uuid(),
              submissionDeclaration: {
                declarationTimestamp: new Date(),
                transactionId: '3497_1224DCBA',
              },
              hasEstimates: true,
              collectionDate: {
                type: 'ActualDate',
                estimateDate: {},
                actualDate: {
                  day: '01',
                  month: '01',
                  year: '2030',
                },
              },
              wasteDescription: {
                wasteCode: {
                  type: 'NotApplicable',
                },
                ewcCodes: [{ code: 'B1010' }],
                description: 'metal',
              },
              reference: 'ref1',
            },
          ],
        },
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('updateBatchRequest', () => {
  const validate = ajv.compile<UpdateBatchRequest>(updateBatchRequest);

  it('is compatible with dto values', () => {
    const value: UpdateBatchRequest = {
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('updateBatchResponse', () => {
  const validate = ajv.compile<UpdateBatchResponse>(updateBatchResponse);

  it('is compatible with dto values', () => {
    const value: UpdateBatchResponse = {
      success: true,
      value: undefined,
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getBatchContentRequest', () => {
  const validate = ajv.compile<GetBatchContentRequest>(getBatchContentRequest);

  it('is compatible with dto values', () => {
    const value: GetBatchContentRequest = {
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getBatchContentResponse', () => {
  const validate = ajv.compile<GetBatchContentResponse>(
    getBatchContentResponse,
  );

  it('is compatible with dto value', () => {
    const value: GetBatchContentResponse = {
      success: true,
      value: [
        {
          id: '8d1cb87d-9349-4d84-acf2-30aa4df4d2cb',
          reference: 'ref9',
          wasteDescription: {
            wasteCode: {
              type: 'BaselAnnexIX',
              code: 'B1010',
            },
            ewcCodes: [
              {
                code: '101213',
              },
            ],
            nationalCode: {
              provided: 'No',
            },
            description: 'WasteDescription',
          },
          wasteQuantity: {
            type: 'EstimateData',
            estimateData: {
              quantityType: 'Volume',
              unit: 'Cubic Metre',
              value: 10,
            },
            actualData: {},
          },
          exporterDetail: {
            exporterAddress: {
              addressLine1: 'Test organisation 1',
              addressLine2: 'Address line',
              townCity: 'London',
              postcode: 'EC2N4AY',
              country: 'England',
            },
            exporterContactDetails: {
              organisationName: 'Test organisation 1',
              fullName: 'John Smith',
              emailAddress: 'test1@test.com',
              phoneNumber: '00-44788-888 8888',
              faxNumber: '07888888888',
            },
          },
          importerDetail: {
            importerAddressDetails: {
              organisationName: 'Test organisation 2',
              address: '2 Some Street, Paris, 75002',
              country: 'France [FR]',
            },
            importerContactDetails: {
              fullName: 'Jane Smith',
              emailAddress: 'test2@test.com',
              phoneNumber: '0033140000000',
              faxNumber: '00 33140000000',
            },
          },
          collectionDate: {
            type: 'EstimateDate',
            estimateDate: {
              day: '15',
              month: '01',
              year: '2050',
            },
            actualDate: {},
          },
          carriers: [
            {
              addressDetails: {
                organisationName: 'Test organisation 2',
                address: '2 Some Street, Paris, 75002',
                country: 'France [FR]',
              },
              contactDetails: {
                fullName: 'Jane Smith',
                emailAddress: 'test2@test.com',
                phoneNumber: '0033140000000',
                faxNumber: '00 33140000000',
              },
              transportDetails: {
                type: 'Sea',
              },
            },
          ],
          collectionDetail: {
            address: {
              addressLine1: 'Test organisation 1',
              addressLine2: 'Address line',
              townCity: 'London',
              postcode: 'EC2N4AY',
              country: 'England',
            },
            contactDetails: {
              organisationName: 'Test organisation 1',
              fullName: 'John Smith',
              emailAddress: 'test1@test.com',
              phoneNumber: '00-44788-888 8888',
              faxNumber: '07888888888',
            },
          },
          ukExitLocation: {
            provided: 'No',
          },
          transitCountries: [],
          recoveryFacilityDetail: [
            {
              addressDetails: {
                name: 'Test organisation 2',
                address: '2 Some Street, Paris, 75002',
                country: 'France [FR]',
              },
              contactDetails: {
                fullName: 'Jane Smith',
                emailAddress: 'test2@test.com',
                phoneNumber: '0033140000000',
                faxNumber: '00 33140000000',
              },
              recoveryFacilityType: {
                type: 'InterimSite',
                recoveryCode: 'R13',
              },
            },
            {
              addressDetails: {
                name: 'Test organisation 2',
                address: '2 Some Street, Paris, 75002',
                country: 'France [FR]',
              },
              contactDetails: {
                fullName: 'Jane Smith',
                emailAddress: 'test2@test.com',
                phoneNumber: '0033140000000',
                faxNumber: '00 33140000000',
              },
              recoveryFacilityType: {
                type: 'RecoveryFacility',
                recoveryCode: 'R1',
              },
            },
          ],
          submissionDeclaration: {
            declarationTimestamp: new Date(),
            transactionId: '2404_8D1CB87D',
          },
          submissionState: {
            status: 'SubmittedWithEstimates',
            timestamp: new Date(),
          },
        },
        {
          id: '4909acad-c100-4419-b73e-181dfd553bfe',
          reference: 'ref8',
          wasteDescription: {
            wasteCode: {
              type: 'NotApplicable',
            },
            ewcCodes: [
              {
                code: '101213',
              },
            ],
            nationalCode: {
              provided: 'Yes',
              value: 'NatCode',
            },
            description: 'WasteDescription',
          },
          wasteQuantity: {
            type: 'ActualData',
            estimateData: {},
            actualData: {
              quantityType: 'Weight',
              unit: 'Kilogram',
              value: 12.5,
            },
          },
          exporterDetail: {
            exporterAddress: {
              addressLine1: 'Test organisation 1',
              townCity: 'London',
              country: 'England',
            },
            exporterContactDetails: {
              organisationName: 'Test organisation 1',
              fullName: 'John Smith',
              emailAddress: 'test1@test.com',
              phoneNumber: '07888888888',
            },
          },
          importerDetail: {
            importerAddressDetails: {
              organisationName: 'Test organisation 2',
              address: '2 Some Street, Paris, 75002',
              country: 'France [FR]',
            },
            importerContactDetails: {
              fullName: 'Jane Smith',
              emailAddress: 'test2@test.com',
              phoneNumber: '0033140000000',
            },
          },
          collectionDate: {
            type: 'ActualDate',
            estimateDate: {},
            actualDate: {
              day: '08',
              month: '01',
              year: '2050',
            },
          },
          carriers: [
            {
              addressDetails: {
                organisationName: 'Test organisation 2',
                address: '2 Some Street, Paris, 75002',
                country: 'France [FR]',
              },
              contactDetails: {
                fullName: 'Jane Smith',
                emailAddress: 'test2@test.com',
                phoneNumber: '0033140000000',
              },
            },
          ],
          collectionDetail: {
            address: {
              addressLine1: 'Test organisation 1',
              townCity: 'London',
              country: 'England',
            },
            contactDetails: {
              organisationName: 'Test organisation 1',
              fullName: 'John Smith',
              emailAddress: 'test1@test.com',
              phoneNumber: '07888888888',
            },
          },
          ukExitLocation: {
            provided: 'No',
          },
          transitCountries: [],
          recoveryFacilityDetail: [
            {
              addressDetails: {
                name: 'Test organisation 2',
                address: '2 Some Street, Paris, 75002',
                country: 'France [FR]',
              },
              contactDetails: {
                fullName: 'Jane Smith',
                emailAddress: 'test2@test.com',
                phoneNumber: '0033140000000',
              },
              recoveryFacilityType: {
                type: 'Laboratory',
                disposalCode: 'D2',
              },
            },
          ],
          submissionDeclaration: {
            declarationTimestamp: new Date(),
            transactionId: '2404_4909ACAD',
          },
          submissionState: {
            status: 'SubmittedWithActuals',
            timestamp: new Date(),
          },
        },
      ],
    };

    expect(validate(value)).toBe(true);
  });
});
