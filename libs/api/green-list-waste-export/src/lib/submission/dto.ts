import { AccountIdRequest, IdRequest, Method } from '@wts/api/common';
import { Response } from '@wts/util/invocation';
import {
  OptionalStringInput,
  UkAddressDetail,
  UkContactDetail,
  AddressDetail,
  ContactDetail,
  CancellationType,
  CustomerReference,
  RecordSummaryPage,
} from '../common';

export type WasteCode =
  | { type: 'NotApplicable' }
  | {
      type: 'BaselAnnexIX' | 'OECD' | 'AnnexIIIA' | 'AnnexIIIB';
      code: string;
    };

export type EwcCode = { code: string };

export type NationalCode = OptionalStringInput;

export type WasteQuantityType = 'EstimateData' | 'ActualData';

export type WasteQuantityData = {
  quantityType: 'Volume' | 'Weight';
  unit: 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
  value: number;
};

export type CollectionDateType = 'EstimateDate' | 'ActualDate';

export type CollectionDateData = {
  day: string;
  month: string;
  year: string;
};

export type TransportDetail = {
  type: 'Road' | 'Air' | 'Sea' | 'Rail' | 'InlandWaterways';
  description?: string;
};

export type RecoveryFacilityType =
  | {
      type: 'Laboratory';
      disposalCode: string;
    }
  | {
      type: 'InterimSite';
      recoveryCode: string;
    }
  | {
      type: 'RecoveryFacility';
      recoveryCode: string;
    };

export type SubmissionStateStatus =
  | 'SubmittedWithEstimates'
  | 'SubmittedWithActuals'
  | 'UpdatedWithActuals';

export type SubmissionStateStatus1 =
  | 'SubmittedWithEstimates'
  | 'SubmittedWithActuals'
  | 'UpdatedWithActuals'
  | 'Cancelled';

export type WasteDescription = {
  wasteCode: WasteCode;
  ewcCodes: EwcCode[];
  nationalCode?: NationalCode;
  description: string;
};

export type WasteQuantity = {
  type: WasteQuantityType;
  estimateData: Partial<WasteQuantityData>;
  actualData: Partial<WasteQuantityData>;
};

export type ExporterDetail = {
  exporterAddress: UkAddressDetail;
  exporterContactDetails: UkContactDetail;
};

export type ImporterDetail = {
  importerAddressDetails: AddressDetail;
  importerContactDetails: ContactDetail;
};

export type CollectionDate = {
  type: CollectionDateType;
  estimateDate: Partial<CollectionDateData>;
  actualDate: Partial<CollectionDateData>;
};

export type Carrier = {
  addressDetails: AddressDetail;
  contactDetails: ContactDetail;
  transportDetails?: TransportDetail;
};

export type CollectionDetail = {
  address: UkAddressDetail;
  contactDetails: UkContactDetail;
};

export type TransitCountry = string;

export type UkExitLocation = OptionalStringInput;

export type RecoveryFacilityDetail = {
  addressDetails: {
    name: AddressDetail['organisationName'];
    address: AddressDetail['address'];
    country: AddressDetail['country'];
  };
  contactDetails: ContactDetail;
  recoveryFacilityType: RecoveryFacilityType;
};

export type SubmissionDeclaration = {
  declarationTimestamp: Date;
  transactionId: string;
};

export type SubmissionState =
  | {
      status: SubmissionStateStatus;
      timestamp: Date;
    }
  | {
      status: 'Cancelled';
      timestamp: Date;
      cancellationType: CancellationType;
    };

export type Submission = {
  id: string;
  reference: CustomerReference;
  wasteDescription: WasteDescription;
  wasteQuantity: WasteQuantity;
  exporterDetail: ExporterDetail;
  importerDetail: ImporterDetail;
  collectionDate: CollectionDate;
  carriers: Carrier[];
  collectionDetail: CollectionDetail;
  ukExitLocation: UkExitLocation;
  transitCountries: TransitCountry[];
  recoveryFacilityDetail: RecoveryFacilityDetail[];
  submissionDeclaration: SubmissionDeclaration;
  submissionState: SubmissionState;
};

export type PartialSubmission = Omit<
  Submission,
  'submissionDeclaration' | 'submissionState'
>;

export type SubmissionSummary = Readonly<
  Omit<
    Submission,
    | 'wasteQuantity'
    | 'exporterDetail'
    | 'importerDetail'
    | 'carriers'
    | 'collectionDetail'
    | 'ukExitLocation'
    | 'transitCountries'
    | 'recoveryFacilityDetail'
  >
>;

export type GetSubmissionsResponse = Response<
  RecordSummaryPage<SubmissionSummary>
>;
export const getSubmissions: Method = {
  name: 'getSubmissions',
  httpVerb: 'POST',
};

export type GetSubmissionRequest = IdRequest & AccountIdRequest;
export type GetSubmissionResponse = Response<Submission>;
export const getSubmission: Method = {
  name: 'getSubmission',
  httpVerb: 'POST',
};

export type GetWasteQuantityRequest = IdRequest & AccountIdRequest;
export type GetWasteQuantityResponse = Response<WasteQuantity>;
export const getWasteQuantity: Method = {
  name: 'getWasteQuantity',
  httpVerb: 'POST',
};

export type SetWasteQuantityRequest = IdRequest &
  AccountIdRequest & { value: WasteQuantity };
export type SetWasteQuantityResponse = Response<void>;
export const setWasteQuantity: Method = {
  name: 'setWasteQuantity',
  httpVerb: 'POST',
};

export type GetCollectionDateRequest = IdRequest & AccountIdRequest;
export type GetCollectionDateResponse = Response<CollectionDate>;
export const getCollectionDate: Method = {
  name: 'getCollectionDate',
  httpVerb: 'POST',
};

export type SetCollectionDateRequest = IdRequest &
  AccountIdRequest & { value: CollectionDate };
export type SetCollectionDateResponse = Response<void>;
export const setCollectionDate: Method = {
  name: 'setCollectionDate',
  httpVerb: 'POST',
};

export type CancelSubmissionRequest = IdRequest &
  AccountIdRequest & { cancellationType: CancellationType };
export type CancelSubmissionResponse = Response<void>;
export const cancelSubmission: Method = {
  name: 'cancelSubmission',
  httpVerb: 'POST',
};

export type NumberOfSubmissions = {
  completedWithActuals: number;
  completedWithEstimates: number;
  incomplete: number;
};
export type GetNumberOfSubmissionsRequest = AccountIdRequest;
export type GetNumberOfSubmissionsResponse = Response<NumberOfSubmissions>;
export const getNumberOfSubmissions: Method = {
  name: 'getNumberOfSubmissions',
  httpVerb: 'POST',
};

export type CreateSubmissionsRequest = AccountIdRequest &
  IdRequest & {
    values: Omit<PartialSubmission, 'id'>[];
  };
export type CreateSubmissionsResponse = Response<Submission[]>;
export const createSubmissions: Method = {
  name: 'createSubmissions',
  httpVerb: 'POST',
};

export type GetBulkSubmissionsRequest = AccountIdRequest & {
  submissionIds: string[];
};
export type GetBulkSubmissionsResponse = Response<Submission[]>;
export const getBulkSubmissions: Method = {
  name: 'getBulkSubmissions',
  httpVerb: 'POST',
};
