# Production Approval Tests for Receipt of Waste API

Below are a list of Gherkin style Scenarios outlining in a behavioural sense some of the key functionalities of the system as it stands. As each system integrating with us is unique, it isn’t feasible for us to give each integrating developer a specific payload per scenario, so please use the following scenarios and the details found in the Github Documentation Service to illustrate the functionality. When you’ve completed developing and testing your integration please send a test submission for each of these scenarios and note down the corresponding Global Waste Tracking ID’s so we can review.

As a quick note on Gherkin Scenarios:
”Scenario” - A title for Given, When, and Then combinations illustrating a behaviour that can occur within a system
”Given” - A precondition step outlining a state a system needs to be in
”When” - An action step that can be carried out by a user/actor within a system
”Then” - An expectation step of what should be achieved by the combination of the Given and When steps

More info can be found here

The following is not an exhaustive set of tests and you will be expected to review our documentation in full to ensure that you have integrated as per the specification.

## Feature: Basic Receipt of Waste Scenarios

As a user,  
I want to submit a basic waste movement receipt,<br> 
So that I can record the receipt of non-hazardous waste.<br> 

### Scenario: Submit basic receipt of waste with single waste item (R01)

Given I have authenticated<br>
And I have a basic waste movement<br>
And there is a single waste item<br>
And there is an accompanying ‘Disposal or Recovery’ code<br>
And there are no POPs properties<br>
And there are no Hazardous properties<br>
When I submit the waste movement receipt<br>
Then the waste movement receipt should be created<br>
And I should receive a global movement ID<br>

### Scenario: Submit basic receipt of waste with multiple waste items (R02)

Given I have authenticated<br>
And I have a basic waste movement<br>
And there are multiple waste items<br>
When I submit the waste movement receipt<br>
Then the waste movement receipt should be created<br>
And I should receive a global movement ID<br>

### Scenario: Submit basic receipt of waste with Road transport (R03)

Given I have authenticated<br>
And I have a basic waste movement<br>
And the means of transport is ‘Road’<br>
When I submit the waste movement receipt<br>
Then the waste movement receipt should be created<br>
And I should receive a global movement ID<br>

### Scenario: Submit basic receipt of waste with no Disposal or Recovery codes (R04)

Given I have authenticated<br>
And I have a basic waste movement<br>
And there are no accompanying ‘Disposal or Recovery’ codes<br>
When I submit the waste movement receipt<br>
Then the waste movement receipt should be created<br>
And I should receive a global movement ID<br>
And I should receive a warning about missing codes<br>

### Scenario: Submit basic receipt of waste with multiple Disposal or Recovery codes (R05)

Given I have authenticated<br>
And I have a basic waste movement<br>
And there are multiple accompanying ‘Disposal or Recovery’ codes<br>
When I submit the waste movement receipt<br>
Then the waste movement receipt should be created<br>
And I should receive a global movement ID<br>

### Scenario: Submit basic receipt of waste with multiple receiver authorisation numbers (R06)

Given I have authenticated<br>
And I have a basic waste movement<br>
And there are multiple receiver authorisation numbers<br>
When I submit the waste movement receipt<br>
Then the waste movement receipt should be created<br>
And I should receive a global movement ID<br>

### Scenario: Submit basic receipt of waste with Mirror EWC codes (R07)

Given I have authenticated<br>
And I have a basic waste movement<br>
And there is a Mirror / Dual EWC code<br>
When I submit the waste movement receipt<br>
Then the waste movement receipt should be created<br>
And I should receive a global movement ID<br>

## Feature: Carrier Details Scenarios

As a user,<br>
I want to submit a receipt of waste with appropriate carrier information,<br>
So that the movement is properly documented and compliant.<br>

### Scenario: Submit receipt of waste with no carrier details and no reason (C01)

Given I have authenticated<br>
And I have a basic waste movement<br>
And there are no carrier details<br>
And no reason is provided<br>
When I attempt to submit the waste movement receipt<br>
Then the waste movement receipt should be rejected<br>
And I should receive an error message<br>

