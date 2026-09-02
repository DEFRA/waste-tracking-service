
!!! Important
    **`From 1 October 2026, permitted or licenced sites in England and Wales will need to report their waste digitally, using the report receipt of waste service. In Northern Ireland and Scotland this comes into effect on 1 January 2027.`**

# Sign up as a Software Provider for the Receipt of Waste API Service

## Background
From 1 October 2026, permitted or licenced sites in England and Wales will need to report their waste digitally using the Report Receipt of Waste Service. In Northern Ireland and Scotland, this comes into effect on 1 January 2027. To enable software developers to integrate with the service and its API, this site provides comprehensive software developer documentation.

## Process
### 1. Register for the Receipt of Waste (RoW) API Service
The sign-up link for registration is available from our [qualtrics survey pages](https://defragroup.eu.qualtrics.com/jfe/form/SV_8Bpqs5H0nP7jW9U). See the button below.

Read the [API Terms of Service](api-terms-of-service.md) and acknowledge this by clicking the checkbox on the last page of the survey.

[Register as a Software Provider](https://defragroup.eu.qualtrics.com/jfe/form/SV_8Bpqs5H0nP7jW9U){ .md-button .md-button--primary }

### 2. Receive Test Credentials from the Digital Waste Tracking (DWT) Team
Following registration, software developers receive test credentials from the DWT team. These test credentials consist of a client ID and a client secret, sent via an encrypted email. Test credentials are used only within the test environment. Production credentials for the production environment are sent following successful implementation of the PAT scenarios (step 7).

To work with the API, software developers need to include an **API Code** in their requests. For testing, a `dummy API Code` is used. A list of dummy codes is available from [Testing and Production API Codes](api-codes-for-testing-and-production.md). In the production environment, software developers must use the API Code supplied for the waste organisation reporting that waste movement.

### 3. Implement Receipt of Waste (RoW) API Integration
Using the provided test credentials, software developers begin building the integration between their software and the Receipt of Waste API.

Developers can use the available GET reference data endpoints to retrieve necessary codes for container types, hazardous properties, and other required data.

### 4. Execute the Production Approval Test (PAT) Scenarios

Once the integration is built, developers must execute Production Approval Test (PAT) scenarios. Refer to the [Production Approval Tests](api-production-approval-tests.md). 

These scenarios are written in a Gherkin/BDD acceptance criteria format to ensure the software caters to all required API functionality.

Scenarios range from basic waste receipts with a single item to complex mixtures of hazardous and persistent organic pollutants (POPs) components.

### 5. Share WT IDs for Each PAT Scenario with the DWT Team
Upon successful completion of the tests, the developer must provide the Waste Tracking (WT) ID for each executed PAT scenario to the DWT team.

### 6. The DWT Team Review PAT Scenarios
The DWT team reviews the submitted IDs for the production approval test scenarios to ensure they satisfy the teams expectations.

### 7. Receive Acceptance of PATs from the DWT Team
The software developer receives a formal acceptance from the DWT team once their PAT scenarios have been successfully reviewed.

### 8. Receive Production Credentials from the DWT Team
Once the terms of service are agreed to, the DWT team issues the production credentials and API Code to the software developer.

### 9. Connect to the Production Environment
The software developer uses the production credentials to establish a connection to the live production environment.

### 10. The DWT Team Onboards Receivers 
The DWT team then onboards waste receivers of the software developer who have already registered their interest in the service.

Receivers accept terms and conditions manually via email, after which they receive their own API codes to share with their software teams to begin submitting real waste movement data.

### Changelog

You can find the changelog for this document in the [Sign-up as a Software Developer](https://github.com/DEFRA/waste-tracking-service/wiki/Sign‐up-as-a-Software-Developer) GitHub wiki page


<br/>Page last updated on July 23rd 2026.
