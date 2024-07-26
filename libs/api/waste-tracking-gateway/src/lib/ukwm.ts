export type UkwmPhysicalForm =
  | 'Gas'
  | 'Liquid'
  | 'Solid'
  | 'Sludge'
  | 'Powder'
  | 'Mixed';

export type UkwmQuantityUnit = 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
export type UkwmWasteQuantityType = 'EstimateData' | 'ActualData';

export interface UkwmAddress {
  addressLine1: string;
  addressLine2?: string;
  townCity: string;
  postcode?: string;
  country: string;
}

export interface UkwmContact {
  organisationName: string;
  name: string;
  email: string;
  phone: string;
}

export interface UkwmWasteCollectionAddress {
  addressLine1?: string;
  addressLine2?: string;
  townCity?: string;
  postcode?: string;
  country?: string;
}

export interface UkwmProducerDetail {
  reference: string;
  sicCode?: string;
  contact: UkwmContact;
  address: UkwmAddress;
}

export interface UkwmReceiverDetail {
  authorizationType: string;
  environmentalPermitNumber?: string;
  contact: UkwmContact;
  address: UkwmAddress;
}

export interface UkwmCarrierDetail {
  contact: UkwmContact;
  address: UkwmAddress;
}

export interface UkwmHazardousWasteCode {
  code: string;
  name: string;
}

export interface UkwmPop {
  name: string;
  concentration: number;
  concentrationUnit: string;
}

export interface UkwmChemicalAndBiologicalComponent {
  name: string;
  concentration: number;
  concentrationUnit: string;
}

export interface UkwmWasteTypeDetail {
  ewcCode: string;
  wasteDescription: string;
  physicalForm: UkwmPhysicalForm;
  wasteQuantity: number;
  quantityUnit: UkwmQuantityUnit;
  wasteQuantityType: UkwmWasteQuantityType;
  chemicalAndBiologicalComponents: UkwmChemicalAndBiologicalComponent[];
  hasHazardousProperties: boolean;
  containsPops: boolean;
  hazardousWasteCodes?: UkwmHazardousWasteCode[];
  pops?: UkwmPop[];
}

export interface UkwmExpectedWasteCollectionDate {
  day: string;
  month: string;
  year: string;
}

export interface UkwmWasteCollectionDetail {
  wasteSource: string;
  brokerRegistrationNumber?: string;
  carrierRegistrationNumber?: string;
  localAuthority: string;
  expectedWasteCollectionDate: UkwmExpectedWasteCollectionDate;
  address: UkwmWasteCollectionAddress;
}

export interface UkwmWasteTransportationDetail {
  numberAndTypeOfContainers: string;
  specialHandlingRequirements?: string;
}

export interface UkwmSubmission {
  id: string;
  transactionId: string;
  producer: UkwmProducerDetail;
  wasteCollection: UkwmWasteCollectionDetail;
  receiver: UkwmReceiverDetail;
  wasteTransportation: UkwmWasteTransportationDetail;
  wasteTypes: UkwmWasteTypeDetail[];
  submissionState: UkwmSubmissionState;
}

export interface UkwmDraft {
  id: string;
  wasteMovementId: string;
  producerName: string;
  ewcCode: string;
  collectionDate: {
    day: string;
    month: string;
    year: string;
  };
}

export interface UkwmGetDraftsRequest {
  page: number;
  pageSize?: number;
  collectionDate?: Date;
  ewcCode?: string;
  producerName?: string;
  wasteMovementId?: string;
}

export interface UkwmGetDraftsResult {
  totalRecords: number;
  totalPages: number;
  page: number;
  values: UkwmDraft[];
}

export type UkwmWasteInformation =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      wasteTypes: UkwmWasteTypeDetail[];
      wasteTransportation: UkwmWasteTransportationDetail;
    };

export type UkwmDraftReceiverDetail =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      value: UkwmReceiverDetail;
    };

export type UkwmProducerAndWasteCollectionDetail =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      producer: UkwmProducerDetail;
      wasteCollection: UkwmWasteCollectionDetail;
    };

export interface UkwmSubmissionDeclaration {
  declarationTimestamp: Date;
  transactionId: string;
}

export type UkwmDraftSubmissionDeclaration =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Complete';
      values: UkwmSubmissionDeclaration;
    };

export type UkwmSubmissionStateStatus =
  | 'SubmittedWithEstimates'
  | 'SubmittedWithActuals'
  | 'UpdatedWithActuals';

export interface UkwmSubmissionState {
  status: UkwmSubmissionStateStatus;
  timestamp: Date;
}

export interface UkwmDraftSubmission {
  id: string;
  transactionId: string;
  wasteInformation: UkwmWasteInformation;
  receiver: UkwmDraftReceiverDetail;
  producerAndCollection: UkwmProducerAndWasteCollectionDetail;
  carrier: UkwmDraftCarrierDetail;
  declaration: UkwmDraftSubmissionDeclaration;
  state: UkwmSubmissionState;
}

export type UkwmDraftCarrierDetail =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      value: UkwmCarrierDetail;
    };

export type GetUkwmSubmissionResponse = UkwmDraftSubmission;
