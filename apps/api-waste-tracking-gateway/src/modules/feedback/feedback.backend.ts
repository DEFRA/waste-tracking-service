import Boom from '@hapi/boom';
import { SendFeedbackRequest, SendFeedbackResponse } from '@wts/api/feedback';
import * as api from '@wts/api/waste-tracking-gateway';
import { DaprFeedbackClient } from '@wts/client/feedback';
import { Logger } from 'winston';

export interface FeedbackBackend {
  sendFeedback(
    surveyName: string,
    feedback?: string,
    rating?: number,
  ): Promise<api.SendFeedbackResponse>;
}

export class FeedbackServiceBackend implements FeedbackBackend {
  constructor(
    private client: DaprFeedbackClient,
    private logger: Logger,
  ) {}

  async sendFeedback(
    serviceName: string,
    feedback?: string,
    rating?: number,
  ): Promise<api.SendFeedbackResponse> {
    let response: SendFeedbackResponse;
    try {
      response = await this.client.sendFeedback({
        serviceName: serviceName,
        surveyData: {
          rating: rating,
          feedback: feedback,
        },
      } as SendFeedbackRequest);
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }
}
