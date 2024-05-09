export type UkwmPhysicalForm =
  | 'Gas'
  | 'Liquid'
  | 'Solid'
  | 'Sludge'
  | 'Powder'
  | 'Mixed';

export type UkwmQuantityUnit = 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
export type UkwmWasteQuantityType = 'EstimateData' | 'ActualData';

export type UkwmAddress = {
  addressLine1: string;
  addressLine2?: string;
  townCity: string;
  postcode: string;
  country: string;
};

export type UkwmContact = {
  organisationName: string;
  name: string;
  email: string;
  phone: string;
};

export type UkwmProducerDetail = {
  reference: string;
  sicCode: string;
  contact: UkwmContact;
  address: UkwmAddress;
};

export type UkwmReceiverDetail = {
  authorizationType: string;
  environmentalPermitNumber: string;
  contact: UkwmContact;
  address: UkwmAddress;
};

export type UkwmHazardousWasteCode = {
  code: string;
  name: string;
};

export type UkwmPop = {
  name: string;
  concentration: number;
  concentrationUnit: 'Microgram' | 'Milligram' | 'Kilogram';
};

export type UkwmChemicalAndBiologicalComponent = {
  name: string;
  concentration: number;
  concentrationUnit: string;
};

export type UkwmWasteTypeDetail = {
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
};

export type UkwmExpectedWasteCollectionDate = {
  day: string;
  month: string;
  year: string;
};

export type UkwmWasteCollectionDetail = {
  wasteSource: string;
  brokerRegistrationNumber?: string;
  carrierRegistrationNumber?: string;
  modeOfWasteTransport: string;
  expectedWasteCollectionDate: UkwmExpectedWasteCollectionDate;
  address: UkwmAddress;
};

export type UkwmWasteTransportationDetail = {
  numberAndTypeOfContainers: string;
  specialHandlingRequirements?: string;
};
export type UkwmSubmissionState = {
  status: 'InProgress' | 'Submitted';
  timestamp: Date;
};

export type UkwmSubmission = {
  id: string;
  transactionId: string;
  producer: UkwmProducerDetail;
  wasteCollection: UkwmWasteCollectionDetail;
  receiver: UkwmReceiverDetail;
  wasteTransportation: UkwmWasteTransportationDetail;
  wasteTypes: UkwmWasteTypeDetail[];
  submissionState: UkwmSubmissionState;
};

export type UkwmDraft = {
  id: string;
  wasteMovementId: string;
  producerName: string;
  ewcCode: string;
  collectionDate: {
    day: string;
    month: string;
    year: string;
  };
};

export type UkwmDraftsResult = {
  totalRecords: number;
  totalPages: number;
  page: number;
  values: UkwmDraft[];
};

export type GetUwkwmDraftsResponse = UkwmDraftsResult;
