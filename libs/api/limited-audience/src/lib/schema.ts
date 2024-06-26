import { JTDSchemaType } from 'ajv/dist/jtd';
import {
  AddParticipantRequest,
  CheckParticipationRequest,
  RedeemInvitationRequest,
} from './dto';

export const checkParticipationRequest: JTDSchemaType<CheckParticipationRequest> =
  {
    properties: {
      dcidSubjectId: { type: 'string' },
      content: { enum: ['GLW', 'UKWM'] },
    },
  };

export const redeemInvitationRequest: JTDSchemaType<RedeemInvitationRequest> = {
  properties: {
    dcidSubjectId: { type: 'string' },
    invitationToken: { type: 'string' },
  },
};

export const addParticipantRequest: JTDSchemaType<AddParticipantRequest> = {
  properties: {
    dcidSubjectId: { type: 'string' },
    content: { enum: ['GLW', 'UKWM'] },
  },
};
