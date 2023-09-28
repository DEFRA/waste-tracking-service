import { Response } from '@wts/util/invocation';
import {
  AccountIdRequest,
  SubmissionBase,
  DraftSectionSummary,
  IdRequest,
  Method,
  DraftWasteDescription,
} from './submissionBase.dto';
export type OrderRequest = { order: 'ASC' | 'DESC' };

export type CustomerReference = string;

export type DraftWasteQuantity =
  | { status: 'CannotStart' }
  | { status: 'NotStarted' }
  | {
      status: 'Started';
      value?: {
        type?: 'NotApplicable' | 'EstimateData' | 'ActualData';
        estimateData?: {
          quantityType?: 'Volume' | 'Weight';
          value?: number;
        };
        actualData?: {
          quantityType?: 'Volume' | 'Weight';
          value?: number;
        };
      };
    }
  | {
      status: 'Complete';
      value:
        | {
            type: 'NotApplicable';
          }
        | {
            type: 'EstimateData' | 'ActualData';
            estimateData: {
              quantityType?: 'Volume' | 'Weight';
              value?: number;
            };
            actualData: {
              quantityType?: 'Volume' | 'Weight';
              value?: number;
            };
          };
    };

export type DraftCollectionDate =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      value: {
        type: 'EstimateDate' | 'ActualDate';
        estimateDate: {
          day?: string;
          month?: string;
          year?: string;
        };
        actualDate: {
          day?: string;
          month?: string;
          year?: string;
        };
      };
    };

export type DraftSubmissionConfirmation =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Complete';
      confirmation: boolean;
    };

export type DraftSubmissionDeclarationData = {
  declarationTimestamp: Date;
  transactionId: string;
};

export type DraftSubmissionDeclaration =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Complete';
      values: DraftSubmissionDeclarationData;
    };

export type DraftSubmissionCancellationType =
  | {
      type: 'ChangeOfRecoveryFacilityOrLaboratory';
    }
  | {
      type: 'NoLongerExportingWaste';
    }
  | {
      type: 'Other';
      reason: string;
    };

export type DraftSubmissionState =
  | {
      status:
        | 'InProgress'
        | 'Deleted'
        | 'SubmittedWithEstimates'
        | 'SubmittedWithActuals'
        | 'UpdatedWithActuals';
      timestamp: Date;
    }
  | {
      status: 'Cancelled';
      timestamp: Date;
      cancellationType: DraftSubmissionCancellationType;
    };

export interface DraftSubmission extends SubmissionBase {
  id: string;
  reference: CustomerReference;
  wasteQuantity: DraftWasteQuantity;
  collectionDate: DraftCollectionDate;
  submissionConfirmation: DraftSubmissionConfirmation;
  submissionDeclaration: DraftSubmissionDeclaration;
  submissionState: DraftSubmissionState;
}

export type DraftSubmissionSummary = Readonly<{
  id: string;
  reference: CustomerReference;
  wasteDescription: DraftWasteDescription;
  wasteQuantity: DraftSectionSummary;
  exporterDetail: DraftSectionSummary;
  importerDetail: DraftSectionSummary;
  collectionDate: DraftCollectionDate;
  carriers: DraftSectionSummary;
  collectionDetail: DraftSectionSummary;
  ukExitLocation: DraftSectionSummary;
  transitCountries: DraftSectionSummary;
  recoveryFacilityDetail: DraftSectionSummary;
  submissionConfirmation: DraftSectionSummary;
  submissionDeclaration: DraftSubmissionDeclaration;
  submissionState: DraftSubmissionState;
}>;

export type DraftSubmissionPageMetadata = {
  pageNumber: number;
  token: string;
};

export type DraftSubmissionSummaryPage = {
  totalSubmissions: number;
  totalPages: number;
  currentPage: number;
  pages: DraftSubmissionPageMetadata[];
  values: ReadonlyArray<DraftSubmissionSummary>;
};

