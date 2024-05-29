import { DaprServer, HttpMethod, LogLevel } from '@dapr/dapr';
import Boom from '@hapi/boom';
import * as api from '@wts/api/uk-waste-movements';
import { LoggerService } from '@wts/util/dapr-winston-logging';
import { fromBoom } from '@wts/util/invocation';
import * as winston from 'winston';
import { SubmissionController, validateSubmission } from './controller';
import { DaprReferenceDataClient } from '@wts/client/reference-data';
import {
  GetEWCCodesResponse,
  GetHazardousCodesResponse,
  GetLocalAuthoritiesResponse,
  GetPopsResponse,
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
    process.env['REFERENCE_DATA_APP_ID'] || 'service-reference-data'
  );

  let hazardousCodesResponse: GetHazardousCodesResponse;
  let popsResponse: GetPopsResponse;
  let ewcCodesResponse: GetEWCCodesResponse;
  let localAuthoritiesResponse: GetLocalAuthoritiesResponse;

  try {
    hazardousCodesResponse = await referenceDataClient.getHazardousCodes();
    popsResponse = await referenceDataClient.getPops();
    ewcCodesResponse = await referenceDataClient.getEWCCodes({
      includeHazardous: true,
    });
    localAuthoritiesResponse = await referenceDataClient.getLocalAuthorities();
  } catch (error) {
    logger.error(error);
    throw new Error('Failed to get reference datasets');
  }

  if (
    !hazardousCodesResponse.success ||
    !popsResponse.success ||
    !ewcCodesResponse.success ||
    !localAuthoritiesResponse.success
  ) {
    throw new Error('Failed to get reference datasets');
  }

  const hazardousCodes = hazardousCodesResponse.value;
  const pops = popsResponse.value;
  const ewcCodes = ewcCodesResponse.value;
  const localAuthorities = localAuthoritiesResponse.value;

  const aadCredentials = new ChainedTokenCredential(
    new AzureCliCredential(),
    new WorkloadIdentityCredential()
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
    logger
  );

  const submissionController = new SubmissionController(repository, logger, {
    hazardousCodes,
    pops,
    ewcCodes,
    localAuthorities,
  });

  await server.invoker.listen(
    api.validateSubmissions.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(body) as api.ValidateSubmissionsRequest;
      if (!validateSubmission.validateSubmissionsRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await submissionController.validateSubmissions(request);
    },
    { method: HttpMethod.POST }
  );

  await server.invoker.listen(
    api.createSubmissions.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(body) as api.CreateSubmissionsRequest;
      if (!validateSubmission.validateCreateSubmissionsRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await submissionController.createSubmissions(request);
    },
    { method: HttpMethod.POST }
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
    { method: HttpMethod.POST }
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
    { method: HttpMethod.POST }
  );

  await server.start();
} catch (error) {
  console.log('Error occurred while starting the service.');
  logger.info('Error occurred while starting the service.');
  console.error(error);
  logger.error(error);
}
