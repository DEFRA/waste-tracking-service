And(/^I can see Update with actual page correctly translated$/) do
  UpdateWithActualPage.new.check_page_displayed
end

Then(/^I verify that newly created record is on top of the table$/) do
  expect(UpdateWithActualPage.new.application_ref.text).to eq TestStatus.test_status(:application_reference_number)
end

And(/^I verify reference section is filled with 'Not provided'$/) do
  expect(UpdateWithActualPage.new.application_ref.text).to eq TestStatus.test_status(:application_reference_number)
end

And(/^I see message that there are no exports with estimates$/) do
  UpdateWithActualPage.new.check_page_displayed_no_exports
end

And(/^I should see correct date and waste code and transaction reference$/) do
  expect(UpdateWithActualPage.new.export_date.text).to eq HelperMethods.current_date_format Date.today
  expect(UpdateWithActualPage.new.transaction_number.text).to eq TestStatus.test_status(:export_transaction_number)
  expect(UpdateWithActualPage.new.waste_code.text).to eq TestStatus.test_status(:waste_code_description)
end

When(/^I click the first update link$/) do
  UpdateWithActualPage.new.first_update_link
end

When(/^I click update estimated quantity of waste$/) do
  UpdateWithActualPage.new.update_quantity_of_waste
end

And(/^I expand About the waste section$/) do
  UpdateWithActualPage.new.expand_about_waste
end

Then(/^I should see quantity of actual waste updated in tonnes$/) do
  expect(CheckYourReportPage.new.waste_quantity).to eq "#{TestStatus.test_status(:weight_in_tonnes)} #{TestStatus.test_status(:weight_units)}"
end

Then(/^I should see success message translated correctly$/) do
  expect(UpdateWithActualPage.new.success_title.text).to eq 'Success'
  expect(UpdateWithActualPage.new.success_body.text).to eq 'Your record has been updated'
end

Then(/^I should see quantity of actual waste updated in cubic meters$/) do
  expect(CheckYourReportPage.new.waste_quantity).to eq "#{TestStatus.test_status(:weight_in_cubic_meters)} m3"
end

Then(/^I should see quantity of actual waste updated in kilograms$/) do
  expect(CheckYourReportPage.new.waste_quantity).to eq "#{TestStatus.test_status(:weight_in_kilograms)} kg"
end

And(/^I should see the transaction number on update estimate page$/) do
  expect(UpdateWithActualPage.new.transaction_id.text).to eq "Transaction number: #{TestStatus.test_status(:export_transaction_number)}"
end

And(/^I verify update annex record page is correctly translated$/) do
  UpdateAnnexRecordPage.new.check_translation
end

Then(/^I click show all sections link$/) do
  find('check-answers-accordion-toggle-all-text').click
end

And(/^I verify hide all sections link is now visible$/) do
  expect(page).to have_text('Hide all sections')
end

And(/^I verify that estimated warning message is not present on the page$/) do
  UpdateAnnexRecordPage.new.no_estimate_warning_message
end

And(/^I verify Actual needed labels are present on the page$/) do
  expect(UpdateAnnexRecordPage.new.waste_quantity_label).to eq 'ACTUAL NEEDED'
  expect(UpdateAnnexRecordPage.new.collection_date_label).to eq 'ACTUAL NEEDED'
end

And(/^I click return to all exports button$/) do
  UpdateAnnexRecordPage.new.return_to_all_exports_button
end

And(/^I should see actual collection date correctly translated$/) do
  ActualCollectionDatePage.new.check_translation
end

And(/^I should see actual collection date correctly displayed$/) do
  expect(CheckYourReportPage.new.collection_date).to eq HelperMethods.convert_date TestStatus.test_status(:actual_collection_date)
end

Then(/^Export update submitted page displayed$/) do
  ExportUpdateSubmissionConfirmationPage.new.check_page_displayed
end

And(/^I should see export update submitted page correctly translated$/) do
  ExportUpdateSubmissionConfirmationPage.new.check_page_translation
end

And(/^I should see the transaction number remains same$/) do
  expect(ExportUpdateSubmissionConfirmationPage.new.transaction_id.text).to eq TestStatus.test_status(:export_transaction_number)
end
