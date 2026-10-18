# Receipt of Waste PAT Self-Service Interpretation Guide

When you have completed developing and testing your integration, you must run a test submission for each relevant scenario and self-certify, based on your own assessment that the results meet the specified requirements.

Not every scenario applies to every software product.

Use this page to:

- identify which scenarios apply to your market segment
- understand what constitutes a `Pass` or `Fail`
- determine whether a scenario is outside the scope of your software

## Confirm your Production Approval Tests

Defra does not review, mark or approve your test results. This is a self-service process and production credentials are issued based on your confirmation rather than Defra’s assessment.

The guidance on this page is therefore your primary safeguard when self-certifying your results.

The scenarios covered by this guidance are:

- **R01** Basic receipt with a single waste item
- **R02** Basic receipt with multiple waste items
- **R03** Basic receipt with transport set to `Road`
- **R04** Basic receipt with no Disposal or Recovery codes
- **R05** Basic receipt with multiple Disposal or Recovery codes
- **R07** Basic receipt with multiple EWC codes
- **C01** No carrier registration number and no reason
- **C02** No carrier registration number but with a reason
- **B01** Broker or dealer involved
- **P01** POPs receipt with multiple POPs components
- **H01** Hazardous receipt with multiple hazardous components
- **H02** Hazardous receipt with no consignment note code and no reason
- **H03** Hazardous receipt with no consignment note code but with a reason
- **X01** Combined hazardous and POPs receipt

R06 was withdrawn by Defra. There is no test associated with this scenario ID.

## Self-Certification and Your Obligations

PAT is a self-certification process.

You submit test payloads to the Receipt of Waste API in Defra’s External Test environment. You can then use the PAT endpoint to obtain a `Pass` or `Fail` result for each supported scenario.

You must assess the results and self-certify that your testing is complete before emailing Defra to request production credentials.

Under the [API Terms of Service](api-terms-of-service.md):

- you must ensure your software aligns with the API specification so that submitted data validates correctly
- you must support your users and customers in meeting their legal obligations

This guidance is intended to help you make an informed and evidenced decision about your results.

Where an explanation says that a result may be expected for a particular market segment, this provides context for your own assessment. It is not a dispensation from any applicable requirement.

Proceeding to production with a known capability gap is at your own and your customers’ risk. This includes the risk of failing to comply with the applicable Digital Waste Tracking regulations.

## How Self-Certification Works

1. Submit a test Receipt of Waste payload to the API in Defra’s External Test environment.
2. Record the Waste Tracking ID returned for a successfully created receipt.
3. Submit the scenario ID and Waste Tracking ID to the PAT endpoint.
4. Review the `Pass` or `Fail` result returned for the scenario.
5. Use the guidance on this page to interpret the result.
6. Correct and repeat any scenario that identifies an applicable capability gap.
7. Once you are satisfied that you have completed the applicable scenarios successfully, self-certify by emailing **WasteTracking_Developers@defra.gov.uk** to confirm completion and request production credentials.

Defra does not check or approve your individual results.

Not every scenario applies to every market segment. For each scenario, this guidance explains:

- what a `Pass` means
- what a `Fail` means
- whether the result may indicate a capability gap
- whether the scenario may be outside your product’s scope
- what action may be required before you proceed

The guidance is not an exhaustive interpretation of every possible result. You must also review the PAT guidance and API specification in full.

 **Note** Regulation references

```code
Regulation references on this page relate to the England regulations. If you operate in Wales, Scotland or Northern Ireland, refer to the equivalent provisions in the regulations that apply in that nation. Paragraph numbering may differ.
```

# Basic Receipt of Waste scenarios

## R01: Basic receipt with a single waste item

