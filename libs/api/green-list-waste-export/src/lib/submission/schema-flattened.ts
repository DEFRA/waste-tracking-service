import { SchemaObject } from 'ajv';
import {
  carriers,
  collectionDate,
  collectionDetail,
  exporterDetail,
  importerDetail,
  recoveryFacilityDetails,
  transitCountries,
  ukExitLocation,
  wasteDescription,
  wasteQuantity,
} from './schema';
import { customerReference, errorResponseValue } from '../common/schema';

export const validateSubmissionsRequest: SchemaObject = {
  properties: {
    accountId: { type: 'string' },
    padIndex: { type: 'uint16' },
    values: {
      elements: {
        properties: {
          reference: { type: 'string' },
          baselAnnexIXCode: { type: 'string' },
          oecdCode: { type: 'string' },
          annexIIIACode: { type: 'string' },
          annexIIIBCode: { type: 'string' },
          laboratory: { type: 'string' },
          ewcCodes: { type: 'string' },
          nationalCode: { type: 'string' },
          wasteDescription: { type: 'string' },
          wasteQuantityTonnes: { type: 'string' },
          wasteQuantityCubicMetres: { type: 'string' },
          wasteQuantityKilograms: { type: 'string' },
          estimatedOrActualWasteQuantity: { type: 'string' },
          exporterOrganisationName: { type: 'string' },
          exporterAddressLine1: { type: 'string' },
          exporterAddressLine2: { type: 'string' },
          exporterTownOrCity: { type: 'string' },
          exporterCountry: { type: 'string' },
          exporterPostcode: { type: 'string' },
          exporterContactFullName: { type: 'string' },
          exporterContactPhoneNumber: { type: 'string' },
          exporterFaxNumber: { type: 'string' },
          exporterEmailAddress: { type: 'string' },
          importerOrganisationName: { type: 'string' },
          importerAddress: { type: 'string' },
          importerCountry: { type: 'string' },
          importerContactFullName: { type: 'string' },
          importerContactPhoneNumber: { type: 'string' },
          importerFaxNumber: { type: 'string' },
          importerEmailAddress: { type: 'string' },
          wasteCollectionDate: { type: 'string' },
          estimatedOrActualCollectionDate: { type: 'string' },
          firstCarrierOrganisationName: { type: 'string' },
          firstCarrierAddress: { type: 'string' },
          firstCarrierCountry: { type: 'string' },
          firstCarrierContactFullName: { type: 'string' },
          firstCarrierContactPhoneNumber: { type: 'string' },
          firstCarrierFaxNumber: { type: 'string' },
          firstCarrierEmailAddress: { type: 'string' },
          firstCarrierMeansOfTransport: { type: 'string' },
          firstCarrierMeansOfTransportDetails: { type: 'string' },
          secondCarrierOrganisationName: { type: 'string' },
          secondCarrierAddress: { type: 'string' },
          secondCarrierCountry: { type: 'string' },
          secondCarrierContactFullName: { type: 'string' },
          secondCarrierContactPhoneNumber: { type: 'string' },
          secondCarrierFaxNumber: { type: 'string' },
          secondCarrierEmailAddress: { type: 'string' },
          secondCarrierMeansOfTransport: { type: 'string' },
          secondCarrierMeansOfTransportDetails: { type: 'string' },
          thirdCarrierOrganisationName: { type: 'string' },
          thirdCarrierAddress: { type: 'string' },
          thirdCarrierCountry: { type: 'string' },
          thirdCarrierContactFullName: { type: 'string' },
          thirdCarrierContactPhoneNumber: { type: 'string' },
          thirdCarrierFaxNumber: { type: 'string' },
          thirdCarrierEmailAddress: { type: 'string' },
          thirdCarrierMeansOfTransport: { type: 'string' },
          thirdCarrierMeansOfTransportDetails: { type: 'string' },
          fourthCarrierOrganisationName: { type: 'string' },
          fourthCarrierAddress: { type: 'string' },
          fourthCarrierCountry: { type: 'string' },
          fourthCarrierContactFullName: { type: 'string' },
          fourthCarrierContactPhoneNumber: { type: 'string' },
          fourthCarrierFaxNumber: { type: 'string' },
          fourthCarrierEmailAddress: { type: 'string' },
          fourthCarrierMeansOfTransport: { type: 'string' },
          fourthCarrierMeansOfTransportDetails: { type: 'string' },
          fifthCarrierOrganisationName: { type: 'string' },
          fifthCarrierAddress: { type: 'string' },
          fifthCarrierCountry: { type: 'string' },
          fifthCarrierContactFullName: { type: 'string' },
          fifthCarrierContactPhoneNumber: { type: 'string' },
          fifthCarrierFaxNumber: { type: 'string' },
          fifthCarrierEmailAddress: { type: 'string' },
          fifthCarrierMeansOfTransport: { type: 'string' },
          fifthCarrierMeansOfTransportDetails: { type: 'string' },
          wasteCollectionOrganisationName: { type: 'string' },
          wasteCollectionAddressLine1: { type: 'string' },
          wasteCollectionAddressLine2: { type: 'string' },
          wasteCollectionTownOrCity: { type: 'string' },
          wasteCollectionCountry: { type: 'string' },
          wasteCollectionPostcode: { type: 'string' },
          wasteCollectionContactFullName: { type: 'string' },
          wasteCollectionContactPhoneNumber: { type: 'string' },
          wasteCollectionFaxNumber: { type: 'string' },
          wasteCollectionEmailAddress: { type: 'string' },
          whereWasteLeavesUk: { type: 'string' },
          transitCountries: { type: 'string' },
          interimSiteOrganisationName: { type: 'string' },
          interimSiteAddress: { type: 'string' },
          interimSiteCountry: { type: 'string' },
          interimSiteContactFullName: { type: 'string' },
          interimSiteContactPhoneNumber: { type: 'string' },
          interimSiteFaxNumber: { type: 'string' },
          interimSiteEmailAddress: { type: 'string' },
          interimSiteRecoveryCode: { type: 'string' },
          laboratoryOrganisationName: { type: 'string' },
          laboratoryAddress: { type: 'string' },
          laboratoryCountry: { type: 'string' },
          laboratoryContactFullName: { type: 'string' },
          laboratoryContactPhoneNumber: { type: 'string' },
          laboratoryFaxNumber: { type: 'string' },
          laboratoryEmailAddress: { type: 'string' },
          laboratoryDisposalCode: { type: 'string' },
          firstRecoveryFacilityOrganisationName: { type: 'string' },
          firstRecoveryFacilityAddress: { type: 'string' },
          firstRecoveryFacilityCountry: { type: 'string' },
          firstRecoveryFacilityContactFullName: { type: 'string' },
          firstRecoveryFacilityContactPhoneNumber: { type: 'string' },
          firstRecoveryFacilityFaxNumber: { type: 'string' },
          firstRecoveryFacilityEmailAddress: { type: 'string' },
          firstRecoveryFacilityRecoveryCode: { type: 'string' },
          secondRecoveryFacilityOrganisationName: { type: 'string' },
          secondRecoveryFacilityAddress: { type: 'string' },
          secondRecoveryFacilityCountry: { type: 'string' },
          secondRecoveryFacilityContactFullName: { type: 'string' },
          secondRecoveryFacilityContactPhoneNumber: { type: 'string' },
          secondRecoveryFacilityFaxNumber: { type: 'string' },
          secondRecoveryFacilityEmailAddress: { type: 'string' },
          secondRecoveryFacilityRecoveryCode: { type: 'string' },
          thirdRecoveryFacilityOrganisationName: { type: 'string' },
          thirdRecoveryFacilityAddress: { type: 'string' },
          thirdRecoveryFacilityCountry: { type: 'string' },
          thirdRecoveryFacilityContactFullName: { type: 'string' },
          thirdRecoveryFacilityContactPhoneNumber: { type: 'string' },
          thirdRecoveryFacilityFaxNumber: { type: 'string' },
          thirdRecoveryFacilityEmailAddress: { type: 'string' },
          thirdRecoveryFacilityRecoveryCode: { type: 'string' },
          fourthRecoveryFacilityOrganisationName: { type: 'string' },
          fourthRecoveryFacilityAddress: { type: 'string' },
          fourthRecoveryFacilityCountry: { type: 'string' },
          fourthRecoveryFacilityContactFullName: { type: 'string' },
          fourthRecoveryFacilityContactPhoneNumber: { type: 'string' },
          fourthRecoveryFacilityFaxNumber: { type: 'string' },
          fourthRecoveryFacilityEmailAddress: { type: 'string' },
          fourthRecoveryFacilityRecoveryCode: { type: 'string' },
          fifthRecoveryFacilityOrganisationName: { type: 'string' },
          fifthRecoveryFacilityAddress: { type: 'string' },
          fifthRecoveryFacilityCountry: { type: 'string' },
          fifthRecoveryFacilityContactFullName: { type: 'string' },
          fifthRecoveryFacilityContactPhoneNumber: { type: 'string' },
          fifthRecoveryFacilityFaxNumber: { type: 'string' },
          fifthRecoveryFacilityEmailAddress: { type: 'string' },
          fifthRecoveryFacilityRecoveryCode: { type: 'string' },
        },
      },
    },
  },
};

