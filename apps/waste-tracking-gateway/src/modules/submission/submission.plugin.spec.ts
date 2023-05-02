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
});
