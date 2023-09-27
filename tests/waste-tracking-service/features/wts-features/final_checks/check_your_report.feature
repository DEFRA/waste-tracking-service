Feature: AS A Waste Practitioner
  I NEED to have a final section
  SO THAT I can ensure that all my entry details are correctly

  Scenario: User should see all the data displayed correctly on check your report page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link
    Then the "check your report" page is displayed
    #need to check the translation
    And I should see check your report page is correctly translated
    And I should see export reference correctly displayed
    And I should see export About the waste section correctly displayed
    And I should see export Exporter and Importer details correctly displayed
    And I should see export Journey of waste correctly displayed
    And I should see export Treatment of waste correctly displayed

  Scenario: User can update Waste code from bulk to small from check your report page, all the relevant tasks should be reset
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    And I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link
    Then the "check your report" page is displayed
    When I click waste code Change link
    Then the "Change waste code" page is displayed
    And I click Continue and change waste code button
    Then the "what is the waste code" page is displayed
    And "Basel Annex IX" is still selected
    When I update Waste codes and description task with Not applicable has waste code
    And I click the Save and return to draft
    Then the task "Quantity of waste" should be "NOT STARTED"
    Then the task "Waste carriers" should be "NOT STARTED"
    Then the task "Laboratory details" should be "NOT STARTED"
    Then the task "Check your report" should be "CANNOT START YET"

  Scenario: User can navigate to check your report page with estimated quantity and collections date
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    When I complete Quantity of waste with estimated bulk waste
    And I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    When the "Importer contact details" page is displayed
    And I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    When I complete the Journey of a waste section with estimated collection date
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link
    Then I should see warning text on check your report page
    Then I should see Estimate Collection date
    And I should see Estimate Quantity of Waste

  Scenario: User can navigate to check your report page with Max each EWS codes, Waste carriers, Recovery facility and multiple Countries waste will travel
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    When I complete Waste codes and description with Bulk waste and Max EWC codes
    And I click the "Quantity of waste" link
    And I complete Quantity of waste sub-section
    And I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I choose "Yes, I’ll enter the actual date" radio button
    And I enter valid Actual collection date
    And I click the button Save and continue
    And I complete the "First" waste carrier with "Shipping container"
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "Second" waste carrier with "Shipping container"
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "Third" waste carrier with "Shipping container"
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "Fourth" waste carrier with "Shipping container"
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "Fifth" waste carrier with "Shipping container"
    And I wait for a second
    And I click the button Save and continue
    And I complete waste carrier location and collection details
    Then I click the "Recovery facility" link
    And I choose "No" radio button
    And I click the button Save and continue
    And I complete the "first" recovery facility
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "second" recovery facility
    And I click the button Save and continue
    When I click the "Check your record" link
    Then I should see 5 waste carriers on check your export page
    And I should see 5 ewc codes on check your export page
    And I should see 2 recovery facilities on check your export page

  Scenario: User can navigate to enter your ref pages from check your report page using change link
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link
    Then the "check your report" page is displayed
    #ref change link
    When I click your own reference Change link
    Then I should see reference number pre-populated
    When I click the button Save and continue
    Then Submit an export page is displayed

  Scenario: User can navigate to About the waste page from check your report page using change link
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link
    Then the "check your report" page is displayed
   # ewc code change link
    When I click ewc code Change link
    Then I should see ewc code description on EWC list page
    And I choose "No" radio button
#    Then I should see selected EWC code on EWC codes page
    When I click the Save and return to draft
    When I click the "Check your record" link
    #national code
    When I click national code Change link
    Then I verify Yes option is selected
    And I should see national code pre-populated
    When I click the Save and return to draft
    And I click the "Check your record" link
    #waste description
    When I click Waste description Change link
    Then I should see previously entered waste description details
    When I click the Save and return to draft
    And I click the "Check your record" link
    When I click Waste quantity Change link
    Then I should see quantity option "Yes, I know the actual amount" is selected

  Scenario: User can navigate to Exporter and Importer from check your report page using change link
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link
    Then the "check your report" page is displayed
    #exporter change link
    When I click Exporter address Change link
    Then I verify Enter exporter address manual page is displayed
    When I click the button Save and continue
    When I wait for a second
    When I click the Save and return to draft
    When I click the "Check your record" link
    And I click Exporter details Change link
    Then the "exporter details" page is displayed
    When I click the Save and return to draft
    When I click the "Check your record" link
    Then the "check your report" page is displayed
    #importer change link
    When I click importer details Change link
    Then the "who is the importer" page is displayed
    When I click the button Save and continue
    Then the "importer contact details" page is displayed
    When I click the Save and return to draft
    When I click the "Check your record" link
    #importer contact change link
    When I click importer contact details Change link
    Then the "importer contact details" page is displayed


  Scenario: User can navigate to Journey of waste from check your report page using change link
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link
    Then the "check your report" page is displayed
    When I click on Collection date Change link
    Then I should see Collection date option "Yes, I’ll enter the actual date" is selected
    When I click the Save and return to draft
    And I click the "Check your record" link
    When I click on Waste carrier Change link
    Then the "Who is the waste carrier" page is displayed
    When I click the Save and return to draft
    And I click the "Check your record" link
    And I wait for a second
    When I click on Waste carrier contact Change link
    And I wait for a second
    Then the "What Are The Waste Carriers Contact Details" page is displayed
    When I click the Save and return to draft
    And I click the "Check your record" link
    When I click the waste carrier transport Change link
    Then the "How Will The Waste Carrier Transport The Waste" page is displayed
    When I click Continue button
    And I click the Save and return to draft
    And I click the "Check your record" link
    And I wait for a second
    When I click waste carrier details Change link
    Then the "Shipping container details" page is displayed
    When I click the Save and return to draft
    And I click the "Check your record" link
    When I click waste collection address Change link
#    Then the "Manual Address Entry Waste Collection" page is displayed
    When I click the Save and return to draft
    And I click the "Check your record" link
    When I click waste collection contact change link
    Then the "Contact Details Collection Address" page is displayed
    When I click the Save and return to draft
    And I click the "Check your record" link
    When I click waste leaves location change link
    Then the "Location Waste Leaves The Uk" page is displayed
    When I click the Save and return to draft
    And I click the "Check your record" link
    When I click transit countries change link
    Then the "Waste Transit Countries" page is displayed

  Scenario: User can navigate to Treatment of waste from check your report page using change link
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link

  Scenario: Remove only EWC code from check your export page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link
    Then the "check your report" page is displayed
   # ewc code change link
    When I click ewc code Change link
    When I click the "Remove" link
    Then I verify confirmation page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then Enter an EWC code is displayed





















