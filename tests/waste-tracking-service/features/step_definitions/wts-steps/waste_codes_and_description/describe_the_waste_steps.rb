And(/^I navigate on the Describe the waste$/) do
  click_link('Green list waste overview')
  OverviewPage.new.submit_a_single_waste_export
  AddReferenceNumberController.complete
  SubmitAnExportPage.new.waste_codes_and_description
  WasteCodeController.complete
  EwcCodeController.complete
  NationalCodeController.complete
  DescribeTheWastePage.new.check_page_displayed
end

Then(/^I should see previously entered waste description details$/) do
  expect(DescribeTheWastePage.new.check_description).to eq(TestStatus.test_status(:description_of_the_waste))
end