const validationResult: SchemaObject = {
  properties: {
    valid: { type: 'boolean' },
    accountId: { type: 'string' },
    values: {
      elements: {
        optionalProperties: {
          reference: customerReference,
          wasteDescription: wasteDescription,
          wasteQuantity: wasteQuantity,
          exporterDetail: exporterDetail,
          importerDetail: importerDetail,
          collectionDate: collectionDate,
          carriers: carriers,
          collectionDetail: collectionDetail,
          ukExitLocation: ukExitLocation,
          transitCountries: transitCountries,
          recoveryFacilityDetail: recoveryFacilityDetails,
          index: { type: 'uint16' },
          fieldFormatErrors: {
            elements: {
              properties: {
                field: {
                  enum: [
                    'CustomerReference',
                    'WasteDescription',
                    'WasteQuantity',
                    'ExporterDetail',
                    'ImporterDetail',
                    'CollectionDate',
                    'Carriers',
                    'CollectionDetail',
                    'UkExitLocation',
                    'TransitCountries',
                    'RecoveryFacilityDetail',
                  ],
                },
                message: { type: 'string' },
              },
            },
          },
          invalidStructureErrors: {
            elements: {
              properties: {
                fields: {
                  elements: {
                    properties: {
                      field: {
                        enum: [
                          'CustomerReference',
                          'WasteDescription',
                          'WasteQuantity',
                          'ExporterDetail',
                          'ImporterDetail',
                          'CollectionDate',
                          'Carriers',
                          'CollectionDetail',
                          'UkExitLocation',
                          'TransitCountries',
                          'RecoveryFacilityDetail',
                        ],
                      },
                      message: { type: 'string' },
                    },
                  },
                },
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
};

export const validateSubmissionsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: validationResult,
  },
};