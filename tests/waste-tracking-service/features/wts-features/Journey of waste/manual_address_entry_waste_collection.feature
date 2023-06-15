Feature: AS A waste producer/broker
  I NEED to add waste collection details
  SO THAT the waste movement can be tracked appropriately

  @translation
  Scenario: User navigates to Manual address entry waste collection page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    And I click the "Enter address manually" link
    Then I should see "Manual Address Entry Waste Collection" page is displayed
    And I should see Manual address page correctly translated
    And I click "Back" link should display "Waste collection details" page

  Scenario: User navigates to Manual address entry waste collection page and completes it
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    And I click the "Enter address manually" link
    Then I should see "Manual Address Entry Waste Collection" page is displayed
    And I complete the Manual entry address waste collection page
    And I choose "England" radio button
    And I click the button Save and continue
    Then  I should see "Contact details collection address" page is displayed

  Scenario: User navigates to Manual address entry waste collection page and completes it and return to draft
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    And I click the "Enter address manually" link
    Then I should see "Manual Address Entry Waste Collection" page is displayed
    And I complete the Manual entry address waste collection page
    And I choose "England" radio button
    And I click the Save and return to draft
    Then I should see "Submit an export" page is displayed
    And the task "Waste collection details" should be "IN PROGRESS"

  Scenario: User click Change address link on Collection address details page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    And I click the "Enter address manually" link
    Then I should see "Manual Address Entry Waste Collection" page is displayed
    And I complete the Manual entry address waste collection page
    And I choose "England" radio button
    And I click the button Save and continue
    Then I should see "Contact details collection address" page is displayed
    And I click the "Change address" link
    Then I can see previously entered data pre-populated on the manual address page

  Scenario: Error validations on Manual address entry waste collection page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    And I click the "Enter address manually" link
    Then I should see "Manual Address Entry Waste Collection" page is displayed
    And I click the button Save and continue
    Then I remain on the Manual Address Entry Waste Collection page with an "Enter an address" error message displayed
    And  I remain on the Manual Address Entry Waste Collection page with an "Enter a town or city" error message displayed
    And I remain on the Manual Address Entry Waste Collection page with an "Enter a real postcode" error message displayed
    And I remain on the Manual Address Entry Waste Collection page with an "Select a country" error message displayed