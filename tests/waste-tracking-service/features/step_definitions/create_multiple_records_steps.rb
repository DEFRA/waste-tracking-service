And(/^I verify create multiple records page is correctly translated$/) do
  CreateMultipleRecordsPage.new.check_page_translation
end

Then(/^I should see multi Annex guidance page is display$/) do
  MultipleGuidancePage.new.check_page_displayed
  MultipleGuidancePage.new.check_page_translation
end
