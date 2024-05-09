import { faker } from '@faker-js/faker';
import { expect, jest } from '@jest/globals';
import winston from 'winston';
import SubmissionController from './submission-controller';
import { validation } from '../model';
import { CosmosRepository } from '../data';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockRepository = {
  createBulkRecords: jest.fn<CosmosRepository['createBulkRecords']>(),
};

const ewcCodes = [
  {
    code: '010101',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
  {
    code: '010102',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
];

const hazardousCodes = [
  {
    code: 'H1',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
  {
    code: 'H2',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
  {
    code: 'H3',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
];

const pops = [
  {
    name: {
      en: 'POP1',
      cy: 'POP1',
    },
  },
  {
    name: {
      en: 'POP2',
      cy: 'POP2',
    },
  },
  {
    name: {
      en: 'POP3',
      cy: 'POP3',
    },
  },
];

describe(SubmissionController, () => {
  const subject = new SubmissionController(
    mockRepository as unknown as CosmosRepository,
    new winston.Logger(),
    hazardousCodes,
    pops,
    ewcCodes
  );

  describe('validateSubmissions', () => {
    it('passes submission validation', async () => {
      const accountId = faker.datatype.uuid();
      const response = await subject.validateSubmissions({
        accountId: accountId,
        padIndex: 2,
        values: [
          {
            customerReference: 'testRef',
            wasteCollectionAddressLine1: '123 Real Street',
            wasteCollectionAddressLine2: 'Real Avenue',
            wasteCollectionTownCity: 'London',
            wasteCollectionPostcode: 'SW1A 1AA',
            wasteCollectionCountry: 'England',
            wasteCollectionBrokerRegistrationNumber: 'CBDL349812',
            wasteCollectionCarrierRegistrationNumber: 'CBDL349812',
            wasteCollectionWasteSource: 'Local Authority',
            wasteCollectionModeOfWasteTransport: 'Rail',
            wasteCollectionExpectedWasteCollectionDate: '01/01/2028',
            producerAddressLine1: '123 Real Street',
            producerAddressLine2: '',
            producerContactName: 'John Smith',
            producerCountry: 'England',
            producerContactEmail: 'john.smith@john.smith',
            producerOrganisationName: 'Test organization',
            producerContactPhone: '0044140000000',
            producerPostcode: 'AB1 1AB',
            producerSicCode: '123456',
            producerTownCity: 'London',
            receiverAuthorizationType: 'permit',
            receiverEnvironmentalPermitNumber: '123456',
            receiverOrganisationName: 'Test organization',
            receiverContactName: 'John Smith',
            receiverContactEmail: 'john.smith@testorganisation.com',
            receiverContactPhone: '0044140000000',
            receiverAddressLine1: '123 Real Street',
            receiverAddressLine2: '',
            receiverCountry: 'England',
            receiverPostcode: 'AB1 1AB',
            receiverTownCity: 'London',
            wasteTransportationNumberAndTypeOfContainers: 'test',
            wasteTransportationSpecialHandlingRequirements: 'test',
            firstWasteTypeEwcCode: '010101',
            firstWasteTypePhysicalForm: 'Solid',
            firstWasteTypeWasteDescription: 'Test waste',
            firstWasteTypeWasteQuantity: '100',
            firstWasteTypeWasteQuantityType: 'Estimate',
            firstWasteTypeWasteQuantityUnit: 'Kilogram',
            firstWasteTypeContainsPops: 'y',
            firstWasteTypeHasHazardousProperties: 'y',
            firstWasteTypeHazardousWasteCodesString: 'H1;H2;h3',
            firstWasteTypePopsString: 'POP1;POP2;POP3',
            firstWasteTypePopsConcentrationsString: '0.1;0.2;5',
            firstWasteTypePopsConcentrationUnitsString: 'g/kg;%;g/kg',
            firstWasteTypeChemicalAndBiologicalComponentsString:
              'test; test 2; test 3',
            firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
              '1;2;0.05',
            firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
              'kg;%;g/kg',
          },
        ],
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.value).toEqual({
        valid: true,
        accountId: accountId,
        values: [
          {
            producer: {
              reference: 'testRef',
              sicCode: '123456',
              address: {
                addressLine1: '123 Real Street',
                addressLine2: undefined,
                country: 'England',
                postcode: 'AB1 1AB',
                townCity: 'London',
              },
              contact: {
                email: 'john.smith@john.smith',
                name: 'John Smith',
                organisationName: 'Test organization',
                phone: '0044140000000',
              },
            },
            receiver: {
              authorizationType: 'permit',
              environmentalPermitNumber: '123456',
              contact: {
                organisationName: 'Test organization',
                name: 'John Smith',
                email: 'john.smith@testorganisation.com',
                phone: '0044140000000',
              },
              address: {
                addressLine1: '123 Real Street',
                addressLine2: undefined,
                country: 'England',
                postcode: 'AB1 1AB',
                townCity: 'London',
              },
            },
            wasteTypes: [
              {
                containsPops: true,
                ewcCode: '010101',
                hasHazardousProperties: true,
                hazardousWasteCodes: [
                  {
                    code: 'H1',
                    name: 'English Description',
                  },
                  {
                    code: 'H2',
                    name: 'English Description',
                  },
                  {
                    code: 'H3',
                    name: 'English Description',
                  },
                ],
                physicalForm: 'Solid',
                pops: [
                  {
                    concentration: 0.1,
                    concentrationUnit: 'g/kg',
                    name: 'POP1',
                  },
                  {
                    concentration: 0.2,
                    concentrationUnit: '%',
                    name: 'POP2',
                  },
                  {
                    concentration: 5,
                    concentrationUnit: 'g/kg',
                    name: 'POP3',
                  },
                ],
                chemicalAndBiologicalComponents: [
                  {
                    concentration: 1,
                    concentrationUnit: 'kg',
                    name: 'test',
                  },
                  {
                    concentration: 2,
                    concentrationUnit: '%',
                    name: 'test 2',
                  },
                  {
                    concentration: 0.05,
                    concentrationUnit: 'g/kg',
                    name: 'test 3',
                  },
                ],
                quantityUnit: 'Kilogram',
                wasteDescription: 'Test waste',
                wasteQuantity: 100,
                wasteQuantityType: 'EstimateData',
              },
            ],
            wasteTransportation: {
              numberAndTypeOfContainers: 'test',
              specialHandlingRequirements: 'test',
            },
            wasteCollection: {
              address: {
                addressLine1: '123 Real Street',
                addressLine2: 'Real Avenue',
                country: 'England',
                postcode: 'SW1A 1AA',
                townCity: 'London',
              },
              brokerRegistrationNumber: 'CBDL349812',
              carrierRegistrationNumber: 'CBDL349812',
              expectedWasteCollectionDate: {
                day: '01',
                month: '01',
                year: '2028',
              },
              modeOfWasteTransport: 'Rail',
              wasteSource: 'LocalAuthority',
            },
          },
        ],
      });
    });

    it('fails submission validation on all sections', async () => {
      const accountId = faker.datatype.uuid();

      const response = await subject.validateSubmissions({
        accountId: accountId,
        padIndex: 2,
        values: [
          {
            customerReference: '@!"?',
            producerAddressLine1: '     ',
            producerContactName: '     ',
            producerCountry: '     ',
            producerContactEmail: 'not_an_email',
            producerOrganisationName: '     ',
            producerContactPhone: '+123567578',
            producerPostcode: '     ',
            producerSicCode: '     ',
            producerTownCity: '     ',
            wasteCollectionAddressLine1: '     ',
            wasteCollectionTownCity: '     ',
            wasteCollectionPostcode: 'AAAAAAAAAA',
            wasteCollectionCountry: '     ',
            wasteCollectionWasteSource: '     ',
            wasteCollectionModeOfWasteTransport: '     ',
            wasteCollectionExpectedWasteCollectionDate: '31/31/2099',
            receiverAuthorizationType: '     ',
            receiverEnvironmentalPermitNumber: '     ',
            receiverOrganisationName: '     ',
            receiverContactName: '     ',
            receiverContactEmail: 'not_an_email',
            receiverContactPhone: '     ',
            receiverAddressLine1: '     ',
            receiverCountry: '     ',
            receiverPostcode: '     ',
            receiverTownCity: '     ',
            wasteTransportationNumberAndTypeOfContainers: '     ',
            wasteTransportationSpecialHandlingRequirements: '     ',
            firstWasteTypeEwcCode: '',
            firstWasteTypePhysicalForm: '',
            firstWasteTypeWasteDescription: '',
            firstWasteTypeWasteQuantity: '',
            firstWasteTypeWasteQuantityType: '',
            firstWasteTypeWasteQuantityUnit: '',
            firstWasteTypeContainsPops: '',
            firstWasteTypeHasHazardousProperties: '',
            firstWasteTypeHazardousWasteCodesString: '',
            firstWasteTypePopsString: '',
            firstWasteTypePopsConcentrationsString: '',
            firstWasteTypePopsConcentrationUnitsString: '',
            firstWasteTypeChemicalAndBiologicalComponentsString: '',
            firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
              '',
            firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
              '',
          },
        ],
      });

      const firstWasteTypeErrorMessages =
        validation.WasteTypeValidationErrorMessages(1);

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.value).toEqual({
        valid: false,
        accountId: accountId,
        values: [
          {
            index: 3,
            fieldFormatErrors: [
              {
                field: 'Reference',
                message:
                  validation.ProducerValidationErrorMessages.invalidReference,
              },
              {
                field: 'Producer organisation name',
                message:
                  validation.ProducerValidationErrorMessages
                    .emptyOrganisationName,
              },
              {
                field: 'Producer address line 1',
                message:
                  validation.ProducerValidationErrorMessages.emptyAddressLine1,
              },
              {
                field: 'Producer town or city',
                message:
                  validation.ProducerValidationErrorMessages.emptyTownOrCity,
              },
              {
                field: 'Producer country',
                message:
                  validation.ProducerValidationErrorMessages.emptyCountry,
              },
              {
                field: 'Producer contact name',
                message:
                  validation.ProducerValidationErrorMessages
                    .emptyContactFullName,
              },
              {
                field: 'Producer contact phone number',
                message:
                  validation.ProducerValidationErrorMessages.invalidPhone,
              },
              {
                field: 'Producer contact email address',
                message:
                  validation.ProducerValidationErrorMessages.invalidEmail,
              },
              {
                field: 'Producer Standard Industrial Classification (SIC) code',
                message:
                  validation.ProducerValidationErrorMessages.invalidSicCode,
              },
              {
                field: 'Waste Collection Details Address Line 1',
                message:
                  validation.WasteCollectionErrorMessages.emptyAddressLine1,
              },
              {
                field: 'Waste Collection Details Town or City',
                message:
                  validation.WasteCollectionErrorMessages.emptyTownOrCity,
              },
              {
                field: 'Waste Collection Details Country',
                message: validation.WasteCollectionErrorMessages.emptyCountry,
              },
              {
                field: 'Waste Collection Details Postcode',
                message:
                  validation.WasteCollectionErrorMessages.invalidPostcode,
              },
              {
                field: 'Waste Collection Details Waste Source',
                message:
                  validation.WasteCollectionErrorMessages.missingWasteSource,
              },
              {
                field: 'Waste Collection Details Mode of Waste Transport',
                message:
                  validation.WasteCollectionErrorMessages.emptyModeOfTransport,
              },

              {
                field:
                  'Waste Collection Details Expected Waste Collection Date',
                message:
                  validation.WasteCollectionErrorMessages
                    .invalidFormatWasteCollectionDate,
              },
              {
                field: 'Receiver authorization type',
                message:
                  validation.ReceiverValidationErrorMessages
                    .emptyAuthorizationType,
              },
              {
                field: 'Receiver organisation name',
                message:
                  validation.ReceiverValidationErrorMessages
                    .emptyOrganisationName,
              },
              {
                field: 'Receiver address line 1',
                message:
                  validation.ReceiverValidationErrorMessages.emptyAddressLine1,
              },
              {
                field: 'Receiver town or city',
                message:
                  validation.ReceiverValidationErrorMessages.emptyTownOrCity,
              },
              {
                field: 'Receiver country',
                message:
                  validation.ReceiverValidationErrorMessages.emptyCountry,
              },
              {
                field: 'Receiver contact name',
                message:
                  validation.ReceiverValidationErrorMessages
                    .emptyContactFullName,
              },
              {
                field: 'Receiver contact phone number',
                message:
                  validation.ReceiverValidationErrorMessages.invalidPhone,
              },
              {
                field: 'Receiver contact email address',
                message:
                  validation.ReceiverValidationErrorMessages.invalidEmail,
              },
              {
                field: 'Number and type of transportation containers',
                message:
                  validation.WasteTransportationValidationErrorMessages
                    .emptyNameAndTypeOfContainers,
              },
              {
                field: 'EWC Code',
                message: firstWasteTypeErrorMessages.emptyEwcCode,
              },
              {
                field: 'Waste Description',
                message: firstWasteTypeErrorMessages.emptyWasteDescription,
              },
              {
                field: 'Physical Form',
                message: firstWasteTypeErrorMessages.emptyPhysicalForm,
              },
              {
                field: 'Waste Quantity',
                message: firstWasteTypeErrorMessages.emptyWasteQuantity,
              },
              {
                field: 'Waste Quantity Units',
                message: firstWasteTypeErrorMessages.emptyWasteQuantityUnit,
              },
              {
                field: 'Quantity of waste (actual or estimate)',
                message: firstWasteTypeErrorMessages.invalidWasteQuantityType,
              },
              {
                field: 'Chemical and biological components of the waste',
                message:
                  firstWasteTypeErrorMessages.emptyChemicalAndBiologicalComponents,
              },
              {
                field: 'Chemical and biological concentration values',
                message:
                  firstWasteTypeErrorMessages.emptyChemicalAndBiologicalConcentration,
              },
              {
                field: 'Chemical and biological concentration units of measure',
                message:
                  firstWasteTypeErrorMessages.emptyChemicalAndBiologicalConcentrationUnit,
              },
              {
                field: 'Waste Has Hazardous Properties',
                message:
                  firstWasteTypeErrorMessages.invalidHasHazardousProperties,
              },
              {
                field: 'Waste Contains POPs',
                message: firstWasteTypeErrorMessages.invalidContainsPops,
              },
            ],
            invalidStructureErrors: [],
          },
        ],
      });
    });
  });

  describe('createSubmissions', () => {
    it('creates submissions', async () => {
      const response = await subject.createSubmissions({
        accountId: faker.datatype.uuid(),
        id: faker.datatype.uuid(),
        values: [
          {
            wasteTransportation: {
              numberAndTypeOfContainers: 'test',
              specialHandlingRequirements: 'test',
            },
            wasteCollection: {
              address: {
                addressLine1: 'Waste Collection Address Line 1',
                addressLine2: 'Waste Collection Address Line 2',
                country: 'Waste Collection Country',
                postcode: 'Waste Collection Postcode',
                townCity: 'Waste Collection Town/City',
              },
              expectedWasteCollectionDate: {
                day: '01',
                month: '01',
                year: '2024',
              },
              modeOfWasteTransport: 'Road',
              wasteSource: 'Household',
              brokerRegistrationNumber:
                'Waste Collection Broker Registration Number',
              carrierRegistrationNumber:
                'Waste Collection Carrier Registration Number',
            },
            wasteTypes: [
              {
                ewcCode: '01 03 04',
                wasteDescription: 'waste description',
                physicalForm: 'Solid',
                wasteQuantity: 100,
                quantityUnit: 'Tonne',
                wasteQuantityType: 'ActualData',
                hasHazardousProperties: false,
                containsPops: false,
                chemicalAndBiologicalComponents: [
                  {
                    concentration: 1,
                    name: 'test',
                    concentrationUnit: 'Milligram',
                  },
                ],
                hazardousWasteCodes: [
                  {
                    code: 'HP1',
                    name: 'test',
                  },
                ],
                pops: [
                  {
                    concentration: 1,
                    name: 'test',
                    concentrationUnit: 'Milligram',
                  },
                ],
              },
            ],
            receiver: {
              address: {
                addressLine1: 'Receiver Address Line 1',
                addressLine2: 'Receiver Address Line 2',
                country: 'Receiver Country',
                postcode: 'Receiver Postcode',
                townCity: 'Receiver Town/City',
              },
              contact: {
                email: 'Receiver Email',
                name: 'Receiver Contact Name',
                organisationName: 'Receiver Organisation Name',
                phone: 'Receiver Phone',
              },
              authorizationType: 'permit',
              environmentalPermitNumber: '123456',
            },
            producer: {
              reference: 'ref',
              sicCode: '123456',
              address: {
                addressLine1: 'Producer Address Line 1',
                addressLine2: 'Producer Address Line 2',
                country: 'Producer Country',
                postcode: 'Producer Postcode',
                townCity: 'Producer Town/City',
              },
              contact: {
                email: 'Producer Email',
                name: 'Producer Contact Name',
                organisationName: 'Producer Organisation Name',
                phone: 'Producer Phone',
              },
            },
          },
        ],
      });
      expect(response.success).toBe(true);
      if (response.success) {
        return;
      }
      expect(mockRepository.createBulkRecords).toBeCalled();
      expect(response.error.statusCode).toBe(201);
    });
  });
});
