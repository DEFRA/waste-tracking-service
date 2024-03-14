import { v4 as uuidv4 } from 'uuid';
import { BulkSubmission } from '@wts/api/waste-tracking-gateway';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { finished } from 'stream/promises';
import { BulkWithAccount, db } from '../../db';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../../libs/errors';

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

export async function createBatch(
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
    if (err instanceof Error) {
      return Promise.reject(err);
    }

    if (err instanceof Error && 'code' in err && typeof err.code === 'string') {
      return Promise.reject(new BadRequestError('Bad Request error.'));
    }

    return Promise.reject(new InternalServerError('Internal error.'));
  }

  const timestamp = new Date();
  const transactionId =
    timestamp.getFullYear().toString().substring(2) +
    (timestamp.getMonth() + 1).toString().padStart(2, '0') +
    '_' +
    id.substring(0, 8).toUpperCase();

  let value: BulkWithAccount = {
    id: id,
    state: {
      status: 'Processing',
      timestamp: timestamp,
    },
    accountId: accountId,
  };
  console.log(records[0].state);
  switch (records[0].state) {
    case 'Processing':
      value = {
        id: id,
        state: {
          status: 'Processing',
          timestamp: timestamp,
        },
        accountId: accountId,
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
        accountId: accountId,
      };
      break;
    case 'PassedValidation':
      value = {
        id: uuidv4(),
        state: {
          status: 'PassedValidation',
          timestamp: timestamp,
          hasEstimates: true,
          submissions: [
            {
              reference: 'ref1',
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
            },
            {
              reference: 'ref2',
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
            },
          ],
        },
        accountId: accountId,
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
        accountId: accountId,
      };
      break;
  }

  db.batches.push(value);

  return Promise.resolve({ id: value.id });
}

export async function getBatch({
  id,
  accountId,
}: BatchRef): Promise<BulkSubmission> {
  const value = db.batches.find((b) => b.id == id && b.accountId == accountId);

  if (value === undefined) {
    return Promise.reject(new NotFoundError());
  }
  const batch: BulkSubmission = {
    id: value.id,
    state: value.state,
  };
  return Promise.resolve(batch);
}

export async function finalizeBatch({
  id,
  accountId,
}: BatchRef): Promise<void> {
  const value = db.batches.find((b) => b.id == id && b.accountId == accountId);
  if (value === undefined) {
    return Promise.reject(new NotFoundError());
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

  return Promise.resolve();
}