### Scenario: Submit receipt of waste with no carrier details but with reason (C02)

Given I have authenticated<br>
And I have a basic waste movement<br>
And there are no carrier details<br>
And a reason is provided<br>
When I submit the waste movement receipt<br>
Then the waste movement receipt should be created<br>
And I should receive a global movement ID<br>

## Feature: Broker/Dealer Scenarios

As a user,<br>
I want to submit waste movement receipts involving brokers or dealers,<br>
So that all parties in the waste movement chain are properly recorded.<br>

### Scenario: Submit receipt of waste with Broker/Dealer involvement (B01)

Given I have authenticated<br>
And I have a basic waste movement<br>
And there is a Broker/Dealer involved in the movement<br>
When I submit the waste movement receipt<br>
Then the waste movement receipt should be created<br>
And I should receive a global movement ID<br>

## Feature: POPs Waste Scenarios

As a user,<br>
I want to submit waste movement receipts containing POPs components,<br>
So that persistent organic pollutants are properly tracked and managed.<br>

### Scenario: Submit receipt of waste with multiple POPs components (P01)

Given I have authenticated<br>
And I have a basic waste movement<br>
And it contains multiple POPs Components<br>
When I submit the waste movement receipt<br>
Then the waste movement receipt should be created<br>
And I should receive a global movement ID<br>

## Feature: Hazardous Waste Scenarios

As a user,<br>
I want to submit waste movement receipts containing hazardous components,<br>
So that hazardous waste is properly classified and tracked.<br>

### Scenario: Submit receipt of waste with multiple hazardous components (H01)

Given I have authenticated<br>
And I have a basic waste movement<br>
And it contains multiple Hazardous Components<br>
When I submit the waste movement receipt<br>
Then the waste movement receipt should be created<br>
And I should receive a global movement ID<br>

### Scenario: Submit receipt of hazardous waste with no Consignment Note Code and no reason (H02)

Given I have authenticated<br>
And I have a basic waste movement<br>
And it contains Hazardous Components<br>
And there is no Consignment Note Code<br>
And no reason is provided<br>
When I attempt to submit the waste movement receipt<br>
Then the waste movement receipt should be rejected<br>
And I should receive an error message<br>

### Scenario: Submit receipt of hazardous waste with no Consignment Note Code but with reason (H03)

Given I have authenticated<br>
And I have a basic waste movement<br>
And it contains Hazardous Components<br>
And there is no Consignment Note Code<br>
And a reason is provided<br>
When I submit the waste movement receipt<br>
Then the waste movement receipt should be created<br>
And I should receive a global movement ID<br>

## Feature: Combined Hazardous and POPs Scenarios

As a user,<br>
I want to submit waste movement receipts containing both hazardous and POPs components,<br>
So that complex waste streams are properly classified and tracked.<br>

### Scenario: Submit receipt of  waste with both hazardous and POPs components (X01)

Given I have authenticated<br>
And I have a basic waste movement<br>
And it contains Hazardous Components<br>
And it contains POPs components<br>
When I submit the waste movement receipt<br>
Then the waste movement receipt should be created<br>
And I should receive a global movement ID<br>

## Technical Exemptions

The following scenarios may be exempted if the integrating system doesn’t handle these specific waste types or business processes, you will need to provide rationale/evidence for any of these exemptions when applying to go into production:

| Scenario |  Technical Exemption |
|----------|-------------|
|R02|If all entities that use the software only handle one waste item per receipt |
|R05|If all entities that use the software only record one DoR per receipt|
|R07|If all entities that use the software only receive non-hazardous waste|
|B01|If all entities that use the software never receive waste from brokers/dealers|
|P01|If all entities that use the software never receive waste containing POP’s|
|H01, H02|If all entities that use the software never receive hazardous waste|
|X01|If all entities that use the software never receive both types of waste|

If your circumstances change at any point, you will need to <br>
a) Let us know immediately and <br>
b) Test your software against the additional categories otherwise your users may not be able to fulfil their obligations and may be at risk of being non-compliant
