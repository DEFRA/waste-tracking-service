import { faker } from '@faker-js/faker';
import {
  validateCreateSubmissionRequest,
  validatePutReferenceRequest,
  validatePutWasteDescriptionRequest,
  validatePutWasteQuantityRequest,
} from './submission.validation';

describe('validateCreateSubmissionRequest', () => {
  const validate = validateCreateSubmissionRequest;

  it('Rejects invalid values', () => {
    expect(validate(undefined)).toBe(false);
    expect(validate(faker.datatype.string(10))).toBe(false);
    expect(validate({ ref: faker.datatype.string(10) })).toBe(false);
    expect(validate({ reference: faker.datatype.number() })).toBe(false);
    expect(validate({ reference: faker.datatype.boolean() })).toBe(false);
    expect(validate({ reference: {} })).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(validate({})).toBe(true);
    expect(validate({ reference: faker.datatype.string(10) })).toBe(true);
  });
});

describe('validatePutReferenceRequest', () => {
  const validate = validatePutReferenceRequest;

  it('Rejects invalid values', () => {
    expect(validate(faker.datatype.number())).toBe(false);
    expect(validate(faker.datatype.array())).toBe(false);
    expect(validate({})).toBe(false);
    expect(validate({ reference: faker.datatype.string(10) })).toBe(false);
    expect(validate(undefined)).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(validate(faker.datatype.string(10))).toBe(true);
    expect(validate(null)).toBe(true);
  });
});

describe('validatePutWasteDescriptionRequest', () => {
  const validate = validatePutWasteDescriptionRequest;

  it('Rejects invalid values', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'Started',
        wasteCode: { type: 'NotApplicable', value: faker.datatype.string(10) },
      })
    ).toBe(false);

    expect(
      validate({
        status: 'Started',
        nationalCode: { provided: 'No', value: faker.datatype.string(10) },
      })
    ).toBe(false);

    expect(
      validate({
        status: 'Complete',
        wasteCode: { type: 'BaselAnnexIX', value: faker.datatype.string(10) },
      })
    ).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        status: 'NotStarted',
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Started',
        wasteCode: { type: 'NotApplicable' },
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Started',
        wasteCode: { type: 'BaselAnnexIX', value: faker.datatype.string(10) },
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Complete',
        wasteCode: { type: 'AnnexIIIA', value: faker.datatype.string(10) },
        ewcCodes: ['Z'],
        nationalCode: { provided: 'No' },
        description: 'Waste',
      })
    ).toBe(true);
  });
});

describe('validatePutWasteQuantityRequest', () => {
  const validate = validatePutWasteQuantityRequest;

  it('Rejects invalid values', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'Started',
        wasteQuantity: {
          type: 'NotApplicable',
          value: faker.datatype.string(10),
        },
      })
    ).toBe(false);

    expect(
      validate({
        status: 'NotStarted',
        wasteQuantity: {
          type: 'ActualData',
          quantityType: 'Volume',
          value: faker.datatype.number(10),
        },
      })
    ).toBe(false);

    expect(
      validate({
        status: 'Complete',
        wasteCode: { type: 'EstimateData', value: faker.datatype.number(10) },
      })
    ).toBe(false);

    expect(
      validate({
        status: 'Started',
        wasteQuantity: {
          type: 'ActualData',
          quantityType: 'Weight',
          value: faker.datatype.string(10),
        },
      })
    ).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        status: 'NotStarted',
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Started',
        wasteQuantity: { type: 'NotApplicable' },
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Started',
        wasteQuantity: {
          type: 'ActualData',
          quantityType: 'Weight',
          value: faker.datatype.float({ precision: 0.01 }),
        },
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Complete',
        wasteQuantity: {
          type: 'ActualData',
          quantityType: 'Volume',
          value: faker.datatype.float({ precision: 0.01 }),
        },
      })
    ).toBe(true);
  });
});
