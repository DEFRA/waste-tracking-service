import Boom from '@hapi/boom';
import { DaprAnnexViiBulkClient } from '@wts/client/annex-vii-bulk';
import { compress } from 'snappy';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import { BulkSubmission } from '@wts/api/waste-tracking-gateway';
import { GetBatchResponse, UpdateBatchResponse } from '@wts/api/annex-vii-bulk';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { finished } from 'stream/promises';

export type BatchRef = {
  id: string;
  accountId: string;
};

export type Input = {
  type: string;
  data: Buffer;
};

type TestCsvRow = {
  state: string;
};

const batches = new Map<string, BulkSubmission>();

export interface BulkSubmissionBackend {
  createBatch(accountId: string, inputs: Input[]): Promise<{ id: string }>;
  getBatch(ref: BatchRef): Promise<BulkSubmission>;
  finalizeBatch(ref: BatchRef): Promise<void>;
}

export class InMemoryBulkSubmissionBackend implements BulkSubmissionBackend {
  async createBatch(
    accountId: string,
    inputs: Input[]
  ): Promise<{ id: string }> {
    const id = uuidv4();

    const records: TestCsvRow[] = [];

    try {
      for (const input of inputs) {
        const stream = Readable.from(input.data);

        const parser = stream.pipe(
          parse({
            columns: ['state'],
            fromLine: 3,
            relax_quotes: true,
            escape: '\\',
            ltrim: true,
            rtrim: true,
          })
        );

        parser.on('readable', function () {
          let record;
          while ((record = parser.read()) !== null) {
            records.push(record);
          }
        });

        await finished(parser);
      }
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return Promise.reject(err);
      }

      if (
        err instanceof Error &&
        'code' in err &&
        typeof err.code === 'string'
      ) {
        const value: BulkSubmission = {
          id: id,
          state: {
            status: 'FailedCsvValidation',
            timestamp: new Date(),
            error: err.code,
          },
        };
        batches.set(JSON.stringify({ id, accountId }), value);
        return Promise.resolve({ id: id });
      }

      return Promise.reject(Boom.internal());
    }

    const timestamp = new Date();
    const transactionId =
      timestamp.getFullYear().toString().substring(2) +
      (timestamp.getMonth() + 1).toString().padStart(2, '0') +
      '_' +
      id.substring(0, 8).toUpperCase();

    let value: BulkSubmission = {
      id: id,
      state: {
        status: 'Processing',
        timestamp: timestamp,
      },
    };

    switch (records[0].state) {
      case 'Processing':
        value = {
          id: id,
          state: {
            status: 'Processing',
            timestamp: timestamp,
          },
        };
        break;
      case 'FailedValidation':
        value = {
          id: uuidv4(),
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
        };
        break;
      case 'PassedValidation':
        value = {
          id: uuidv4(),
          state: {
            status: 'PassedValidation',
            timestamp: timestamp,
            drafts: [
              {
                id: uuidv4(),
              },
            ],
          },
        };
        break;
      case 'Submitted':
        value = {
          id: uuidv4(),
          state: {
            status: 'Submitted',
            timestamp: timestamp,
            transactionId: transactionId,
            submissions: [
              {
                id: uuidv4(),
                transactionId: '2307_1234ABCD',
              },
            ],
          },
        };
        break;
    }

    batches.set(JSON.stringify({ id, accountId }), value);
    return Promise.resolve({ id: id });
  }

  getBatch({ id, accountId }: BatchRef): Promise<BulkSubmission> {
    const value = batches.get(JSON.stringify({ id, accountId }));
    if (value === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(value);
  }

  finalizeBatch({ id, accountId }: BatchRef): Promise<void> {
    const value = batches.get(JSON.stringify({ id, accountId }));
    if (value === undefined) {
      return Promise.reject(Boom.notFound());
    }

    const timestamp = new Date();
    const transactionId =
      timestamp.getFullYear().toString().substring(2) +
      (timestamp.getMonth() + 1).toString().padStart(2, '0') +
      '_' +
      id.substring(0, 8).toUpperCase();

    value.state = {
      status: 'Submitted',
      timestamp: timestamp,
      transactionId: transactionId,
      submissions: [
        {
          id: uuidv4(),
          transactionId: '2307_1234ABCD',
        },
      ],
    };

    batches.set(JSON.stringify({ id, accountId }), value);
    return Promise.resolve();
  }
}

export class AnnexViiBulkServiceBackend implements BulkSubmissionBackend {
  constructor(private client: DaprAnnexViiBulkClient, private logger: Logger) {}

  async createBatch(
    accountId: string,
    inputs: Input[]
  ): Promise<{ id: string }> {
    try {
      if (inputs.length === 0) {
        throw Boom.badRequest();
      }

      let batchId: string | undefined;
      for (const input of inputs) {
        if (input.type !== 'text/csv') {
          throw Boom.badRequest("Input type must be 'text/csv'");
        }

        const content = (await compress(input.data)).toString('base64');
        const response = await this.client.addContentToBatch({
          accountId,
          batchId,
          content: {
            type: input.type as 'text/csv',
            compression: 'Snappy',
            value: (await compress(input.data)).toString('base64'),
          },
        });

        if (!response.success) {
          this.logger.error('Error response from backend', {
            message: response.error.message,
          });

          throw new Boom.Boom(response.error.message, {
            statusCode: response.error.statusCode,
          });
        }

        this.logger.info('Added content to batch', {
          batchId: response.value.batchId,
          length: content.length,
        });

        batchId = response.value.batchId;
      }

      return { id: batchId as string };
    } catch (err) {
      if (err instanceof Boom.Boom) {
        throw new Boom.Boom(err.message, {
          statusCode: err.output.statusCode,
        });
      }

      this.logger.error('Error handling request', err);
      throw Boom.internal();
    }
  }

  async getBatch({ id, accountId }: BatchRef): Promise<BulkSubmission> {
    let response: GetBatchResponse;
    try {
      response = await this.client.getBatch({ id, accountId });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value as BulkSubmission;
  }

  async finalizeBatch({ id, accountId }: BatchRef): Promise<void> {
    let response: UpdateBatchResponse;
    try {
      response = await this.client.updateBatch({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }
}
