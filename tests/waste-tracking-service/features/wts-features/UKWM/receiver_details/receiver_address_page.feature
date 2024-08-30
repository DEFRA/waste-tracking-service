@UKMV @enter_Receiver_address
Feature: AS A Waste controller
  I NEED to be able to add a waste Receiver address detail
  SO THAT I have the address where the waste is coming from captured on the system

  @translation
  Scenario: User navigates to Whats Receiver address page, verify its correctly translated and enters valid postcode
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Receiver address" link
    Then the "Whats Receiver address" page is displayed
    And I verify whats Receiver address page is correctly translated
    And I enter valid Receiver postcode
    And I click search postcode button
    Then the "Select Receiver address" page is displayed
    And I verify select Receiver address page is correctly translated

  @translation
  Scenario: User navigates to Whats Receiver address page and enters postcode which does not return any address
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Receiver address" link
    Then the "Whats Receiver address" page is displayed
    And I verify whats Receiver address page is correctly translated
    And I enter postcode with 0 addresses
    And I click search postcode button
    Then the "No address found" page is displayed
    And I verify no address found page is correctly translated

  Scenario: User navigates to Whats Receiver address page and not entering postcode before clicking search button
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Receiver address" link
    Then the "Whats Receiver address" page is displayed
    And I click search postcode button
    Then I remain on the Whats Receiver address page with an "Enter a postcode" error message displayed
    And I enter invalid address postcode
    And I wait for a second
    And I click save and return button
    Then I remain on the Whats Receiver address page with an "Enter a postcode" error message displayed



