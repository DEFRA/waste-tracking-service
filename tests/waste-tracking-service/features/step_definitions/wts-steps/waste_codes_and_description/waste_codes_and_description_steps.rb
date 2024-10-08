Given(/^I navigate to whats the waste code page$/) do
  ExportWasteFromUkPage.new.create_single_annex_record
  AddReferenceNumberController.complete
  TaskListPage.new.waste_codes_and_description
end

When(/^I choose Not applicable option$/) do
  EnterAnEwcCodePage.new.choose_option 'Not applicable'
  TestStatus.set_test_status(:waste_code_option, 'Not applicable')
  Log.info("Waste code option :  #{TestStatus.test_status(:waste_code_option)}")
end

When(/^I choose "([^"]*)" as a waste code$/) do |waste_code_option|
  ClassificationOfTheWastePage.new.choose_option waste_code_option
  TestStatus.set_test_status(:waste_code_option, waste_code_option)
  Log.info("Waste code option :  #{TestStatus.test_status(:waste_code_option)}")
end

And(/^select a first option as waste code description$/) do
  WasteCodePage.new.select_first_option
end

Then(/^"([^"]*)" is still selected$/) do |option|
  expect(ClassificationOfTheWastePage.new.waste_code_option(option)).to be_checked
end

And(/^waste code description is displayed$/) do
  expect(WasteCodePage.new).to have_waste_code TestStatus.test_status(:waste_code_description)
end

When(/^I change the waste code from small to bulk waste$/) do
  ClassificationOfTheWastePage.new.choose_option 'Basel Annex IX'
  TestStatus.set_test_status(:waste_code_option, 'Basel Annex IX')
  Log.info("Waste code option :  #{TestStatus.test_status(:waste_code_option)}")
  ClassificationOfTheWastePage.new.save_and_continue
  WasteCodePage.new.select_first_option
end

When(/^I update Waste codes and description task with Not applicable has waste code$/) do
  ClassificationOfTheWastePage.new.choose_option 'Not applicable'
end

When(/^I complete Waste codes and description with Bulk waste and Max EWC codes$/) do
  TaskListPage.new.waste_codes_and_description
  WasteCodeController.complete
  EnterAnEwcCodePage.new.enter_ewc_code TestData.get_ewc_codes 0
  EnterAnEwcCodePage.new.save_and_continue
  sleep 1
  EnterAnEwcCodePage.new.enter_multiple_ewc_code 4
  sleep 1
  EnterAnEwcCodePage.new.save_and_continue
  NationalCodeController.complete
  DescribeTheWasteController.complete
  sleep 1
  QuantityOfBulkWastePage.new.back
  HelperMethods.wait_for_a_sec
  DescribeTheWastePage.new.save_and_return_to_draft
end

And(/^I select first OECD code$/) do
  ClassificationOfTheWastePage.new.select_first_OECD_option
end

And(/^I select new Basel Annex IX code$/) do
  ClassificationOfTheWastePage.new.select_second_BaselAnnexIX_option
end

Then(/^I remain on the (.+) page with "([^"]*)" an "([^"]*)" error message displayed$/) do |page_name, option, error_message|
  camel_case_page_name = page_name.split.map(&:capitalize).push('Page').join
  page_class = Object.const_get camel_case_page_name
  page_object = page_class.new
  page_object.check_page_displayed(option)
  expect(page_object).to have_error_message error_message
end
