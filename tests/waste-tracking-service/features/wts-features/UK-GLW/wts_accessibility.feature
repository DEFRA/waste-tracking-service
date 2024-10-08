@accessibility
Feature: Automation to check accessibility tool

  Scenario: Check WTS Accessibility for Overview page
    Given I login to waste tracking portal
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa;
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for task list page page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean within "#exporter-details"; according to: best-practice
    Then the page should be axe clean according to: wcag2aa;
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean excluding "#exporter-details" according to: wcag2a, wcag2aa but skipping: color-contrast
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Waste code page
    Given I login to waste tracking portal
    And I navigate to whats the waste code page
    When I choose "Basel Annex IX" as a waste code
    Then the page should be axe clean according to: wcag2aa;
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - EWC code page
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    Then the page should be axe clean according to: wcag2aa;
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - EWC code error page
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa;
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - EWC code list page
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    And I enter valid ewc code
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa;
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - National code page
    Given I login to waste tracking portal
    Then I navigate to National Code page
    When I choose "Yes" radio button
    Then the page should be axe clean according to: wcag2aa;
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Describe the waste page
    Given I login to waste tracking portal
    And I navigate on the Describe the waste
    When I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa;
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - quantity of waste for bulk page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    And the task "Waste codes and description" should be "COMPLETED"
    When I click the "Quantity of waste" link
    When the quantity of bulk waste page is displayed
    Then the page should be axe clean according to: wcag2aa;
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - quantity of waste for bulk page error validation
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    And the task "Waste codes and description" should be "COMPLETED"
    When I click the "Quantity of waste" link
    When the quantity of bulk waste page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa;
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - quantity of waste for small page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I click the "Waste codes and description" link
    And I complete the Waste code and description task with small waste
    Then the quantity of small waste page is displayed
    Then the page should be axe clean according to: wcag2aa;
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - quantity of waste for small page error validation
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I click the "Waste codes and description" link
    And I complete the Waste code and description task with small waste
    Then the quantity of small waste page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa;
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - actual weight tonnes page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    When I choose "Actual weight (tonnes)" radio button
    And I click the button Save and continue
    Then the What is the actual net weight of the waste is displayed
    Then the page should be axe clean according to: wcag2aa;
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - estimated weight tonnes page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    When I choose "Estimated weight (tonnes)" radio button
    And I click the button Save and continue
    Then the What is the estimate net bulk tonne weight of the waste is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - estimated volume cubic metres page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    When I choose "Estimated volume (m³)" radio button
    And I click the button Save and continue
    Then the What is the estimate net volume of the waste is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - actual volume cubic metres page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    When I choose "Actual volume (m³)" radio button
    And I click the button Save and continue
    Then the What is the actual net volume of the waste is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - actual weight kilograms page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page with "Not applicable" has waste code
    Then the quantity of small waste page is displayed
    And I choose "Actual weight (kilograms)" radio button
    And I click the button Save and continue
    Then What is the actual net weight of the small weight waste is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - estimated weight kilograms page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page with "Not applicable" has waste code
    Then the quantity of small waste page is displayed
    When I choose "Estimated weight (kilograms)" radio button
    And I click the button Save and continue
    Then the What is the estimate net weight of the small weight waste is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Exporter details page, postcode finder
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Check Exporter address details page with valid postcode
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Exporter details page, Manual entry page
    Given I login to waste tracking portal
    When I navigate to Enter exporter address manual page
    When I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Exporter details page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I navigate to Check Exporter address details page with valid postcode
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Who's the importer page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Importer details" link
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Who's the importer page - error validation
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Importer details" link
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Importer details page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Importer details" link
    And I complete who is the importer page
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
#    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Importer details page - error validation
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Importer details" link
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Collection date page - Yes option
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Collection date" link
    Then the "collection date" page is displayed
    And I choose "Yes" radio button
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Collection date page - No option
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Collection date" link
    Then the "collection date" page is displayed
    And I choose "No, I’ll enter an estimate date" radio button
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Collection date page - error validation
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Collection date" link
    Then the "collection date" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Who is the waste carrier page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Who is the waste carrier page - error validation
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
#    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Waste carrier contact details page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Waste carrier contact details page - error validation
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    Then I should see "what are the waste carriers contact details" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Your added carriers page - Yes option
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    And I complete the "first" waste carrier with "Road"
    And I choose "Yes" radio button
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Your added carriers page - No option
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    And I complete the "first" waste carrier with "Road"
    And I choose "No" radio button
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Waste collection details postcode page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    When I click the "Waste collection details" link
    Then the "Waste collection address" page is displayed
    When I enter valid postcode
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Waste collection details postcode page - with address
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    When I click the "Waste collection details" link
    And I wait for a second
    Then the "Waste collection Address" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I choose first address from the list
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - contact details for collection address page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    When I click the "Waste collection details" link
    Then the "Waste collection address" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I choose first address from the list
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Enter address manually page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    When I click the "Waste collection details" link
    Then the "Waste collection address" page is displayed
    And I click the "Enter address manually" link
    And I choose "England" radio button
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Enter address manually page - error validation
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    When I click the "Waste collection details" link
    Then the "Waste collection address" page is displayed
    And I click the "Enter address manually" link
    Then I should see "Manual Address Entry Waste Collection" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Location waste leaves UK page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Location waste leaves the UK" link
    Then the "Location waste leaves the UK" page is displayed
    And I choose "Yes" radio button
    And I enter location
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Location waste leaves UK page - error validation
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Location waste leaves the UK" link
    Then the "Location waste leaves the UK" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Countries waste will travel through
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    When I select other countries of waste
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
#    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Countries waste will travel through - error validation
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Countries waste will travel through" link
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Countries waste will travel through list page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    When I select other countries of waste
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Confirmation interim site page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Recovery facility address page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Recovery facility address page - error validation
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
#    Then the page should be axe clean within "main, header" but excluding "footer"
#    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Recovery facility contact details page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    And I complete recovery facility address page
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - recovery code page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    When I complete recovery facility address page
    And I click the button Save and continue
    Then the "Recovery facility contact details" page is displayed
    When I complete recovery facility contact details
    And I click the button Save and continue
    Then the "Recovery code" page is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
