Then(/^Enter an EWC code is displayed$/) do
  EnterAnEwcCodePage.new.check_page_displayed
end

And(/^I choose first EWC code description from list$/) do
  PageHelper.new.choose_option 'first_option'
end

When(/^I navigate to You have added EWC codes page with Not applicable waste code$/) do
  SubmitAnExportPage.new.waste_codes_and_description
  WhatIsTheWasteCodePage.new.choose_option 'Not applicable'
  TestStatus.set_test_status(:waste_code_option, 'Not applicable')
end
