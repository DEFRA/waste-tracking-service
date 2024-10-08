import { UkwmSubmission } from './ukwm';
import { Response } from '@wts/util/invocation';

export type UkwmPartialSubmission = Omit<
  UkwmSubmission,
  'id' | 'transactionId' | 'submissionState'
>;

export type UkwmSubmittedPartialSubmission = Omit<
  UkwmSubmission & { transactionId: string },
  'submissionDeclaration' | 'submissionState'
>;

interface UkwmErrorSummary {
  columnBased: UkwmColumnSummary[];
  rowBased: UkwmRowSummary[];
}

interface UkwmColumnSummary {
  columnRef: string;
  count: number;
}

interface UkwmRowSummary {
  rowNumber: number;
  rowId: string;
  count: number;
}

export interface UkwmErrorColumn {
  id: string;
  batchId: string;
  accountId: string;
  errors: UkwmErrorColumnDetail[];
}

export interface UkwmErrorColumnDetail {
  rowNumber: number;
  codes: UkwmErrorCode[];
}

export interface Row {
  id: string;
  batchId: string;
  accountId: string;
  data: UkwmRowData;
}

type UkwmRowData =
  | {
      valid: false;
      rowNumber: number;
      codes: UkwmErrorCode[];
    }
  | ({
      valid: true;
    } & UkwmRowContent);

type UkwmRowContent =
  | {
      submitted: true;
      content: UkwmSubmittedPartialSubmission;
    }
  | {
      submitted: false;
      content: UkwmPartialSubmission;
    };

type UkwmErrorCode =
  | number
  | {
      code: number;
      args: string[];
    };

export interface UkwmRowWithMessage {
  id: string;
  batchId: string;
  accountId: string;
  messages: string[];
}

export interface UkwmColumnWithMessage {
  columnRef: string;
  batchId: string;
  accountId: string;
  errors: {
    rowNumber: number;
    messages: string[];
  }[];
}

export interface UkwmSubmissionReference {
  id: string;
  wasteMovementId: string;
  producerName: string;
  ewcCodes: string[];
  collectionDate: {
    day: string;
    month: string;
    year: string;
  };
}

export interface UkwmBulkSubmissionPartialSummary {
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

export type UkwmBulkSubmissionState =
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
      errorSummary: UkwmErrorSummary;
    }
  | {
      status: 'PassedValidation';
      timestamp: Date;
      hasEstimates: boolean;
      rowsCount: number;
    }
  | {
      status: 'Submitting';
      timestamp: Date;
      hasEstimates: boolean;
      transactionId: string;
    }
  | {
      status: 'Submitted';
      timestamp: Date;
      hasEstimates: boolean;
      transactionId: string;
      createdRowsCount: number;
    };

export interface UkwmBulkSubmission {
  id: string;
  state: UkwmBulkSubmissionState;
}

export type GetUwkwmBulkSubmissionResponse = Response<UkwmBulkSubmission>;

export type UkwmSubmissionFlattenedDownload = {
  transactionId: string;
} & Omit<UkwmProducerDetailFlattened, 'customerReference'> &
  UkwmWasteTransportationDetailFlattened &
  UkwmWasteCollectionDetailFlattened &
  UkwmCarrierDetailFlattened &
  UkwmWasteTypeDetailFlattened &
  UkwmReceiverDetailFlattened &
  UkwmCarrierConfirmationFlattened & {
    [key: string]: string;
  };

export interface UkwmProducerDetailFlattened {
  customerReference: string;
  producerOrganisationName: string;
  producerContactName: string;
  producerContactEmail: string;
  producerContactPhone: string;
  producerAddressLine1: string;
  producerAddressLine2?: string;
  producerTownCity: string;
  producerPostcode?: string;
  producerCountry: string;
  producerSicCode?: string;
}

export interface UkwmWasteCollectionDetailFlattened {
  wasteCollectionAddressLine1?: string;
  wasteCollectionAddressLine2?: string;
  wasteCollectionTownCity?: string;
  wasteCollectionCountry?: string;
  wasteCollectionPostcode?: string;
  wasteCollectionLocalAuthority: string;
  wasteCollectionWasteSource: string;
  wasteCollectionBrokerRegistrationNumber?: string;
  wasteCollectionCarrierRegistrationNumber?: string;
  wasteCollectionExpectedWasteCollectionDate: string;
}

export interface UkwmCarrierDetailFlattened {
  carrierOrganisationName?: string;
  carrierAddressLine1?: string;
  carrierAddressLine2?: string;
  carrierTownCity?: string;
  carrierCountry?: string;
  carrierPostcode?: string;
  carrierContactName?: string;
  carrierContactEmail?: string;
  carrierContactPhone?: string;
}

