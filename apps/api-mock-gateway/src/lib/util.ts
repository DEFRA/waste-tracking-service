import { v4 as uuidv4 } from 'uuid';
import { draft, template } from '@wts/api/green-list-waste-export';
import { TemplateWithAccount } from '../db';

export function setSubmissionConfirmationStatus(
  submission: draft.DraftSubmission,
): draft.DraftSubmission['submissionConfirmation'] {
  const {
    id,
    reference,
    submissionConfirmation,
    submissionDeclaration,
    submissionState,
    ...filteredValues
  } = submission;

  if (
    Object.entries(filteredValues).every(
      ([key, value]) =>
        key === 'accountId' || (value.status && value.status === 'Complete'),
    )
  ) {
    return { status: 'NotStarted' };
  } else {
    return { status: 'CannotStart' };
  }
}

export function setSubmissionDeclarationStatus(
  submission: draft.DraftSubmission,
): draft.DraftSubmission['submissionDeclaration'] {
  if (submission.submissionConfirmation.status === 'Complete') {
    return { status: 'NotStarted' };
  } else {
    return { status: 'CannotStart' };
  }
}

export function copyCarriersNoTransport(
  sourceCarriers: draft.DraftCarriers,
  isSmallWaste: boolean,
): draft.DraftCarriers {
  let targetCarriers: draft.DraftCarriers = {
    status: 'NotStarted',
    transport: true,
  };

  if (sourceCarriers.status !== 'NotStarted') {
    const carriers = sourceCarriers.values.map((c) => {
      return {
        id: uuidv4(),
        addressDetails: c.addressDetails,
        contactDetails: c.contactDetails,
      };
    });

    const status = isSmallWaste ? sourceCarriers.status : 'Started';
    if (status === 'Complete') {
      targetCarriers = {
        status: status,
        transport: true,
        values: carriers as draft.DraftCarrier[],
      };
    } else {
      targetCarriers = {
        status: status,
        transport: true,
        values: carriers as draft.DraftCarrierPartial[],
      };
    }
  }

  return targetCarriers;
}

export function setBaseWasteDescription(
  draftWasteDescription: draft.DraftWasteDescription,
  draftCarriers: draft.DraftCarriers,
  draftRecoveryFacilityDetail: draft.DraftRecoveryFacilityDetails,
  value: draft.DraftWasteDescription,
): {
  wasteDescription: draft.DraftWasteDescription;
  carriers: draft.DraftCarriers;
  recoveryFacilityDetail: draft.DraftRecoveryFacilityDetails;
} {
  let recoveryFacilityDetail: draft.DraftSubmission['recoveryFacilityDetail'] =
    draftRecoveryFacilityDetail.status === 'CannotStart' &&
    value.status !== 'NotStarted' &&
    value.wasteCode !== undefined
      ? { status: 'NotStarted' }
      : draftRecoveryFacilityDetail;

  let carriers: draft.DraftSubmission['carriers'] = draftCarriers;

  if (
    draftWasteDescription.status === 'NotStarted' &&
    value.status !== 'NotStarted' &&
    value.wasteCode?.type === 'NotApplicable'
  ) {
    carriers.transport = false;
  }

  if (isWasteCodeChangingBulkToSmall(draftWasteDescription, value)) {
    if (value.status === 'Started') {
      value.ewcCodes = undefined;
      value.nationalCode = undefined;
      value.description = undefined;
    }

    carriers = { status: 'NotStarted', transport: false };

    recoveryFacilityDetail = { status: 'NotStarted' };
  }

  if (isWasteCodeChangingSmallToBulk(draftWasteDescription, value)) {
    if (value.status === 'Started') {
      value.ewcCodes = undefined;
      value.nationalCode = undefined;
      value.description = undefined;
    }

    carriers = { status: 'NotStarted', transport: true };

    recoveryFacilityDetail = { status: 'NotStarted' };
  }

  if (
    isWasteCodeChangingBulkToBulkDifferentType(draftWasteDescription, value)
  ) {
    if (value.status === 'Started') {
      value.ewcCodes = undefined;
      value.nationalCode = undefined;
      value.description = undefined;
    }

    carriers = { status: 'NotStarted', transport: true };

    recoveryFacilityDetail = { status: 'NotStarted' };
  }

  if (isWasteCodeChangingBulkToBulkSameType(draftWasteDescription, value)) {
    if (value.status === 'Started') {
      value.ewcCodes = undefined;
      value.nationalCode = undefined;
      value.description = undefined;
    }

    if (draftCarriers.status !== 'NotStarted') {
      carriers = {
        status: 'Started',
        transport: true,
        values: draftCarriers.values,
      };
    }

    if (
      draftRecoveryFacilityDetail.status === 'Started' ||
      draftRecoveryFacilityDetail.status === 'Complete'
    ) {
      recoveryFacilityDetail = {
        status: 'Started',
        values: draftRecoveryFacilityDetail.values,
      };
    }
  }

  draftWasteDescription = value;
  draftCarriers = carriers;
  draftRecoveryFacilityDetail = recoveryFacilityDetail;

  return {
    wasteDescription: draftWasteDescription,
    carriers: draftCarriers,
    recoveryFacilityDetail: draftRecoveryFacilityDetail,
  };
}

export function isWasteCodeChangingBulkToSmall(
  currentWasteDescription: draft.DraftWasteDescription,
  newWasteDescription: draft.DraftWasteDescription,
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    newWasteDescription.wasteCode?.type === 'NotApplicable'
  );
}

export function isWasteCodeChangingSmallToBulk(
  currentWasteDescription: draft.DraftWasteDescription,
  newWasteDescription: draft.DraftWasteDescription,
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type === 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    newWasteDescription.wasteCode?.type !== 'NotApplicable'
  );
}

export function isWasteCodeChangingBulkToBulkDifferentType(
  currentWasteDescription: draft.DraftWasteDescription,
  newWasteDescription: draft.DraftWasteDescription,
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    newWasteDescription.wasteCode?.type !== 'NotApplicable' &&
    currentWasteDescription.wasteCode?.type !==
      newWasteDescription.wasteCode?.type
  );
}

export function isWasteCodeChangingBulkToBulkSameType(
  currentWasteDescription: draft.DraftWasteDescription,
  newWasteDescription: draft.DraftWasteDescription,
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type ===
      newWasteDescription.wasteCode?.type &&
    currentWasteDescription.wasteCode?.code !==
      newWasteDescription.wasteCode?.code
  );
}

export function paginateArray<T>(
  array: T[],
  pageSize: number,
  pageNumber: number,
): T[] {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

export function doesTemplateAlreadyExist(
  values: TemplateWithAccount[],
  accountId: string,
  templateName: string,
): boolean {
  let exists = false;
  const templates: template.Template[] = values.filter(
    (template) => template.accountId === accountId,
  );

  templates.map((template) => {
    if (template.templateDetails.name === templateName) {
      exists = true;
      return;
    }
  });
  return exists;
}
