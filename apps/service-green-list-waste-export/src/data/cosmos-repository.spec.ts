import {
  CosmosClient,
  FeedResponse,
  Item,
  ItemResponse,
  Items,
  QueryIterator,
} from '@azure/cosmos';
import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import { Logger } from 'winston';
import CosmosRepository from './cosmos-repository';
import { DbContainerNameKey, Submission } from '../model';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockRead = jest.fn<typeof Item.prototype.read>();
const mockPatch = jest.fn<typeof Item.prototype.patch>();
const mockCreate = jest.fn<typeof Items.prototype.create>();
const mockBulk = jest.fn<typeof Items.prototype.bulk>();
const mockDelete = jest.fn<typeof Item.prototype.delete>();
const mockFetchNext = jest.fn<typeof QueryIterator.prototype.fetchNext>();

jest.mock('@azure/cosmos', () => ({
  CosmosClient: jest.fn().mockImplementation(() => ({
    database: jest.fn(() => ({
      container: jest.fn(() => ({
        item: jest.fn(() => ({
          read: mockRead,
          patch: mockPatch,
          delete: mockDelete,
        })),
        items: {
          create: mockCreate,
          query: jest.fn(() => ({
            fetchNext: mockFetchNext,
          })),
          bulk: mockBulk,
        },
      })),
    })),
  })),
}));

