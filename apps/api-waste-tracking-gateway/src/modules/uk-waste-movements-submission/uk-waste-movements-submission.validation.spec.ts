import { faker } from '@faker-js/faker';
import {
  validateCreateDraftRequest,
  validateCreateDraftSicCodeRequest,
  validateSetDraftProducerAddressDetailsRequest,
  validateSetDraftProducerConfirmationRequest,
  validateSetDraftProducerContactRequest,
  validateSetDraftWasteCollectionAddressDetailsRequest,
  validateSetDraftWasteSourceRequest,
  validateSetDraftCarrierAddressDetailsRequest,
  validateSetDraftReceiverAddressDetailsRequest,
  validateSetDraftReceiverContactRequest,
} from './uk-waste-movements-submission.validation';

describe('validateCreateDraftRequest', () => {
  const validate = validateCreateDraftRequest;

  it('Rejects invalid values', () => {
    expect(validate(undefined)).toBe(false);
    expect(validate({})).toBe(false);
    expect(validate(faker.string.sample(10))).toBe(false);
    expect(validate({ ref: faker.string.sample(10) })).toBe(false);
    expect(validate({ reference: faker.number.int() })).toBe(false);
    expect(validate({ reference: faker.datatype.boolean() })).toBe(false);
    expect(validate({ reference: {} })).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(validate({ reference: faker.string.sample(10) })).toBe(true);
  });
});

describe('validateSetDraftProducerAddressRequest', () => {
  const validate = validateSetDraftProducerAddressDetailsRequest;

  it('Rejects invalid values', () => {
    expect(validate(undefined)).toBe(false);
    expect(validate({})).toBe(false);

    expect(
      validate({
        buildingNameOrNumber: faker.number.int(),
        addressLine1: faker.number.int(),
        addressLine2: faker.number.int(),
        townCity: faker.number.int(),
        postcode: faker.number.int(),
        country: faker.number.int(),
      }),
    ).toBe(false);
    expect(
      validate({
        buildingNameOrNumber: faker.string.sample(),
        addressLine2: faker.string.sample(),
        townCity: faker.string.sample(),
        postcode: faker.string.sample(),
        country: faker.string.sample(),
      }),
    ).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        buildingNameOrNumber: faker.string.sample(),
        addressLine1: faker.string.sample(),
        addressLine2: faker.string.sample(),
        townCity: faker.string.sample(),
        postcode: faker.string.sample(),
        country: faker.string.sample(),
      }),
    ).toBe(true);
    expect(
      validate({
        addressLine1: faker.string.sample(),
        townCity: faker.string.sample(),
        country: faker.string.sample(),
      }),
    ).toBe(true);
  });
});

describe('validateSetDraftProducerContactRequest', () => {
  const validate = validateSetDraftProducerContactRequest;

  it('Rejects invalid values', () => {
    expect(validate(undefined)).toBe(false);
    expect(validate({})).toBe(false);
    expect(validate(faker.lorem.word())).toBe(false);
    expect(
      validate({
        organisationName: faker.lorem.word(),
        fullName: faker.lorem.word(),
        emailAddress: faker.datatype.boolean(),
        phoneNumber: {},
      }),
    ).toBe(false);
    expect(
      validate({
        organisationName: faker.lorem.word(),
        fullName: faker.lorem.word(),
        emailAddress: faker.datatype.boolean(),
        phoneNumber: faker.phone.number(),
        faxNumber: faker.phone.number(),
      }),
    ).toBe(false);
    expect(
      validate({
        organisationName: faker.phone.number(),
        fullName: faker.phone.number(),
        emailAddress: faker.datatype.boolean(),
        phoneNumber: faker.phone.number(),
        faxNumber: faker.phone.number(),
      }),
    ).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        organisationName: faker.company.name(),
        fullName: faker.lorem.word(),
        emailAddress: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        faxNumber: faker.phone.number(),
      }),
    ).toBe(true);
  });
});

describe('validateSetDraftWasteSourceRequest', () => {
  const validate = validateSetDraftWasteSourceRequest;

  it('Rejects invalid values', () => {
    expect(validate(undefined)).toBe(false);
    expect(validate({})).toBe(false);
    expect(validate(faker.lorem.word())).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        wasteSource: 'Industrial',
      }),
    ).toBe(true);
  });
});

describe('validateSetDraftWasteCollectionAddressRequest', () => {
  const validate = validateSetDraftWasteCollectionAddressDetailsRequest;

  it('Rejects invalid values', () => {
    expect(validate(undefined)).toBe(false);
    expect(validate({})).toBe(false);

    expect(
      validate({
        buildingNameOrNumber: faker.number.int(),
        addressLine1: faker.number.int(),
        addressLine2: faker.number.int(),
        townCity: faker.number.int(),
        postcode: faker.number.int(),
        country: faker.number.int(),
      }),
    ).toBe(false);
    expect(
      validate({
        buildingNameOrNumber: faker.string.sample(),
        addressLine2: faker.string.sample(),
        townCity: faker.string.sample(),
        postcode: faker.string.sample(),
        country: faker.string.sample(),
      }),
    ).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        buildingNameOrNumber: faker.string.sample(),
        addressLine1: faker.string.sample(),
        addressLine2: faker.string.sample(),
        townCity: faker.string.sample(),
        postcode: faker.string.sample(),
        country: faker.string.sample(),
      }),
    ).toBe(true);
    expect(
      validate({
        addressLine1: faker.string.sample(),
        townCity: faker.string.sample(),
        country: faker.string.sample(),
      }),
    ).toBe(true);
  });
});

