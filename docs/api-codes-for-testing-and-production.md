[← Back to Top](https://defra.github.io/waste-tracking-service){ .md-button }

# Testing and Production API Codes

This document explains what API Codes are and where to use them.

## What are the Testing and Production API Codes?

The API Code (apiCode) is a mandatory (uuid) field used in a Request Body (receiveMovementRequest) of the Receipt API POST or PUT request. Below is a snippet from the API Specification.

[![API Code listed in API Specifaction](api-apiCode.png)](api-apiCode.png)
#### Using the API Code
- When software developers begin testing their software against the API, they need to provide a ["Dummy" Test Code](#dummy-test-codes).
- Once developers have been granted access to the Receipt of Waste API production environment, the Defra Team will issue receivers with a <b>Production API Code</b>. This is passed to  software developers so that they can set up a working connection to the Receipt of Waste Production service.

#### API Code as used in a PUT or POST request


```json
{
  "apiCode": "1f83215e-4b90-4785-9ab2-2614839aa2e9",
  "dateTimeReceived": "2025-11-20T12:26:24.281Z",
  "reasonForNoConsignmentCode": "NO_DOC_WITH_WASTE",
  "wasteItems": [
    {
      "ewcCodes": [
        "200121"
      ],
      "wasteDescription": "Industrial waste containing persistent organic pollutants (POPs) and hazardous heavy metals from decommissioned electrical equipment and contaminated soil",
      "physicalForm": "Mixed",
      "numberOfContainers": 15,
      "typeOfContainers": "SKI",
      "weight": {
        "metric": "Tonnes",
        "amount": 1.2,
        "isEstimate": true
      },
      ... etc
```

## Dummy Test Codes

There are ten dummy codes to choose from (see below). There are no restrictions, developers can select any code from the list.
```code
1. 1f83215e-4b90-4785-9ab2-2614839aa2e9

2. c1611aa6-e1ae-487f-9768-cb2b5e5b8afb

3. 5a6058cc-ac78-47e1-b1b3-37b5eca15cb2

4. 6f1f80e3-5c77-46cb-9766-f3d0f28039a6

5. 1a4a1076-f3c9-4aee-8b80-f548e1d745bb

6. 98093f51-a0b8-41a4-a349-a533a0dffd97

7. a3e264b7-21c1-4c6f-ae7e-52305336bbdd

8. 3ec44d7a-e319-494b-b8bb-d156d7004b61

9. 17ea0c22-668a-41b2-b5ad-83c954f314f1

10. 75ff9140-8617-406e-9163-2ba4907e645b2
```
