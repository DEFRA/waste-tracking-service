import { faker } from '@faker-js/faker';
import { server } from '@hapi/hapi';
import { jest } from '@jest/globals';
import winston from 'winston';
import {
  CustomerReference,
  Submission,
  SubmissionBackend,
  SubmissionRef,
  WasteDescription,
  WasteQuantity,
  ExporterDetail,
  ImporterDetail,
  CollectionDate,
  Carriers,
  CollectionDetail,
  ExitLocation,
  TransitCountries,
} from './submission.backend';
import submissionPlugin from './submission.plugin';
import Boom from '@hapi/boom';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const accountId = 'c3c99728-3d5e-4357-bfcb-32dd913a55e8';

const mockBackend = {
  createSubmission:
    jest.fn<
      (accountId: string, reference: CustomerReference) => Promise<Submission>
    >(),

  getSubmission: jest.fn<(ref: SubmissionRef) => Promise<Submission>>(),
  getCustomerReference:
    jest.fn<(ref: SubmissionRef) => Promise<CustomerReference>>(),
  setCustomerReference:
    jest.fn<
      (ref: SubmissionRef, reference: CustomerReference) => Promise<void>
    >(),
  getWasteDescription:
    jest.fn<(ref: SubmissionRef) => Promise<WasteDescription>>(),
  setWasteDescription:
    jest.fn<
      (ref: SubmissionRef, wasteDescription: WasteDescription) => Promise<void>
    >(),
  getWasteQuantity: jest.fn<(ref: SubmissionRef) => Promise<WasteQuantity>>(),
  setWasteQuantity:
    jest.fn<
      (ref: SubmissionRef, wasteDescription: WasteQuantity) => Promise<void>
    >(),
  getExporterDetail: jest.fn<(ref: SubmissionRef) => Promise<ExporterDetail>>(),
  setExporterDetail:
    jest.fn<(ref: SubmissionRef, value: ExporterDetail) => Promise<void>>(),
  getImporterDetail: jest.fn<(ref: SubmissionRef) => Promise<ImporterDetail>>(),
  setImporterDetail:
    jest.fn<(ref: SubmissionRef, value: ImporterDetail) => Promise<void>>(),
  getCollectionDate: jest.fn<(ref: SubmissionRef) => Promise<CollectionDate>>(),
  setCollectionDate:
    jest.fn<(ref: SubmissionRef, value: CollectionDate) => Promise<void>>(),
  listCarriers: jest.fn<(ref: SubmissionRef) => Promise<Carriers>>(),
  createCarriers:
    jest.fn<
      (ref: SubmissionRef, value: Omit<Carriers, 'values'>) => Promise<Carriers>
    >(),
  getCarriers:
    jest.fn<(ref: SubmissionRef, carrierId: string) => Promise<Carriers>>(),
  setCarriers:
    jest.fn<
      (ref: SubmissionRef, carrerId: string, value: Carriers) => Promise<void>
    >(),
  deleteCarriers:
    jest.fn<(ref: SubmissionRef, carrierId: string) => Promise<void>>(),
  getCollectionDetail:
    jest.fn<(ref: SubmissionRef) => Promise<CollectionDetail>>(),
  setCollectionDetail:
    jest.fn<(ref: SubmissionRef, value: CollectionDetail) => Promise<void>>(),
  getExitLocation: jest.fn<(ref: SubmissionRef) => Promise<ExitLocation>>(),
  setExitLocation:
    jest.fn<(ref: SubmissionRef, value: ExitLocation) => Promise<void>>(),
  getTransitCountries:
    jest.fn<(ref: SubmissionRef) => Promise<TransitCountries>>(),
  setTransitCountries:
    jest.fn<(ref: SubmissionRef, value: TransitCountries) => Promise<void>>(),
};

const app = server({
  host: 'localhost',
  port: 3000,
});

beforeAll(async () => {
  await app.register({
    plugin: submissionPlugin,
    options: {
      backend: mockBackend as SubmissionBackend,
      logger: new winston.Logger(),
    },
    routes: {
      prefix: '/submissions',
    },
  });

  await app.start();
});