- **Category:** Basic – Mandatory
- **Test flow:** A receipt is submitted with one fully classified waste item and a Waste Tracking ID is returned.
- **Aim:** Confirm that the product can create a basic waste receipt containing a single waste item.
- **Underlying reason:** A receipt requires the complete waste-classification data model, including the EWC code, waste description, Disposal or Recovery code and carrier details.
- **What it proves:** The software holds the core required waste-receipt data model and can submit a conformant record.
- **If Pass:** The result demonstrates that the product holds the core waste-receipt data model and submitted a conformant record. No further action is required for this scenario.
- **If Fail:** This indicates a genuine capability or payload gap. Correct the issue and repeat the scenario. This is not a market-segmentation issue.
- **Regulation reference:** England only. Schedule 1, Part 2, paragraph 14(1)(b) of the Digital Waste Tracking (England) Regulations 2026 requires the D code, R code, or both to be recorded for each waste code on the receipt. Recording the specified information is required under regulation 4(5)(a). If you operate outside England, refer to the equivalent provisions in your nation’s regulations.
- **Before you proceed:** R01 is a mandatory basic test. Your software cannot proceed to the production credentials process while this scenario fails.

## R02: Basic receipt with multiple waste items

- **Category:** Basic – Mandatory
- **Test flow:** A receipt is submitted with multiple separately classified waste items and a Waste Tracking ID is returned.
- **Aim:** Confirm that multiple waste items on one receipt can be classified separately.
- **Underlying reason:** Mixed loads must be classified item by item. Applying one classification to the complete load, or submitting multiple receipts for one received load, can degrade data quality.
- **What it proves:** The product classifies each waste item separately instead of combining a mixed load under one code or requiring separate receipts for one load.
- **If Pass:** The result demonstrates that the software allows waste items to be classified individually.
- **If Fail:** This indicates a genuine capability gap. The software does not support the capture of multiple waste items under one waste receipt. Correct the issue and repeat the scenario.
- **Regulation reference:** England only. Schedule 1, Part 2, paragraph 13 covers the waste code or codes for the controlled waste. Paragraph 14 requires weight, Disposal or Recovery code and container information to be recorded for each waste code. If you operate outside England, refer to the equivalent provisions in your nation’s regulations.
- **Before you proceed:** This is a mandatory requirement. The capability gap must be resolved before you request production credentials.

## R03: Basic receipt with Road transport

- **Category:** Basic
- **Test flow:** A receipt is submitted with the transport mode set to `Road` and a Waste Tracking ID is returned.
- **Aim:** Confirm that the transport mode can be captured on a receipt.
- **Underlying reason:** The receipt must record the transport mode.
- **What it proves:** The product records the mode used to transport the waste.
- **If Pass:** The result demonstrates that the product recorded Road as the transport mode.
- **If Fail:** If your customers use road transport, this indicates a genuine capability gap because the product did not record the mode of transport. If your product exclusively supports non-road transport, the scenario may be outside its scope.
- **Regulation reference:** England only. Schedule 1, Part 2, paragraph 10 requires the mode or modes of transport to be recorded. These include road, rail, sea, air, inland waterway and pipe. Paragraph 11 also requires the vehicle registration number for each vehicle where Road is a recorded mode. If you operate outside England, refer to the equivalent provisions in your nation’s regulations.
- **Before you proceed:** If your customers use road transport, resolve the failure before requesting production credentials.

## R04: Basic receipt with no Disposal or Recovery codes

- **Category:** Basic – Advisory
- **Test flow:** A receipt is submitted with the Disposal or Recovery code omitted from a waste item. A Waste Tracking ID and warning are returned.
- **Aim:** Confirm that a warning is returned when the Disposal or Recovery code is omitted.
- **Underlying reason:** Although the Disposal or Recovery code is not mandatory API data, it is expected. The API therefore returns a warning when it is omitted.
- **What it proves:** The API can create the record and return a warning. If your user interface makes the code mandatory, you may be unable to submit this scenario.
- **If Pass:** The product created the record and received a Waste Tracking ID even though a Disposal or Recovery code was not provided.
- **If Fail:** This may mean your product’s validation is working as intended. If your user interface makes the Disposal or Recovery code mandatory, your software cannot submit a payload that omits it. In that case, the inability to reach the API warning can indicate stricter data-quality validation rather than a capability gap.
- **Regulation reference:** England only. Schedule 1, Part 2, paragraph 14(1)(b) covers the Disposal or Recovery code expected for each waste code. This scenario tests API behaviour when that information is absent. If you operate outside England, refer to the equivalent provisions in your nation’s regulations.
- **Before you proceed:** If the result is caused by intentional validation that always requires a valid Disposal or Recovery code, record that evidence as part of your self-verification. If the cause is unknown or the product unintentionally prevents correct processing, investigate and resolve it before requesting production credentials.

