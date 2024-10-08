export interface DcidToken {
  ver: string;
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  acr: string;
  iat: number;
  auth_time: number;
  aal: string;
  serviceId: string;
  correlationId: string;
  currentRelationshipId: string;
  sessionId: string;
  email: string;
  contactId: string;
  firstName: string;
  lastName: string;
  uniqueReference: string;
  loa: number;
  enrolmentCount: number;
  enrolmentRequestCount: number;
  relationships: string[];
  roles: string[];
  nbf: number;
}
