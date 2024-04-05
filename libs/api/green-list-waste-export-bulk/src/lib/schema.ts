import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import {
  AddContentToBatchRequest,
  GetBatchRequest,
  UpdateBatchRequest,
} from './dto';

const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

export const wasteDescription: SchemaObject = {
  properties: {
    wasteCode: {
      discriminator: 'type',
      mapping: {
        NotApplicable: { properties: {} },
        BaselAnnexIX: { properties: { code: { type: 'string' } } },
        OECD: { properties: { code: { type: 'string' } } },
        AnnexIIIA: { properties: { code: { type: 'string' } } },
        AnnexIIIB: { properties: { code: { type: 'string' } } },
      },
    },
    ewcCodes: {
      elements: {
        properties: {
          code: {
            type: 'string',
          },
        },
      },
    },
    description: { type: 'string' },
  },
  optionalProperties: {
    nationalCode: {
      discriminator: 'provided',
      mapping: {
        Yes: { properties: { value: { type: 'string' } } },
        No: { properties: {} },
      },
    },
  },
};

export const wasteQuantity: SchemaObject = {
  discriminator: 'type',
  mapping: {
    NotApplicable: { properties: {} },
    EstimateData: {
      properties: {
        estimateData: {
          optionalProperties: {
            quantityType: { enum: ['Volume', 'Weight'] },
            unit: {
              enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
            },
            value: { type: 'float64' },
          },
        },
        actualData: {
          optionalProperties: {
            quantityType: { enum: ['Volume', 'Weight'] },
            unit: {
              enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
            },
            value: { type: 'float64' },
          },
        },
      },
    },
    ActualData: {
      properties: {
        estimateData: {
          optionalProperties: {
            quantityType: { enum: ['Volume', 'Weight'] },
            unit: {
              enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
            },
            value: { type: 'float64' },
          },
        },
        actualData: {
          optionalProperties: {
            quantityType: { enum: ['Volume', 'Weight'] },
            unit: {
              enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
            },
            value: { type: 'float64' },
          },
        },
      },
    },
  },
};

const bulkSubmissionState: SchemaObject = {
  discriminator: 'status',
  mapping: {
    Processing: {
      properties: {
        timestamp: { type: 'timestamp' },
      },
    },
    FailedCsvValidation: {
      properties: {
        timestamp: { type: 'timestamp' },
        error: { type: 'string' },
      },
    },
    FailedValidation: {
      properties: {
        timestamp: { type: 'timestamp' },
        rowErrors: {
          elements: {
            properties: {
              rowNumber: { type: 'uint16' },
              errorAmount: { type: 'uint16' },
              errorDetails: { elements: { type: 'string' } },
            },
          },
        },
        columnErrors: {
          elements: {
            properties: {
              errorAmount: { type: 'uint16' },
              columnName: { type: 'string' },
              errorDetails: {
                elements: {
                  properties: {
                    rowNumber: { type: 'uint16' },
                    errorReason: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    PassedValidation: {
      properties: {
        timestamp: { type: 'timestamp' },
        hasEstimates: { type: 'boolean' },
        submissions: {
          elements: {
            properties: {
              reference: { type: 'string' },
              wasteDescription: wasteDescription,
              wasteQuantity: wasteQuantity,
            },
          },
        },
      },
    },
    Submitting: {
      properties: {
        timestamp: { type: 'timestamp' },
        hasEstimates: { type: 'boolean' },
        submissions: {
          elements: {
            properties: {
              reference: { type: 'string' },
              wasteDescription: wasteDescription,
              wasteQuantity: wasteQuantity,
            },
          },
        },
      },
    },
    Submitted: {
      properties: {
        timestamp: { type: 'timestamp' },
        transactionId: { type: 'string' },
        hasEstimates: { type: 'boolean' },
        submissions: {
          elements: {
            properties: {
              id: { type: 'string' },
              transactionId: { type: 'string' },
              hasEstimates: { type: 'boolean' },
              collectionDate: { type: 'timestamp' },
              wasteCode: { type: 'string' },
              reference: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

const bulkSubmission: SchemaObject = {
  properties: {
    id: { type: 'string' },
    state: bulkSubmissionState,
  },
};

export const addContentToBatchRequest: JTDSchemaType<AddContentToBatchRequest> =
  {
    properties: {
      accountId: { type: 'string' },
      content: {
        properties: {
          type: { enum: ['text/csv'] },
          compression: { enum: ['Snappy', 'None'] },
          value: { type: 'string' },
        },
      },
    },
    optionalProperties: {
      batchId: { type: 'string' },
    },
  };

export const addContentToBatchResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      properties: {
        batchId: { type: 'string' },
      },
    },
  },
};

export const getBatchRequest: JTDSchemaType<GetBatchRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
  },
};

export const getBatchResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: bulkSubmission,
  },
};

export const updateBatchRequest: JTDSchemaType<UpdateBatchRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
  },
};

export const updateBatchResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};