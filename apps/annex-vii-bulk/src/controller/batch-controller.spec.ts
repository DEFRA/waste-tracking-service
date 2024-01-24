import { expect, jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import winston from 'winston';
import Boom from '@hapi/boom';
import BatchController from './batch-controller';
import { BulkSubmission } from '../model';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockRepository = {
  saveBatch:
    jest.fn<(value: BulkSubmission, accountId: string) => Promise<void>>(),
  getBatch:
    jest.fn<(id: string, accountId: string) => Promise<BulkSubmission>>(),
};

describe(BatchController, () => {
  const subject = new BatchController(mockRepository, new winston.Logger());

  beforeEach(() => {
    mockRepository.saveBatch.mockClear();
    mockRepository.getBatch.mockClear();
  });

  describe('addBatchContent', () => {
    it('forwards thrown Boom errors', async () => {
      mockRepository.saveBatch.mockRejectedValue(Boom.teapot());
      const response = await subject.addBatchContent({
        accountId: faker.datatype.uuid(),
        content: {
          type: 'text/csv',
          compression: 'Snappy',
          value: faker.datatype.string(),
        },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.saveBatch).toBeCalled();
      expect(response.error.statusCode).toBe(418);
    });

    it('cannot initially start recovery facility section', async () => {
      mockRepository.saveBatch.mockResolvedValue();
      const response = await subject.addBatchContent({
        accountId: faker.datatype.uuid(),
        content: {
          type: 'text/csv',
          compression: 'Snappy',
          value: faker.datatype.string(),
        },
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }
    });
  });

  describe('getBatchContent', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      mockRepository.getBatch.mockRejectedValue(Boom.teapot());

      const response = await subject.getBatchContent({ id, accountId });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getBatch).toBeCalledWith(id, accountId);
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns value from the repository', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      const value: BulkSubmission = {
        id,
        state: {
          status: 'Processing',
          timestamp: new Date(),
        },
      };

      mockRepository.getBatch.mockResolvedValue(value);

      const response = await subject.getBatchContent({ id, accountId });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getBatch).toHaveBeenCalledWith(id, accountId);
      expect(response.value).toEqual(value);
    });
  });
});