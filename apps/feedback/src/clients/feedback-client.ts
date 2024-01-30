import Boom from '@hapi/boom';
import { SendFeedbackRequest } from '@wts/api/feedback';
import axios from 'axios';
import { Logger } from 'winston';
import {
  GenerateAccessTokenResponse,
  GenerateSurveySessionResponse,
  FeedbackResponse,
  SendFeedbackResponse,
  SurveyData,
} from '../model';

export interface FeedbackClient {
  sendFeedback(surveyData: SendFeedbackRequest): Promise<SendFeedbackResponse>;
}

export default class QualtricsFeedbackClient implements FeedbackClient {
  constructor(
    private logger: Logger,
    private clientId: string,
    private clientSecret: string,
    private surveyId: string,
    private surveyAPIEndpoint: string
  ) {}

  private async generateAccessToken(
    clientId: string,
    clientSecret: string,
    grantType: string,
    scope: string
  ): Promise<GenerateAccessTokenResponse> {
    const tokenResponse = await axios.post(
      this.surveyAPIEndpoint + 'oauth2/token',
      {
        grant_type: grantType,
        client_id: clientId,
        client_secret: clientSecret,
        scope: scope,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!tokenResponse.data) {
      this.logger.error(tokenResponse.statusText);
      throw Boom.internal();
    }

    return tokenResponse.data;
  }

  private async generateSurveySession(
    token: string,
    surveyId: string
  ): Promise<GenerateSurveySessionResponse> {
    const surveySessionResponse = await axios.post(
      this.surveyAPIEndpoint + 'API/v3/surveys/' + surveyId + '/sessions',
      {
        language: 'EN',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }
    );

    if (!surveySessionResponse.data) {
      this.logger.error(surveySessionResponse.statusText);
      throw Boom.internal();
    }

    return surveySessionResponse.data;
  }

  async sendFeedback(
    surveyData: SendFeedbackRequest
  ): Promise<SendFeedbackResponse> {
    const bearertoken = await this.generateAccessToken(
      this.clientId,
      this.clientSecret,
      'client_credentials',
      'write:survey_sessions'
    );

    if (!bearertoken.access_token) {
      throw Boom.internal();
    }

    const surveySession = await this.generateSurveySession(
      bearertoken.access_token,
      this.surveyId
    );

    if (!surveySession.result.sessionId) {
      throw Boom.internal();
    }

    try {
      const qid6: string = surveyData.feedback;

      const sd: SurveyData = {
        advance: true,
        responses: {
          QID5: {
            1: {
              selected: false,
            },
            2: {
              selected: false,
            },
            3: {
              selected: false,
            },
            4: {
              selected: false,
            },
            5: {
              selected: false,
            },
          },
          QID6: qid6,
        },
      };

      switch (surveyData.rating) {
        case 1:
          sd.responses.QID5[1].selected = true;
          break;
        case 2:
          sd.responses.QID5[2].selected = true;
          break;
        case 3:
          sd.responses.QID5[3].selected = true;
          break;
        case 4:
          sd.responses.QID5[4].selected = true;
          break;
        case 5:
          sd.responses.QID5[5].selected = true;
          break;

        default: {
          throw Boom.badRequest();
        }
      }

      const sendSurveyDataResponse = await axios.post(
        this.surveyAPIEndpoint +
          'API/v3/surveys/' +
          this.surveyId +
          '/sessions/' +
          surveySession.result.sessionId,
        sd,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + bearertoken.access_token,
          },
        }
      );

      if (!sendSurveyDataResponse.data) {
        throw Boom.internal();
      }

      const successfulResponse: FeedbackResponse = {
        response: 'Successfully submitted feedback.',
      };
      return {
        success: true,
        value: successfulResponse,
      } as SendFeedbackResponse;
    } catch (err) {
      this.logger.error('Feedback API unknown error');
      throw Boom.internal();
    }
  }
}