export interface UkwmReceiverDetailFlattened {
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
}

export interface UkwmWasteTransportationDetailFlattened {
  wasteTransportationNumberAndTypeOfContainers: string;
  wasteTransportationSpecialHandlingRequirements?: string;
}

export interface UkwmWasteTypeDetailFlattened {
  firstWasteTypeEwcCode: string;
  firstWasteTypeWasteDescription: string;
  firstWasteTypePhysicalForm: string;
  firstWasteTypeWasteQuantity: string;
  firstWasteTypeWasteQuantityUnit: string;
  firstWasteTypeWasteQuantityType: string;
  firstWasteTypeChemicalAndBiologicalComponentsString: string;
  firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString: string;
  firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString: string;
  firstWasteTypeHasHazardousProperties: string;
  firstWasteTypeHazardousWasteCodesString?: string;
  firstWasteTypeContainsPops: string;
  firstWasteTypePopsString?: string;
  firstWasteTypePopsConcentrationsString?: string;
  firstWasteTypePopsConcentrationUnitsString?: string;
  secondWasteTypeEwcCode?: string;
  secondWasteTypeWasteDescription?: string;
  secondWasteTypePhysicalForm?: string;
  secondWasteTypeWasteQuantity?: string;
  secondWasteTypeWasteQuantityUnit?: string;
  secondWasteTypeWasteQuantityType?: string;
  secondWasteTypeChemicalAndBiologicalComponentsString?: string;
  secondWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  secondWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  secondWasteTypeHasHazardousProperties?: string;
  secondWasteTypeHazardousWasteCodesString?: string;
  secondWasteTypeContainsPops?: string;
  secondWasteTypePopsString?: string;
  secondWasteTypePopsConcentrationsString?: string;
  secondWasteTypePopsConcentrationUnitsString?: string;
  thirdWasteTypeEwcCode?: string;
  thirdWasteTypeWasteDescription?: string;
  thirdWasteTypePhysicalForm?: string;
  thirdWasteTypeWasteQuantity?: string;
  thirdWasteTypeWasteQuantityUnit?: string;
  thirdWasteTypeWasteQuantityType?: string;
  thirdWasteTypeChemicalAndBiologicalComponentsString?: string;
  thirdWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  thirdWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  thirdWasteTypeHasHazardousProperties?: string;
  thirdWasteTypeHazardousWasteCodesString?: string;
  thirdWasteTypeContainsPops?: string;
  thirdWasteTypePopsString?: string;
  thirdWasteTypePopsConcentrationsString?: string;
  thirdWasteTypePopsConcentrationUnitsString?: string;
  fourthWasteTypeEwcCode?: string;
  fourthWasteTypeWasteDescription?: string;
  fourthWasteTypePhysicalForm?: string;
  fourthWasteTypeWasteQuantity?: string;
  fourthWasteTypeWasteQuantityUnit?: string;
  fourthWasteTypeWasteQuantityType?: string;
  fourthWasteTypeChemicalAndBiologicalComponentsString?: string;
  fourthWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  fourthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  fourthWasteTypeHasHazardousProperties?: string;
  fourthWasteTypeHazardousWasteCodesString?: string;
  fourthWasteTypeContainsPops?: string;
  fourthWasteTypePopsString?: string;
  fourthWasteTypePopsConcentrationsString?: string;
  fourthWasteTypePopsConcentrationUnitsString?: string;
  fifthWasteTypeEwcCode?: string;
  fifthWasteTypeWasteDescription?: string;
  fifthWasteTypePhysicalForm?: string;
  fifthWasteTypeWasteQuantity?: string;
  fifthWasteTypeWasteQuantityUnit?: string;
  fifthWasteTypeWasteQuantityType?: string;
  fifthWasteTypeChemicalAndBiologicalComponentsString?: string;
  fifthWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  fifthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  fifthWasteTypeHasHazardousProperties?: string;
  fifthWasteTypeHazardousWasteCodesString?: string;
  fifthWasteTypeContainsPops?: string;
  fifthWasteTypePopsString?: string;
  fifthWasteTypePopsConcentrationsString?: string;
  fifthWasteTypePopsConcentrationUnitsString?: string;
  sixthWasteTypeEwcCode?: string;
  sixthWasteTypeWasteDescription?: string;
  sixthWasteTypePhysicalForm?: string;
  sixthWasteTypeWasteQuantity?: string;
  sixthWasteTypeWasteQuantityUnit?: string;
  sixthWasteTypeWasteQuantityType?: string;
  sixthWasteTypeChemicalAndBiologicalComponentsString?: string;
  sixthWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  sixthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  sixthWasteTypeHasHazardousProperties?: string;
  sixthWasteTypeHazardousWasteCodesString?: string;
  sixthWasteTypeContainsPops?: string;
  sixthWasteTypePopsString?: string;
  sixthWasteTypePopsConcentrationsString?: string;
  sixthWasteTypePopsConcentrationUnitsString?: string;
  seventhWasteTypeEwcCode?: string;
  seventhWasteTypeWasteDescription?: string;
  seventhWasteTypePhysicalForm?: string;
  seventhWasteTypeWasteQuantity?: string;
  seventhWasteTypeWasteQuantityUnit?: string;
  seventhWasteTypeWasteQuantityType?: string;
  seventhWasteTypeChemicalAndBiologicalComponentsString?: string;
  seventhWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  seventhWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  seventhWasteTypeHasHazardousProperties?: string;
  seventhWasteTypeHazardousWasteCodesString?: string;
  seventhWasteTypeContainsPops?: string;
  seventhWasteTypePopsString?: string;
  seventhWasteTypePopsConcentrationsString?: string;
  seventhWasteTypePopsConcentrationUnitsString?: string;
  eighthWasteTypeEwcCode?: string;
  eighthWasteTypeWasteDescription?: string;
  eighthWasteTypePhysicalForm?: string;
  eighthWasteTypeWasteQuantity?: string;
  eighthWasteTypeWasteQuantityUnit?: string;
  eighthWasteTypeWasteQuantityType?: string;
  eighthWasteTypeChemicalAndBiologicalComponentsString?: string;
  eighthWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  eighthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  eighthWasteTypeHasHazardousProperties?: string;
  eighthWasteTypeHazardousWasteCodesString?: string;
  eighthWasteTypeContainsPops?: string;
  eighthWasteTypePopsString?: string;
  eighthWasteTypePopsConcentrationsString?: string;
  eighthWasteTypePopsConcentrationUnitsString?: string;
  ninthWasteTypeEwcCode?: string;
  ninthWasteTypeWasteDescription?: string;
  ninthWasteTypePhysicalForm?: string;
  ninthWasteTypeWasteQuantity?: string;
  ninthWasteTypeWasteQuantityUnit?: string;
  ninthWasteTypeWasteQuantityType?: string;
  ninthWasteTypeChemicalAndBiologicalComponentsString?: string;
  ninthWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  ninthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  ninthWasteTypeHasHazardousProperties?: string;
  ninthWasteTypeHazardousWasteCodesString?: string;
  ninthWasteTypeContainsPops?: string;
  ninthWasteTypePopsString?: string;
  ninthWasteTypePopsConcentrationsString?: string;
  ninthWasteTypePopsConcentrationUnitsString?: string;
  tenthWasteTypeEwcCode?: string;
  tenthWasteTypeWasteDescription?: string;
  tenthWasteTypePhysicalForm?: string;
  tenthWasteTypeWasteQuantity?: string;
  tenthWasteTypeWasteQuantityUnit?: string;
  tenthWasteTypeWasteQuantityType?: string;
  tenthWasteTypeChemicalAndBiologicalComponentsString?: string;
  tenthWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  tenthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  tenthWasteTypeHasHazardousProperties?: string;
  tenthWasteTypeHazardousWasteCodesString?: string;
  tenthWasteTypeContainsPops?: string;
  tenthWasteTypePopsString?: string;
  tenthWasteTypePopsConcentrationsString?: string;
  tenthWasteTypePopsConcentrationUnitsString?: string;
}