export type GetDraftsRequest = AccountIdRequest &
  OrderRequest & {
    pageLimit?: number;
    state?: DraftSubmissionState['status'][];
    token?: string;
  };
export type GetDraftsResponse = Response<DraftSubmissionSummaryPage>;
export const getDrafts: Method = { name: 'getDrafts', httpVerb: 'POST' };

export type GetDraftByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftByIdResponse = Response<DraftSubmission>;
export const getDraftById: Method = { name: 'getDraftById', httpVerb: 'POST' };

export type CreateDraftRequest = AccountIdRequest & {
  reference: CustomerReference;
};
export type CreateDraftFromTemplateRequest = IdRequest &
  AccountIdRequest & {
    reference: CustomerReference;
  };
export type CreateDraftResponse = Response<DraftSubmission>;
export const createDraft: Method = { name: 'createDraft', httpVerb: 'POST' };
export const createDraftFromTemplate: Method = {
  name: 'createDraftFromTemplate',
  httpVerb: 'POST',
};

export type DeleteDraftRequest = IdRequest & AccountIdRequest;
export type DeleteDraftResponse = Response<void>;
export const deleteDraft: Method = { name: 'deleteDraft', httpVerb: 'POST' };

export type CancelDraftByIdRequest = IdRequest &
  AccountIdRequest & { cancellationType: DraftSubmissionCancellationType };
export type CancelDraftByIdResponse = Response<void>;
export const cancelDraft: Method = { name: 'cancelDraft', httpVerb: 'POST' };

export type GetDraftCustomerReferenceByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftCustomerReferenceByIdResponse = Response<CustomerReference>;
export const getDraftCustomerReferenceById: Method = {
  name: 'getDraftCustomerReferenceById',
  httpVerb: 'POST',
};

export type SetDraftCustomerReferenceByIdRequest = IdRequest &
  AccountIdRequest & { reference: CustomerReference };
export type SetDraftCustomerReferenceByIdResponse = Response<void>;
export const setDraftCustomerReferenceById: Method = {
  name: 'setDraftCustomerReferenceById',
  httpVerb: 'POST',
};

export type GetDraftWasteQuantityByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftWasteQuantityByIdResponse = Response<DraftWasteQuantity>;
export const getDraftWasteQuantityById: Method = {
  name: 'getDraftWasteQuantityById',
  httpVerb: 'POST',
};

export type SetDraftWasteQuantityByIdRequest = IdRequest &
  AccountIdRequest & { value: DraftWasteQuantity };
export type SetDraftWasteQuantityByIdResponse = Response<void>;
export const setDraftWasteQuantityById: Method = {
  name: 'setDraftWasteQuantityById',
  httpVerb: 'POST',
};

export type GetDraftCollectionDateByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftCollectionDateByIdResponse = Response<DraftCollectionDate>;
export const getDraftCollectionDateById: Method = {
  name: 'getDraftCollectionDateById',
  httpVerb: 'POST',
};

export type SetDraftCollectionDateByIdRequest = IdRequest &
  AccountIdRequest & { value: DraftCollectionDate };
export type SetDraftCollectionDateByIdResponse = Response<void>;
export const setDraftCollectionDateById: Method = {
  name: 'setDraftCollectionDateById',
  httpVerb: 'POST',
};

export type GetDraftSubmissionConfirmationByIdRequest = IdRequest &
  AccountIdRequest;
export type GetDraftSubmissionConfirmationByIdResponse =
  Response<DraftSubmissionConfirmation>;
export const getDraftSubmissionConfirmationById: Method = {
  name: 'getDraftSubmissionConfirmationById',
  httpVerb: 'POST',
};

export type SetDraftSubmissionConfirmationByIdRequest = IdRequest &
  AccountIdRequest & { value: DraftSubmissionConfirmation };
