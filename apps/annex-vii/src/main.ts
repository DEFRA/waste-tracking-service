import { DaprServer, HttpMethod, LogLevel } from '@dapr/dapr';
import Boom from '@hapi/boom';
import * as api from '@wts/api/annex-vii';
import { LoggerService } from '@wts/util/dapr-winston-logging';
import { fromBoom } from '@wts/util/invocation';
import * as winston from 'winston';
import { DraftController, parse, validate } from './controller';
import { DaprDraftRepository } from './data';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { appId: process.env['APP_ID'] },
  transports: [new winston.transports.Console()],
});

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

const draftController = new DraftController(
  new DaprDraftRepository(
    server.client,
    logger,
    process.env['DAPR_DRAFT_STATE_STORE'] || 'drafts.state.annex-vii'
  ),
  logger
);

await server.invoker.listen(
  api.getDraftById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDrafts.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftsRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDrafts(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createDraft.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.createDraftRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.createDraft(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftCustomerReferenceById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftCustomerReferenceByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftCustomerReferenceById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftCustomerReferenceById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(
      body
    ) as api.SetDraftCustomerReferenceByIdRequest;
    if (!validate.setDraftCustomerReferenceByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftCustomerReferenceById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftWasteDescriptionById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftWasteDescriptionByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftWasteDescriptionById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftWasteDescriptionById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftWasteDescriptionByIdRequest;
    if (!validate.setDraftWasteDescriptionByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftWasteDescriptionById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftWasteQuantityById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftWasteQuantityByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftWasteQuantityById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftWasteQuantityById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftWasteQuantityByIdRequest;
    if (!validate.setDraftWasteQuantityByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftWasteQuantityById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftExporterDetailById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftExporterDetailByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftExporterDetailById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftExporterDetailById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftExporterDetailByIdRequest;
    if (!validate.setDraftExporterDetailByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftExporterDetailById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftImporterDetailById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftImporterDetailByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftImporterDetailById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftImporterDetailById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftImporterDetailByIdRequest;
    if (!validate.setDraftImporterDetailByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftImporterDetailById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftCollectionDateById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftCollectionDateByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftCollectionDateById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftCollectionDateById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftCollectionDateByIdRequest;
    if (!validate.setDraftCollectionDateByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftCollectionDateById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.listDraftCarriers.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.listDraftCarriersRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.listDraftCarriers(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftCarriers.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftCarriersRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftCarriers(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createDraftCarriers.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.CreateDraftCarriersRequest;
    if (!validate.createDraftCarriersRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.createDraftCarriers(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftCarriers.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftCarriersRequest;
    if (!validate.setDraftCarriersRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftCarriers(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.deleteDraftCarriers.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.deleteDraftCarriersRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.deleteDraftCarriers(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftCollectionDetail.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftCollectionDetailRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftCollectionDetail(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftCollectionDetail.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftCollectionDetailRequest;
    if (!validate.setDraftCollectionDetailRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftCollectionDetail(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftExitLocationById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftExitLocationByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftExitLocationById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftExitLocationById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftExitLocationByIdRequest;
    if (!validate.setDraftExitLocationByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftExitLocationById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftTransitCountries.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftTransitCountriesRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftTransitCountries(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftTransitCountries.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftTransitCountriesRequest;
    if (!validate.setDraftTransitCountriesRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftTransitCountries(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.listDraftRecoveryFacilityDetails.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.listDraftRecoveryFacilityDetailsRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.listDraftRecoveryFacilityDetails(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftRecoveryFacilityDetails.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftRecoveryFacilityDetailsRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftRecoveryFacilityDetails(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createDraftRecoveryFacilityDetails.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(
      body
    ) as api.CreateDraftRecoveryFacilityDetailsRequest;
    if (!validate.createDraftRecoveryFacilityDetailsRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.createDraftRecoveryFacilityDetails(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftRecoveryFacilityDetails.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(
      body
    ) as api.SetDraftRecoveryFacilityDetailsRequest;
    if (!validate.setDraftRecoveryFacilityDetailsRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftRecoveryFacilityDetails(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.deleteDraftRecoveryFacilityDetails.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.deleteDraftRecoveryFacilityDetailsRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.deleteDraftRecoveryFacilityDetails(request);
  },
  { method: HttpMethod.POST }
);

await server.start();
