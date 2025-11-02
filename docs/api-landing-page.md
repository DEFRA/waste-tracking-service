---
title: DEFRA Receipt of Waste API Landing Page
weight: 1
description: This API Landing Page is for waste receivers, software developers and third party software users. It enables operators of permitted or licenced waste receiving sites, to report details of each waste movement arriving at their site. This will be mandatory from October 2026.
---

Version 1.0 issued October 2025

# DEFRA Receipt of Waste API Landing Page (Private BETA)

## Introduction
This page introduces waste receivers, software developers and third party software providors to the DEFRA Waste Tracking Service (DWT) Receipt API. Learn here about how receivers and developers can get started and the digital processes involved for operators of permitted or licenced waste receiving sites to report details of each waste movement arriving at their site. This will be mandatory from October 2026.

**Note:** During this document's life-time some of the existing features of the API might be enhanced. You should periodically review the DEFRA Waste Tracking Service (DWT)  Receipt API Landing Page [Changelog](https://github.com/DEFRA/waste-tracking-service/wiki/Receipt-API-Landing-Page-Changelog).

## Receipt API Overview 

![Receipt of Waste Process Flow](https://github.com/DEFRA/waste-tracking-service/blob/DWT-924_Landing_Page/docs/initial-scope-receivers.jpg)

The Receipt of Waste API OAS Specification is available [here.](https://github.com/DEFRA/waste-tracking-service/blob/main/docs/apiSpecifications/Receipt%20API.yml)
    
The API is based on REST principles and currently has seven endpoints that return data in JSON format and use standard HTTP error response codes, see the table below.

| Endpoint |  Description|
|----------|-------------|
| <font color="green"><b>POST</b></font> | is used to create a record for a waste movement that has arrived at a waste receiving site. It returns a waste tracking ID and a validation result. |
| <font color="orange"><b>PUT</b></font> |is used to update a waste tracking record using a waste tracking ID query parameter to identify the movement. It returns a validation result.|
|<font color="blue"><b>GET</b></font>| is used to retrieve a list of European Waste Codes (EWC).|
|<font color="blue"><b>GET</b></font>|is used to retrieve a list of hazardous waste codes (called Special Waste Codes in Scotland).|
|<font color="blue"><b>GET</b></font>|is used to retrieve a list of Disposal or Recovery codes.|
|<font color="blue"><b>GET</b></font>|is used to retrieve a list of Container Types.|
|<font color="blue"><b>GET</b></font>|is used to retrieve a list of Waste POP Codes.|

    
**Note:** At present the API endpoints relate only to Great Britain and Northern Ireland.

## API Status

This version of the Receipt of Waste API:

- supports **only** the API v1.0 Receipt of Waste API for Private Beta customers.
- a roadmap to the Receipt API [can be found here.](https://github.com/DEFRA/waste-tracking-service/blob/DWT-924_Landing_Page/docs/roadmap.md)

## Related API Documentation
[Receipt of Waste API v1.0 Reference Guide](https://github.com/DEFRA/waste-tracking-service/blob/main/docs/apiSpecifications/Receipt%20API.yml)

[Receipt of Waste Roadmap](https://github.com/DEFRA/waste-tracking-service/blob/main/docs/roadmap.md)

[Receipt of Waste API Data Definitions](https://github.com/DEFRA/waste-tracking-service/blob/main/docs/receipt-data-definitions.md)

[README](https://github.com/DEFRA/waste-tracking-service/blob/main/docs/README.md)

[FAQs](https://github.com/DEFRA/waste-tracking-service/blob/main/docs/faq.md)


## Getting Started 
Work through these short sections for practical preparation and use of the API:

- [Getting started](#getting-started)
- [Authentication](#Authentication)
- [Making API Requests](#making-api-requests)
- [Validating a Collection of Requests and Responses](#validating-a-collection-of-requests-and-responses)


#### Prequisite Steps (Receiver)

1. Receivers need to [sign-up for private beta](https://defra.github.io/waste-tracking-service/private-beta-comms-sign-up/) using the on-borading form.
2. Get the <font color="orange"><b>API Code</b></font>. After successfuly completing the on-boarding programme, an API Code will be issued to the Receivers and their Software Providors who can then set up the connection to the Waste Tracking Service. This code uniquely identifies your organisation within the Digital Waste Tracking service. 

#### Prequisite Steps (Developers)

To develop using the Receipt of Waste API, you must:
- be familiar with HTTP, RESTful services and JSON and OAuth
- have received your client id and secret (by encrypted email, see step 2 below.)
- be familiar with API's terms of service.

These are the necesary steps:
1. Gain access to the test environment. The URL is shown beloow
   ```code
   https://waste-movement-external-api.api.ext-test.cdp-int.defra.cloud
   ```
3. Request an OAuth bearer token using the client ID and Client Secret. See [Authentication](#Authentication).
4. Begin sending requests and developing the integration with the API. At the same time demonstrating  that you have [implemented the specification in its entirety](https://github.com/DEFRA/waste-tracking-service/blob/DWT-720_API_Diagram/docs/production-approval-tests.md). 
5. Ensure that all scenarios have been implemented. Some useful test scripts can [be found here](https://github.com/DEFRA/waste-tracking-service/blob/main/docs/api-testing-and-examples.md).
6. Following acceptance of your integration, begin sending waste movements to the Waste Tracking Service. 

### Authentication

To start using the Receipt API, you need first to authenticate your access using your Client ID and Secret which you should have received via email. You will need this to apply to the OAuth service for an access token and make your first receipt of waste movement request. 

The diagram below illustrates the authentication process followed by a POST request waste movement. For a more detailed description with code snippets you can refer to this [authentication note](https://github.com/DEFRA/waste-tracking-service/blob/main/docs/api-authentication-guide.md).

```mermaid
sequenceDiagram
    participant Third Party Software
    participant OAuth
    participant Receipt API

    Third Party Software->>OAuth: Client ID + Secret
    OAuth-->>Third Party Software: Bearer Token

    Third Party Software->>Receipt API: POST Receipt API + Bearer Token
    Receipt API -->>Third Party Software: Result of Waste Movement Request (Success/Failure)
```

## Making API requests

Before sending any requests to the Receipt of Waste API, make sure that you are addressing the following points in your software:

- the correct URL for the environment and API version number
- the correct header contents and payload information, see example request below.

For details, see the [Receipt of Waste API v1.0 Reference Guide](https://github.com/DEFRA/waste-tracking-service/blob/main/docs/apiSpecifications/Receipt%20API.yml).

The base URLs of the sandbox and production environments are as follows:

```code 
Test: https://waste-movement-external-api.api.ext-test.cdp-int.defra.cloud

Production: https://api.server.test/v1/movements/receive
```

### What makes up a Receive Waste Movement Request?

A request starts with a command and a URL specifying the method and the API endpoint or server you want to interact with, in this case the Waste Tracking Service. An example is shown below.

```curl
curl --request POST \
  --url https://waste-movement-external-api.api.dev.cdp-int.defra.cloud/movements/receive \
  --header 'authorization: Bearer eyJraWQiOiJQYnJiZXZ \
  --header 'content-type: application/json' \
  --data '{
  "organisationApiId": "b74cbf3c-e9e2-43f3-bd6b-009d37a8d677",
  "dateTimeReceived": "2025-10-15T11:05:05.310Z",
  "reasonForNoConsignmentCode": "Carrier did not provide documentation"
```
This is broken down as follows: 

1. The cURL command and URL
```json
curl --request POST \
  --url https://waste-movement-external-api.api.dev.cdp-int.defra.cloud/movements/receive \
 ```
2. The header information containing the Bearer Token and the content type
```json
 --header 'authorization: Bearer 
 eyJraWQiOiJQYnJiZXZv
 --header 'content-type: application/json' \
```
3. The Request Body
```json
-- data '{
  "organisationApiId": "b74cbf3c-e9e2-43f3-bd6b-009d37a8d677",
  "dateTimeReceived": "2025-10-15T11:05:05.310Z",
  "reasonForNoConsignmentCode": "Carrier did not provide documentation", ...etc
  )
```


 The Request Body is the essential part of an API <font color="green"><b>POST</b></font> or <font color="orange"><b>PUT</b></font> request, it containes important data fields that a waste receiver needs to report about a waste movement. 


An example of a complete cURL Receive Waste API Request Body used by the POST and PUT methods is as follows:


```yaml
{
  "organisationApiId": "ba6eb330-4f7f-11eb-a2fb-67c34e9ac07cg",
  "dateTimeReceived": "UTC - 2025-09-15T12:12:28Z, BST - 2025-09-15T13:12:28+01:00",
  "hazardousWasteConsignmentCode": "Company name: CJTILE Ltd → Code prefix: CJTILE/\nUnique ID: A0001\nFull code: CJTILE/A0001\n",
  "reasonForNoConsignmentCode": "Carrier did not provide documentation",
  "yourUniqueReference": "wTBrdgAA020",
  "otherReferencesForMovement": [
    {
      "label": "PO Number",
      "reference": "PO-12345"
    },
    {
      "label": "Waste Ticket",
      "reference": "WT-67890"
    },
    {
      "label": "Haulier Note",
      "reference": "HN-11111"
    }
  ],
  "specialHandlingRequirements": "The waste must be fully inspected by the waste handler according to the Hazardous waste consignment and or EWC codes provided.",
  "wasteItems": [
    {
      "ewcCodes": "200108 biodegradable kitchen and canteen waste, 150109 textile packaging",
      "wasteDescription": "Basic mixed construction and demolition waste, this includes recyclable house bricks, gypsum plaster and slates.",
      "physicalForm": "Sludge",
      "numberOfContainers": 2,
      "typeOfContainers": "rubble bag, refuse sack, pallet",
      "weight": {
        "metric": "Tonnes",
        "amount": 150,
        "isEstimate": true
      },
      "pops": {
        "containsPops": true,
        "components": [
          {
            "name": "Aldrin, Chlordane, Dieldrin.",
            "concentration": 100
          }
        ]
      },
      "hazardous": {
        "containsHazardous": true,
        "hazCodes": "5 - Wastes from petroleum refining, Natural Gas Purification and pyrolitic treatment of coal, 10 - Wastes from Thermal Processes</p>",
        "components": [
          {
            "name": "lead, mercury",
            "concentration": 50
          }
        ]
      },
      "disposalOrRecoveryCodes": [
        {
          "code": "\"code\": \"R1\"\n",
          "weight": {
            "metric": "Tonnes",
            "amount": 150,
            "isEstimate": true
          }
        }
      ]
    }
  ],
  "carrier": {
    "registrationNumber": "England - CBDL123456, CBDU123456, Scotland - WCR/R/522048, Northern Ireland - ROC UT 36, ROC LT 5432",
    "reasonForNoRegistrationNumber": "Waste carrier did not provide a carrier registration number.",
    "organisationName": "Waste Carriers Lite Ltd",
    "address": {
      "fullAddress": "26a Oil Drum Lane, London, UK",
      "postCode": "W12 7ZL"
    },
    "emailAddress": "info@wastecarrierselite.co.uk",
    "phoneNumber": "020 4756 XXXX",
    "vehicleRegistration": "RNT 493",
    "meansOfTransport": "Rail"
  },
  "brokerOrDealer": {
    "organisationName": "Waste Desposal Ltd",
    "address": {
      "fullAddress": "26a Oil Drum Lane, London, UK",
      "postCode": "W12 7ZL"
    },
    "emailAddress": "info@wastecarrierselite.co.uk",
    "phoneNumber": "020 4756 3232",
    "registrationNumber": "England - CBDL123456, CBDU123456, Wales - CBDL124351, CBDU33435, Scotland - WCR/R/522048, Northern Ireland - ROC UT 36, ROC LT 5432"
  },
  "receiver": {
    "organisationName": "string",
    "emailAddress": "info@wastecarrierselite.co.uk",
    "phoneNumber": "020 4756 XXXX",
    "authorisations": [
      {
        "authorisationNumber": "string",
        "regulatoryPositionStatement": 343
      }
    ]
  },
  "receipt": {
    "address": {
      "fullAddress": "26a Oil Drum Lane, London, UK",
      "postCode": "W12 7ZL"
    }
  }
}
```
A description of each of the fields contained in the API Specification [is available here.](https://github.com/DEFRA/waste-tracking-service/blob/main/docs/receipt-data-definitions.md)
### Validating a Collection of Requests and Responses

We have assembled a collection of Bruno test scripts to help you learn about working with the Receipt API. These scripts can [be found here](https://github.com/DEFRA/waste-tracking-service/blob/main/docs/api-testing-and-examples.md).

## Error Responses

A detailed description of the error responses for this API can be found in the [Receipt API v1.0 Reference Guide](https://github.com/DEFRA/waste-tracking-service/blob/main/docs/apiSpecifications/Receipt%20API.yml).


## Getting help by email

- For developers: WasteTracking_Developers@defra.gov.uk 

- For receivers: WasteTracking_Testing@defra.gov.uk

- All users can also post questions/comments to https://github.com/DEFRA/waste-tracking-service/discussions

## Related API Documentation
[Receipt of Waste API v1.0 Reference Guide](https://github.com/DEFRA/waste-tracking-service/blob/main/docs/apiSpecifications/Receipt%20API.yml)

[Receipt of Waste Roadmap](https://github.com/DEFRA/waste-tracking-service/blob/main/docs/roadmap.md)

[Receipt of Waste API Data Definitions](https://github.com/DEFRA/waste-tracking-service/blob/main/docs/receipt-data-definitions.md)

[README](https://github.com/DEFRA/waste-tracking-service/blob/main/docs/README.md)

[FAQs](https://github.com/DEFRA/waste-tracking-service/blob/main/docs/faq.md)

## Changelog

You can find the changelog for this document in the [Receipt API v1.0 Landing Page](https://github.com/DEFRA/waste-tracking-service/wiki/Receipt-API-Landing-Page-Changelog) GitHub wiki.







