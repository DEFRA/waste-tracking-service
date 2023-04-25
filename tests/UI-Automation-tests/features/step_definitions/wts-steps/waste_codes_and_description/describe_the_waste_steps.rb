And(/^I navigate on the Describe the waste$/) do
  click_link('Green list waste overview')
  OverviewPage.new.submit_a_single_waste_export
  AddReferenceNumberController.complete
  SubmitAnExportPage.new.waste_codes_and_description
  WasteCodeController.complete
  click_link('Continue to National code page')
  NationalCodeController.complete
  DescribeTheWastePage.new.check_page_displayed
end