#    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - chosen facilities page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    When I complete recovery facility address page
    And I click the button Save and continue
    Then the "Recovery facility contact details" page is displayed
    When I complete recovery facility contact details
    And I click the button Save and continue
    Then the "Recovery code" page is displayed
    When I select first recovery code from the recovery facility
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - interim site address page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - interim site address page - error validation
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - interim site contact details page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - interim site contact details page - error validation
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the "Interim site contact details" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - interim site recovery code page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the "Interim site contact details" page is displayed
    And I complete Interim site contact details page
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - interim site recovery code page - error validation
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the "Interim site contact details" page is displayed
    And I complete Interim site contact details page
    And I click the button Save and continue
    Then  the "Interim site recovery code" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Check your record page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
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
    Then the "check your record" page is displayed
    Then the page should be axe clean according to: wcag2aa
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast

  Scenario: Check WTS Accessibility for - submitted records page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I click confirm and submit button
    And Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the submitted with actual links
    Then the "submitted records" page is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Update with actuals page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section with estimated collection date
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    Then I should see export submitted page with estimates correctly translated
    And I click Return to export waste from UK button
    Then the "Export Waste From Uk" page is displayed
    And I click the submitted with estimated links
    Then the "Update with actual" page is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Continue a draft export page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
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
    When I click the link Return to this draft later
    When I click the incomplete records link
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - sign declaration page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - export submitted page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I click confirm and submit button
    And Export submitted page displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Export waste from the UK page
    Given I login to waste tracking portal
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Update Annex record page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste with estimated bulk waste
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section with estimated collection date
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the submitted with estimated links
    Then the "Update with actual" page is displayed
    When I click the first update link
    Then the "Update annex record" page is displayed
    And I verify Actual needed labels are present on the page
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Cancel export page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    Then task list page is displayed
    And I navigate to Quantity of waste page
    When I complete Quantity of waste with estimated bulk waste
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section with estimated collection date
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the submitted with estimated links
    Then the "Update with actual" page is displayed
    And I verify reference section is filled with reference
    And I should see correct date and waste code and transaction reference
    When I click first cancel button
    Then the "cancel the export" page is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Manage Templates page
    Given I login to waste tracking portal
    And I click Manage your Annex VII record templates link
    Then the "Manage templates" page is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Create Template page
    Given I login to waste tracking portal
    And I click Manage your Annex VII record templates link
    Then the "Manage templates" page is displayed
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Template Task list page
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Update template name page
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I click the "Name and description" link
    Then the "Update template name" page is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Name of the new template page
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I click Manage templates link
    Then the "Manage templates" page is displayed
    And I click Make a copy link on the first template from the table
    Then the "Name of the new template" page is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Delete template page
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I click Manage templates link
    Then the "Manage templates" page is displayed
    And I click delete link for the first template from the table
    Then the "Delete template" page is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Road page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I wait for a second
    And I complete the Whats is the waste carriers contact details page
    And I wait for a second
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I choose "Road" radio button
    And I click the button Save and continue
    Then the "Road transport details" page is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Sea page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    And I wait for a second
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I wait for a second
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I choose "Sea" radio button
    And I click the button Save and continue
    Then the "Sea transport details" page is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Air page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I choose "Air" radio button
    And I click the button Save and continue
    Then the "Air transport details" page is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Rail page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I choose "Rail" radio button
    And I click the button Save and continue
    Then the "Rail transport details" page is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Inland waterways page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I choose "Inland waterways" radio button
    And I click the button Save and continue
    Then the "Inland water transport details" page is displayed
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Location waste leave the UK page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Location waste leaves the UK" link
    Then the "Location waste leaves the UK" page is displayed
    And I choose "Yes" radio button
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

