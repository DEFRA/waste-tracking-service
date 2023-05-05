import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import {
  CreateDraftRequest,
  CustomerReference,
  GetDraftByIdRequest,
  GetDraftCustomerReferenceByIdRequest,
  GetDraftExporterDetailByIdRequest,
  GetDraftWasteDescriptionByIdRequest,
  GetDraftWasteQuantityByIdRequest,
  GetDraftsRequest,
} from './dto';

const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

const customerReference: JTDSchemaType<CustomerReference> = {
  type: 'string',
  nullable: true,
};

const draftWasteDescriptionData = {
  wasteCode: {
    discriminator: 'type',
    mapping: {
      NotApplicable: { properties: {} },
      BaselAnnexIX: { properties: { value: { type: 'string' } } },
      Oecd: { properties: { value: { type: 'string' } } },
      AnnexIIIA: { properties: { value: { type: 'string' } } },
      AnnexIIIB: { properties: { value: { type: 'string' } } },
    },
  },
  ewcCodes: { elements: { type: 'string' } },
  nationalCode: {
    discriminator: 'provided',
    mapping: {
      Yes: { properties: { value: { type: 'string' } } },
      No: { properties: {} },
    },
  },
  description: { type: 'string' },
};

const draftWasteDescription: SchemaObject = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Started: {
      properties: {},
      optionalProperties: {
        wasteCode: draftWasteDescriptionData.wasteCode,
        nationalCode: draftWasteDescriptionData.nationalCode,
        ewcCodes: draftWasteDescriptionData.ewcCodes,
        description: draftWasteDescriptionData.description,
      },
    },
    Complete: {
      properties: {
        wasteCode: draftWasteDescriptionData.wasteCode,
        nationalCode: draftWasteDescriptionData.nationalCode,
        ewcCodes: draftWasteDescriptionData.ewcCodes,
        description: draftWasteDescriptionData.description,
      },
    },
  },
};

const draftWasteQuantityData = {
  wasteQuantity: {
    discriminator: 'type',
    mapping: {
      NotApplicable: { properties: {} },
      EstimateData: {
        properties: {
          quantityType: { enum: ['Volume', 'Weight'] },
          value: { type: 'float64' },
        },
      },
      ActualData: {
        properties: {
          quantityType: { enum: ['Volume', 'Weight'] },
          value: { type: 'float64' },
        },
      },
    },
  },
};

const draftWasteQuantity: SchemaObject = {
  discriminator: 'status',
  mapping: {
    CannotStart: {
      properties: {},
    },
    NotStarted: {
      properties: {},
    },
    Started: {
      properties: {},
      optionalProperties: {
        wasteQuantity: draftWasteQuantityData.wasteQuantity,
      },
    },
    Complete: {
      properties: {
        wasteQuantity: draftWasteQuantityData.wasteQuantity,
      },
    },
  },
};

const draftExporterDetailData = {
  exporterAddress: {
    properties: {
      addressLine1: { type: 'string' },
      addressLine2: { type: 'string' },
      townCity: { type: 'string' },
      postcode: { type: 'string' },
      country: { type: 'string' },
    },
  },
  exporterContactDetails: {
    properties: {
      organisationName: { type: 'string' },
      fullName: { type: 'string' },
      emailAddress: { type: 'string' },
      phoneNumber: { type: 'string' },
      faxNumber: { type: 'string' },
    },
  },
};

const draftExporterDetail: SchemaObject = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Started: {
      properties: {},
      optionalProperties: {
        exporterAddress: draftExporterDetailData.exporterAddress,
        exporterContactDetails: draftExporterDetailData.exporterContactDetails,
      },
    },
    Complete: {
      properties: {
        exporterAddress: draftExporterDetailData.exporterAddress,
        exporterContactDetails: draftExporterDetailData.exporterContactDetails,
      },
    },
  },
};

const notStartedSection: SchemaObject = {
  properties: {
    status: {
      enum: ['NotStarted'],
    },
  },
};

const recoveryFacilityDetail: SchemaObject = {
  properties: {
    status: {
      enum: ['CannotStart', 'NotStarted'],
    },
  },
};

const draftSubmission: SchemaObject = {
  properties: {
    id: { type: 'string' },
    reference: customerReference,
    wasteDescription: draftWasteDescription,
    wasteQuantity: draftWasteQuantity,
    exporterDetail: draftExporterDetail,
    importerDetail: notStartedSection,
    collectionDate: notStartedSection,
    carriers: notStartedSection,
    collectionDetail: notStartedSection,
    ukExitLocation: notStartedSection,
    transitCountries: notStartedSection,
    recoveryFacilityDetail: recoveryFacilityDetail,
  },
};

export const getDraftsRequest: JTDSchemaType<GetDraftsRequest> = {
  properties: { accountId: { type: 'string' } },
};

export const getDraftsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          id: { type: 'string' },
          reference: customerReference,
          wasteDescription: { ref: 'sectionSummary' },
          wasteQuantity: { ref: 'sectionSummary' },
          exporterDetail: { ref: 'sectionSummary' },
          importerDetail: { ref: 'sectionSummary' },
          collectionDate: { ref: 'sectionSummary' },
          carriers: { ref: 'sectionSummary' },
          collectionDetail: { ref: 'sectionSummary' },
          ukExitLocation: { ref: 'sectionSummary' },
          transitCountries: { ref: 'sectionSummary' },
          recoveryFacilityDetail: { ref: 'sectionSummary' },
        },
      },
    },
  },
  definitions: {
    sectionSummary: {
      properties: {
        status: { enum: ['CannotStart', 'NotStarted', 'Started', 'Complete'] },
      },
    },
  },
};

export const getDraftByIdRequest: JTDSchemaType<GetDraftByIdRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
  },
};

export const getDraftByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftSubmission,
  },
};

export const createDraftRequest: JTDSchemaType<CreateDraftRequest> = {
  properties: {
    accountId: { type: 'string' },
    reference: customerReference,
  },
};

export const createDraftResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftSubmission,
  },
};

export const getDraftCustomerReferenceByIdRequest: JTDSchemaType<GetDraftCustomerReferenceByIdRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftCustomerReferenceByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: customerReference,
  },
};

export const setDraftCustomerReferenceByIdRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: customerReference,
  },
};

export const setDraftCustomerReferenceByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftWasteDescriptionByIdRequest: JTDSchemaType<GetDraftWasteDescriptionByIdRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftWasteDescriptionByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftSubmission,
  },
};

export const setDraftWasteDescriptionByIdRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftWasteDescription,
  },
};

export const setDraftWasteDescriptionByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftWasteQuantityByIdRequest: JTDSchemaType<GetDraftWasteQuantityByIdRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftWasteQuantityByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftWasteQuantity,
  },
};

export const setDraftWasteQuantityByIdRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftWasteQuantity,
  },
};

export const setDraftWasteQuantityByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftExporterDetailByIdRequest: JTDSchemaType<GetDraftExporterDetailByIdRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftExporterDetailByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftExporterDetail,
  },
};

export const setDraftExporterDetailByIdRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftExporterDetail,
  },
};

export const setDraftExporterDetailByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};