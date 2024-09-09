import Boom from '@hapi/boom';
import {
  template as api,
  draft,
  validation,
} from '@wts/api/green-list-waste-export';
import { fromBoom, success } from '@wts/util/invocation';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import {
  DraftCarriers,
  Template,
  DraftCarrierPartial,
  DraftCarrier,
  DraftRecoveryFacility,
  DraftRecoveryFacilityPartial,
  DraftRecoveryFacilityDetails,
  DraftSubmission,
  Submission,
  FieldFormatError,
} from '../../model';
import {
  setBaseWasteDescription,
  copyCarriersNoTransport,
} from '../../lib/util';
import { CosmosRepository } from '../../data';
import { glwe } from '@wts/util/shared-validation';
import { WasteCode, WasteCodeType } from '@wts/api/reference-data';
import { glwe as glwValidation } from '@wts/util/shared-validation';
import { Country } from '@wts/api/reference-data';

export type Handler<Request, Response> = (
  request: Request,
) => Promise<Response>;

const draftContainerName = 'drafts';
const submissionContainerName = 'submissions';
const templateContainerName = 'templates';

export default class TemplateController {
  constructor(
    private repository: CosmosRepository,
    private wasteCodeList: WasteCodeType[],
    private ewcCodeList: WasteCode[],
    private countryList: Country[],
    private logger: Logger,
  ) {}

