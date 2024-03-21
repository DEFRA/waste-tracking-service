import { PingRequest, schema } from '@wts/api/service-uk-waste-movements';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const pingRequest = ajv.compileParser<PingRequest>(schema.pingRequest);