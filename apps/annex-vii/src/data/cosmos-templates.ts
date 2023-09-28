import { SqlQuerySpec } from '@azure/cosmos';
import Boom from '@hapi/boom';
import { Logger } from 'winston';
import { CosmosAnnexViiClient } from '../clients';
import { TemplateRepository } from './templates-repository';
import {
  Template,
  TemplatePageMetadata,
  TemplateSummary,
  TemplateSummaryPage,
} from '../model';
import { CosmosBaseRepository } from './cosmos-base';

type TemplateData = Template & { accountId: string };

export default class CosmosTemplateRepository
  extends CosmosBaseRepository
  implements TemplateRepository
{
  constructor(
    protected cosmosClient: CosmosAnnexViiClient,
    protected cosmosContainerName: string,
    protected alternateContainerName: string,
    protected logger: Logger
  ) {
    super(cosmosClient, cosmosContainerName, alternateContainerName, logger);
  }

  async getTemplate(id: string, accountId: string): Promise<Template> {
    const item = await this.cosmosClient.readItem(
      this.cosmosContainerName,
      id,
      accountId
    );
    if (!item) {
      throw Boom.notFound();
    }

    const data = item.value as TemplateData;
    return {
      id: data.id,
      templateDetails: data.templateDetails,
      wasteDescription: data.wasteDescription,
      exporterDetail: data.exporterDetail,
      importerDetail: data.importerDetail,
      carriers: data.carriers,
      collectionDetail: data.collectionDetail,
      ukExitLocation: data.ukExitLocation,
      transitCountries: data.transitCountries,
      recoveryFacilityDetail: data.recoveryFacilityDetail,
    };
  }

  async getTemplates(
    accountId: string,
    order: 'ASC' | 'DESC',
    pageLimit = 15,
    token?: string
  ): Promise<TemplateSummaryPage> {
    const querySpec: SqlQuerySpec = {
      query: `SELECT * FROM c 
              WHERE
                c["value"].accountId = @accountId
              ORDER BY
                c["value"]["templateDetails"].lastModified ${order}`,
      parameters: [
        {
          name: '@accountId',
          value: accountId,
        },
      ],
    };

    let hasMoreResults = true;
    let totalSubmissions = 0;
    let totalPages = 0;
    let currentPage = 0;
    let pageNumber = 0;
    let contToken = '';
    const metadataArray: TemplatePageMetadata[] = [];
    let values: ReadonlyArray<TemplateSummary> = [];

    while (hasMoreResults) {
      totalPages += 1;
      pageNumber += 1;

      const options = {
        maxItemCount: pageLimit,
        partitionKey: accountId,
        continuationToken: contToken,
      };

      const response = await this.cosmosClient.queryContainerNext(
        this.cosmosContainerName,
        querySpec,
        options
      );

      if (response.results === undefined) {
        return {
          totalTemplates: 0,
          totalPages: 0,
          currentPage: 0,
          pages: [],
          values: [],
        };
      }

      hasMoreResults = response.hasMoreResults;
      totalSubmissions += response.results.length;

      if ((!token && pageNumber === 1) || token === contToken) {
        values = response.results.map((r) => {
          const s = r.value as TemplateData;
          return {
            id: s.id,
            templateDetails: s.templateDetails,
            wasteDescription: s.wasteDescription,
            exporterDetail: { status: s.exporterDetail.status },
            importerDetail: { status: s.importerDetail.status },
            carriers: { status: s.carriers.status },
            collectionDetail: { status: s.collectionDetail.status },
            ukExitLocation: { status: s.ukExitLocation.status },
            transitCountries: { status: s.transitCountries.status },
            recoveryFacilityDetail: { status: s.recoveryFacilityDetail.status },
          };
        });
        currentPage = pageNumber;
      }

      contToken = response.continuationToken;

      const pageMetadata: TemplatePageMetadata = {
        pageNumber: pageNumber,
        token: response.continuationToken ?? '',
      };
      metadataArray.push(pageMetadata);

      if (!hasMoreResults && token === '') {
        break;
      }
    }

    return {
      totalTemplates: totalSubmissions,
      totalPages: totalPages,
      currentPage: currentPage,
      pages: metadataArray,
      values: values,
    };
  }

  async saveTemplate(template: Template, accountId: string): Promise<void> {
    const data: TemplateData = { ...template, accountId };
    try {
      await this.cosmosClient.createOrReplaceItem(
        this.cosmosContainerName,
        data.id,
        data.accountId,
        data
      );
    } catch (err: any) {
      if (err.code && err.code === 409) {
        throw Boom.conflict('Template with this name already exists');
      }
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
  }

  async deleteTemplate(id: string, accountId: string): Promise<void> {
    await this.cosmosClient.deleteItem(this.cosmosContainerName, id, accountId);
  }
}