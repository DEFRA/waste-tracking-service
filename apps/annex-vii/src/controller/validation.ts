import {
  SetDraftCustomerReferenceByIdRequest,
  SetDraftExporterDetailByIdRequest,
  SetDraftWasteDescriptionByIdRequest,
  SetDraftWasteQuantityByIdRequest,
  schema,
} from '@wts/api/annex-vii';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const setDraftCustomerReferenceByIdRequest =
  ajv.compile<SetDraftCustomerReferenceByIdRequest>(
    schema.setDraftCustomerReferenceByIdRequest
  );

export const setDraftWasteDescriptionByIdRequest =
  ajv.compile<SetDraftWasteDescriptionByIdRequest>(
    schema.setDraftWasteDescriptionByIdRequest
  );

export const setDraftWasteQuantityByIdRequest =
  ajv.compile<SetDraftWasteQuantityByIdRequest>(
    schema.setDraftWasteQuantityByIdRequest
  );

export const setDraftExporterDetailByIdRequest =
  ajv.compile<SetDraftExporterDetailByIdRequest>(
    schema.setDraftExporterDetailByIdRequest
  );