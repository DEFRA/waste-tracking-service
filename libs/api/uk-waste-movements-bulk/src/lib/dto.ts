import { AccountIdRequest, Method } from '@wts/api/common';
import { Response } from '@wts/util/invocation';
import { Submission } from '@wts/api/uk-waste-movements';

export type AddContentToBatchRequest = AccountIdRequest & {
  batchId?: string;
  content: {
    type: 'text/csv';
    compression: 'Snappy' | 'None';
    value: string;
  };
};
export type AddContentToBatchResponse = Response<{ batchId: string }>;
export const addContentToBatch: Method = {
  name: 'ukwmAddContentToBatch',
  httpVerb: 'POST',
};
export const getBatch: Method = {
  name: 'ukwmGetBatch',
  httpVerb: 'POST',
};
export const finalizeBatch: Method = {
  name: 'ukwmFinalizeBatch',
  httpVerb: 'POST',
};

export type GetBatchRequest = { id: string } & AccountIdRequest;
export type GetBatchResponse = Response<BulkSubmission>;

export type FinalizeBatchRequest = { id: string } & AccountIdRequest;
export type FinalizeBatchResponse = Response<void>;

export type PartialSubmission = {
  receiver: Submission['receiver'];
  producer: Submission['producer'];
  wasteCollection: Submission['wasteCollection'];
  wasteType: Submission['wasteType'];
  wasteTransportation: Submission['wasteTransportation'];
};

export type BulkSubmissionValidationRowError = {
  rowNumber: number;
  errorAmount: number;
  errorDetails: string[];
};

export type BulkSubmissionValidationRowErrorDetails = {
  rowNumber: number;
  errorReason: string;
};

export type BulkSubmissionValidationColumnError = {
  errorAmount: number;
  columnName: string;
  errorDetails: BulkSubmissionValidationRowErrorDetails[];
};

export type SubmissionReference = {
  id: string;
  transactionId: string;
  reference: string;
};

export type BulkSubmissionState =
  | {
      status: 'Processing';
      timestamp: Date;
    }
  | {
      status: 'FailedCsvValidation';
      timestamp: Date;
      error: string;
    }
  | {
      status: 'FailedValidation';
      timestamp: Date;
      rowErrors: BulkSubmissionValidationRowError[];
      columnErrors: BulkSubmissionValidationColumnError[];
    }
  | {
      status: 'PassedValidation';
      timestamp: Date;
      hasEstimates: boolean;
      submissions: PartialSubmission[];
    }
  | {
      status: 'Submitting';
      timestamp: Date;
      hasEstimates: boolean;
      transactionId: string;
      submissions: PartialSubmission[];
    }
  | {
      status: 'Submitted';
      timestamp: Date;
      hasEstimates: boolean;
      transactionId: string;
      submissions: SubmissionReference[];
    };

export type BulkSubmission = {
  id: string;
  state: BulkSubmissionState;
};

export type ProducerDetailFlattened = {
  reference: string;
  producerOrganisationName: string;
  producerContactName: string;
  producerEmail: string;
  producerPhone: string;
  producerAddressLine1: string;
  producerAddressLine2?: string;
  producerTownCity: string;
  producerPostcode?: string;
  producerCountry: string;
  producerSicCode?: string;
};

export type WasteCollectionDetailFlattened = {
  wasteCollectionAddressLine1?: string;
  wasteCollectionAddressLine2?: string;
  wasteCollectionTownCity?: string;
  wasteCollectionCountry?: string;
  wasteCollectionPostcode?: string;
  wasteSource: string;
  brokerRegNumber?: string;
  carrierRegNumber?: string;
  modeOfWasteTransport: string;
  expectedWasteCollectionDate: string;
};

export type ReceiverDetailFlattened = {
  receiverAuthorizationType: string;
  receiverEnvironmentalPermitNumber?: string;
  receiverOrganisationName: string;
  receiverAddressLine1: string;
  receiverAddressLine2?: string;
  receiverTownCity: string;
  receiverPostcode?: string;
  receiverCountry: string;
  receiverContactName: string;
  receiverContactEmail: string;
  receiverContactPhone: string;
};

export type WasteTransportationDetailFlattened = {
  wasteTransportationNumberAndTypeOfContainers: string;
  wasteTransportationSpecialHandlingRequirements?: string;
};

export type SubmissionFlattened = ProducerDetailFlattened &
  ReceiverDetailFlattened &
  WasteTransportationDetailFlattened &
  WasteCollectionDetailFlattened;