  getTemplate: Handler<api.GetTemplateRequest, api.GetTemplateResponse> =
    async ({ id, accountId }) => {
      try {
        return success(
          (await this.repository.getRecord(
            templateContainerName,
            id,
            accountId,
          )) as Template,
        );
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  getTemplates: Handler<api.GetTemplatesRequest, api.GetTemplatesResponse> =
    async ({ accountId, order, pageLimit, token }) => {
      try {
        return success(
          await this.repository.getRecords(
            templateContainerName,
            accountId,
            order,
            pageLimit,
            token,
          ),
        ) as api.GetTemplatesResponse;
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  getNumberOfTemplates: Handler<
    api.GetNumberOfTemplatesRequest,
    api.GetNumberOfTemplatesResponse
  > = async ({ accountId }) => {
    try {
      return success(
        await this.repository.getTotalNumber(templateContainerName, accountId),
      ) as api.GetNumberOfTemplatesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createTemplate: Handler<
    api.CreateTemplateRequest,
    api.CreateTemplateResponse
  > = async ({ accountId, templateDetails }) => {
    if (
      !templateDetails.name ||
      templateDetails.name.length < validation.TemplateNameChar.min ||
      templateDetails.name.length > validation.TemplateNameChar.max ||
      !validation.templateNameRegex.test(templateDetails.name)
    ) {
      return fromBoom(
        Boom.badRequest(
          `Template name must be unique and between ${validation.TemplateNameChar.min} and ${validation.TemplateNameChar.max} alphanumeric characters.`,
        ),
      );
    }
    if (
      templateDetails.description &&
      templateDetails.description.length >
        validation.TemplateDescriptionChar.max
    ) {
      return fromBoom(
        Boom.badRequest(
          `Template description cannot exceed ${validation.TemplateDescriptionChar.max} characters.`,
        ),
      );
    }

    try {
      const template: Template = {
        id: uuidv4(),
        templateDetails: {
          name: templateDetails.name,
          description: templateDetails.description,
          created: new Date(),
          lastModified: new Date(),
        },
        wasteDescription: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
      };

      await this.repository.saveRecord(
        templateContainerName,
        template,
        accountId,
      );
      return success(template);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  updateTemplate: Handler<
    api.UpdateTemplateRequest,
    api.UpdateTemplateResponse
  > = async ({ accountId, id, templateDetails }) => {
    if (
      !templateDetails.name ||
      templateDetails.name.length < validation.TemplateNameChar.min ||
      templateDetails.name.length > validation.TemplateNameChar.max ||
      !validation.templateNameRegex.test(templateDetails.name)
    ) {
      return fromBoom(
        Boom.badRequest(
          `Template name must be unique and between ${validation.TemplateNameChar.min} and ${validation.TemplateNameChar.max} alphanumeric characters.`,
        ),
      );
    }
    if (
      templateDetails.description &&
      templateDetails.description.length >
        validation.TemplateDescriptionChar.max
    ) {
      return fromBoom(
        Boom.badRequest(
          `Template description cannot exceed ${validation.TemplateDescriptionChar.max} characters.`,
        ),
      );
    }

    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;

      if (
        template.templateDetails.name !== templateDetails.name ||
        template.templateDetails.description !== templateDetails.description
      ) {
        template.templateDetails.description = templateDetails.description;
        template.templateDetails.lastModified = new Date();
        template.templateDetails.name = templateDetails.name;
        await this.repository.saveRecord(
          templateContainerName,
          template,
          accountId,
        );
      }

      return success(template);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  deleteTemplate: Handler<
    api.DeleteTemplateRequest,
    api.DeleteTemplateResponse
  > = async ({ id, accountId }) => {
    try {
      await this.repository.deleteRecord(templateContainerName, id, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplateWasteDescription: Handler<
    draft.GetDraftWasteDescriptionRequest,
    draft.GetDraftWasteDescriptionResponse
  > = async ({ id, accountId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      return success(template.wasteDescription);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateWasteDescription: Handler<
    draft.SetDraftWasteDescriptionRequest,
    draft.SetDraftCustomerReferenceResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'NotStarted') {
        const errors = {
          fieldFormatErrors: [] as FieldFormatError[],
        };
        if (value.wasteCode) {
          if (
            value.status === 'Complete' &&
            value.wasteCode.type !== 'NotApplicable' &&
            !('code' in value.wasteCode)
          ) {
            const wasteCodeValidationResult =
              glwe.validationRules.validateWasteCode(
                '',
                value.wasteCode.type,
                this.wasteCodeList,
              );
            if (!wasteCodeValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...wasteCodeValidationResult.error.fieldFormatErrors,
              );
            } else {
              value.wasteCode = wasteCodeValidationResult.value;
            }
          } else if (
            'code' in value.wasteCode &&
            typeof value.wasteCode.code === 'string'
          ) {
            const wasteCodeValidationResult =
              glwe.validationRules.validateWasteCode(
                value.wasteCode.code,
                value.wasteCode.type,
                this.wasteCodeList,
              );

            if (!wasteCodeValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...wasteCodeValidationResult.error.fieldFormatErrors,
              );
            } else {
              value.wasteCode = wasteCodeValidationResult.value;
            }
          } else {
            value.wasteCode = {
              type: value.wasteCode.type,
            };
          }
        }

        if (value.ewcCodes) {
          const ewcCodesValidationResult =
            glwe.validationRules.validateEwcCodes(
              value.ewcCodes.map((e) => e.code),
              this.ewcCodeList,
            );

          if (!ewcCodesValidationResult.valid) {
            errors.fieldFormatErrors.push(
              ...ewcCodesValidationResult.error.fieldFormatErrors,
            );
          } else {
            value.ewcCodes = ewcCodesValidationResult.value;
          }
        }

        if (value.nationalCode) {
          const nationalCodeValidationResult =
            glwe.validationRules.validateNationalCode(
              value.nationalCode.provided === 'Yes'
                ? value.nationalCode.value
                : undefined,
            );

          if (!nationalCodeValidationResult.valid) {
            errors.fieldFormatErrors.push(
              ...nationalCodeValidationResult.error.fieldFormatErrors,
            );
          } else {
            value.nationalCode = nationalCodeValidationResult.value;
          }
        }

        if (value.description) {
          const descriptionValidationResult =
            glwe.validationRules.validateWasteDecription(value.description);

          if (!descriptionValidationResult.valid) {
            errors.fieldFormatErrors.push(
              ...descriptionValidationResult.error.fieldFormatErrors,
            );
          } else {
            value.description = descriptionValidationResult.value;
          }
        }

        if (errors.fieldFormatErrors.length > 0) {
          return fromBoom(Boom.badRequest('Validation failed', errors));
        }
      }

      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;

      const submissionBase = setBaseWasteDescription(
        template.wasteDescription,
        template.carriers,
        template.recoveryFacilityDetail,
        value,
      );

      template.wasteDescription = submissionBase.wasteDescription;
      template.carriers = submissionBase.carriers;
      template.recoveryFacilityDetail = submissionBase.recoveryFacilityDetail;

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        {
          ...template,
        },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplateExporterDetail: Handler<
    draft.GetDraftExporterDetailRequest,
    draft.GetDraftExporterDetailResponse
  > = async ({ id, accountId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      return success(template.exporterDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateExporterDetail: Handler<
    draft.SetDraftExporterDetailRequest,
    draft.SetDraftExporterDetailResponse
  > = async ({ id, accountId, value }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;

      template.exporterDetail = value;

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplateImporterDetail: Handler<
    draft.GetDraftImporterDetailRequest,
    draft.GetDraftImporterDetailResponse
  > = async ({ id, accountId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      return success(template.importerDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateImporterDetail: Handler<
    draft.SetDraftImporterDetailRequest,
    draft.SetDraftImporterDetailResponse
  > = async ({ id, accountId, value }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      template.importerDetail = value;
      template.templateDetails.lastModified = new Date();

      if (
        (template.transitCountries.status === 'Complete' ||
          template.transitCountries.status === 'Started') &&
        (value.status === 'Complete' || value.status === 'Started')
      ) {
        const transitCountriesCrossValidationResult =
          glwe.validationRules.validateImporterDetailAndTransitCountriesCross(
            value,
            template.transitCountries.values,
          );
        if (!transitCountriesCrossValidationResult.valid) {
          const boom = Boom.badRequest(
            'Validation failed',
            transitCountriesCrossValidationResult.error,
          );
          return fromBoom(boom);
        }
      }

      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  listTemplateCarriers: Handler<
    draft.ListDraftCarriersRequest,
    draft.ListDraftCarriersResponse
  > = async ({ id, accountId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      return success(template.carriers);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplateCarriers: Handler<
    draft.GetDraftCarriersRequest,
    draft.GetDraftCarriersResponse
  > = async ({ id, accountId, carrierId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      if (template.carriers.status === 'NotStarted') {
        return fromBoom(Boom.notFound());
      }

      const carrier = template.carriers.values.find((c) => {
        return c.id === carrierId;
      });

      if (carrier === undefined) {
        return fromBoom(Boom.notFound());
      }

      const value: DraftCarriers =
        template.carriers.status !== 'Complete'
          ? {
              status: template.carriers.status,
              transport: template.carriers.transport,
              values: [carrier as DraftCarrierPartial],
            }
          : {
              status: template.carriers.status,
              transport: template.carriers.transport,
              values: [carrier as DraftCarrier],
            };

      return success(value);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createTemplateCarriers: Handler<
    draft.CreateDraftCarriersRequest,
    draft.CreateDraftCarriersResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'Started') {
        return fromBoom(
          Boom.badRequest(
            `"Status cannot be ${value.status} on carrier detail creation"`,
          ),
        );
      }

      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      if (template === undefined) {
        return fromBoom(Boom.notFound());
      }

      if (template.carriers.status !== 'NotStarted') {
        if (template.carriers.values.length === validation.CarrierLength.max) {
          return fromBoom(
            Boom.badRequest(
              `Cannot add more than ${validation.CarrierLength.max} carriers`,
            ),
          );
        }
      }

      template.carriers.transport =
        template.wasteDescription.status !== 'NotStarted' &&
        template.wasteDescription.wasteCode?.type === 'NotApplicable'
          ? false
          : true;

      const uuid = uuidv4();

      if (template.carriers.status === 'NotStarted') {
        template.carriers = {
          status: 'Started',
          transport: template.carriers.transport,
          values: [{ id: uuid }],
        };
      } else {
        const carriers: DraftCarrierPartial[] = [];
        for (const c of template.carriers.values) {
          carriers.push(c);
        }
        carriers.push({ id: uuid });

        template.carriers = {
          status: 'Started',
          transport: template.carriers.transport,
          values: carriers,
        };
      }

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
      );

      return success({
        status: value.status,
        transport: template.carriers.transport,
        values: [{ id: uuid }],
      });
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateCarriers: Handler<
    draft.SetDraftCarriersRequest,
    draft.SetDraftCarriersResponse
  > = async ({ id, accountId, carrierId, value }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      if (template === undefined) {
        return fromBoom(Boom.notFound());
      }

      if (template.carriers.status === 'NotStarted') {
        return fromBoom(Boom.notFound());
      }

      if (value.status === 'NotStarted') {
        template.carriers = value;
      } else {
        const carrier = value.values.find((c) => {
          return c.id === carrierId;
        });
        if (carrier === undefined) {
          return fromBoom(Boom.badRequest());
        }

        const index = template.carriers.values.findIndex((c) => {
          return c.id === carrierId;
        });
        if (index === -1) {
          return fromBoom(Boom.notFound());
        }

        if (template.carriers !== undefined) {
          template.carriers.status = value.status;
          template.carriers.values[index] = carrier;
        }
      }

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  deleteTemplateCarriers: Handler<
    draft.DeleteDraftCarriersRequest,
    draft.DeleteDraftCarriersResponse
  > = async ({ id, accountId, carrierId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      if (template === undefined) {
        return fromBoom(Boom.notFound());
      }

      if (template.carriers.status === 'NotStarted') {
        return fromBoom(Boom.notFound());
      }

      const index = template.carriers.values.findIndex((c) => {
        return c.id === carrierId;
      });

      if (index === -1) {
        return fromBoom(Boom.notFound());
      }

      template.carriers.transport =
        template.wasteDescription.status !== 'NotStarted' &&
        template.wasteDescription.wasteCode?.type === 'NotApplicable'
          ? false
          : true;

      template.carriers.values.splice(index, 1);

      if (template.carriers.values.length === 0) {
        template.carriers = {
          status: 'NotStarted',
          transport: template.carriers.transport,
        };
      }

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplateCollectionDetail: Handler<
    draft.GetDraftCollectionDetailRequest,
    draft.GetDraftCollectionDetailResponse
  > = async ({ id, accountId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      return success(template.collectionDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateCollectionDetail: Handler<
    draft.SetDraftCollectionDetailRequest,
    draft.SetDraftCollectionDetailResponse
  > = async ({ id, accountId, value }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      template.collectionDetail = value;

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplateUkExitLocation: Handler<
    draft.GetDraftUkExitLocationRequest,
    draft.GetDraftUkExitLocationResponse
  > = async ({ id, accountId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      return success(template.ukExitLocation);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateUkExitLocation: Handler<
    draft.SetDraftUkExitLocationRequest,
    draft.SetDraftUkExitLocationResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status === 'Complete') {
        const ukExitLocationValidationResult =
          glwe.validationRules.validateUkExitLocation(
            'value' in value.exitLocation &&
              typeof value.exitLocation.value === 'string'
              ? value.exitLocation.value
              : undefined,
          );
        if (!ukExitLocationValidationResult.valid) {
          const boom = Boom.badRequest(
            'Validation failed',
            ukExitLocationValidationResult.error,
          );
          return fromBoom(boom);
        }
      }

      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;

      template.ukExitLocation = value;
      template.templateDetails.lastModified = new Date();

      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplateTransitCountries: Handler<
    draft.GetDraftTransitCountriesRequest,
    draft.GetDraftTransitCountriesResponse
  > = async ({ id, accountId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      return success(template.transitCountries);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateTransitCountries: Handler<
    draft.SetDraftTransitCountriesRequest,
    draft.SetDraftTransitCountriesResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status === 'Started' || value.status === 'Complete') {
        const transitCountriesValidationResult =
          glwValidation.validationRules.validateTransitCountries(
            this.countryList,
            value.values.toString().replace(/,/g, ';'),
          );
        if (!transitCountriesValidationResult.valid) {
          const boom = Boom.badRequest(
            'Validation failed',
            transitCountriesValidationResult.error,
          );
          return fromBoom(boom);
        }
      }
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      template.transitCountries = value;

      if (
        (template.importerDetail.status === 'Complete' ||
          template.importerDetail.status === 'Started') &&
        (value.status === 'Complete' || value.status === 'Started')
      ) {
        const transitCountriesCrossValidationResult =
          glwe.validationRules.validateImporterDetailAndTransitCountriesCross(
            template.importerDetail,
            value.values,
          );
        if (!transitCountriesCrossValidationResult.valid) {
          const boom = Boom.badRequest(
            'Validation failed',
            transitCountriesCrossValidationResult.error,
          );
          return fromBoom(boom);
        }
      }

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  listTemplateRecoveryFacilityDetails: Handler<
    draft.ListDraftRecoveryFacilityDetailsRequest,
    draft.ListDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      return success(template.recoveryFacilityDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplateRecoveryFacilityDetails: Handler<
    draft.GetDraftRecoveryFacilityDetailsRequest,
    draft.GetDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId, rfdId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      if (
        template.recoveryFacilityDetail.status !== 'Started' &&
        template.recoveryFacilityDetail.status !== 'Complete'
      ) {
        return fromBoom(Boom.notFound());
      }

      const recoveryFacilityDetail =
        template.recoveryFacilityDetail.values.find((c) => {
          return c.id === rfdId;
        });

      if (recoveryFacilityDetail === undefined) {
        return fromBoom(Boom.notFound());
      }

      const value: DraftRecoveryFacilityDetails =
        template.recoveryFacilityDetail.status !== 'Complete'
          ? {
              status: template.carriers.status as 'Started',
              values: [recoveryFacilityDetail as DraftRecoveryFacilityPartial],
            }
          : {
              status: template.carriers.status,
              values: [recoveryFacilityDetail as DraftRecoveryFacility],
            };

      return success(value);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createTemplateRecoveryFacilityDetails: Handler<
    draft.CreateDraftRecoveryFacilityDetailsRequest,
    draft.CreateDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'Started') {
        return fromBoom(
          Boom.badRequest(
            `"Status cannot be ${value.status} on recovery facility detail creation"`,
          ),
        );
      }

      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;

      if (template === undefined) {
        return fromBoom(Boom.notFound());
      }

      const uuid = uuidv4();

      if (
        template.recoveryFacilityDetail.status === 'Started' ||
        template.recoveryFacilityDetail.status === 'Complete'
      ) {
        const maxFacilities =
          validation.InterimSiteLength.max +
          validation.RecoveryFacilityLength.max;
        if (template.recoveryFacilityDetail.values.length === maxFacilities) {
          return fromBoom(
            Boom.badRequest(
              `Cannot add more than ${maxFacilities} recovery facilities (Maximum: ${validation.InterimSiteLength.max} InterimSite & ${validation.RecoveryFacilityLength.max} Recovery Facilities)`,
            ),
          );
        }

        const facilities: DraftRecoveryFacilityPartial[] = [];
        for (const rf of template.recoveryFacilityDetail.values) {
          facilities.push(rf);
        }
        facilities.push({ id: uuid });

        template.recoveryFacilityDetail = {
          status: 'Started',
          values: facilities,
        };
      } else {
        template.recoveryFacilityDetail = {
          status: 'Started',
          values: [{ id: uuid }],
        };
      }

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
      );

      return success(template.recoveryFacilityDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateRecoveryFacilityDetails: Handler<
    draft.SetDraftRecoveryFacilityDetailsRequest,
    draft.SetDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId, rfdId, value }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      if (template === undefined) {
        return fromBoom(Boom.notFound());
      }

      if (
        template.recoveryFacilityDetail.status !== 'Started' &&
        template.recoveryFacilityDetail.status !== 'Complete'
      ) {
        return fromBoom(Boom.notFound());
      }

      if (value.status === 'Started' || value.status === 'Complete') {
        const recoveryFacility = value.values.find((rf) => {
          return rf.id === rfdId;
        });

        if (recoveryFacility === undefined) {
          return fromBoom(Boom.badRequest());
        }
        const index = template.recoveryFacilityDetail.values.findIndex((rf) => {
          return rf.id === rfdId;
        });
        if (index === -1) {
          return fromBoom(Boom.notFound());
        }

        template.recoveryFacilityDetail.status = value.status;
        template.recoveryFacilityDetail.values[index] =
          recoveryFacility as DraftRecoveryFacility;
      }

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  deleteTemplateRecoveryFacilityDetails: Handler<
    draft.DeleteDraftRecoveryFacilityDetailsRequest,
    draft.DeleteDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId, rfdId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      if (template === undefined) {
        return fromBoom(Boom.notFound());
      }
      if (
        template.recoveryFacilityDetail.status !== 'Started' &&
        template.recoveryFacilityDetail.status !== 'Complete'
      ) {
        return fromBoom(Boom.notFound());
      }

      const index = template.recoveryFacilityDetail.values.findIndex((rf) => {
        return rf.id === rfdId;
      });

      if (index === -1) {
        return fromBoom(Boom.notFound());
      }

      template.recoveryFacilityDetail.values.splice(index, 1);
      if (template.recoveryFacilityDetail.values.length === 0) {
        template.recoveryFacilityDetail = { status: 'NotStarted' };
      }

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createDraftFromTemplate: Handler<
    api.CreateDraftFromTemplateRequest,
    draft.CreateDraftResponse
  > = async ({ id, accountId, reference }) => {
    try {
      if (reference.length > validation.ReferenceChar.max) {
        return fromBoom(
          Boom.badRequest(
            `Supplied reference cannot exceed ${validation.ReferenceChar.max} characters`,
          ),
        );
      }

      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;

      const draft: DraftSubmission = {
        id: uuidv4(),
        reference,
        wasteDescription: template.wasteDescription,
        wasteQuantity:
          template.wasteDescription.status === 'NotStarted'
            ? { status: 'CannotStart' }
            : { status: 'NotStarted' },
        exporterDetail: template.exporterDetail,
        importerDetail: template.importerDetail,
        collectionDate: { status: 'NotStarted' },
        carriers: copyCarriersNoTransport(
          template.carriers,
          template.wasteDescription.status === 'Complete' &&
            template.wasteDescription.wasteCode.type === 'NotApplicable',
        ),
        collectionDetail: template.collectionDetail,
        ukExitLocation: template.ukExitLocation,
        transitCountries: template.transitCountries,
        recoveryFacilityDetail: template.recoveryFacilityDetail,
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
      };

      await this.repository.saveRecord(draftContainerName, draft, accountId);

      return success(draft);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createTemplateFromSubmission: Handler<
    api.CreateTemplateFromSubmissionRequest,
    api.CreateTemplateResponse
  > = async ({ accountId, id, templateDetails }) => {
    if (
      !templateDetails.name ||
      templateDetails.name.length < validation.TemplateNameChar.min ||
      templateDetails.name.length > validation.TemplateNameChar.max ||
      !validation.templateNameRegex.test(templateDetails.name)
    ) {
      return fromBoom(
        Boom.badRequest(
          `Template name must be unique and between ${validation.TemplateNameChar.min} and ${validation.TemplateNameChar.max} alphanumeric characters.`,
        ),
      );
    }
    if (
      templateDetails.description &&
      templateDetails.description.length >
        validation.TemplateDescriptionChar.max
    ) {
      return fromBoom(
        Boom.badRequest(
          `Template description cannot exceed ${validation.TemplateDescriptionChar.max} characters.`,
        ),
      );
    }

    try {
      const submission = (await this.repository.getRecord(
        submissionContainerName,
        id,
        accountId,
      )) as Submission;

      const template: Template = {
        id: uuidv4(),
        templateDetails: {
          name: templateDetails.name,
          description: templateDetails.description,
          created: new Date(),
          lastModified: new Date(),
        },
        wasteDescription: {
          status: 'Complete',
          ...submission.wasteDescription,
        },
        exporterDetail: {
          status: 'Complete',
          ...submission.exporterDetail,
        },
        importerDetail: {
          status: 'Complete',
          ...submission.importerDetail,
        },
        carriers: copyCarriersNoTransport(
          {
            status: 'Complete',
            transport:
              submission.wasteDescription.wasteCode.type === 'NotApplicable',
            values: submission.carriers.map((c) => {
              return {
                id: uuidv4(),
                ...c,
              };
            }),
          },
          submission.wasteDescription.wasteCode.type === 'NotApplicable',
        ),
        collectionDetail: {
          status: 'Complete',
          ...submission.collectionDetail,
        },
        ukExitLocation: {
          status: 'Complete',
          exitLocation: submission.ukExitLocation,
        },
        transitCountries: {
          status: 'Complete',
          values: submission.transitCountries,
        },
        recoveryFacilityDetail: {
          status: 'Complete',
          values: submission.recoveryFacilityDetail.map((r) => {
            return {
              id: uuidv4(),
              ...r,
            };
          }),
        },
      };

      await this.repository.saveRecord(
        templateContainerName,
        template,
        accountId,
      );

      return success(template);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createTemplateFromTemplate: Handler<
    api.CreateTemplateFromTemplateRequest,
    api.CreateTemplateFromTemplateResponse
  > = async ({ accountId, id, templateDetails }) => {
    if (
      !templateDetails.name ||
      templateDetails.name.length < validation.TemplateNameChar.min ||
      templateDetails.name.length > validation.TemplateNameChar.max ||
      !validation.templateNameRegex.test(templateDetails.name)
    ) {
      return fromBoom(
        Boom.badRequest(
          `Template name must be unique and between ${validation.TemplateNameChar.min} and ${validation.TemplateNameChar.max} alphanumeric characters.`,
        ),
      );
    }
    if (
      templateDetails.description &&
      templateDetails.description.length >
        validation.TemplateDescriptionChar.max
    ) {
      return fromBoom(
        Boom.badRequest(
          `Template description cannot exceed ${validation.TemplateDescriptionChar.max} characters.`,
        ),
      );
    }

    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      const newTemplate: Template = {
        id: uuidv4(),
        templateDetails: {
          name: templateDetails.name,
          description: templateDetails.description,
          created: new Date(),
          lastModified: new Date(),
        },
        wasteDescription: template.wasteDescription,
        exporterDetail: template.exporterDetail,
        importerDetail: template.importerDetail,
        carriers: copyCarriersNoTransport(
          template.carriers,
          template.wasteDescription.status === 'Complete' &&
            template.wasteDescription.wasteCode.type === 'NotApplicable',
        ),
        collectionDetail: template.collectionDetail,
        ukExitLocation: template.ukExitLocation,
        transitCountries: template.transitCountries,
        recoveryFacilityDetail: template.recoveryFacilityDetail,
      };

      await this.repository.saveRecord(
        templateContainerName,
        newTemplate,
        accountId,
      );
      return success(newTemplate);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