## R05: Basic receipt with multiple Disposal or Recovery codes

- **Category:** Basic – Advisory
- **Test flow:** A receipt is submitted containing one waste item with multiple Disposal or Recovery codes and a Waste Tracking ID is returned.
- **Aim:** Confirm that the data model can contain more than one Disposal or Recovery code for one waste item.
- **Underlying reason:** A single waste item can have multiple Disposal or Recovery codes.
- **What it proves:** The product can record multiple Disposal or Recovery codes for each waste item.
- **If Pass:** The product’s data model correctly carries more than one Disposal or Recovery code on a single waste item.
- **If Fail:** This may indicate that the product only allows one Disposal or Recovery code per waste item. If the product serves users who need to record more than one code, this is a capability gap.
- **Regulation reference:** England only. Schedule 1, Part 2, paragraph 14(1) covers recording a D or R code against each waste code. If you operate outside England, refer to the equivalent provisions in your nation’s regulations.
- **Before you proceed:** Assess whether your customers need to record multiple Disposal or Recovery codes for one waste item. If they do, resolve the capability gap before requesting production credentials.

## R06: Withdrawn scenario

R06 has been removed from the PAT scenario set by Defra. There is no test associated with this scenario ID.

## R07: Basic receipt with multiple EWC codes

- **Category:** Basic – Advisory
- **Test flow:** A receipt is submitted with multiple EWC codes for a waste item and a Waste Tracking ID is returned.
- **Aim:** Confirm that multiple EWC codes can be submitted for one waste item.
- **Underlying reason:** One waste item can have more than one EWC code.
- **What it proves:** The product can record multiple EWC codes for one waste item, including dual coding where applicable.
- **If Pass:** The product successfully recorded multiple EWC codes for one waste item.
- **If Fail:** This may indicate that the product can record only one EWC code for each waste item or models a dual-classification load as separate items. Assess whether your users need to record multiple EWC codes for one item.
- **Regulation reference:** England only. Schedule 1, Part 2, paragraph 13 refers to the “waste code(s)” for the controlled waste. If you operate outside England, refer to the equivalent provisions in your nation’s regulations.
- **Before you proceed:** If your users need to record multiple EWC codes for one waste item, resolve the capability gap before requesting production credentials.

# Carrier details scenarios

## C01: No carrier registration number and no reason

- **Category:** Basic – Advisory
- **Test flow:** A receipt is submitted for an unregistered carrier without a reason. An error is returned and no Waste Tracking ID is generated.
- **Aim:** Confirm that the system refuses an unregistered-carrier movement when no reason is provided.
- **Underlying reason:** An unregistered carrier cannot move waste unless an appropriate reason is recorded.
- **What it proves:** The product blocks the invalid record. An error is returned and no Waste Tracking ID is generated.
- **If Pass:** The system refused the unregistered-carrier movement because no reason was provided. No Waste Tracking ID was returned. If a Waste Tracking ID is generated, the scenario has failed.
- **If Fail:** This may mean your client-side validation blocked the submission before it reached the API. If the software correctly prevents the invalid record from being created, retain evidence of that behaviour as part of your self-verification.
- **Regulation reference:** England only. Schedule 1, paragraph 7 requires a reason to be recorded where the transporter does not have a carrier registration or transporter authorisation number. Regulations 16(2)(a) and 19(2)(a), read with regulation 4(4), address a failure to complete the specified steps. If you operate outside England, refer to the equivalent provisions in your nation’s regulations.
- **Before you proceed:** Determine whether the result was caused by intentional client-side validation. If the product can submit an invalid movement without a registration number or reason, resolve the gap before requesting production credentials.

## C02: No carrier registration number but with a reason

