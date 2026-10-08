
# Receipt of Waste - API Production Approval Tests

When you have completed developing and testing your integration, complete every Production Approval Test (PAT) scenario applicable to your software and self-certify based on your own assessment that the results meet the specified requirements. Not all scenarios will apply to every product — see the [PAT test guidance page](api-production-approval-tests-self-verification.md) on interpreting your results to help identify which apply to your market segment.

## Confirming Your Production Approval Tests

Once you’re satisfied your software meets the requirements, email WasteTracking_Developers@defra.gov.uk to confirm self-certification is complete and to request your production credentials.

Defra does not review, validate, mark or approve individual PAT results, this is a self-service process and production credentials are issued on the basis of your own confirmation, not Defra’s assessment

## Complete and Self-Certify Your Production Approval Tests

Use the External Test environment to complete the applicable PAT scenarios. Check [here](#check-your-pat-results) for examples of request and response formats.

Before using POST /production-approval-tests, submit a test movement to POST /movements/receive that meets the conditions of the PAT scenario. Record the Waste Tracking ID returned in the successful 201 Created response and use it with the corresponding scenario ID in your PAT request.

For scenarios that successfully create a waste receipt, record the Waste Tracking ID returned by the Receipt of Waste API. You will use the Waste Tracking ID to check the result of the scenario using:

```http
POST /production-approval-tests
```

You may use the same Waste Tracking ID for different scenarios where the submitted receipt satisfies the requirements of each scenario.

C01 and H02 are rejection scenarios. These scenarios do not generate Waste Tracking IDs. Complete them separately and confirm that your software receives and handles the expected error response.

Every applicable scenario must pass before you self-certify your integration.

After all applicable scenarios have passed, complete the approved self-certification process to confirm that:

- you completed every PAT scenario applicable to your integration
- every applicable scenario passed against the published criteria
- you resolved and repeated every failed scenario
- C01 and H02 produced and handled the expected error responses
- there are no unresolved `Fail` results
- your integration is ready to proceed to production credentials

<b>Important Note:</b> Do not send your client secret as part of the self-certification or production credentials request.

## PAT Scenarios

The scenarios to be demonstrated are:

- **R01** Basic waste receipt with a single waste item
- **R02** Basic waste receipt with multiple waste items
- **R03** Basic waste receipt with means of transport set to `Road`
- **R04** Basic waste receipt with no Disposal or Recovery codes
- **R05** Basic waste receipt with multiple Disposal or Recovery codes
- **R07** Basic waste receipt with multiple EWC codes
- **C01** Basic waste receipt with no carrier registration number and no reason
- **C02** Basic waste receipt with no carrier registration number and a reason
- **B01** Basic waste receipt with a broker or dealer
- **P01** POPs waste receipt with multiple POPs components
- **H01** Hazardous waste receipt with multiple hazardous components
- **H02** Hazardous waste receipt with no consignment note code and no reason
- **H03** Hazardous waste receipt with no consignment note code and a reason
- **X01** Waste receipt containing both hazardous and POPs components

## Understand the Scenario Format

Below are a list of Gherkin style Scenarios outlining, in a behavioural sense, the scenarios to be demonstrated. As a quick note on Gherkin Scenarios:<br>The scenarios use a Given, When and Then format:

- **Scenario** describes the behaviour being tested.
- **Given** describes the required starting conditions.
- **When** describes the action performed by the Software Vendor.
- **Then** describes the expected result.

These scenarios do not replace the complete API specification and developer guidance. You are responsible for ensuring that your integration complies with all applicable requirements.

## Complete the PAT Scenarios

### Feature: Basic Receipt of Waste Scenarios

As a Software Vendor,  
I want to submit waste movement receipts, so that I can record the receipt of waste items.

### R01: Submit a basic waste receipt with a single waste item

**Given** I have authenticated  
**And** I have a waste movement  
**And** there is a single waste item  
**And** there is an accompanying Disposal or Recovery code  
**And** there are no POPs properties  
**And** there are no hazardous properties  
**When** I submit the waste movement receipt  
**Then** the waste movement receipt should be created  
**And** I should receive a Waste Tracking ID

### R02: Submit a basic waste receipt with multiple waste items

**Given** I have authenticated  
**And** I have a waste movement  
**And** there are multiple waste items  
**When** I submit the waste movement receipt  
**Then** the waste movement receipt should be created  
**And** I should receive a Waste Tracking ID

### R03: Submit a basic waste receipt with Road transport

**Given** I have authenticated  
**And** I have a waste movement  
**And** the means of transport is `Road`  
**When** I submit the waste movement receipt  
**Then** the waste movement receipt should be created  
**And** I should receive a Waste Tracking ID

### R04: Submit a basic waste receipt with no Disposal or Recovery codes

**Given** I have authenticated  
**And** I have a waste movement  
**And** there are no accompanying Disposal or Recovery codes  
**When** I submit the waste movement receipt  
**Then** the waste movement receipt should be created  
**And** I should receive a Waste Tracking ID  
**And** I should receive a warning about the missing codes

### R05: Submit a basic waste receipt with multiple Disposal or Recovery codes

**Given** I have authenticated  
**And** I have a waste movement  
**And** there is a single waste item  
**And** there are multiple accompanying Disposal or Recovery codes  
**When** I submit the waste movement receipt  
**Then** the waste movement receipt should be created  
**And** I should receive a Waste Tracking ID

### R07: Submit a basic waste receipt with multiple EWC codes

**Given** I have authenticated  
**And** I have a waste movement  
**And** there are at least two EWC codes  
**When** I submit the waste movement receipt  
**Then** the waste movement receipt should be created  
**And** I should receive a Waste Tracking ID

### Feature: Carrier details scenarios

As a Software Vendor,  
I want to submit a receipt with appropriate carrier information,  
so that the waste movement is correctly documented.

### C01: Submit a receipt with no carrier registration number and no reason

**Given** I have authenticated  
**And** I have a waste movement  
**And** there is no carrier registration number  
**And** a reason for not providing a registration number is not provided  
**When** I attempt to submit the waste movement receipt  
**Then** the waste movement receipt should be rejected  
**And** I should receive an error response  
**And** I should not receive a Waste Tracking ID

### C02: Submit a receipt with no carrier registration number but with a reason

**Given** I have authenticated  
**And** I have a waste movement  
**And** `carrier.registrationNumber` is `null`<br>
**And** a valid reason for not providing a registration number is provided<br>
**When** I submit the waste movement receipt<br>
**Then** the waste movement receipt should be created<br>
**And** I should receive a Waste Tracking ID

### Feature: Broker or dealer scenarios

As a Software Vendor,<br>
I want to submit receipts involving brokers or dealers,<br>
so that the parties involved in the waste movement are recorded.

### B01: Submit a receipt with broker or dealer involvement

**Given** I have authenticated<br>
**And** I have a waste movement<br>
**And** a broker or dealer is involved in the movement<br>
**When** I submit the waste movement receipt<br>
**Then** the waste movement receipt should be created<br>
**And** I should receive a Waste Tracking ID

### Feature: POPs waste scenarios

As a Software Vendor,<br>
I want to submit receipts containing POPs components,<br>
so that persistent organic pollutants are recorded.

### P01: Submit a receipt with multiple POPs components

**Given** I have authenticated<br>
**And** I have a waste movement<br>
**And** the movement contains multiple POPs components<br>
**When** I submit the waste movement receipt<br>
**Then** the waste movement receipt should be created<br>
**And** I should receive a Waste Tracking ID

### Feature: Hazardous waste scenarios

As a Software Vendor, I want to submit receipts containing hazardous components, so that hazardous waste is correctly classified and recorded.

### H01: Submit a hazardous waste receipt with multiple hazardous components

**Given** I have authenticated<br>
**And** I have a waste movement<br>
**And** the movement contains multiple hazardous components<br>
**When** I submit the waste movement receipt<br>
**Then** the waste movement receipt should be created<br>
**And** I should receive a Waste Tracking ID<br>

### H02: Submit hazardous waste with no consignment note code and no reason

**Given** I have authenticated<br>
**And** I have a waste movement<br>
**And** the movement contains hazardous components<br>
**And** `hazardousWasteConsignmentCode` is `null`<br>
**And** no reason is provided<br>
**When** I attempt to submit the waste movement receipt<br>
**Then** the waste movement receipt should be rejected<br>
**And** I should receive an error response<br>
**And** I should not receive a Waste Tracking ID

### H03: Submit hazardous waste with no consignment note code but with a reason

**Given** I have authenticated<br>
**And** I have a waste movement<br>
**And** the movement contains hazardous components<br>
**And** no hazardous waste consignment note code is provided<br>
**And** a valid reason is provided<br>
**When** I submit the waste movement receipt<br>
**Then** the waste movement receipt should be created<br>
**And** I should receive a Waste Tracking ID<br>

### Feature: Combined hazardous and POPs scenarios

As a Software Vendor,<br>
I want to submit receipts containing both hazardous and POPs components,<br>
so that complex waste streams are correctly classified and recorded.

### X01: Submit a receipt containing both hazardous and POPs components

**Given** I have authenticated<br>
**And** I have a waste movement<br>
**And** the movement contains hazardous components<br>
**And** the movement contains POPs components<br>
**When** I submit the waste movement receipt
**Then** the waste movement receipt should be created<br>
**And** I should receive a Waste Tracking ID

## Check Your PAT Results

Use the following endpoint to check successful PAT scenarios against the published pass and fail criteria:

```http
POST /production-approval-tests
```

The endpoint is available in the External Test environment only. It is not available in Production.

Submit the scenario ID and corresponding Waste Tracking ID for each scenario you want to check.

The endpoint returns a separate result for every submitted scenario:

- `Pass` means that the submitted receipt satisfies the requirements of that scenario.
- `Fail` means that the submitted receipt does not satisfy one or more requirements. The `message` explains why the scenario failed.

   For a more detailed explanation, refer to the PAT result [Self-Service Interpretation Guide](api-production-approval-tests-self-verification.md) page.

A `200 OK` response means that the PAT request was processed. It does not mean that every submitted scenario passed.

You must check the `status` returned for every result.

### Request format

The request body must be a JSON array containing at least one scenario.

Each item must contain:

- `scenarioId` – the supported PAT scenario identifier
- `wasteTrackingId` – the Waste Tracking ID returned when the corresponding receipt was created

You may use the same Waste Tracking ID for different scenarios where the receipt satisfies the requirements of each scenario.

You **must not** include the same `scenarioId` more than once in a request.

The endpoint supports the following scenario IDs:

```text
R01
R02
R03
R04
R05
R07
C02
B01
P01
H01
H03
X01
```

C01 and H02 cannot be submitted through this endpoint because they do not generate Waste Tracking IDs.

### Example request

```json
[
{
"scenarioId": "R01",
"wasteTrackingId": "25HRA0B2"
},
{
"scenarioId": "R02",
"wasteTrackingId": "25XYZ122"
}
]
```

### Example cURL request

Replace `YOUR_ACCESS_TOKEN` with an access token obtained using your External Test credentials.

```bash
curl --request POST \
--url "https://waste-tracking.integration.api.defra.gov.uk/production-approval-tests" \
--header "Authorization: Bearer YOUR_ACCESS_TOKEN" \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--data '[
{
"scenarioId": "R01",
"wasteTrackingId": "25HRA0B2"
},
{
"scenarioId": "R02",
"wasteTrackingId": "25XYZ122"
}
]'
```

Do not include a client secret in the request or in any communication with the DWT team.

### Example response

```json
{
"submissionId": "6a992f0a70be5b2a9436bf9c",
"results": [
{
"scenarioId": "R01",
"wasteTrackingId": "25HRA0B2",
"status": "Pass",
"message": ""
},
{
"scenarioId": "R02",
"wasteTrackingId": "25XYZ122",
"status": "Fail",
"message": "Expected more than 1 waste item for R02, found 1"
}
]
}
```

In this example:

- R01 passed.
- R02 failed because the associated receipt contained only one waste item.
- The `200 OK` response confirms that the request was processed, not that both scenarios passed.

## Resolve every failed result

Every applicable scenario must return `Pass` before you self-certify your integration.

A `Fail` result means that the scenario has not been completed successfully.

If a scenario fails:

1. Read the returned `message`.
2. Review the submitted receipt against the scenario criteria.
3. Correct your integration or test data.
4. Submit a new Receipt of Waste record if necessary.
5. Repeat the PAT check using the appropriate Waste Tracking ID.
6. Confirm that the scenario returns `Pass`.

You must not disregard or override a `Fail` result.

You must not self-certify your integration while any applicable scenario has an unresolved `Fail` result.

## Verify rejection scenarios

C01 and H02 are rejection scenarios.

A correctly implemented integration must:

- receive an error response
- not receive a Waste Tracking ID
- handle the error response correctly

Because these scenarios do not generate Waste Tracking IDs, they cannot be submitted through:

```http
POST /production-approval-tests
```

Complete C01 and H02 separately and confirm that your software receives and handles the expected error for each scenario.

## Self-Certify Your PAT results

After every applicable PAT scenario has passed, you must confirm that testing is complete and that your integration is ready to proceed to production credentials.

Your self-certification should confirm that:

- you completed every PAT scenario applicable to your integration
- every applicable scenario passed against the published criteria
- you resolved and repeated every failed scenario
- C01 and H02 produced and handled the expected error responses
- there are no unresolved `Fail` results
- your integration is ready to proceed to production credentials

### Confirmation statement

Use the following statement when completing the approved production credentials request process:

```code
We confirm that we have completed all Production Approval Test scenarios applicable to our integration, based on the waste industry we serve and the types of waste our software handles. We have assessed the results using the PAT Self-Service Interpretation Guide. All applicable scenarios have passed the published criteria. Where a scenario does not apply to our integration, we have recorded the reason and can provide it on request. All other failed results have been resolved, including confirming that applicable rejection scenarios produce and handle the expected error responses.

We declare that, in our judgement, our integration is ready for production credentials.
```

By making this confirmation, the Software Vendor takes responsibility for the completeness and outcome of its Production Approval Testing.

Self-certification confirms that the Software Vendor considers its integration ready to proceed to the production credentials process. It is not a Defra review, validation or approval of individual PAT results.

## Production credentials

After self-certifying that testing is complete, follow the production credentials request process provided during Software Vendor onboarding.

Do not include your client secret in the request or in an email.

Production credentials must only be stored and used in accordance with the API Terms of Service and your organisation’s security procedures.

## Contact developer support

If a PAT scenario does not fit your software product, or you need help interpreting the published criteria, contact:

**WasteTracking_Developers@defra.gov.uk**

Developer support can clarify the documentation and technical requirements. Contacting the support team does not replace the Software Vendor’s responsibility to complete and self-certify its PAT results.

## Changelog

You can find the changelog for this page in the [Production-Approval-Tests](https://github.com/DEFRA/waste-tracking-service/wiki/Production-Approval-Tests) GitHub wiki page.
