import { faker } from '@faker-js/faker';
import { expect, jest } from '@jest/globals';
import winston from 'winston';
import SubmissionController from './submission-controller';
import { DaprReferenceDataClient } from '@wts/client/reference-data';
import { validation } from '../model';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockClient = {};

describe(SubmissionController, () => {
  const subject = new SubmissionController(
    mockClient as unknown as DaprReferenceDataClient,
    new winston.Logger()
  );

  beforeEach(() => {});

  describe('validateSubmissions', () => {
    it('passes submission validation', async () => {
      const accountId = faker.datatype.uuid();

      const response = await subject.validateSubmissions({
        accountId: accountId,
        padIndex: 2,
        values: [
          {
            reference: 'testRef',
            wasteCollectionDetailsAddressLine1: '123 Real Street',
            wasteCollectionDetailsAddressLine2: 'Real Avenue',
            wasteCollectionDetailsTownCity: 'London',
            wasteCollectionDetailsPostcode: 'SW1A 1AA',
            wasteCollectionDetailsCountry: 'England',
            wasteCollectionDetailsBrokerRegistrationNumber: 'CBDL349812',
            wasteCollectionDetailsCarrierRegistrationNumber: 'CBDL349812',
            wasteCollectionDetailsWasteSource: 'Local Authority',
            wasteCollectionDetailsModeOfWasteTransport: 'Rail',
            wasteCollectionDetailsExpectedWasteCollectionDate: '01/01/2028',
            producerAddressLine1: '123 Real Street',
            producerAddressLine2: '',
            producerContactName: 'John Smith',
            producerCountry: 'England',
            producerEmail: 'john.smith@john.smith',
            producerOrganisationName: 'Test organization',
            producerPhone: '0044140000000',
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
            wasteType: [],
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
            reference: '@!"?',
            producerAddressLine1: '     ',
            producerContactName: '     ',
            producerCountry: '     ',
            producerEmail: 'not_an_email',
            producerOrganisationName: '     ',
            producerPhone: '+123567578',
            producerPostcode: '     ',
            producerSicCode: '     ',
            producerTownCity: '     ',
            wasteCollectionDetailsAddressLine1: '     ',
            wasteCollectionDetailsTownCity: '     ',
            wasteCollectionDetailsPostcode: 'AAAAAAAAAA',
            wasteCollectionDetailsCountry: '     ',
            wasteCollectionDetailsWasteSource: '     ',
            wasteCollectionDetailsModeOfWasteTransport: '     ',
            wasteCollectionDetailsExpectedWasteCollectionDate: '31/31/2099',
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
          },
        ],
      });

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
                  validation.WasteCollectionDetailsErrorMessages
                    .emptyAddressLine1,
              },
              {
                field: 'Waste Collection Details Town or City',
                message:
                  validation.WasteCollectionDetailsErrorMessages
                    .emptyTownOrCity,
              },
              {
                field: 'Waste Collection Details Country',
                message:
                  validation.WasteCollectionDetailsErrorMessages.emptyCountry,
              },
              {
                field: 'Waste Collection Details Postcode',
                message:
                  validation.WasteCollectionDetailsErrorMessages
                    .invalidPostcode,
              },
              {
                field: 'Waste Collection Details Waste Source',
                message:
                  validation.WasteCollectionDetailsErrorMessages
                    .missingWasteSource,
              },
              {
                field: 'Waste Collection Details Mode of Waste Transport',
                message:
                  validation.WasteCollectionDetailsErrorMessages
                    .emptyModeOfTransport,
              },

              {
                field:
                  'Waste Collection Details Expected Waste Collection Date',
                message:
                  validation.WasteCollectionDetailsErrorMessages
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
            ],
            invalidStructureErrors: [],
          },
        ],
      });
    });
  });
});
