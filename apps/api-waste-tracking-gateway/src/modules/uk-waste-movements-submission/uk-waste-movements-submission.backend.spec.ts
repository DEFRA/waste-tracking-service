import { DaprUkWasteMovementsClient } from '@wts/client/uk-waste-movements';
import { expect, jest } from '@jest/globals';
import { ServiceUkWasteMovementsSubmissionBackend } from './uk-waste-movements-submission.backend';
import { Logger } from 'winston';
import { faker } from '@faker-js/faker';
import {
  CreateDraftResponse,
  GetDraftProducerContactDetailResponse,
  GetDraftResponse,
  GetDraftsResponse,
  GetDraftProducerAddressDetailsResponse,
  SetDraftProducerContactDetailResponse,
  SetDraftWasteSourceResponse,
  GetDraftWasteSourceResponse,
  GetDraftWasteCollectionAddressDetailsResponse,
  CreateDraftSicCodeResponse,
  GetDraftSicCodesResponse,
  GetDraftCarrierAddressDetailsResponse,
  GetDraftReceiverAddressDetailsResponse,
  DeleteDraftSicCodeResponse,
  SetDraftReceiverContactDetailsResponse,
  GetDraftReceiverContactDetailsResponse,
} from '@wts/api/uk-waste-movements';
import { UkwmContact } from '@wts/api/waste-tracking-gateway';

import { Response } from '@wts/util/invocation';
import { UkwmAddress } from '@wts/api/waste-tracking-gateway';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockClient = {
  getDraft: jest.fn<DaprUkWasteMovementsClient['getDraft']>(),
  getDrafts: jest.fn<DaprUkWasteMovementsClient['getDrafts']>(),
  createDraft: jest.fn<DaprUkWasteMovementsClient['createDraft']>(),
  setDraftProducerAddressDetails:
    jest.fn<DaprUkWasteMovementsClient['setDraftProducerAddressDetails']>(),
  getDraftProducerAddressDetails:
    jest.fn<DaprUkWasteMovementsClient['getDraftProducerAddressDetails']>(),
  setDraftProducerContactDetail:
    jest.fn<DaprUkWasteMovementsClient['setDraftProducerContactDetail']>(),
  getDraftProducerContactDetail:
    jest.fn<DaprUkWasteMovementsClient['getDraftProducerContactDetail']>(),
  setDraftWasteSource:
    jest.fn<DaprUkWasteMovementsClient['setDraftWasteSource']>(),
  getDraftWasteSource:
    jest.fn<DaprUkWasteMovementsClient['getDraftWasteSource']>(),
  setDraftWasteCollectionAddressDetails:
    jest.fn<
      DaprUkWasteMovementsClient['setDraftWasteCollectionAddressDetails']
    >(),
  getDraftWasteCollectionAddressDetails:
    jest.fn<
      DaprUkWasteMovementsClient['getDraftWasteCollectionAddressDetails']
    >(),
  createDraftSicCode:
    jest.fn<DaprUkWasteMovementsClient['createDraftSicCode']>(),
  getDraftSicCodes: jest.fn<DaprUkWasteMovementsClient['getDraftSicCodes']>(),
  setDraftCarrierAddressDetails:
    jest.fn<DaprUkWasteMovementsClient['setDraftCarrierAddressDetails']>(),
  getDraftCarrierAddressDetails:
    jest.fn<DaprUkWasteMovementsClient['getDraftCarrierAddressDetails']>(),
  setDraftReceiverAddressDetails:
    jest.fn<DaprUkWasteMovementsClient['setDraftReceiverAddressDetails']>(),
  getDraftReceiverAddressDetails:
    jest.fn<DaprUkWasteMovementsClient['getDraftReceiverAddressDetails']>(),
  deleteDraftSicCode:
    jest.fn<DaprUkWasteMovementsClient['deleteDraftSicCode']>(),
  setProducerConfirmation:
    jest.fn<DaprUkWasteMovementsClient['setProducerConfirmation']>(),
  setDraftReceiverContactDetail:
    jest.fn<DaprUkWasteMovementsClient['setDraftReceiverContactDetail']>(),
  getDraftReceiverContactDetail:
    jest.fn<DaprUkWasteMovementsClient['getDraftReceiverContactDetail']>(),
};

