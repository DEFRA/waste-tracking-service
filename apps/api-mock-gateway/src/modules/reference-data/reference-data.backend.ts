import {
  ListCountriesResponse,
  ListDisposalCodesResponse,
  ListEWCCodesResponse,
  ListHazardousCodesResponse,
  ListPopsResponse,
  ListRecoveryCodesResponse,
  ListSICCodesResponse,
  ListWasteCodesResponse,
  ListlocalAuthoritiesResponse,
} from '@wts/api/waste-tracking-gateway';
import { DB } from '../../db';

export async function listWasteCodes(db: DB): Promise<ListWasteCodesResponse> {
  const wasteCodes: ListWasteCodesResponse = db.wasteCodes;
  return wasteCodes;
}

export async function listEWCCodes(
  db: DB,
  includeHazardous: boolean,
): Promise<ListEWCCodesResponse> {
  try {
    let ewcCodes: ListEWCCodesResponse = db.ewcCodes;
    if (!includeHazardous) {
      ewcCodes = ewcCodes.filter((ewcCode) => !ewcCode.code.includes('*'));
    }
    return ewcCodes;
  } catch (err) {
    console.error('Unknown error', { error: err });
    throw new Error('Internal server error');
  }
}

export async function listCountries(
  db: DB,
  includeUk: boolean,
): Promise<ListCountriesResponse> {
  try {
    let countries: ListCountriesResponse = db.countries;
    if (!includeUk) {
      countries = countries.filter(
        (country) => !country.name.includes('United Kingdom'),
      );
    }
    return countries;
  } catch (err) {
    console.error('Unknown error', { error: err });
    throw new Error('Internal server error');
  }
}
export async function listRecoveryCodes(
  db: DB,
): Promise<ListRecoveryCodesResponse> {
  const recoveryCodes: ListRecoveryCodesResponse = db.recoveryCodes;
  return recoveryCodes;
}

export async function listDisposalCodes(
  db: DB,
): Promise<ListDisposalCodesResponse> {
  const disposalCodes: ListDisposalCodesResponse = db.disposalCodes;
  return disposalCodes;
}

export async function listHazardousCodes(
  db: DB,
): Promise<ListHazardousCodesResponse> {
  const hazardousCodes: ListHazardousCodesResponse = db.hazardousCodes;
  return hazardousCodes;
}

export async function listPops(db: DB): Promise<ListPopsResponse> {
  const pops: ListPopsResponse = db.pops;
  return pops;
}

export async function listLocalAuthorities(
  db: DB,
): Promise<ListlocalAuthoritiesResponse> {
  const localAuthorities: ListlocalAuthoritiesResponse = db.localAuthorities;
  return localAuthorities;
}

export async function listSICCodes(db: DB): Promise<ListSICCodesResponse> {
  const sicCodes: ListSICCodesResponse = db.sicCodes;
  return sicCodes;
}