export type SetDraftSubmissionConfirmationByIdResponse = Response<void>;
export const setDraftSubmissionConfirmationById: Method = {
  name: 'setDraftSubmissionConfirmationById',
  httpVerb: 'POST',
};

export type GetDraftSubmissionDeclarationByIdRequest = IdRequest &
  AccountIdRequest;
export type GetDraftSubmissionDeclarationByIdResponse =
  Response<DraftSubmissionDeclaration>;
export const getDraftSubmissionDeclarationById: Method = {
  name: 'getDraftSubmissionDeclarationById',
  httpVerb: 'POST',
};

export type SetDraftSubmissionDeclarationByIdRequest = IdRequest &
  AccountIdRequest & { value: Omit<DraftSubmissionDeclaration, 'values'> };
export type SetDraftSubmissionDeclarationByIdResponse = Response<void>;
export const setDraftSubmissionDeclarationById: Method = {
  name: 'setDraftSubmissionDeclarationById',
  httpVerb: 'POST',
};

export const getDraftWasteDescriptionById: Method = {
  name: 'getDraftWasteDescriptionById',
  httpVerb: 'POST',
};
export const setDraftWasteDescriptionById: Method = {
  name: 'setDraftWasteDescriptionById',
  httpVerb: 'POST',
};
export const getDraftExporterDetailById: Method = {
  name: 'getDraftExporterDetailById',
  httpVerb: 'POST',
};
export const setDraftExporterDetailById: Method = {
  name: 'setDraftExporterDetailById',
  httpVerb: 'POST',
};
export const getDraftImporterDetailById: Method = {
  name: 'getDraftImporterDetailById',
  httpVerb: 'POST',
};
export const setDraftImporterDetailById: Method = {
  name: 'setDraftImporterDetailById',
  httpVerb: 'POST',
};
export const listDraftCarriers: Method = {
  name: 'listDraftCarriers',
  httpVerb: 'POST',
};
export const getDraftCarriers: Method = {
  name: 'getDraftCarriers',
  httpVerb: 'POST',
};
export const createDraftCarriers: Method = {
  name: 'createDraftCarriers',
  httpVerb: 'POST',
};
export const setDraftCarriers: Method = {
  name: 'setDraftCarriers',
  httpVerb: 'POST',
};
export const deleteDraftCarriers: Method = {
  name: 'deleteDraftCarriers',
  httpVerb: 'POST',
};
export const getDraftExitLocationById: Method = {
  name: 'getDraftExitLocationById',
  httpVerb: 'POST',
};
export const setDraftExitLocationById: Method = {
  name: 'setDraftExitLocationById',
  httpVerb: 'POST',
};
export const getDraftTransitCountries: Method = {
  name: 'getDraftTransitCountries',
  httpVerb: 'POST',
};
export const setDraftTransitCountries: Method = {
  name: 'setDraftTransitCountries',
  httpVerb: 'POST',
};
export const getDraftCollectionDetail: Method = {
  name: 'getDraftCollectionDetail',
  httpVerb: 'POST',
};
export const setDraftCollectionDetail: Method = {
  name: 'setDraftCollectionDetail',
  httpVerb: 'POST',
};
export const listDraftRecoveryFacilityDetails: Method = {
  name: 'listDraftRecoveryFacilityDetails',
  httpVerb: 'POST',
};
export const createDraftRecoveryFacilityDetails: Method = {
  name: 'createDraftRecoveryFacilityDetails',
  httpVerb: 'POST',
};
export const getDraftRecoveryFacilityDetails: Method = {
  name: 'getDraftRecoveryFacilityDetails',
  httpVerb: 'POST',
};
export const setDraftRecoveryFacilityDetails: Method = {
  name: 'setDraftRecoveryFacilityDetails',
  httpVerb: 'POST',
};
export const deleteDraftRecoveryFacilityDetails: Method = {
  name: 'deleteDraftRecoveryFacilityDetails',
  httpVerb: 'POST',
};