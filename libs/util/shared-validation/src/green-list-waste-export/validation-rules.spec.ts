import { faker } from '@faker-js/faker';
import {
  validateCollectionDateType,
  validateEwcCodes,
  validateNationalCode,
  validateUkExitLocation,
  validateWasteCode,
  validateWasteDecription,
  validateImporterDetailAndTransitCountriesCross,
  validateTransitCountries,
} from './validation-rules';
import { UkExitLocationChar } from './constraints';
import * as errorMessages from './error-messages';
import { submission } from '@wts/api/green-list-waste-export';
import { ImporterDetail } from './model';

const wasteCodes = [
  {
    type: 'BaselAnnexIX',
    values: [
      {
        code: 'B1010',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
    ],
  },
  {
    type: 'OECD',
    values: [
      {
        code: 'GB040',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
    ],
  },
  {
    type: 'AnnexIIIA',
    values: [
      {
        code: 'B1010 and B1050',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
    ],
  },
  {
    type: 'AnnexIIIB',
    values: [
      {
        code: 'BEU04',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
    ],
  },
];

const ewcCodes = [
  {
    code: '010101',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
  {
    code: '010102',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
];

const countries = [
  {
    name: 'Afghanistan [AF]',
  },
  {
    name: 'France [FR]',
  },
  {
    name: 'Belgium [BE]',
  },
  {
    name: 'Burkina Faso [BF]',
  },
  {
    name: 'Åland Islands [AX]',
  },
  {
    name: 'United Kingdom (Northern Ireland) [GB-NIR]',
  },
  {
    name: 'United Kingdom (Wales) [GB-WLS]',
  },
];

const locale = 'en';
const context = 'api';

describe(validateWasteCode, () => {
  it('passes WasteCode validation', async () => {
    let response = validateWasteCode('B1010', 'BaselAnnexIX', wasteCodes);
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual({
        type: 'BaselAnnexIX',
        code: 'B1010',
      });
    }

    response = validateWasteCode('GB040', 'OECD', wasteCodes);
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual({
        type: 'OECD',
        code: 'GB040',
      });
    }

    response = validateWasteCode('B1010; B1050', 'AnnexIIIA', wasteCodes);
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual({
        type: 'AnnexIIIA',
        code: 'B1010 and B1050',
      });
    }

    response = validateWasteCode('BEU04', 'AnnexIIIB', wasteCodes);
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual({
        type: 'AnnexIIIB',
        code: 'BEU04',
      });
    }

    response = validateWasteCode('', 'NotApplicable', []);
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual({
        type: 'NotApplicable',
      });
    }
  });

  it('fails WasteCode validation', async () => {
    let type: submission.WasteDescription['wasteCode']['type'] = 'BaselAnnexIX';
    let response = validateWasteCode(
      'B9999',
      type,
      wasteCodes,
      locale,
      context,
    );
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.error).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.invalidWasteCode[type][locale][context],
          },
        ],
      });
    }

    type = 'OECD';
    response = validateWasteCode('GB999', type, wasteCodes);
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.error).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.invalidWasteCode[type][locale][context],
          },
        ],
      });
    }

    type = 'AnnexIIIA';
    response = validateWasteCode('B1010;B9999', type, wasteCodes);
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.error).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.invalidWasteCode[type][locale][context],
          },
        ],
      });
    }

    response = validateWasteCode('1010;B1050', type, wasteCodes);
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.error).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.invalidWasteCode[type][locale][context],
          },
        ],
      });
    }

    type = 'AnnexIIIB';
    response = validateWasteCode('BEU99', type, wasteCodes);
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.error).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.invalidWasteCode[type][locale][context],
          },
        ],
      });
    }
  });
});

describe(validateEwcCodes, () => {
  it('passes EwcCodes validation', async () => {
    let response = validateEwcCodes(['010101'], ewcCodes);
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual([
        {
          code: '010101',
        },
      ]);
    }

    response = validateEwcCodes(['010101', '010102'], ewcCodes);
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual([
        {
          code: '010101',
        },
        {
          code: '010102',
        },
      ]);
    }
  });

  it('fails EwcCodes validation', async () => {
    let response = validateEwcCodes([], ewcCodes);
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.error).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.emptyEwcCodes[locale][context],
          },
        ],
      });
    }

    response = validateEwcCodes(
      ['010101', '010102', '010101', '010102', '010101', '010102'],
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.error).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.tooManyEwcCodes[locale][context],
          },
        ],
      });
    }

    response = validateEwcCodes(['010101', '999999'], ewcCodes);
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.error).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.invalidEwcCodes[locale][context],
          },
        ],
      });
    }
  });
});

describe(validateNationalCode, () => {
  it('passes NationalCode validation', async () => {
    let response = validateNationalCode('123456');
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual({
        provided: 'Yes',
        value: '123456',
      });
    }

    response = validateNationalCode('');
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual({
        provided: 'No',
      });
    }

    response = validateNationalCode('A-123');
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual({
        provided: 'Yes',
        value: 'A-123',
      });
    }
  });

  it('fails NationalCode validation', async () => {
    const response = validateNationalCode('*****');
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.error).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.invalidNationalCode[locale][context],
          },
        ],
      });
    }
  });
});