- **Category:** Basic – Advisory
- **Test flow:** A receipt is submitted for an unregistered carrier with a reason. A Waste Tracking ID is returned and the reason is recorded.
- **Aim:** Confirm that a reason can be captured when the carrier is not registered.
- **Underlying reason:** An unregistered carrier may be submitted when an appropriate reason is provided.
- **What it proves:** The product supports the controlled-exception path.
- **If Pass:** The product returned a Waste Tracking ID and recorded the reason for the missing carrier registration number.
- **If Fail:** If the software does not permit unregistered carriers, its own validation may prevent this scenario. If the product permits unregistered carriers but cannot capture the reason, this is a capability gap.
- **Regulation reference:** England only. Schedule 1, Part 2, paragraph 7 requires the reason to be recorded where the transporter does not have a carrier registration or transporter authorisation number. If you operate outside England, refer to the equivalent provisions in your nation’s regulations.
- **Before you proceed:** If your product supports unregistered-carrier movements, it must capture the reason. Resolve any related capability gap before requesting production credentials.

# Broker or dealer scenarios

## B01: Broker or dealer involved

- **Category:** Basic – Advisory
- **Test flow:** A receipt is submitted with a broker or dealer present and a Waste Tracking ID is returned.
- **Aim:** Confirm that the product captures the broker or dealer, rather than only the carrier.
- **Underlying reason:** Where a broker or dealer arranged the movement, that party must be recorded.
- **What it proves:** The product records broker or dealer involvement.
- **If Pass:** The product captured the broker or dealer involved in the movement.
- **If Fail:** This may be outside the scope of a product serving only customers who deal directly with carriers. If any customers use brokers or dealers, the absence of this capability is a genuine gap.
- **Regulation reference:** England only. Schedule 1, Part 2, paragraph 9 requires the name, address, contact details and registration or authorisation number of a broker or dealer who arranged the transportation. If you operate outside England, refer to the equivalent provisions in your nation’s regulations.
- **Before you proceed:** Confirm whether broker or dealer involvement applies to your customer base. If it does, resolve the capability gap before requesting production credentials.

# POPs waste scenarios

## P01: POPs receipt with multiple POPs components

- **Category:** POPs – Advisory
- **Test flow:** A receipt is submitted containing one waste item with multiple POPs components and a Waste Tracking ID is returned.
- **Aim:** Confirm that POPs details can be captured.
- **Underlying reason:** POPs require specific management controls, and identifying them is important for safe and compliant treatment.
- **What it proves:** The product can capture multiple POPs components for one waste item.
- **If Pass:** The product correctly recorded multiple POPs components for a single waste item.
- **If Fail:** The scenario may be outside the scope of a product that does not serve the POPs waste market. If your customers handle POPs waste, the inability to model multiple POPs components is a capability gap.
- **Regulation reference:** England only. Schedule 1, Part 2, paragraphs 15(1)(b) and 16 cover the recording of relevant POPs substance information and concentration, or the reason why that information was not provided. If you operate outside England, refer to the equivalent provisions in your nation’s regulations.
- **Before you proceed:** Confirm whether your customers handle POPs waste. If they do, resolve any inability to record multiple POPs components before requesting production credentials.

# Hazardous waste scenarios

## H01: Hazardous receipt with multiple hazardous components

- **Category:** Hazardous – Advisory
- **Test flow:** A receipt is submitted containing one waste item with multiple hazardous components and a Waste Tracking ID is returned.
- **Aim:** Confirm that multiple hazardous components can be captured for one waste item.
- **Underlying reason:** Hazardous movements may require component information and hazardous-property codes.
- **What it proves:** The product can capture multiple hazardous components for one waste item.
- **If Pass:** The product successfully recorded multiple hazardous components, including hazardous-property codes and component information.
- **If Fail:** The scenario may be outside the scope of a product that does not support the hazardous waste market. If any customers handle hazardous waste, the absence of component or hazardous-property fields is a live capability gap.
- **Regulation reference:** England only. Schedule 1, Part 2, paragraph 15 covers hazardous-property codes and component or concentration values where waste has a hazardous property. If you operate outside England, refer to the equivalent provisions in your nation’s regulations.
- **Before you proceed:** If any of your customers handle hazardous waste, even occasionally, resolve the capability gap before requesting production credentials.