describe(ServiceUkWasteMovementsSubmissionBackend, () => {
  const subject = new ServiceUkWasteMovementsSubmissionBackend(
    mockClient as unknown as DaprUkWasteMovementsClient,
    new Logger(),
  );
  beforeEach(() => {
    mockClient.getDraft.mockClear();
  });

  it('returns draft', async () => {
    const id = faker.string.uuid();
    const mockGetDraftResponse: GetDraftResponse = {
      success: true,
      value: {
        id: id,
        reference: '123456',
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            address: {
              status: 'NotStarted',
            },
            contact: {
              status: 'NotStarted',
            },
            sicCodes: {
              status: 'NotStarted',
              values: [],
            },
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
            brokerRegistrationNumber: '',
            carrierRegistrationNumber: '',
            expectedWasteCollectionDate: {
              day: '',
              month: '',
              year: '',
            },
            localAuthority: '',
          },
          confirmation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      },
    };
    const accountId = faker.string.uuid();
    mockClient.getDraft.mockResolvedValueOnce(mockGetDraftResponse);
    const result = await subject.getDraft({
      id,
      accountId,
    });

    expect(result.id).toEqual(id);
    expect(mockClient.getDraft).toBeCalledWith({ id, accountId });
  });

  it('returns drafts', async () => {
    const id = faker.string.uuid();
    const mockGetDraftsResponse: GetDraftsResponse = {
      success: true,
      value: {
        totalRecords: 1,
        totalPages: 1,
        page: 1,
        values: [
          {
            id: id,
            wasteMovementId: '',
            producerName: '',
            ewcCode: '',
            collectionDate: {
              day: '',
              month: '',
              year: '',
            },
          },
        ],
      },
    };
    mockClient.getDrafts.mockResolvedValueOnce(mockGetDraftsResponse);
    const result = await subject.getDrafts({
      page: 1,
    });

    expect(result.values[0].id).toEqual(id);
    expect(mockClient.getDrafts).toBeCalled();
  });

  it('creates draft', async () => {
    const mockGetDraftsResponse: CreateDraftResponse = {
      success: true,
      value: {
        id: faker.string.uuid(),
        reference: '123456',
        producerAndCollection: {
          producer: {
            address: {
              status: 'NotStarted',
            },
            contact: {
              status: 'NotStarted',
            },
            sicCodes: {
              status: 'Complete',
              values: ['123456'],
            },
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
          },
          confirmation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        state: {
          status: 'InProgress',
          timestamp: faker.date.anytime(),
        },
        wasteInformation: {
          status: 'NotStarted',
        },
      },
    };
    mockClient.createDraft.mockResolvedValueOnce(mockGetDraftsResponse);
    const result = await subject.createDraft({
      accountId: faker.string.uuid(),
      reference: '123456',
    });

    expect(result).toEqual(mockGetDraftsResponse.value);
    expect(mockClient.createDraft).toBeCalled();
  });

  it('sets producer address details on a draft', async () => {
    const accountId = faker.string.uuid();
    const id = faker.string.uuid();
    const mockSetDraftProducerAddressDetailsResponse: Response<void> = {
      success: true,
      value: undefined,
    };

    mockClient.setDraftProducerAddressDetails.mockResolvedValueOnce(
      mockSetDraftProducerAddressDetailsResponse,
    );

    const value: UkwmAddress = {
      addressLine1: '123 Main St',
      addressLine2: 'Building 1',
      townCity: 'London',
      country: 'England [EN]',
      postcode: 'SW1A 1AA',
    };

    await subject.setDraftProducerAddressDetails(
      { id, accountId },
      value,
      true,
    );

    expect(mockClient.setDraftProducerAddressDetails).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
    expect(mockClient.setDraftProducerAddressDetails).toHaveBeenCalledTimes(1);
    expect(mockClient.setDraftProducerAddressDetails).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
  });

  it('gets producer address detail from a draft', async () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const mockGetDraftProducerAddressDetailsResponse: GetDraftProducerAddressDetailsResponse =
      {
        success: true,
        value: {
          status: 'Started',
          addressLine1: '123 Main St',
          addressLine2: 'Building 1',
          townCity: 'London',
          country: 'England [EN]',
          postcode: 'SW1A 1AA',
        },
      };

    mockClient.getDraftProducerAddressDetails.mockResolvedValueOnce(
      mockGetDraftProducerAddressDetailsResponse,
    );

    const result = await subject.getDraftProducerAddressDetails({
      id,
      accountId,
    });

    expect(mockClient.getDraftProducerAddressDetails).toHaveBeenCalledWith({
      id,
      accountId,
    });
    expect(result).toEqual(mockGetDraftProducerAddressDetailsResponse.value);
  });

  it('sets producer contact detail on a draft', async () => {
    const accountId = faker.string.uuid();
    const id = faker.string.uuid();
    const mockSetDraftProducerContactDetailResponse: SetDraftProducerContactDetailResponse =
      {
        success: true,
        value: undefined,
      };

    mockClient.setDraftProducerContactDetail.mockResolvedValueOnce(
      mockSetDraftProducerContactDetailResponse,
    );
    const value: UkwmContact = {
      organisationName: 'Org name',
      fullName: 'John Doe',
      emailAddress: 'john.doe@example.com',
      phoneNumber: '123-456-7890',
    };

    await subject.setDraftProducerContactDetail({ id, accountId }, value, true);

    expect(mockClient.setDraftProducerContactDetail).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
    expect(mockClient.setDraftProducerContactDetail).toHaveBeenCalledTimes(1);
    expect(mockClient.setDraftProducerContactDetail).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
  });

  it('gets producer contact detail from a draft', async () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const mockGetDraftProducerContactDetailResponse: GetDraftProducerContactDetailResponse =
      {
        success: true,
        value: {
          status: 'Started',
          organisationName: 'Org name',
          fullName: 'John Doe',
          emailAddress: 'john.doe@example.com',
          phoneNumber: '123-456-7890',
        },
      };

    mockClient.getDraftProducerContactDetail.mockResolvedValueOnce(
      mockGetDraftProducerContactDetailResponse,
    );

    const result = await subject.getDraftProducerContactDetail({
      id,
      accountId,
    });

    expect(mockClient.getDraftProducerContactDetail).toHaveBeenCalledWith({
      id,
      accountId,
    });
    expect(result).toEqual(mockGetDraftProducerContactDetailResponse.value);
  });

  it('sets waste source on a draft', async () => {
    const accountId = faker.string.uuid();
    const id = faker.string.uuid();
    const mockSetDraftWasteSourceResponse: SetDraftWasteSourceResponse = {
      success: true,
      value: undefined,
    };

    mockClient.setDraftWasteSource.mockResolvedValueOnce(
      mockSetDraftWasteSourceResponse,
    );
    const wasteSource = 'Industrial';

    await subject.setDraftWasteSource({ id, accountId, wasteSource });

    expect(mockClient.setDraftWasteSource).toHaveBeenCalledWith({
      id,
      accountId,
      wasteSource,
    });
    expect(mockClient.setDraftWasteSource).toHaveBeenCalledTimes(1);
    expect(mockClient.setDraftWasteSource).toHaveBeenCalledWith({
      id,
      accountId,
      wasteSource,
    });
  });

  it('gets waste source from a draft', async () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const mockGetDraftWasteSourceResponse: GetDraftWasteSourceResponse = {
      success: true,
      value: {
        status: 'Complete',
        value: 'Industrial',
      },
    };

    mockClient.getDraftWasteSource.mockResolvedValueOnce(
      mockGetDraftWasteSourceResponse,
    );

    const result = await subject.getDraftWasteSource({
      id,
      accountId,
    });

    expect(mockClient.getDraftWasteSource).toHaveBeenCalledWith({
      id,
      accountId,
    });
    expect(result).toEqual(mockGetDraftWasteSourceResponse.value);
  });

  it('sets waste collection address details on a draft', async () => {
    const accountId = faker.string.uuid();
    const id = faker.string.uuid();
    const mockSetDraftWasteCollectionAddressDetailsResponse: Response<void> = {
      success: true,
      value: undefined,
    };

    mockClient.setDraftWasteCollectionAddressDetails.mockResolvedValueOnce(
      mockSetDraftWasteCollectionAddressDetailsResponse,
    );

    const value: UkwmAddress = {
      addressLine1: '123 Main St',
      addressLine2: 'Building 1',
      townCity: 'London',
      country: 'England [EN]',
      postcode: 'SW1A 1AA',
    };

    await subject.setDraftWasteCollectionAddressDetails(
      { id, accountId },
      value,
      true,
    );

    expect(
      mockClient.setDraftWasteCollectionAddressDetails,
    ).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
    expect(
      mockClient.setDraftWasteCollectionAddressDetails,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockClient.setDraftWasteCollectionAddressDetails,
    ).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
  });

  it('gets waste collection address detail from a draft', async () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const mockGetDraftWasteCollectionAddressDetailsResponse: GetDraftWasteCollectionAddressDetailsResponse =
      {
        success: true,
        value: {
          status: 'Started',
          addressLine1: '123 Main St',
          addressLine2: 'Building 1',
          townCity: 'London',
          country: 'England [EN]',
          postcode: 'SW1A 1AA',
        },
      };

    mockClient.getDraftWasteCollectionAddressDetails.mockResolvedValueOnce(
      mockGetDraftWasteCollectionAddressDetailsResponse,
    );

    const result = await subject.getDraftWasteCollectionAddressDetails({
      id,
      accountId,
    });

    expect(
      mockClient.getDraftWasteCollectionAddressDetails,
    ).toHaveBeenCalledWith({
      id,
      accountId,
    });
    expect(result).toEqual(
      mockGetDraftWasteCollectionAddressDetailsResponse.value,
    );
  });

  it('creates sic code on a draft', async () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const mockCreateDraftSicCodeResponse: CreateDraftSicCodeResponse = {
      success: true,
      value: '01110',
    };

    mockClient.createDraftSicCode.mockResolvedValueOnce(
      mockCreateDraftSicCodeResponse,
    );
    const sicCode = '01110';

    await subject.createDraftSicCode({ id, accountId, sicCode });

    expect(mockClient.createDraftSicCode).toHaveBeenCalledWith({
      id,
      accountId,
      sicCode,
    });
    expect(mockClient.createDraftSicCode).toHaveBeenCalledTimes(1);
  });

  it('gets sic code from a draft', async () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const mockGetDraftSicCodesResponse: GetDraftSicCodesResponse = {
      success: true,
      value: {
        status: 'Complete',
        values: ['01110,01120'],
      },
    };

    mockClient.getDraftSicCodes.mockResolvedValueOnce(
      mockGetDraftSicCodesResponse,
    );

    const result = await subject.getDraftSicCodes({
      id,
      accountId,
    });

    expect(mockClient.getDraftSicCodes).toHaveBeenCalledWith({
      id,
      accountId,
    });
    expect(result).toEqual(mockGetDraftSicCodesResponse.value);
  });

  it('sets carrier address details on a draft', async () => {
    const accountId = faker.string.uuid();
    const id = faker.string.uuid();
    const mockSetDraftCarrierAddressDetailsResponse: Response<void> = {
      success: true,
      value: undefined,
    };

    mockClient.setDraftCarrierAddressDetails.mockResolvedValueOnce(
      mockSetDraftCarrierAddressDetailsResponse,
    );

    const value: UkwmAddress = {
      addressLine1: '123 Main St',
      addressLine2: 'Building 1',
      townCity: 'London',
      country: 'England [EN]',
      postcode: 'SW1A 1AA',
    };

    await subject.setDraftCarrierAddressDetails({ id, accountId }, value, true);

    expect(mockClient.setDraftCarrierAddressDetails).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
    expect(mockClient.setDraftCarrierAddressDetails).toHaveBeenCalledTimes(1);
    expect(mockClient.setDraftCarrierAddressDetails).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
  });

  it('gets carrier address detail from a draft', async () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const mockGetDraftCarrierAddressDetailsResponse: GetDraftCarrierAddressDetailsResponse =
      {
        success: true,
        value: {
          status: 'Started',
          addressLine1: '123 Main St',
          addressLine2: 'Building 1',
          townCity: 'London',
          country: 'England [EN]',
          postcode: 'SW1A 1AA',
        },
      };

    mockClient.getDraftCarrierAddressDetails.mockResolvedValueOnce(
      mockGetDraftCarrierAddressDetailsResponse,
    );

    const result = await subject.getDraftCarrierAddressDetails({
      id,
      accountId,
    });

    expect(mockClient.getDraftCarrierAddressDetails).toHaveBeenCalledWith({
      id,
      accountId,
    });
    expect(result).toEqual(mockGetDraftCarrierAddressDetailsResponse.value);
  });

  it('sets receiver address details on a draft', async () => {
    const accountId = faker.string.uuid();
    const id = faker.string.uuid();
    const mockSetDraftReceiverAddressDetailsResponse: Response<void> = {
      success: true,
      value: undefined,
    };

    mockClient.setDraftReceiverAddressDetails.mockResolvedValueOnce(
      mockSetDraftReceiverAddressDetailsResponse,
    );

    const value: UkwmAddress = {
      addressLine1: '123 Main St',
      addressLine2: 'Building 1',
      townCity: 'London',
      country: 'England [EN]',
      postcode: 'SW1A 1AA',
    };

    await subject.setDraftReceiverAddressDetails(
      { id, accountId },
      value,
      true,
    );

    expect(mockClient.setDraftReceiverAddressDetails).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
    expect(mockClient.setDraftReceiverAddressDetails).toHaveBeenCalledTimes(1);
    expect(mockClient.setDraftReceiverAddressDetails).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
  });

  it('gets receiver address detail from a draft', async () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const mockGetDraftReceiverAddressDetailsResponse: GetDraftReceiverAddressDetailsResponse =
      {
        success: true,
        value: {
          status: 'Started',
          addressLine1: '123 Main St',
          addressLine2: 'Building 1',
          townCity: 'London',
          country: 'England [EN]',
          postcode: 'SW1A 1AA',
        },
      };

    mockClient.getDraftReceiverAddressDetails.mockResolvedValueOnce(
      mockGetDraftReceiverAddressDetailsResponse,
    );

    const result = await subject.getDraftReceiverAddressDetails({
      id,
      accountId,
    });

    expect(mockClient.getDraftReceiverAddressDetails).toHaveBeenCalledWith({
      id,
      accountId,
    });
    expect(result).toEqual(mockGetDraftReceiverAddressDetailsResponse.value);
  });

  it('deletes sic code from a draft', async () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const code = '01110';
    const mockDeleteDraftSicCodesResponse: DeleteDraftSicCodeResponse = {
      success: true,
      value: ['01110', '01120', '01130'],
    };

    mockClient.deleteDraftSicCode.mockResolvedValueOnce(
      mockDeleteDraftSicCodesResponse,
    );

    const result = await subject.deleteDraftSicCode({
      id,
      accountId,
      code,
    });

    expect(mockClient.deleteDraftSicCode).toHaveBeenCalledWith({
      id,
      accountId,
      code,
    });
    expect(result).toEqual(['01110', '01120', '01130']);
  });

  it('sets producer confirmation on a draft', async () => {
    const accountId = faker.string.uuid();
    const id = faker.string.uuid();
    const mockResponse: Response<void> = {
      success: true,
      value: undefined,
    };

    mockClient.setProducerConfirmation.mockResolvedValueOnce(mockResponse);

    await subject.setProducerConfirmation({ id, accountId, isConfirmed: true });

    expect(mockClient.setProducerConfirmation).toHaveBeenCalledWith({
      id,
      accountId,
      isConfirmed: true,
    });
    expect(mockClient.setProducerConfirmation).toHaveBeenCalledTimes(1);
  });

  it('sets receiver contact detail on a draft', async () => {
    const accountId = faker.string.uuid();
    const id = faker.string.uuid();
    const mockSetDraftReceiverContactDetailResponse: SetDraftReceiverContactDetailsResponse =
      {
        success: true,
        value: undefined,
      };

    mockClient.setDraftReceiverContactDetail.mockResolvedValueOnce(
      mockSetDraftReceiverContactDetailResponse,
    );
    const value: UkwmContact = {
      organisationName: 'Org name',
      fullName: 'John Doe',
      emailAddress: 'john.doe@example.com',
      phoneNumber: '123-456-7890',
    };

    await subject.setDraftReceiverContactDetail({ id, accountId }, value, true);

    expect(mockClient.setDraftReceiverContactDetail).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
    expect(mockClient.setDraftReceiverContactDetail).toHaveBeenCalledTimes(1);
    expect(mockClient.setDraftReceiverContactDetail).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
  });

  it('gets receiver contact detail from a draft', async () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const mockGetDraftReceiverContactDetailResponse: GetDraftReceiverContactDetailsResponse =
      {
        success: true,
        value: {
          status: 'Started',
          organisationName: 'Org name',
          fullName: 'Mathew Jones',
          emailAddress: 'john.doe@example.com',
          phoneNumber: '123-456-7890',
        },
      };

    mockClient.getDraftReceiverContactDetail.mockResolvedValueOnce(
      mockGetDraftReceiverContactDetailResponse,
    );

    const result = await subject.getDraftReceiverContactDetail({
      id,
      accountId,
    });

    expect(mockClient.getDraftReceiverContactDetail).toHaveBeenCalledWith({
      id,
      accountId,
    });
    expect(result).toEqual(mockGetDraftReceiverContactDetailResponse.value);
  });
});
