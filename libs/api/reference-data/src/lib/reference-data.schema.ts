import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import { GetCountriesRequest, GetEWCCodesRequest } from './reference-data.dto';

export const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

export const getWasteCodesResponse: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          type: { type: 'string' },
          values: {
            elements: {
              properties: {
                code: { type: 'string' },
                value: {
                  properties: {
                    description: {
                      properties: {
                        en: { type: 'string' },
                        cy: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const getEWCCodesResponse: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          code: { type: 'string' },
          value: {
            properties: {
              description: {
                properties: {
                  en: { type: 'string' },
                  cy: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const getEwcCodesRequest: JTDSchemaType<GetEWCCodesRequest> = {
  optionalProperties: {
    includeHazardous: { type: 'boolean' },
  },
};

export const getCountriesRequest: JTDSchemaType<GetCountriesRequest> = {
  optionalProperties: {
    includeUk: { type: 'boolean' },
  },
};

export const getCountriesResponse: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          name: { type: 'string' },
        },
      },
    },
  },
};

export const getRecoveryCodesResponse: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          code: { type: 'string' },
          value: {
            properties: {
              description: {
                properties: {
                  en: { type: 'string' },
                  cy: { type: 'string' },
                },
              },
              interim: { type: 'boolean' },
            },
          },
        },
      },
    },
  },
};

export const getDisposalCodesResponse: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          code: { type: 'string' },
          value: {
            properties: {
              description: {
                properties: {
                  en: { type: 'string' },
                  cy: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const getHazardousCodesResponse: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          code: { type: 'string' },
          value: {
            properties: {
              description: {
                properties: {
                  en: { type: 'string' },
                  cy: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const getPopsResponse: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          name: {
            properties: {
              en: { type: 'string' },
              cy: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

export const getLocalAuthoritiesResponse: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          name: {
            properties: {
              en: { type: 'string' },
              cy: { type: 'string' },
            },
          },
          country: {
            properties: {
              en: { type: 'string' },
              cy: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

export const getSICCodesResponse: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          code: { type: 'string' },
          description: {
            properties: {
              en: { type: 'string' },
              cy: { type: 'string' },
            },
          },
        },
      },
    },
  },
};