#  Scenario: Check WTS Accessibility for - Countries the waste travel and countries transit page
#    Given I login to waste tracking portal
#    When I navigate to the task list page with reference
#    And I click the "Countries waste will travel through" link
#    And I choose "Yes" radio button
#    Then I should see Are there any other countries the waste will travel through page correctly translated
#    When I select other countries of waste
#    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
#    Then the page should be axe clean within "main, header" but excluding "footer"
#    Then the page should be axe clean checking only: document-title, label
#
#  Scenario: Check WTS Accessibility for - Feedback page
#    Given I login to waste tracking portal
#    When I click the "feedback" link
#    Then the "Feedback Survey" page is displayed
#    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
#    Then the page should be axe clean within "main, header" but excluding "footer"
#    Then the page should be axe clean checking only: document-title, label
#
#  Scenario: Check WTS Accessibility for - Multiple guidance page
#    Given I login to waste tracking portal
#    When I click the "How to create a multiple Annex VII record CSV template" link
#    Then the "Multiple Guidance" page is displayed
#    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
#    Then the page should be axe clean within "main, header" but excluding "footer"
#    Then the page should be axe clean checking only: document-title, label
#
#  Scenario: Check WTS Accessibility for - Creating multiple Annex VII records page
#    Given I login to waste tracking portal
#    When I click the "Create multiple Annex VII records" link
#    Then the "Create multiple records" page is displayed
#    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
#    Then the page should be axe clean within "main, header" but excluding "footer"
#    Then the page should be axe clean checking only: document-title, label
#
#  Scenario: Check WTS Accessibility for - CSV error page
#    Given I login to waste tracking portal
#    And I navigate to upload glw csv
#    When I upload invalid glw csv
#    And I click the upload button
#    Then I should see glw csv error page is displayed
#    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
#    Then the page should be axe clean within "main, header" but excluding "footer"
#    Then the page should be axe clean checking only: document-title, label
#
#  Scenario: Check WTS Accessibility for - CSV upload page
#    Given I login to waste tracking portal
#    And I navigate to upload glw csv
#    When I upload valid glw csv
#    And I click the upload button
#    Then I should see glw csv is successfully uploaded
#    And I should see glw csv upload page correctly translated
#    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
#    Then the page should be axe clean within "main, header" but excluding "footer"
#    Then the page should be axe clean checking only: document-title, label
#
#  Scenario: Check WTS Accessibility for - CSV declaration page
#    Given I login to waste tracking portal
#    And I navigate to upload glw csv
#    When I upload valid glw csv
#    And I click the upload button
#    Then I should see glw csv is successfully uploaded
#    And I should see glw csv upload page correctly translated
#    When I wait for a second
#    When I click the "Continue and submit all records" button
#    Then I should see glw csv declaration page is displayed
#    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
#    Then the page should be axe clean within "main, header" but excluding "footer"
#    Then the page should be axe clean checking only: document-title, label
#
#  Scenario: Check WTS Accessibility for - CSV submitted successful page
#    Given I login to waste tracking portal
#    And I navigate to upload glw csv
#    When I upload valid glw csv
#    And I click the upload button
#    Then I should see glw csv is successfully uploaded
#    And I should see glw csv upload page correctly translated
#    When I wait for a second
#    When I click the "Continue and submit all records" button
#    Then I should see glw csv declaration page is displayed
#    When I click the "I confirm - submit all records" button
#    Then I should see glw csv submitted successful page
#    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
#    Then the page should be axe clean within "main, header" but excluding "footer"
#    Then the page should be axe clean checking only: document-title, label
#
#  Scenario: Check WTS Accessibility for - No csv file uploaded
#    Given I login to waste tracking portal
#    And I navigate to upload glw csv
#    When I upload invalid glw csv
#    And I click the upload button
#    Then I should see glw csv error page is displayed
#    And I click the upload button
#    Then I remain on the Glw upload error page with an "Upload a CSV file" error message displayed
#    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
#    Then the page should be axe clean within "main, header" but excluding "footer"
#    Then the page should be axe clean checking only: document-title, label
#
#  Scenario: Check WTS Accessibility for - Service charge Description page
#    Given I navigate to service charge page after login on DCID portal
#    Then the "Description" page is displayed
#    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
#    Then the page should be axe clean within "main, header" but excluding "footer"
#    Then the page should be axe clean checking only: document-title, label
#
#  @UKMV
#  Scenario: Check WTS Accessibility for - Service charge Annual charge page
#    Given I navigate to service charge page after login on DCID portal
#    And I click the "Pay your service charge" link
#    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
##    Then the page should be axe clean within "main, header" but excluding "footer"
#    Then the page should be axe clean checking only: document-title, label
#
#  @ignore @manual
#  Scenario: Check WTS Accessibility for - Service charge Payment successful page
#    Given I navigate to service charge page after login on DCID portal
#    And I click Pay service charge button
#    Then the "Annual Charge" page is displayed
#    When I click Continue button
#    Then I should see enter payment detail page is displayed
#    When I enter the payment details for "successful_payment"
#    And I click Continue button
#    Then I should see confirm your payment page is displayed
#    And I complete the payment process
#    Then the "Success Payment" page is displayed
#    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
#    Then the page should be axe clean within "main, header" but excluding "footer"
#    Then the page should be axe clean checking only: document-title, label
