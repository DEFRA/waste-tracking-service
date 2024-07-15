@UKMV @accessibility @ignore
Feature: Automation to check accessibility tool

  Scenario: Check WTS Accessibility - Service home page
    Given I login into UKWM app
    When the "Service Home" page is displayed
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility - Create Multiple Waste page
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility - Bulk upload error page
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I upload ukwm "UKM_Producer_errors" csv
    And I click the upload button
    When I wait for the error page to load
    Then Bulk upload ukwm error is displayed for "27" records
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility - Bulk upload success page
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I upload ukwm "UKWM_correct_40_rows_with_estimate" csv
    And I click the upload button
    When I wait for the upload to finish
    Then Bulk upload success page is displayed for "40" records
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility - Bulk confirmation page
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I upload ukwm "UKWM_correct_40_rows_with_estimate" csv
    And I click the upload button
    When I wait for the upload to finish
    Then Bulk upload success page is displayed for "40" records
    And I click Continue and create button
    When I wait for the submission to finish
    Then Bulk confirmation page is displayed for "40" movements
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility - Ukwm cancel page
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I upload ukwm "UKWM_correct_40_rows_with_estimate" csv
    And I click the upload button
    When I wait for the upload to finish
    Then Bulk upload success page is displayed for "40" records
    And I click Cancel submission button
    Then the "Ukwm Cancel" page is displayed
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility - Waste movement records list page
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I upload ukwm "UKWM_correct_40_rows_with_estimate" csv
    And I click the upload button
    When I wait for the upload to finish
    Then Bulk upload success page is displayed for "40" records
    And I click Continue and create button
    When I wait for the submission to finish
    Then Bulk confirmation page is displayed for "40" movements
    When I click the "view all these created waste movement records" link
    And I switch to new tab
    Then Waste movement records list page
    And I click show all sections
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility - Single Record page
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I upload ukwm "UKWM_correct_1_row_with_estimate" csv
    And I click the upload button
    When I wait for the upload to finish
    Then Bulk upload success page is displayed for one record
    And I click Continue and create button
    When I wait for the submission to finish
    Then Bulk confirmation page is displayed for one movement record
    When I click the "view all these created waste movement records" link
    And I switch to new tab
    Then Waste movement records list page
    And I click the "View" link
    Then the "Ukwm Single Record" page is displayed
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list