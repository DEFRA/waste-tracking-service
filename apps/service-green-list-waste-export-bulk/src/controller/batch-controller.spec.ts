import { expect, jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import winston from 'winston';
import Boom from '@hapi/boom';
import BatchController from './batch-controller';
import { BulkSubmission } from '../model';
import { DaprAnnexViiClient } from '@wts/client/green-list-waste-export';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockClient = {
  getBulkSubmissions: jest.fn<DaprAnnexViiClient['getBulkSubmissions']>(),
};

const mockRepository = {
  saveBatch:
    jest.fn<(value: BulkSubmission, accountId: string) => Promise<void>>(),
  getBatch:
    jest.fn<(id: string, accountId: string) => Promise<BulkSubmission>>(),
};

describe(BatchController, () => {
  const subject = new BatchController(
    mockRepository,
    mockClient as unknown as DaprAnnexViiClient,
    new winston.Logger(),
  );

  beforeEach(() => {
    mockRepository.saveBatch.mockClear();
    mockRepository.getBatch.mockClear();
  });

  describe('addContentToBatch', () => {
    it('forwards thrown Boom errors', async () => {
      mockRepository.saveBatch.mockRejectedValue(Boom.teapot());
      const response = await subject.addContentToBatch({
        accountId: faker.string.uuid(),
        content: {
          type: 'text/csv',
          compression: 'Snappy',
          value: faker.string.sample(),
        },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.saveBatch).toBeCalled();
      expect(response.error.statusCode).toBe(418);
    });
  });

  describe('getBatch', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getBatch.mockRejectedValue(Boom.teapot());

      const response = await subject.getBatch({ id, accountId });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getBatch).toBeCalledWith(id, accountId);
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns value from the repository', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const value: BulkSubmission = {
        id,
        state: {
          status: 'Processing',
          timestamp: new Date(),
        },
      };

      mockRepository.getBatch.mockResolvedValue(value);

      const response = await subject.getBatch({ id, accountId });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getBatch).toHaveBeenCalledWith(id, accountId);
      expect(response.value).toEqual(value);
    });
  });

  describe('updateBatch', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();

      const value: BulkSubmission = {
        id,
        state: {
          status: 'FailedValidation',
          timestamp: new Date(),
          rowErrors: [],
          columnErrors: [],
        },
      };
      mockRepository.getBatch.mockResolvedValue(value);

      const response = await subject.updateBatch({ id, accountId });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.saveBatch).toBeCalledTimes(0);
      expect(response.error.statusCode).toBe(400);
    });

    it('successfully updates value from the repository', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();

      const value: BulkSubmission = {
        id,
        state: {
          status: 'PassedValidation',
          timestamp: new Date(),
          hasEstimates: true,
          submissions: [],
        },
      };
      mockRepository.getBatch.mockResolvedValue(value);
      mockRepository.saveBatch.mockResolvedValue(undefined);

      const response = await subject.updateBatch({
        id,
        accountId,
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      id.substring(0, 8).toUpperCase();
      expect(mockRepository.saveBatch).toBeCalledTimes(1);
      expect(response.value).toEqual(undefined);
    });
  });
});
