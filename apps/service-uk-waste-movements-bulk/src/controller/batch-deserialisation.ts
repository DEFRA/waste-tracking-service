import {
  AddContentToBatchRequest,
  GetBatchRequest,
  FinalizeBatchRequest,
  schema,
} from '@wts/api/uk-waste-movements-bulk';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const addContentToBatchRequest = ajv.compile<AddContentToBatchRequest>(
  schema.addContentToBatchRequest
);

export const getBatchRequest = ajv.compileParser<GetBatchRequest>(
  schema.getBatchRequest
);

export const finalizeBatchRequest = ajv.compileParser<FinalizeBatchRequest>(
  schema.finalizeBatchRequest
);
