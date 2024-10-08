import { DaprServer, HttpMethod, LogLevel } from '@dapr/dapr';
import Boom from '@hapi/boom';
import * as api from '@wts/api/uk-waste-movements';
import { LoggerService } from '@wts/util/dapr-winston-logging';
import { fromBoom } from '@wts/util/invocation';
import * as winston from 'winston';
import { SubmissionController, validateSubmission } from './controller/draft';
import { DaprReferenceDataClient } from '@wts/client/reference-data';
import {
  GetEWCCodesResponse,
  GetHazardousCodesResponse,
  GetLocalAuthoritiesResponse,
  GetPopsResponse,
  GetSICCodesResponse,
} from '@wts/api/reference-data';
import { CosmosClient } from '@azure/cosmos';
import { CosmosRepository } from './data';
import {
  AzureCliCredential,
  ChainedTokenCredential,
  WorkloadIdentityCredential,
} from '@azure/identity';
import { DbContainerNameKey } from './model';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { appId: process.env['APP_ID'] || 'service-uk-waste-movements' },
  transports: [new winston.transports.Console()],
});

async function init() {
  try {
    if (!process.env['COSMOS_DB_ACCOUNT_URI']) {
      throw new Error('Missing COSMOS_DB_ACCOUNT_URI configuration.');
    }

    const server = new DaprServer({
      serverHost: '127.0.0.1',
      clientOptions: {
        daprHost: '127.0.0.1',
      },
      logger: {
        level: LogLevel.Info,
        service: new LoggerService(logger),
      },
    });

    const referenceDataClient = new DaprReferenceDataClient(
      server.client,
      process.env['REFERENCE_DATA_APP_ID'] || 'service-reference-data',
    );

    let hazardousCodesResponse: GetHazardousCodesResponse;
    let popsResponse: GetPopsResponse;
    let ewcCodesResponse: GetEWCCodesResponse;
    let localAuthoritiesResponse: GetLocalAuthoritiesResponse;
    let sicCodesResponse: GetSICCodesResponse;

    try {
      hazardousCodesResponse = await referenceDataClient.getHazardousCodes();
      popsResponse = await referenceDataClient.getPops();
      ewcCodesResponse = await referenceDataClient.getEWCCodes({
        includeHazardous: true,
      });
      localAuthoritiesResponse =
        await referenceDataClient.getLocalAuthorities();
      sicCodesResponse = await referenceDataClient.getSICCodes();
    } catch (error) {
      logger.error(error);
      throw new Error('Failed to get reference datasets');
    }

    if (
      !hazardousCodesResponse.success ||
      !popsResponse.success ||
      !ewcCodesResponse.success ||
      !localAuthoritiesResponse.success ||
      !sicCodesResponse.success
    ) {
      throw new Error('Failed to get reference datasets');
    }

    const aadCredentials = new ChainedTokenCredential(
      new AzureCliCredential(),
      new WorkloadIdentityCredential(),
    );

    const dbClient = new CosmosClient({
      endpoint: process.env['COSMOS_DB_ACCOUNT_URI'],
      aadCredentials,
    });

    const cosmosContainerMap = new Map<DbContainerNameKey, string>([
      ['drafts', process.env['COSMOS_DRAFTS_CONTAINER_NAME'] || 'drafts'],
    ]);

    const repository = new CosmosRepository(
      dbClient,
      process.env['COSMOS_DATABASE_NAME'] || 'uk-waste-movements',
      cosmosContainerMap,
      logger,
    );

    const submissionController = new SubmissionController(repository, logger, {
      hazardousCodes: hazardousCodesResponse.value,
      pops: popsResponse.value,
      ewcCodes: ewcCodesResponse.value,
      localAuthorities: localAuthoritiesResponse.value,
      sicCodes: sicCodesResponse.value,
    });

    await server.invoker.listen(
      api.validateMultipleDrafts.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }

        const request = JSON.parse(body) as api.ValidateMultipleDraftsRequest;
        if (!validateSubmission.validateMultipleDraftsRequest(request)) {
          return fromBoom(Boom.badRequest());
        }

        return await submissionController.validateMultipleDrafts(request);
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.createMultipleDrafts.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }

        const request = JSON.parse(body) as api.CreateMultipleDraftsRequest;
        if (!validateSubmission.validateCreateMultipleDraftsRequest(request)) {
          return fromBoom(Boom.badRequest());
        }

        return await submissionController.createMultipleDrafts(request);
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.getDraft.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }
        const request = JSON.parse(body) as api.GetDraftRequest;
        if (request == undefined) {
          return fromBoom(Boom.badRequest());
        }

        return await submissionController.getDraft(request);
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.getDrafts.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }
        const request = JSON.parse(body) as api.GetDraftsRequest;
        if (request == undefined) {
          return fromBoom(Boom.badRequest());
        }

        if (!validateSubmission.validateGetDraftsRequest(request)) {
          return fromBoom(Boom.badRequest());
        }

        return await submissionController.getDrafts(request);
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.createDraft.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }

        const request = JSON.parse(body) as api.CreateDraftRequest;
        if (!validateSubmission.validateCreateDraftsRequest(request)) {
          return fromBoom(Boom.badRequest());
        }

        return await submissionController.createDraft(request);
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.setDraftProducerAddressDetails.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }

        const request = JSON.parse(
          body,
        ) as api.SetDraftProducerAddressDetailsRequest;

        if (!request.saveAsDraft) {
          if (
            !validateSubmission.validateSetDraftProducerAddressDetailsRequest(
              request,
            )
          ) {
            return fromBoom(Boom.badRequest());
          }
        } else {
          if (
            !validateSubmission.validateSetPartialDraftProducerAddressDetailsRequest(
              request,
            )
          ) {
            return fromBoom(Boom.badRequest());
          }
        }

        return await submissionController.setDraftProducerAddressDetails(
          request,
        );
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.getDraftProducerAddressDetails.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }
        const request = JSON.parse(
          body,
        ) as api.GetDraftProducerAddressDetailsRequest;
        if (request == undefined) {
          return fromBoom(Boom.badRequest());
        }

        if (
          !validateSubmission.validateGetDraftProducerAddressDetailsRequest(
            request,
          )
        ) {
          return fromBoom(Boom.badRequest());
        }

        return await submissionController.getDraftProducerAddressDetails(
          request,
        );
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.getDraftWasteCollectionAddressDetails.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }
        const request = JSON.parse(
          body,
        ) as api.GetDraftWasteCollectionAddressDetailsRequest;
        if (request == undefined) {
          return fromBoom(Boom.badRequest());
        }

        if (
          !validateSubmission.validateGetDraftWasteCollectionAddressDetailsRequest(
            request,
          )
        ) {
          return fromBoom(Boom.badRequest());
        }

        return await submissionController.getDraftWasteCollectionAddressDetails(
          request,
        );
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.setDraftWasteCollectionAddressDetails.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }

        const request = JSON.parse(
          body,
        ) as api.SetDraftWasteCollectionAddressDetailsRequest;

        if (!request.saveAsDraft) {
          if (
            !validateSubmission.validateSetDraftWasteCollectionAddressDetailsRequest(
              request,
            )
          ) {
            return fromBoom(Boom.badRequest());
          }
        } else {
          if (
            !validateSubmission.validateSetPartialDraftWasteCollectionAddressDetailsRequest(
              request,
            )
          ) {
            return fromBoom(Boom.badRequest());
          }
        }

        return await submissionController.setDraftWasteCollectionAddressDetails(
          request,
        );
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.getDraftProducerContactDetail.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }

        const request = JSON.parse(
          body,
        ) as api.GetDraftProducerContactDetailRequest;
        if (request === undefined) {
          return fromBoom(Boom.badRequest());
        }

        return await submissionController.getDraftProducerContactDetail(
          request,
        );
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.setDraftProducerContactDetail.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }
        const request = JSON.parse(
          body,
        ) as api.SetDraftProducerContactDetailRequest;
        if (request.saveAsDraft) {
          if (
            !validateSubmission.validateSetPartialDraftProducerContactDetailRequest(
              request,
            )
          ) {
            return fromBoom(Boom.badRequest());
          }
        } else {
          if (
            !validateSubmission.validateSetDraftProducerContactDetailRequest(
              request,
            )
          ) {
            return fromBoom(Boom.badRequest());
          }
        }
        return await submissionController.setDraftProducerContactDetail(
          request,
        );
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.getDraftWasteSource.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }

        const request = JSON.parse(body) as api.GetDraftWasteSourceRequest;
        if (request === undefined) {
          return fromBoom(Boom.badRequest());
        }

        if (!validateSubmission.validateGetDraftWasteSourceRequest(request)) {
          return fromBoom(Boom.badRequest());
        }

        return await submissionController.getDraftWasteSource(request);
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.setDraftWasteSource.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }
        const request = JSON.parse(body) as api.SetDraftWasteSourceRequest;
        if (!validateSubmission.validateSetDraftWasteSourceRequest(request)) {
          return fromBoom(Boom.badRequest());
        }
        return await submissionController.setDraftWasteSource(request);
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.createDraftSicCode.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }
        const request = JSON.parse(body) as api.CreateDraftSicCodeRequest;

        if (!validateSubmission.validateCreateDraftSicCodeRequest(request)) {
          return fromBoom(Boom.badRequest());
        }

        return await submissionController.createDraftSicCode(request);
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.getDraftSicCodes.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }

        const request = JSON.parse(body) as api.GetDraftSicCodesRequest;
        if (request === undefined) {
          return fromBoom(Boom.badRequest());
        }

        if (!validateSubmission.validateGetDraftSicCodesRequest(request)) {
          return fromBoom(Boom.badRequest());
        }

        return await submissionController.getDraftSicCodes(request);
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.getDraftCarrierAddressDetails.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }
        const request = JSON.parse(
          body,
        ) as api.GetDraftCarrierAddressDetailsRequest;
        if (request == undefined) {
          return fromBoom(Boom.badRequest());
        }

        if (
          !validateSubmission.validateGetDraftCarrierAddressDetailsRequest(
            request,
          )
        ) {
          return fromBoom(Boom.badRequest());
        }

        return await submissionController.getDraftCarrierAddressDetails(
          request,
        );
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.setDraftCarrierAddressDetails.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }

        const request = JSON.parse(
          body,
        ) as api.SetDraftCarrierAddressDetailsRequest;

        if (!request.saveAsDraft) {
          if (
            !validateSubmission.validateSetDraftCarrierAddressDetailsRequest(
              request,
            )
          ) {
            return fromBoom(Boom.badRequest());
          }
        } else {
          if (
            !validateSubmission.validateSetPartialDraftCarrierAddressDetailsRequest(
              request,
            )
          ) {
            return fromBoom(Boom.badRequest());
          }
        }

        return await submissionController.setDraftCarrierAddressDetails(
          request,
        );
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.getDraftCarrierContactDetail.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }

        const request = JSON.parse(
          body,
        ) as api.GetDraftCarrierContactDetailRequest;
        if (request === undefined) {
          return fromBoom(Boom.badRequest());
        }

        return await submissionController.getDraftCarrierContactDetail(request);
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.setDraftCarrierContactDetail.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }
        const request = JSON.parse(
          body,
        ) as api.SetDraftCarrierContactDetailRequest;
        if (request.saveAsDraft) {
          if (
            !validateSubmission.validateSetPartialDraftCarrierContactDetailRequest(
              request,
            )
          ) {
            return fromBoom(Boom.badRequest());
          }
        } else {
          if (
            !validateSubmission.validateSetDraftCarrierContactDetailRequest(
              request,
            )
          ) {
            return fromBoom(Boom.badRequest());
          }
        }
        return await submissionController.setDraftCarrierContactDetail(request);
      },
      { method: HttpMethod.POST },
    );
    await server.invoker.listen(
      api.getDraftReceiverAddressDetails.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }
        const request = JSON.parse(
          body,
        ) as api.GetDraftReceiverAddressDetailsRequest;
        if (request == undefined) {
          return fromBoom(Boom.badRequest());
        }

        if (
          !validateSubmission.validateGetDraftReceiverAddressDetailsRequest(
            request,
          )
        ) {
          return fromBoom(Boom.badRequest());
        }

        return await submissionController.getDraftReceiverAddressDetails(
          request,
        );
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.setDraftReceiverAddressDetails.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }

        const request = JSON.parse(
          body,
        ) as api.SetDraftReceiverAddressDetailsRequest;

        if (!request.saveAsDraft) {
          if (
            !validateSubmission.validateSetDraftReceiverAddressDetailsRequest(
              request,
            )
          ) {
            return fromBoom(Boom.badRequest());
          }
        } else {
          if (
            !validateSubmission.validateSetPartialDraftReceiverAddressDetailsRequest(
              request,
            )
          ) {
            return fromBoom(Boom.badRequest());
          }
        }

        return await submissionController.setDraftReceiverAddressDetails(
          request,
        );
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.deleteDraftSicCode.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }

        const request = JSON.parse(body) as api.DeleteDraftSicCodeRequest;

        if (request === undefined) {
          return fromBoom(Boom.badRequest());
        }

        if (!validateSubmission.validateDeleteDraftSicCodeRequest(request)) {
          return fromBoom(Boom.badRequest());
        }

        return await submissionController.deleteDraftSicCode(request);
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.setDraftProducerConfirmation.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }
        const request = JSON.parse(
          body,
        ) as api.SetDraftProducerConfirmationRequest;

        if (!validateSubmission.setDraftProducerConfirmationRequest(request)) {
          return fromBoom(Boom.badRequest());
        }

        return await submissionController.setDraftProducerConfirmation(request);
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.getDraftReceiverContactDetail.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }

        const request = JSON.parse(
          body,
        ) as api.GetDraftReceiverContactDetailsRequest;
        if (request === undefined) {
          return fromBoom(Boom.badRequest());
        }

        if (
          !validateSubmission.validateGetDraftReceiverContactDetailRequest(
            request,
          )
        ) {
          return fromBoom(Boom.badRequest());
        }

        return await submissionController.getDraftReceiverContactDetail(
          request,
        );
      },
      { method: HttpMethod.POST },
    );

    await server.invoker.listen(
      api.setDraftReceiverContactDetail.name,
      async ({ body }) => {
        if (body === undefined) {
          return fromBoom(Boom.badRequest('Missing body'));
        }
        const request = JSON.parse(
          body,
        ) as api.SetDraftReceiverContactDetailsRequest;
        if (request.saveAsDraft) {
          if (
            !validateSubmission.validateSetPartialDraftReceiverContactDetailRequest(
              request,
            )
          ) {
            return fromBoom(Boom.badRequest());
          }
        } else {
          if (
            !validateSubmission.validateSetDraftReceiverContactDetailRequest(
              request,
            )
          ) {
            return fromBoom(Boom.badRequest());
          }
        }
        return await submissionController.setDraftReceiverContactDetail(
          request,
        );
      },
      { method: HttpMethod.POST },
    );

    await server.start();
  } catch (error) {
    console.log('Error occurred while starting the service.');
    logger.info('Error occurred while starting the service.');
    console.error(error);
    logger.error(error);
  }
}

init();