## H02: No consignment note code and no reason

- **Category:** Hazardous – Advisory
- **Test flow:** A hazardous receipt is submitted without a consignment note code or reason. An error is returned and no Waste Tracking ID is generated.
- **Aim:** Confirm that the system refuses a hazardous movement that does not contain a consignment note code or a reason for its absence.
- **Underlying reason:** A hazardous movement must contain a hazardous waste consignment note code or a valid reason for not providing one.
- **What it proves:** The product blocks the invalid record.
- **If Pass:** The system refused the hazardous movement and did not return a Waste Tracking ID. If a Waste Tracking ID is generated, the scenario has failed.
- **If Fail:** Your software’s own validation may have blocked the request before it reached the API. If the software correctly requires the consignment note code or a reason, retain evidence of that behaviour as part of your self-verification.
- **Regulation reference:** England only. Schedule 1, Part 2, paragraph 8 requires the consignment note code to be recorded for hazardous waste or, where there is no code, the reason why. If you operate outside England, refer to the equivalent provisions in your nation’s regulations.
- **Before you proceed:** Confirm whether the result was caused by intentional client-side validation. If the product can submit hazardous waste without the code or a reason, resolve the gap before requesting production credentials.

## H03: No consignment note code but with a reason

- **Category:** Hazardous – Advisory
- **Test flow:** A hazardous receipt is submitted without a consignment note code but with a reason. A Waste Tracking ID is returned and the reason is recorded.
- **Aim:** Confirm that hazardous waste can be submitted without a consignment note code when a valid reason is provided.
- **Underlying reason:** A hazardous movement must contain a hazardous waste consignment note code or a reason for its absence.
- **What it proves:** The product supports the controlled exception where a reason is recorded instead of the consignment note code.
- **If Pass:** The product returned a Waste Tracking ID and recorded the reason for the missing consignment note code.
- **If Fail:** The scenario may be outside the scope of a product that does not support hazardous waste. If the product supports hazardous waste but cannot capture the reason, this is a capability gap.
- **Regulation reference:** England only. Schedule 1, Part 2, paragraph 8 requires the reason to be recorded where there is no hazardous waste consignment note code. If you operate outside England, refer to the equivalent provisions in your nation’s regulations.
- **Before you proceed:** If your customers handle hazardous waste and may use this exception, resolve any inability to capture the reason before requesting production credentials.

# Combined hazardous and POPs scenarios

## X01: Combined hazardous and POPs receipt

- **Category:** Hazardous and POPs – Advisory
- **Test flow:** A receipt containing both hazardous and POPs information is submitted and a Waste Tracking ID is returned.
- **Aim:** Confirm that the product handles a composite waste item containing both hazardous and POPs properties.
- **Underlying reason:** Some waste is both hazardous and POPs-containing. The data model must be able to represent both.
- **What it proves:** The product supports a combined hazardous and POPs receipt.
- **If Pass:** The product handled the combined hazardous and POPs receipt correctly.
- **If Fail:** The scenario may be outside the scope of a product that serves neither the hazardous nor POPs waste markets. If your customers handle either or both, the failure may indicate missing hazardous-component, hazardous-property or POPs-component capabilities.
- **Regulation reference:** England only. Schedule 1, Part 2, paragraph 15 covers hazardous properties and related information. Paragraph 16 covers persistent organic pollutants. Both apply where the receipt contains hazardous and POPs waste. If you operate outside England, refer to the equivalent provisions in your nation’s regulations.
- **Before you proceed:** If any of your customers could receive combined hazardous and POPs-containing waste, resolve any related capability gaps before requesting production credentials.

## Contact developer support

If, after reviewing this guidance against your test result, you believe a test is behaving incorrectly or your circumstances are not covered, email:

**WasteTracking_Developers@defra.gov.uk**

Include:

- your organisation name
- the PAT scenario ID
- a clear description of the issue
- your specific technical question

Do not include your client secret.

The developer support mailbox can help clarify the documentation and technical behaviour. It does not review, mark or approve your PAT results.