describe(CosmosRepository, () => {
  beforeEach(() => {
    mockRead.mockClear();
    mockPatch.mockClear();
    mockCreate.mockClear();
    mockBulk.mockClear();
    mockDelete.mockClear();
    mockFetchNext.mockClear();
  });

  const mockCosmosEndpoint = faker.datatype.string();
  const mockCosmosKey = faker.datatype.string();
  const mockCosmosDbName = faker.datatype.string();
  const cosmosContainerMap = new Map<DbContainerNameKey, string>([
    ['drafts', 'drafts'],
    ['submissions', 'submissions'],
    ['templates', 'templates'],
  ]);
  const logger = new Logger();

  const subject = new CosmosRepository(
    new CosmosClient({
      endpoint: mockCosmosEndpoint,
      key: mockCosmosKey,
    }),
    mockCosmosDbName,
    cosmosContainerMap,
    logger,
  );

  describe('getRecords', () => {
    it('handles empty response', async () => {
      mockFetchNext.mockResolvedValueOnce({
        results: undefined || [],
        hasMoreResults: false,
        continuationToken: '',
      } as unknown as FeedResponse<object>);

      expect(
        await subject.getRecords('drafts', faker.datatype.uuid(), 'ASC'),
      ).toEqual({
        totalRecords: 0,
        totalPages: 0,
        currentPage: 0,
        pages: [],
        values: [],
      });
    });
  });

  describe('getRecord', () => {
    it('retrieves a value with the associated id', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      const timestamp = new Date();
      const mockResponse = {
        id,
        value: {
          id,
          accountId,
          reference: 'abc',
          wasteDescription: { status: 'NotStarted' },
          wasteQuantity: { status: 'CannotStart' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: { status: 'NotStarted', transport: true },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'CannotStart' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: { status: 'InProgress', timestamp: timestamp },
        },
        partitionKey: accountId,
        _rid: faker.datatype.string(),
        _self: faker.datatype.string(),
        _etag: faker.datatype.string(),
        _attachments: faker.datatype.string(),
        _ts: faker.datatype.bigInt(),
      };
      mockRead.mockResolvedValueOnce({
        resource: mockResponse,
      } as unknown as ItemResponse<object>);

      let result = await subject.getRecord('drafts', id, accountId);
      expect(result).toEqual({
        id,
        reference: 'abc',
        carriers: { status: 'NotStarted', transport: true },
        collectionDate: { status: 'NotStarted' },
        collectionDetail: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
        transitCountries: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        wasteDescription: { status: 'NotStarted' },
        wasteQuantity: { status: 'CannotStart' },
      });

      const mockSubmissionResponse = {
        id: id,
        value: {
          id: id,
          reference: faker.datatype.string(),
          wasteDescription: {
            wasteCode: {
              type: 'BaselAnnexIX',
              code: 'B1010',
            },
            ewcCodes: [
              {
                code: '010101',
              },
            ],
            nationalCode: {
              provided: 'Yes',
              value: 'National Code',
            },
            description: faker.datatype.string(),
          },
          wasteQuantity: {
            type: 'ActualData',
            estimateData: {},
            actualData: {
              quantityType: 'Weight',
              value: 5.25,
              unit: 'Tonne',
            },
          },
          exporterDetail: {
            exporterAddress: {
              addressLine1: faker.datatype.string(),
              addressLine2: faker.datatype.string(),
              townCity: faker.datatype.string(),
              postcode: 'SW1A 1AA',
              country: faker.datatype.string(),
            },
            exporterContactDetails: {
              organisationName: faker.datatype.string(),
              fullName: faker.datatype.string(),
              emailAddress: 'test@mail.com',
              phoneNumber: '01234567890',
            },
          },
          importerDetail: {
            importerAddressDetails: {
              organisationName: faker.datatype.string(),
              address: faker.datatype.string(),
              country: 'Puerto Rico [PR]',
            },
            importerContactDetails: {
              fullName: faker.datatype.string(),
              emailAddress: 'mail@mail.com',
              phoneNumber: '01234567890',
              faxNumber: '0123567890',
            },
          },
          collectionDate: {
            type: 'ActualDate',
            actualDate: {
              day: '26',
              month: '06',
              year: '2024',
            },
            estimateDate: {},
          },
          carriers: [
            {
              addressDetails: {
                organisationName: faker.datatype.string(),
                address: faker.datatype.string(),
                country: 'United Kingdom (Wales) [GB-WLS]',
              },
              contactDetails: {
                fullName: faker.datatype.string(),
                emailAddress: 'sample@mail.com',
                phoneNumber: '01234567890',
              },
              transportDetails: {
                type: 'Road',
                description: faker.datatype.string(),
              },
            },
          ],
          collectionDetail: {
            address: {
              addressLine1: faker.datatype.string(),
              addressLine2: faker.datatype.string(),
              townCity: faker.datatype.string(),
              postcode: 'SW1A 1AA',
              country: faker.datatype.string(),
            },
            contactDetails: {
              organisationName: faker.datatype.string(),
              fullName: faker.datatype.string(),
              emailAddress: 'sample@mail.com',
              phoneNumber: '0123457890',
            },
          },
          ukExitLocation: {
            provided: 'Yes',
            value: faker.datatype.string(),
          },
          transitCountries: [],
          recoveryFacilityDetail: [
            {
              addressDetails: {
                name: faker.datatype.string(),
                address: faker.datatype.string(),
                country: 'Antarctica [AQ]',
              },
              contactDetails: {
                fullName: faker.datatype.string(),
                emailAddress: 'test@test.com',
                phoneNumber: '01234567890',
                faxNumber: '01234567890',
              },
              recoveryFacilityType: {
                type: 'InterimSite',
                recoveryCode: 'R12',
              },
            },
            {
              addressDetails: {
                name: faker.datatype.string(),
                address: faker.datatype.string(),
                country: 'Belarus [BY]',
              },
              contactDetails: {
                fullName: faker.datatype.string(),
                emailAddress: 'test@test.biz',
                phoneNumber: '01234567890',
              },
              recoveryFacilityType: {
                type: 'RecoveryFacility',
                recoveryCode: 'R1',
              },
            },
          ],
          submissionDeclaration: {
            declarationTimestamp: faker.datatype.datetime(),
            transactionId: '2406_AFA5EDB9',
          },
          submissionState: {
            status: 'SubmittedWithActuals',
            timestamp: faker.datatype.datetime(),
          },
          accountId: accountId,
        },
        partitionKey: accountId,
        _rid: 'xCAfANgtxZ7mBwAAAAAAAA==',
        _self: 'dbs/xCAfAA==/colls/xCAfANgtxZ4=/docs/xCAfANgtxZ7mBwAAAAAAAA==/',
        _etag: '"3d00825a-0000-1100-0000-6672c9620000"',
        _attachments: 'attachments/',
        _ts: 1718798690,
      };

      mockRead.mockResolvedValueOnce({
        resource: mockSubmissionResponse,
      } as unknown as ItemResponse<object>);

      result = await subject.getRecord('submissions', id, accountId);

      expect(result).toEqual({
        id: mockSubmissionResponse.value.id,
        reference: mockSubmissionResponse.value.reference,
        carriers: mockSubmissionResponse.value.carriers,
        collectionDate: mockSubmissionResponse.value.collectionDate,
        collectionDetail: mockSubmissionResponse.value.collectionDetail,
        exporterDetail: mockSubmissionResponse.value.exporterDetail,
        importerDetail: mockSubmissionResponse.value.importerDetail,
        recoveryFacilityDetail:
          mockSubmissionResponse.value.recoveryFacilityDetail,
        submissionDeclaration:
          mockSubmissionResponse.value.submissionDeclaration,
        submissionState: {
          status: mockSubmissionResponse.value.submissionState.status,
          timestamp: mockSubmissionResponse.value.submissionState.timestamp,
        },
        transitCountries: mockSubmissionResponse.value.transitCountries,
        ukExitLocation: mockSubmissionResponse.value.ukExitLocation,
        wasteDescription: mockSubmissionResponse.value.wasteDescription,
        wasteQuantity: mockSubmissionResponse.value.wasteQuantity,
      });

      const mockTemplateResponse = {
        id,
        value: {
          id,
          accountId,
          templateDetails: {
            name: faker.datatype.string(),
            description: faker.datatype.string(),
            created: new Date(),
            lastModified: new Date(),
          },
          wasteDescription: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          carriers: { status: 'NotStarted', transport: true },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'CannotStart' },
        },
        partitionKey: accountId,
        _rid: faker.datatype.string(),
        _self: faker.datatype.string(),
        _etag: faker.datatype.string(),
        _attachments: faker.datatype.string(),
        _ts: faker.datatype.bigInt(),
      };

      mockRead.mockResolvedValueOnce({
        resource: mockTemplateResponse,
      } as unknown as ItemResponse<object>);

      result = await subject.getRecord('templates', id, accountId);

      expect(result).toEqual({
        id,
        templateDetails: mockTemplateResponse.value.templateDetails,
        carriers: mockTemplateResponse.value.carriers,
        collectionDetail: mockTemplateResponse.value.collectionDetail,
        exporterDetail: mockTemplateResponse.value.exporterDetail,
        importerDetail: mockTemplateResponse.value.importerDetail,
        recoveryFacilityDetail:
          mockTemplateResponse.value.recoveryFacilityDetail,
        transitCountries: mockTemplateResponse.value.transitCountries,
        ukExitLocation: mockTemplateResponse.value.ukExitLocation,
        wasteDescription: mockTemplateResponse.value.wasteDescription,
      });
    });

    it("throws Not Found exception if key doesn't exist", async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      mockRead.mockResolvedValueOnce({
        resource: undefined,
      } as unknown as ItemResponse<object>);

      expect(subject.getRecord('drafts', id, accountId)).rejects.toThrow(
        Boom.notFound(),
      );
      expect(mockRead).toBeCalledTimes(1);
    });
  });

  describe('getTotalNumber', () => {
    it('gets the total number of records', async () => {
      mockFetchNext.mockResolvedValueOnce({
        resources: [2],
      } as unknown as FeedResponse<object>);

      expect(
        await subject.getTotalNumber('drafts', faker.datatype.uuid()),
      ).toEqual(2);
    });
  });

  describe('deleteRecord', () => {
    it('successfully deletes a record', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      mockDelete.mockResolvedValueOnce({
        resource: undefined,
      } as unknown as ItemResponse<object>);

      await subject.deleteRecord('drafts', id, accountId);

      expect(mockDelete).toBeCalledTimes(1);
    });

    it('throws Not Found exception if record does not exist', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      mockDelete.mockRejectedValueOnce({
        code: 404,
      });

      expect(subject.deleteRecord('drafts', id, accountId)).rejects.toThrow(
        Boom.notFound(),
      );
    });
  });

  describe('saveRecord', () => {
    it('successfully saves a new record', async () => {
      const accountId = faker.datatype.uuid();
      const record = {
        id: faker.datatype.uuid(),
        accountId,
        reference: faker.datatype.string(),
        wasteDescription: {
          description: faker.datatype.string(),
          wasteCode: { type: 'NotApplicable' },
          ewcCodes: [{ code: 'EWC code' }, { code: 'EWC code' }],
        },
        wasteQuantity: {
          type: 'ActualData',
          estimateData: {
            quantityType: 'Volume',
            unit: 'Tonne',
            value: 1,
          },
          actualData: {
            quantityType: 'Volume',
            unit: 'Tonne',
            value: 1,
          },
        },
        exporterDetail: {
          exporterAddress: {
            addressLine1: faker.datatype.string(),
            addressLine2: faker.datatype.string(),
            townCity: faker.datatype.string(),
            postcode: faker.datatype.string(),
            country: faker.datatype.string(),
          },
          exporterContactDetails: {
            organisationName: faker.datatype.string(),
            fullName: faker.datatype.string(),
            emailAddress: faker.datatype.string(),
            phoneNumber: faker.datatype.string(),
            faxNumber: faker.datatype.string(),
          },
        },
        importerDetail: {
          importerAddressDetails: {
            organisationName: faker.datatype.string(),
            address: faker.datatype.string(),
            country: faker.datatype.string(),
          },
          importerContactDetails: {
            fullName: faker.datatype.string(),
            emailAddress: faker.datatype.string(),
            phoneNumber: faker.datatype.string(),
            faxNumber: faker.datatype.string(),
          },
        },
        collectionDate: {
          type: 'ActualDate',
          estimateDate: {
            day: '1',
            month: '1',
            year: '2030',
          },
          actualDate: {
            day: '1',
            month: '1',
            year: '2030',
          },
        },
        carriers: [
          {
            addressDetails: {
              organisationName: faker.datatype.string(),
              address: faker.datatype.string(),
              country: faker.datatype.string(),
            },
            contactDetails: {
              fullName: faker.datatype.string(),
              emailAddress: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
              faxNumber: faker.datatype.string(),
            },
          },
        ],
        collectionDetail: {
          address: {
            addressLine1: faker.datatype.string(),
            townCity: faker.datatype.string(),
            postcode: faker.datatype.string(),
            country: faker.datatype.string(),
          },
          contactDetails: {
            organisationName: faker.datatype.string(),
            fullName: faker.datatype.string(),
            emailAddress: faker.datatype.string(),
            phoneNumber: faker.datatype.string(),
            faxNumber: faker.datatype.string(),
          },
        },
        ukExitLocation: {
          provided: 'No',
        },
        transitCountries: ['France [FR]'],
        recoveryFacilityDetail: [
          {
            addressDetails: {
              name: faker.datatype.string(),
              address: faker.datatype.string(),
              country: faker.datatype.string(),
            },
            contactDetails: {
              fullName: faker.datatype.string(),
              emailAddress: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
              faxNumber: faker.datatype.string(),
            },
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D1',
            },
          },
        ],
        submissionState: {
          status: 'UpdatedWithActuals',
          timestamp: new Date(),
        },
        submissionDeclaration: {
          declarationTimestamp: new Date(),
          transactionId: faker.datatype.string(),
        },
      } as Submission;

      mockRead.mockResolvedValueOnce({
        resource: undefined,
      } as unknown as ItemResponse<object>);

      mockCreate.mockResolvedValueOnce({
        resource: record,
      } as unknown as ItemResponse<object>);

      await subject.saveRecord('drafts', record, accountId);

      expect(mockCreate).toBeCalled();
      expect(mockPatch).not.toBeCalled();
    });

    it('successfully updates an existing record', async () => {
      const accountId = faker.datatype.uuid();
      const record = {
        id: faker.datatype.uuid(),
        accountId,
        reference: faker.datatype.string(),
        wasteDescription: {
          description: faker.datatype.string(),
          wasteCode: { type: 'NotApplicable' },
          ewcCodes: [{ code: 'EWC code' }, { code: 'EWC code' }],
        },
        wasteQuantity: {
          type: 'ActualData',
          estimateData: {
            quantityType: 'Volume',
            unit: 'Tonne',
            value: 1,
          },
          actualData: {
            quantityType: 'Volume',
            unit: 'Tonne',
            value: 1,
          },
        },
        exporterDetail: {
          exporterAddress: {
            addressLine1: faker.datatype.string(),
            addressLine2: faker.datatype.string(),
            townCity: faker.datatype.string(),
            postcode: faker.datatype.string(),
            country: faker.datatype.string(),
          },
          exporterContactDetails: {
            organisationName: faker.datatype.string(),
            fullName: faker.datatype.string(),
            emailAddress: faker.datatype.string(),
            phoneNumber: faker.datatype.string(),
            faxNumber: faker.datatype.string(),
          },
        },
        importerDetail: {
          importerAddressDetails: {
            organisationName: faker.datatype.string(),
            address: faker.datatype.string(),
            country: faker.datatype.string(),
          },
          importerContactDetails: {
            fullName: faker.datatype.string(),
            emailAddress: faker.datatype.string(),
            phoneNumber: faker.datatype.string(),
            faxNumber: faker.datatype.string(),
          },
        },
        collectionDate: {
          type: 'ActualDate',
          estimateDate: {
            day: '1',
            month: '1',
            year: '2030',
          },
          actualDate: {
            day: '1',
            month: '1',
            year: '2030',
          },
        },
        carriers: [
          {
            addressDetails: {
              organisationName: faker.datatype.string(),
              address: faker.datatype.string(),
              country: faker.datatype.string(),
            },
            contactDetails: {
              fullName: faker.datatype.string(),
              emailAddress: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
              faxNumber: faker.datatype.string(),
            },
          },
        ],
        collectionDetail: {
          address: {
            addressLine1: faker.datatype.string(),
            townCity: faker.datatype.string(),
            postcode: faker.datatype.string(),
            country: faker.datatype.string(),
          },
          contactDetails: {
            organisationName: faker.datatype.string(),
            fullName: faker.datatype.string(),
            emailAddress: faker.datatype.string(),
            phoneNumber: faker.datatype.string(),
            faxNumber: faker.datatype.string(),
          },
        },
        ukExitLocation: {
          provided: 'No',
        },
        transitCountries: ['France [FR]'],
        recoveryFacilityDetail: [
          {
            addressDetails: {
              name: faker.datatype.string(),
              address: faker.datatype.string(),
              country: faker.datatype.string(),
            },
            contactDetails: {
              fullName: faker.datatype.string(),
              emailAddress: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
              faxNumber: faker.datatype.string(),
            },
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D1',
            },
          },
        ],
        submissionState: {
          status: 'UpdatedWithActuals',
          timestamp: new Date(),
        },
        submissionDeclaration: {
          declarationTimestamp: new Date(),
          transactionId: faker.datatype.string(),
        },
      } as Submission;

      mockRead.mockResolvedValueOnce({
        resource: record,
      } as unknown as ItemResponse<object>);

      mockCreate.mockResolvedValueOnce({
        resource: record,
      } as unknown as ItemResponse<object>);

      await subject.saveRecord('drafts', record, accountId);

      expect(mockCreate).not.toBeCalled();
      expect(mockPatch).toBeCalled();
    });
  });
});