afterAll(async () => {
  await app.stop();
});

describe('SubmissionPlugin', () => {
  beforeEach(() => {
    mockBackend.createSubmission.mockClear();
    mockBackend.getSubmission.mockClear();
    mockBackend.getWasteDescription.mockClear();
    mockBackend.setWasteDescription.mockClear();
    mockBackend.getWasteQuantity.mockClear();
    mockBackend.setWasteQuantity.mockClear();
    mockBackend.getCustomerReference.mockClear();
    mockBackend.setCustomerReference.mockClear();
    mockBackend.getExporterDetail.mockClear();
    mockBackend.setExporterDetail.mockClear();
    mockBackend.getImporterDetail.mockClear();
    mockBackend.setImporterDetail.mockClear();
    mockBackend.getCollectionDate.mockClear();
    mockBackend.setCollectionDate.mockClear();
    mockBackend.listCarriers.mockClear();
    mockBackend.createCarriers.mockClear();
    mockBackend.getCarriers.mockClear();
    mockBackend.setCarriers.mockClear();
    mockBackend.deleteCarriers.mockClear();
    mockBackend.getCollectionDetail.mockClear();
    mockBackend.setCollectionDetail.mockClear();
  });

  describe('POST /submissions', () => {
    it('Responds 400 with no request payload', async () => {
      const options = {
        method: 'POST',
        url: '/submissions',
      };

      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /submissions/{id}', () => {
    it("Responds 404 if submission doesn't exist", async () => {
      const options = {
        method: 'GET',
        url: `/submissions/${faker.datatype.uuid()}`,
      };

      mockBackend.getSubmission.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /submissions/{id}/reference', () => {
    it("Responds 404 if submission doesn't exist", async () => {
      const options = {
        method: 'GET',
        url: `/submissions/${faker.datatype.uuid()}/reference`,
      };

      mockBackend.getCustomerReference.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /submissions/{id}/reference', () => {
    it('Supports null values', async () => {
      const id = faker.datatype.uuid();
      mockBackend.setCustomerReference.mockResolvedValue();
      const response = await app.inject({
        method: 'PUT',
        url: `/submissions/${id}/reference`,
        payload: JSON.stringify(null),
      });

      expect(response.result).toBeNull();
      expect(response.statusCode).toBe(204);
      expect(mockBackend.setCustomerReference).toBeCalledTimes(1);
      expect(mockBackend.setCustomerReference).toBeCalledWith(
        { id, accountId },
        null
      );
    });

    it('Supports string values', async () => {
      const id = faker.datatype.uuid();
      const reference = faker.datatype.string(10);
      mockBackend.setCustomerReference.mockResolvedValue();
      const response = await app.inject({
        method: 'PUT',
        url: `/submissions/${id}/reference`,
        payload: JSON.stringify(reference),
      });

      expect(response.result).toEqual(reference);
      expect(response.statusCode).toBe(200);
      expect(mockBackend.setCustomerReference).toBeCalledTimes(1);
      expect(mockBackend.setCustomerReference).toBeCalledWith(
        { id, accountId },
        reference
      );
    });
  });

  describe('GET /submissions/{id}/carriers/{carrierId}', () => {
    it("Responds 404 if carrier doesn't exist", async () => {
      const options = {
        method: 'GET',
        url: `/submissions/${faker.datatype.uuid()}/carriers/${faker.datatype.uuid()}`,
      };

      mockBackend.getCarriers.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /submissions/{id}/carriers/{carrierId}', () => {
    it("Responds 400 if carrier id doesn't match with id from payload", async () => {
      const id = faker.datatype.uuid();
      const carrierId = faker.datatype.uuid();
      mockBackend.setCarriers.mockResolvedValue();
      const options = {
        method: 'PUT',
        url: `/submissions/${id}/carriers/${carrierId}`,
        payload: JSON.stringify({
          status: 'Started',
          values: [
            {
              id: faker.datatype.uuid(),
            },
          ],
        }),
      };

      mockBackend.getCarriers.mockRejectedValue(Boom.badRequest());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });
});
