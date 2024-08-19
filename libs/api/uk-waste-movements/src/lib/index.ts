export * as draftSchema from './draft.schema';
export type {} from './submission.dto';

export type {
  DraftReceiver,
  Declaration,
  Draft,
  WasteInformation,
  ProducerAndWasteCollectionDetail,
  GetDraftRequest,
  GetDraftResponse,
  DraftCarrier,
  GetDraftsRequest,
  GetDraftsResponse,
  GetDraftsResult,
  GetDraftsDto,
  ReceiverDetail,
  WasteSource,
  WasteTransport,
  PhysicalForm,
  QuantityUnit,
  DraftState,
  ValidateMultipleDraftsRequest,
  ValidateMultipleDraftsResponse,
  ProducerDetail,
  WasteCollectionDetail,
  Address,
  Contact,
  PermitDetails,
  DraftContact,
  WasteTransportationDetail,
  WasteTypeDetail,
  ExpectedWasteCollectionDate,
  WasteQuantityType,
  CreateMultipleDraftsRequest,
  CreateMultipleDraftsResponse,
  DbContainerNameKey,
  CarrierDetail,
  DraftDeclaration,
  SimpleDraft,
  CreateDraftRequest,
  CreateDraftResponse,
  SetDraftProducerAddressDetailsRequest,
  SetDraftProducerAddressDetailsResponse,
  GetDraftProducerAddressDetailsRequest,
  GetDraftProducerAddressDetailsResponse,
  GetDraftProducerContactDetailRequest,
  GetDraftProducerContactDetailResponse,
  SetDraftProducerContactDetailRequest,
  SetDraftProducerContactDetailResponse,
  GetDraftWasteSourceRequest,
  GetDraftWasteSourceResponse,
  SetDraftWasteSourceRequest,
  SetDraftWasteSourceResponse,
  GetDraftWasteCollectionAddressDetailsRequest,
  GetDraftWasteCollectionAddressDetailsResponse,
  SetDraftWasteCollectionAddressDetailsRequest,
  SetDraftWasteCollectionAddressDetailsResponse,
  CreateDraftSicCodeRequest,
  CreateDraftSicCodeResponse,
  GetDraftSicCodesRequest,
  GetDraftSicCodesResponse,
  GetDraftCarrierAddressDetailsRequest,
  GetDraftCarrierAddressDetailsResponse,
  SetDraftCarrierAddressDetailsRequest,
  SetDraftCarrierAddressDetailsResponse,
  GetDraftReceiverAddressDetailsRequest,
  GetDraftReceiverAddressDetailsResponse,
  SetDraftReceiverAddressDetailsRequest,
  SetDraftReceiverAddressDetailsResponse,
  DeleteDraftSicCodeRequest,
  DeleteDraftSicCodeResponse,
} from './draft.dto';

export type { Field, ErrorCodeData } from './validation';

export {
  getDraft,
  getDrafts,
  createMultipleDrafts,
  validateMultipleDrafts,
  createDraft,
  setDraftProducerAddressDetails,
  getDraftProducerAddressDetails,
  getDraftProducerContactDetail,
  setDraftProducerContactDetail,
  getDraftWasteSource,
  setDraftWasteSource,
  getDraftWasteCollectionAddressDetails,
  setDraftWasteCollectionAddressDetails,
  createDraftSicCode,
  getDraftSicCodes,
  getDraftCarrierAddressDetails,
  setDraftCarrierAddressDetails,
  getDraftReceiverAddressDetails,
  setDraftReceiverAddressDetails,
  deleteDraftSicCode,
} from './draft.dto';

export * as validation from './validation';
