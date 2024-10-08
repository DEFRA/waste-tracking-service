@gov_pay @UKMV
Feature: AS A WTS user
  I NEED a service charge description page
  SO THAT I know what will be permissible within the Waste tracking service after paying the service charge

  @service_charge @translation
  Scenario: User navigates to description page and verifies its translated correctly
    Given I navigate to service charge page after login on DCID portal
    Then I should see description page correctly translated
    And I click Continue without payment button
    Then the "Account" page is displayed
    And I verify payment warning banner is displayed
    And I click the "Pay your service charge" link
    Then the "Description" page is displayed

  Scenario: User navigates to GLW app without paying and verify payment banner is present
    Given I navigate to service charge page after login on DCID portal
    And I click Continue without payment button
    Then the "Account" page is displayed
    And I verify payment warning banner is displayed
    And I click Green list waste app card
    And I verify payment warning banner is displayed

  Scenario: User navigates to UKWM app without paying and verify payment banner is present
    Given I navigate to service charge page after login on DCID portal
    And I click Continue without payment button
    Then the "Account" page is displayed
    And I verify payment warning banner is displayed
    And I click UKWM app card
    And I verify payment warning banner is displayed
