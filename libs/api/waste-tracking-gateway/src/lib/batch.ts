import {
  CustomerReference,
  Submission,
  SubmissionDeclarationData,
} from './submission';

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

type EwcCode = { code: string };

type WasteDescription = {
  wasteCode:
    | { type: 'NotApplicable' }
    | {
        type: 'BaselAnnexIX' | 'OECD' | 'AnnexIIIA' | 'AnnexIIIB';
        code: string;
      };
  ewcCodes: EwcCode[];
  nationalCode?: { provided: 'Yes'; value: string } | { provided: 'No' };
  description: string;
};

type WasteQuantity = {
  type: 'EstimateData' | 'ActualData';
  estimateData: {
    quantityType?: 'Volume' | 'Weight';
    unit?: 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
    value?: number;
  };
  actualData: {
    quantityType?: 'Volume' | 'Weight';
    unit?: 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
    value?: number;
  };
};

type ExporterDetail = {
  exporterAddress: {
    addressLine1: string;
    addressLine2?: string;
    townCity: string;
    postcode?: string;
    country: string;
  };
  exporterContactDetails: {
    organisationName: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber?: string;
  };
};

type ImporterDetail = {
  importerAddressDetails: {
    organisationName: string;
    address: string;
    country: string;
  };
  importerContactDetails: {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber?: string;
  };
};

type Carrier = {
  addressDetails: {
    organisationName: string;
    address: string;
    country: string;
  };
  contactDetails: {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber?: string;
  };
  transportDetails?: {
    type: 'Road' | 'Air' | 'Sea' | 'Rail' | 'InlandWaterways';
    description?: string;
  };
};

type CollectionDetail = {
  address: {
    addressLine1: string;
    addressLine2?: string;
    townCity: string;
    postcode?: string;
    country: string;
  };
  contactDetails: {
    organisationName: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber?: string;
  };
};

type ExitLocation = { provided: 'No' } | { provided: 'Yes'; value: string };

type CollectionDate = {
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

type TransitCountry = string;

type RecoveryFacilityDetail = {
  addressDetails: {
    name: string;
    address: string;
    country: string;
  };
  contactDetails: {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber?: string;
  };
  recoveryFacilityType:
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
};

type PartialSubmission = {
  id: string;
  reference: string;
  wasteDescription: WasteDescription;
  wasteQuantity: WasteQuantity;
  exporterDetail: ExporterDetail;
  importerDetail: ImporterDetail;
  collectionDate: CollectionDate;
  carriers: Carrier[];
  collectionDetail: CollectionDetail;
  exitLocation: ExitLocation;
  transitCountries: TransitCountry[];
  recoveryFacilityDetail: RecoveryFacilityDetail[];
};

type SubmissionFromBulkSummary = {
  id: string;
  hasEstimates: boolean;
  reference: CustomerReference;
  wasteDescription: WasteDescription;
  collectionDate: CollectionDate;
  submissionDeclaration: SubmissionDeclarationData;
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
      submissions: Omit<PartialSubmission, 'id'>[];
    }
  | {
      status: 'Submitting';
      timestamp: Date;
      hasEstimates: boolean;
      submissions: Omit<PartialSubmission, 'id'>[];
    }
  | {
      status: 'Submitted';
      timestamp: Date;
      hasEstimates: boolean;
      transactionId: string;
      submissions: SubmissionFromBulkSummary[];
    };

export type BulkSubmission = {
  id: string;
  state: BulkSubmissionState;
};

export type GetBulkSubmissionResponse = BulkSubmission;

export type GetBulkSubmissionsResponse = Submission[];
