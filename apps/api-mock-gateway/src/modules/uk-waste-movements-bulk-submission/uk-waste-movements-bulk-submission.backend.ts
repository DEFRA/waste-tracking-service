import Boom from '@hapi/boom';
import { UkwmBulkSubmission } from '@wts/api/waste-tracking-gateway';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { finished } from 'stream/promises';
import { UkwmBulkWithAccount, db } from '../../db';

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
    if (err instanceof Boom.Boom) {
      return Promise.reject(err);
    }

    if (err instanceof Error && 'code' in err && typeof err.code === 'string') {
      const value: UkwmBulkWithAccount = {
        id: id,
        state: {
          status: 'FailedCsvValidation',
          timestamp: new Date(),
          error: err.code,
        },
        accountId: accountId,
      };
      db.ukwmBatches.push(value);
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

  let value: UkwmBulkWithAccount = {
    id: id,
    state: {
      status: 'Processing',
      timestamp: timestamp,
    },
    accountId: accountId,
  };

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
        id: id,
        accountId: accountId,
        state: {
          status: 'FailedValidation',
          timestamp: new Date(),
          rowErrors: [
            {
              rowNumber: 3,
              errorAmount: 12,
              errorDetails: [
                'The unique reference must be 20 characters or less',
                'Enter the producer organisation name',
                'Enter the producer address',
                'Enter the producer town or city',
                'Enter full name of producer contact',
                'Enter producer contact email address in correct format',
                'Enter the receiver organisation name',
                'Enter the receiver address',
                'Enter the receiver town or city',
                'Enter full name of receiver contact',
                'Enter receiver contact email address in correct format',
                'Enter the number and type of containers',
              ],
            },
            {
              rowNumber: 4,
              errorAmount: 16,
              errorDetails: [
                'The unique reference must be 20 characters or less',
                'Enter the producer organisation name',
                'Enter the producer address',
                'Enter the producer town or city',
                'The producer country must only be England, Wales, Scotland, or Northern Ireland',
                'Enter full name of producer contact',
                'Enter producer contact email address',
                'Enter the receiver organisation name',
                'Enter the receiver address',
                'Enter the receiver town or city',
                'The receiver country must only be England, Wales, Scotland, or Northern Ireland',
                'Enter full name of receiver contact',
                'Enter receiver contact email address',
                'Number and type of transportation details must be less than 100 characters',
                'The waste collection address line 2 must be fewer than 250 characters',
                'Enter the waste collection town or city',
                'The mode of transport must only be Road, Rail, Air, Sea or Inland Waterway',
              ],
            },
          ],
          columnErrors: [
            {
              columnName: 'Producer address line 1',
              errorAmount: 2,
              errorDetails: [
                {
                  rowNumber: 3,
                  errorReason: 'Enter the producer address',
                },
                {
                  rowNumber: 4,
                  errorReason: 'Enter the producer address',
                },
              ],
            },
            {
              columnName: 'Producer contact name',
              errorAmount: 2,
              errorDetails: [
                {
                  rowNumber: 3,
                  errorReason: 'Enter full name of producer contact',
                },
                {
                  rowNumber: 4,
                  errorReason: 'Enter full name of producer contact',
                },
              ],
            },
            {
              columnName: 'Producer contact email address',
              errorAmount: 2,
              errorDetails: [
                {
                  rowNumber: 3,
                  errorReason:
                    'Enter producer contact email address in correct format',
                },
                {
                  rowNumber: 4,
                  errorReason: 'Enter producer contact email address',
                },
              ],
            },
            {
              columnName: 'Producer country',
              errorAmount: 1,
              errorDetails: [
                {
                  rowNumber: 4,
                  errorReason:
                    'The producer country must only be England, Wales, Scotland, or Northern Ireland',
                },
              ],
            },
            {
              columnName: 'Producer organisation name',
              errorAmount: 2,
              errorDetails: [
                {
                  rowNumber: 3,
                  errorReason: 'Enter the producer organisation name',
                },
                {
                  rowNumber: 4,
                  errorReason: 'Enter the producer organisation name',
                },
              ],
            },
            {
              columnName: 'Producer town or city',
              errorAmount: 2,
              errorDetails: [
                {
                  rowNumber: 3,
                  errorReason: 'Enter the producer town or city',
                },
                {
                  rowNumber: 4,
                  errorReason: 'Enter the producer town or city',
                },
              ],
            },
            {
              columnName: 'Receiver address line 1',
              errorAmount: 2,
              errorDetails: [
                {
                  rowNumber: 3,
                  errorReason: 'Enter the receiver address',
                },
                {
                  rowNumber: 4,
                  errorReason: 'Enter the receiver address',
                },
              ],
            },
            {
              columnName: 'Receiver contact name',
              errorAmount: 2,
              errorDetails: [
                {
                  rowNumber: 3,
                  errorReason: 'Enter full name of receiver contact',
                },
                {
                  rowNumber: 4,
                  errorReason: 'Enter full name of receiver contact',
                },
              ],
            },
            {
              columnName: 'Receiver contact email address',
              errorAmount: 2,
              errorDetails: [
                {
                  rowNumber: 3,
                  errorReason:
                    'Enter receiver contact email address in correct format',
                },
                {
                  rowNumber: 4,
                  errorReason: 'Enter receiver contact email address',
                },
              ],
            },
            {
              columnName: 'Receiver country',
              errorAmount: 1,
              errorDetails: [
                {
                  rowNumber: 4,
                  errorReason:
                    'The receiver country must only be England, Wales, Scotland, or Northern Ireland',
                },
              ],
            },
            {
              columnName: 'Receiver organisation name',
              errorAmount: 2,
              errorDetails: [
                {
                  rowNumber: 3,
                  errorReason: 'Enter the receiver organisation name',
                },
                {
                  rowNumber: 4,
                  errorReason: 'Enter the receiver organisation name',
                },
              ],
            },
            {
              columnName: 'Receiver town or city',
              errorAmount: 2,
              errorDetails: [
                {
                  rowNumber: 3,
                  errorReason: 'Enter the receiver town or city',
                },
                {
                  rowNumber: 4,
                  errorReason: 'Enter the receiver town or city',
                },
              ],
            },
            {
              columnName: 'Waste Collection Details Invalid Town',
              errorAmount: 2,
              errorDetails: [
                {
                  rowNumber: 6,
                  errorReason:
                    'The mode of transport must only be Road, Rail, Air, Sea or Inland Waterway',
                },
                {
                  rowNumber: 7,
                  errorReason:
                    'The mode of transport must only be Road, Rail, Air, Sea or Inland Waterway',
                },
              ],
            },
            {
              columnName: 'Reference',
              errorAmount: 2,
              errorDetails: [
                {
                  rowNumber: 3,
                  errorReason:
                    'The unique reference must be 20 characters or less',
                },
                {
                  rowNumber: 4,
                  errorReason:
                    'The unique reference must be 20 characters or less',
                },
              ],
            },
            {
              columnName: 'Number and type of transportation containers',
              errorAmount: 2,
              errorDetails: [
                {
                  rowNumber: 3,
                  errorReason: 'Enter the number and type of containers',
                },
                {
                  rowNumber: 4,
                  errorReason:
                    'Number and type of transportation details must be less than 100 characters',
                },
              ],
            },
          ],
        },
      };
      break;
    case 'PassedValidation':
      value = {
        id: id,
        accountId: accountId,
        state: {
          status: 'PassedValidation',
          timestamp: timestamp,
          hasEstimates: true,
          submissions: [
            {
              producer: {
                reference: 'ref1',
                sicCode: '1010101',
                contact: {
                  email: 'example@email.com',
                  name: 'John Doe',
                  organisationName: 'Example Ltd',
                  phone: '0044140000000',
                },
                address: {
                  addressLine1: '123 Fake Street',
                  addressLine2: 'Apt 10',
                  country: 'England',
                  townCity: 'London',
                  postcode: 'FA1 2KE',
                },
              },
              receiver: {
                authorizationType: 'permit',
                environmentalPermitNumber: '1010101',
                contact: {
                  email: 'example@email.com',
                  name: 'John Doe',
                  organisationName: 'Example Ltd',
                  phone: '0044140000000',
                },
                address: {
                  addressLine1: '123 Fake Street',
                  addressLine2: 'Apt 10',
                  country: 'England',
                  townCity: 'London',
                  postcode: 'FA1 2KE',
                },
              },
              wasteType: {
                containsPops: false,
                ewcCode: '01 03 04',
                hasHazardousProperties: false,
                physicalForm: 'Solid',
                quantityUnit: 'Tonne',
                wasteDescription: 'Waste description',
                wasteQuantity: 100,
                wasteQuantityType: 'ActualData',
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
              wasteTransportation: {
                numberAndTypeOfContainers: '20 x 40ft containers',
                specialHandlingRequirements: 'Special handling requirements',
              },
            },
            {
              producer: {
                reference: 'ref2',
                sicCode: '20202',
                contact: {
                  email: 'janedoe@email.com',
                  name: 'Jane Doe',
                  organisationName: 'Company Ltd',
                  phone: '0044140000000',
                },
                address: {
                  addressLine1: '123 Real Street',
                  addressLine2: 'Apt 20',
                  country: 'England',
                  townCity: 'Manchester',
                  postcode: 'FA1 2KE',
                },
              },
              receiver: {
                authorizationType: 'permit',
                environmentalPermitNumber: '2020202',
                contact: {
                  email: 'example@email.com',
                  name: 'John Doe',
                  organisationName: 'Example Ltd',
                  phone: '0044140000000',
                },
                address: {
                  addressLine1: '123 Fake Street',
                  addressLine2: 'Apt 10',
                  country: 'England',
                  townCity: 'London',
                  postcode: 'FA1 2KE',
                },
              },
              wasteType: {
                containsPops: true,
                ewcCode: '02 03 02',
                hasHazardousProperties: true,
                physicalForm: 'Liquid',
                quantityUnit: 'Cubic Metre',
                wasteDescription: 'Waste description',
                wasteQuantity: 200,
                wasteQuantityType: 'EstimateData',
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
              wasteTransportation: {
                numberAndTypeOfContainers: '20 x 40ft containers',
                specialHandlingRequirements: 'Special handling requirements',
              },
            },
          ],
        },
      };
      break;
    case 'Submitting':
      value = {
        id: id,
        accountId: accountId,
        state: {
          status: 'Submitting',
          timestamp: timestamp,
          hasEstimates: true,
          submissions: [
            {
              producer: {
                reference: 'ref1',
                sicCode: '1010101',
                contact: {
                  email: 'example@email.com',
                  name: 'John Doe',
                  organisationName: 'Example Ltd',
                  phone: '0044140000000',
                },
                address: {
                  addressLine1: '123 Fake Street',
                  addressLine2: 'Apt 10',
                  country: 'England',
                  townCity: 'London',
                  postcode: 'FA1 2KE',
                },
              },
              receiver: {
                authorizationType: 'permit',
                environmentalPermitNumber: '1010101',
                contact: {
                  email: 'example@email.com',
                  name: 'John Doe',
                  organisationName: 'Example Ltd',
                  phone: '0044140000000',
                },
                address: {
                  addressLine1: '123 Fake Street',
                  addressLine2: 'Apt 10',
                  country: 'England',
                  townCity: 'London',
                  postcode: 'FA1 2KE',
                },
              },
              wasteType: {
                containsPops: false,
                ewcCode: '01 03 04',
                hasHazardousProperties: false,
                physicalForm: 'Solid',
                quantityUnit: 'Tonne',
                wasteDescription: 'Waste description',
                wasteQuantity: 100,
                wasteQuantityType: 'ActualData',
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
              wasteTransportation: {
                numberAndTypeOfContainers: '20 x 40ft containers',
                specialHandlingRequirements: 'Special handling requirements',
              },
            },
            {
              producer: {
                reference: 'ref2',
                sicCode: '20202',
                contact: {
                  email: 'janedoe@email.com',
                  name: 'Jane Doe',
                  organisationName: 'Company Ltd',
                  phone: '0044140000000',
                },
                address: {
                  addressLine1: '123 Real Street',
                  addressLine2: 'Apt 20',
                  country: 'England',
                  townCity: 'Manchester',
                  postcode: 'FA1 2KE',
                },
              },
              receiver: {
                authorizationType: 'permit',
                environmentalPermitNumber: '2020202',
                contact: {
                  email: 'example@email.com',
                  name: 'John Doe',
                  organisationName: 'Example Ltd',
                  phone: '0044140000000',
                },
                address: {
                  addressLine1: '123 Fake Street',
                  addressLine2: 'Apt 10',
                  country: 'England',
                  townCity: 'London',
                  postcode: 'FA1 2KE',
                },
              },
              wasteType: {
                containsPops: true,
                ewcCode: '02 03 02',
                hasHazardousProperties: true,
                physicalForm: 'Liquid',
                quantityUnit: 'Cubic Metre',
                wasteDescription: 'Waste description',
                wasteQuantity: 200,
                wasteQuantityType: 'EstimateData',
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
              wasteTransportation: {
                numberAndTypeOfContainers: '20 x 40ft containers',
                specialHandlingRequirements: 'Special handling requirements',
              },
            },
          ],
        },
      };
      break;

    case 'Submitted':
      value = {
        id: id,
        accountId: accountId,
        state: {
          status: 'Submitted',
          transactionId: transactionId,
          timestamp: timestamp,
          submissions: [
            {
              id: uuidv4(),
              transactionId: transactionId,
              reference: 'ref1',
            },
          ],
        },
      };
      break;
  }

  db.ukwmBatches.push(value);
  return { id: value.id };
}

export function getBatch({
  id,
  accountId,
}: BatchRef): Promise<UkwmBulkSubmission> {
  const value = db.ukwmBatches.find(
    (b) => b.id == id && b.accountId == accountId
  );
  if (value === undefined) {
    return Promise.reject(Boom.notFound());
  }

  return Promise.resolve(value);
}

export function finalizeBatch({ id, accountId }: BatchRef): Promise<void> {
  const value = db.ukwmBatches.find(
    (b) => b.id == id && b.accountId == accountId
  );
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
        id: id,
        transactionId: transactionId,
        reference: '12345',
      },
    ],
  };

  return Promise.resolve();
}