describe('validateCreateDraftSicCodeRequest', () => {
  const validate = validateCreateDraftSicCodeRequest;

  it('Rejects invalid values', () => {
    expect(validate(undefined)).toBe(false);
    expect(validate({})).toBe(false);
    expect(validate(faker.lorem.word())).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        sicCode: '01110',
      }),
    ).toBe(true);
  });
});

describe('validateSetDraftCarrierAddressRequest', () => {
  const validate = validateSetDraftCarrierAddressDetailsRequest;

  it('Rejects invalid values', () => {
    expect(validate(undefined)).toBe(false);
    expect(validate({})).toBe(false);

    expect(
      validate({
        buildingNameOrNumber: faker.number.int(),
        addressLine1: faker.number.int(),
        addressLine2: faker.number.int(),
        townCity: faker.number.int(),
        postcode: faker.number.int(),
        country: faker.number.int(),
      }),
    ).toBe(false);
    expect(
      validate({
        buildingNameOrNumber: faker.string.sample(),
        addressLine2: faker.string.sample(),
        townCity: faker.string.sample(),
        postcode: faker.string.sample(),
        country: faker.string.sample(),
      }),
    ).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        buildingNameOrNumber: faker.string.sample(),
        addressLine1: faker.string.sample(),
        addressLine2: faker.string.sample(),
        townCity: faker.string.sample(),
        postcode: faker.string.sample(),
        country: faker.string.sample(),
      }),
    ).toBe(true);
    expect(
      validate({
        addressLine1: faker.string.sample(),
        townCity: faker.string.sample(),
        country: faker.string.sample(),
      }),
    ).toBe(true);
  });
});

describe('validateSetDraftReceiverAddressRequest', () => {
  const validate = validateSetDraftReceiverAddressDetailsRequest;

  it('Rejects invalid values', () => {
    expect(validate(undefined)).toBe(false);
    expect(validate({})).toBe(false);

    expect(
      validate({
        buildingNameOrNumber: faker.number.int(),
        addressLine1: faker.number.int(),
        addressLine2: faker.number.int(),
        townCity: faker.number.int(),
        postcode: faker.number.int(),
        country: faker.number.int(),
      }),
    ).toBe(false);
    expect(
      validate({
        buildingNameOrNumber: faker.string.sample(),
        addressLine2: faker.string.sample(),
        townCity: faker.string.sample(),
        postcode: faker.string.sample(),
        country: faker.string.sample(),
      }),
    ).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        buildingNameOrNumber: faker.string.sample(),
        addressLine1: faker.string.sample(),
        addressLine2: faker.string.sample(),
        townCity: faker.string.sample(),
        postcode: faker.string.sample(),
        country: faker.string.sample(),
      }),
    ).toBe(true);
    expect(
      validate({
        addressLine1: faker.string.sample(),
        townCity: faker.string.sample(),
        country: faker.string.sample(),
      }),
    ).toBe(true);
  });

  describe('validateSetDraftReceiverContactRequest', () => {
    const validate = validateSetDraftReceiverContactRequest;

    it('Rejects invalid values', () => {
      expect(validate(undefined)).toBe(false);
      expect(validate({})).toBe(false);
      expect(validate(faker.lorem.word())).toBe(false);
      expect(
        validate({
          organisationName: faker.lorem.word(),
          fullName: faker.lorem.word(),
          emailAddress: faker.datatype.boolean(),
          phoneNumber: {},
        }),
      ).toBe(false);
      expect(
        validate({
          organisationName: faker.lorem.word(),
          fullName: faker.lorem.word(),
          emailAddress: faker.datatype.boolean(),
          phoneNumber: faker.phone.number(),
          faxNumber: faker.phone.number(),
        }),
      ).toBe(false);
      expect(
        validate({
          organisationName: faker.phone.number(),
          fullName: faker.phone.number(),
          emailAddress: faker.datatype.boolean(),
          phoneNumber: faker.phone.number(),
          faxNumber: faker.phone.number(),
        }),
      ).toBe(false);
    });

    it('Accepts valid values', () => {
      expect(
        validate({
          organisationName: faker.company.name(),
          fullName: faker.lorem.word(),
          emailAddress: faker.internet.email(),
          phoneNumber: faker.phone.number(),
          faxNumber: faker.phone.number(),
        }),
      ).toBe(true);
    });
  });
});

describe('validateSetDraftProducerConfirmationRequest', () => {
  const validate = validateSetDraftProducerConfirmationRequest;

  it('Rejects invalid values', () => {
    expect(validate(undefined)).toBe(false);
    expect(validate({})).toBe(false);
    expect(validate(faker.lorem.word())).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        isConfirmed: true,
      }),
    ).toBe(true);
  });
});

describe('validateSetDraftProducerConfirmationRequest', () => {
  const validate = validateSetDraftProducerConfirmationRequest;

  it('Rejects invalid values', () => {
    expect(validate(undefined)).toBe(false);
    expect(validate({})).toBe(false);
    expect(validate(faker.lorem.word())).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        isConfirmed: true,
      }),
    ).toBe(true);
  });
});
