export interface Address {
  addressLine1: string;
  addressLine2?: string;
  townCity: string;
  postcode: string;
  country: string;
}

export type ListAddressesResponse = Address[];