export interface UkwmCarrierConfirmationFlattened {
  carrierConfirmationUniqueReference: string;
  carrierConfirmationCorrectDetails: string;
  carrierConfirmationBrokerRegistrationNumber: string;
  carrierConfirmationRegistrationNumber: string;
  carrierConfirmationOrganisationName: string;
  carrierConfirmationAddressLine1: string;
  carrierConfirmationAddressLine2: string;
  carrierConfirmationTownCity: string;
  carrierConfirmationCountry: string;
  carrierConfirmationPostcode: string;
  carrierConfirmationContactName: string;
  carrierConfirmationContactEmail: string;
  carrierConfirmationContactPhone: string;
  carrierModeOfTransport: string;
  carrierVehicleRegistrationNumber: string;
  carrierDateWasteCollected: string;
  carrierTimeWasteCollected: string;
}

export interface UkwmRowWithMessage {
  id: string;
  batchId: string;
  accountId: string;
  messages: string[];
}

export interface UkwmColumnWithMessage {
  columnRef: string;
  batchId: string;
  accountId: string;
  errors: {
    rowNumber: number;
    messages: string[];
  }[];
}

export interface UkwmPagedSubmissionData {
  totalRecords: number;
  totalPages: number;
  page: number;
  values: UkwmBulkSubmissionPartialSummary[];
}