describe(validateWasteDecription, () => {
  it('passes WasteDescription validation', async () => {
    const response = validateWasteDecription('test');
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual('test');
    }
  });

  it('fails WasteDescription validation', async () => {
    let response = validateWasteDecription(faker.string.sample(120));
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.error).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.charTooManyWasteDescription[locale][context],
          },
        ],
      });
    }

    response = validateWasteDecription('');
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.error).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.emptyWasteDescription[locale][context],
          },
        ],
      });
    }

    response = validateWasteDecription(' ');
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.error).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.charTooFewWasteDescription[locale][context],
          },
        ],
      });
    }
  });
});

describe(validateCollectionDateType, () => {
  it.each(['actual', 'estimate'])(
    'should return valid for valid types (%s)',
    () => {
      const result = validateCollectionDateType('actual');
      expect(result.valid).toBe(true);

      if (result.valid) {
        expect(result.value).toBe('ActualDate');
      }
    },
  );

  it.each(['', '      ', undefined, 'abc'])(
    'should return invalid for invalid vlues (%s)',
    () => {
      const result = validateCollectionDateType('actual');
      expect(result.valid).toBe(true);

      if (result.valid) {
        expect(result.value).toBe('ActualDate');
      }
    },
  );
});

describe(validateUkExitLocation, () => {
  it.each(['London', 'Sofia ', '02Sofia', '', '  ', undefined])(
    'passes UkExitLocation validation (%s)',
    (value) => {
      const result = validateUkExitLocation(value);
      expect(result.valid).toEqual(true);
      if (result.valid) {
        if (result.value.provided === 'Yes' && value) {
          expect(result.value).toEqual({
            provided: 'Yes',
            value: value.trim(),
          });
        } else {
          expect(result.value).toEqual({
            provided: 'No',
          });
        }
      }
    },
  );

  it.each([
    faker.string.sample(Number(UkExitLocationChar.max + 1)),
    'London>!@>!<@',
    'Sofia>!@.,!<@',
    '02Sofia>!@>!{]s@',
  ])('fails UkExitLocation validation (%s)', (value) => {
    const result = validateUkExitLocation(value);

    expect(result.valid).toEqual(false);
    if (!result.valid) {
      if (value.length > UkExitLocationChar.max) {
        expect(result.error.fieldFormatErrors).toEqual([
          {
            field: 'UkExitLocation',
            message: errorMessages.charTooManyUkExitLocation[locale][context],
          },
        ]);
      } else {
        expect(result.error.fieldFormatErrors).toEqual([
          {
            field: 'UkExitLocation',
            message: errorMessages.invalidUkExitLocation[locale][context],
          },
        ]);
      }
    }
  });
});

describe('validateTransitCountries', () => {
  it('should return array of strings in correct format (%s)', () => {
    const request = { value: 'Belgium;France', countryList: countries };
    const result = validateTransitCountries(request.countryList, request.value);
    expect(result.valid).toEqual(true);
    if (result.valid) {
      expect(result.value).toEqual(['Belgium [BE]', 'France [FR]']);
    }
  });

  it('should return invalid error if the provided countries do not exist on the countryList', () => {
    const request = { value: 'Bulgaria;France', countryList: countries };
    const result = validateTransitCountries(request.countryList, request.value);
    console.log(result);
    expect(result.valid).toEqual(false);
    if (!result.valid) {
      expect(result.error).toEqual({
        fieldFormatErrors: [
          {
            field: 'TransitCountries',
            message: 'Enter transit country in full',
          },
        ],
      });
    }
  });
});

describe('validateImporterDetailAndTransitCountriesCross', () => {
  it('should return valid true if the provided transitCountries are not present in the importerDetail object', () => {
    const transitCountries = ['France'];
    const importerDetail: ImporterDetail = {
      importerAddressDetails: {
        organisationName: 'Global Imports Ltd.',
        address: '123 International Way, Suite 400',
        country: 'Belgium',
      },
      importerContactDetails: {
        fullName: 'Ivan Petrov',
        emailAddress: 'ivan.petrov@globalimports.com',
        phoneNumber: '+359 88 123 4567',
        faxNumber: '+359 88 765 4321',
      },
    };
    const result = validateImporterDetailAndTransitCountriesCross(
      importerDetail,
      transitCountries,
    );
    expect(result.valid).toEqual(true);
  });

  it('should return valid false if the provided transitCountries are present in the importerDetail object', () => {
    const transitCountries = ['Portugal'];
    const importerDetail: ImporterDetail = {
      importerAddressDetails: {
        organisationName: 'Global Imports Ltd.',
        address: '123 International Way, Suite 400',
        country: 'Portugal',
      },
      importerContactDetails: {
        fullName: 'Ivan Petrov',
        emailAddress: 'ivan.petrov@globalimports.com',
        phoneNumber: '+359 88 123 4567',
        faxNumber: '+359 88 765 4321',
      },
    };
    const result = validateImporterDetailAndTransitCountriesCross(
      importerDetail,
      transitCountries,
    );
    expect(result.valid).toEqual(false);
    if (!result.valid) {
      expect(result.error).toEqual({
        invalidStructureErrors: [
          {
            fields: ['ImporterDetail', 'TransitCountries'],
            message:
              'The importer country cannot be the same as the transit country',
          },
          {
            fields: ['ImporterDetail', 'TransitCountries'],
            message:
              'The transit country cannot be the same as the importer country',
          },
        ],
        fieldFormatErrors: [],
      });
    }
  });
});
