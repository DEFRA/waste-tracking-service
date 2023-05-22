@add_ewc_code
Feature:AS A waste producer
  I NEED to be able to add my EWC code
  SO THAT I can classify my waste based on the European categorisation

  @translation
  Scenario: Checking Add EWC code and verify its saved
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    Then I verify copy text is present on the EWC page
    When I choose "Yes" radio button
    And I have selected valid ewc code
    And I click the button Save and continue
    Then I verify Do you need to add another page is displayed

  Scenario: User can continue by selecting option No on Add ewc code page should navigate to National code page
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    Then I verify copy text is present on the EWC page
    When I choose "No" radio button
    And I click the button Save and continue
    Then I verify that National code page is displayed

  Scenario: User can select NO option on the list page and continue to national code page
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    And I choose "Yes" radio button
    And I have selected valid ewc code
    And I click the button Save and continue
    Then I verify Do you need to add another page is displayed
    When I choose "No" radio button
    And I click the button Save and continue
    Then I verify that National code page is displayed

  Scenario: User should see previously selected option pre-populated when user navigated back to do you have EWC code page
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    And I choose "No" radio button
    And I click the Save and return
    Then I verify that Submit an export page is displayed
    When I click the "Waste codes and description" link
    Then "Basel Annex IX" is still selected
    And I click the button Save and continue
    Then I verify copy text is present on the EWC page
#    And I should see previously selected EWC code pre-populated

  Scenario: User should navigate to EWC list page after enter valid EWC code
    Given I login to waste tracking portal
    Then I navigate to Add EWC code page
    And I have selected "Yes" option
    And I have selected valid ewc code
    When I click the Save and return
    And I click the "Waste codes and description" link
    And I click the button Save and continue
    Then I verify Do you need to add another page is displayed

  Scenario: User can add EWC code when user select Not applicable waste code
    Given I login to waste tracking portal
    When I navigate to ewc code page with selecting Not applicable option on waste code page
    Then I verify enter ewc code page is displayed
    When I have selected valid ewc code
    And I click the button Save and continue
    Then I verify Do you need to add another page is displayed

  Scenario: User can remove an EWC code from ewc codes list page
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    And I choose "Yes" radio button
    And I have selected valid ewc code
    And I click the button Save and continue
    Then I verify the code is added
    When I click the "Remove" link
    Then I verify confirmation page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then I should see 0 EWC code added to the export

  Scenario: User can't continue without selecting any option on EWC code page
    Given I login to waste tracking portal
    Then I navigate to Add EWC code page
    Then I verify copy text is present on the EWC page
    And I click the button Save and continue
    Then I remain on the Do you have EWC code page with an "Select yes if you want to add an EWC code" error message displayed

  Scenario: User can't continue without entering EWC code
    Given I login to waste tracking portal
    Then I navigate to Add EWC code page
    Then I verify copy text is present on the EWC page
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then I remain on the Do you have EWC code page with an "Select an EWC code" error message displayed

  Scenario: User can't add more than 5 EWC codes to an export
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    And I choose "Yes" radio button
    And I have selected valid ewc code
    And I click the button Save and continue
    Then I verify Do you need to add another page is displayed
    When I add 4 ewc codes
    Then I should see 5 EWC code added to the export
    And I verify Do you need to add another EWC code question is not present on the page

  Scenario: User navigate back from Do you have ewc code page
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    Then I verify add ewc code page is displayed
    And I click "Back" link should display "What is the waste code" page
    Then "Basel Annex IX" is still selected

  Scenario: User add ewc code to the ewc code list page and click Back link
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    And I choose "Yes" radio button
    And I have selected valid ewc code
    And I click the button Save and continue
    Then I verify Do you need to add another page is displayed
    And I click "Back" link should display "Do you have EWC code" page
    Then I should see previously selected EWC code pre-populated

  Scenario: User click Back link, after selecting No option on EWC page
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    And I choose "No" radio button
    And I click the button Save and continue
    Then I should see national code page is displayed
    Then I click "Back" link should display "Do you have EWC code" page
#    And I should see previously selected EWC code pre-populated
