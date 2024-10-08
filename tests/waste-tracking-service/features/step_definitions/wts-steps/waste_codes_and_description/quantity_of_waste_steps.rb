When(/^the quantity of bulk waste page is displayed$/) do
  QuantityOfBulkWastePage.new.check_page_displayed
end

Then(/^I have options "([^"]*)"$/) do |option|
  value = Translations.key(option)
  expect(page).to have_text(Translations.value(value))
end

And(/^I navigate to Quantity of waste page$/) do
  TaskListPage.new.waste_codes_and_description
  WasteCodeController.complete
  EwcCodeController.complete
  NationalCodeController.complete
  DescribeTheWasteController.complete
end

Then(/^the What is the actual net weight of the waste is displayed$/) do
  ActualBulkTonneWeightPage.new.check_page_displayed
end

And(/^I should see net weight page is correctly translated$/) do
  ActualBulkTonneWeightPage.new.check_translation
end

And(/^I enter valid weight in tonnes$/) do
  weight_in_tonnes = Faker::Number.decimal(l_digits: 3, r_digits: 2)
  ActualBulkTonneWeightPage.new.enter_weight_in_tonnes weight_in_tonnes
  TestStatus.set_test_status(:weight_in_tonnes, weight_in_tonnes)
  Log.info("Weight in tonnes, #{weight_in_tonnes}")
end

Then(/^I should see quantity option "([^"]*)" is selected$/) do |option|
  expect(QuantityOfBulkWastePage.new.quantity_of_weight(option)).to be_checked
end

Then(/^I should see previously entered weight in tonnes pre\-populated$/) do
  expect(QuantityOfBulkWastePage.new.weight_in_tonnes).to eq TestStatus.test_status(:weight_in_tonnes).to_s
end

And(/^I enter valid weight in cubic meters$/) do
  weight_in_cubic_meters = Faker::Number.decimal(l_digits: 3, r_digits: 2)
  ActualBulkTonneWeightPage.new.enter_weight_in_cubic_meters weight_in_cubic_meters
  TestStatus.set_test_status(:weight_in_cubic_meters, weight_in_cubic_meters)
  Log.info("Weight in cubic meters, #{weight_in_cubic_meters}")
end

Then(/^I should see previously entered weight in cubic meters pre\-populated$/) do
  expect(QuantityOfBulkWastePage.new.weight_in_cubic_meters).to eq TestStatus.test_status(:weight_in_cubic_meters).to_s
end

When(/^I enter invalid weight in cubic meters$/) do
  ActualBulkTonneWeightPage.new.enter_weight_in_cubic_meters ''
  weight_in_cubic_meters = '7,1'
  ActualBulkTonneWeightPage.new.enter_weight_in_cubic_meters weight_in_cubic_meters
  TestStatus.set_test_status(:weight_in_tonnes, weight_in_cubic_meters)
  Log.info("Weight in cubic meters, #{weight_in_cubic_meters}")
end

When(/^I enter invalid weight in tonnes$/) do
  ActualBulkTonneWeightPage.new.enter_weight_in_tonnes ''
  weight_in_tonnes = '7,1'
  ActualBulkTonneWeightPage.new.enter_weight_in_tonnes weight_in_tonnes
  TestStatus.set_test_status(:weight_in_tonnes, weight_in_tonnes)
  Log.info("Weight in tonnes, #{weight_in_tonnes}")
end

Then(/^the What is the estimate net bulk tonne weight of the waste is displayed$/) do
  EstimateBulkTonneWeightPage.new.check_page_displayed
end

And(/^I should see estimate net bulk tonne weight page is correctly translated$/) do
  EstimateBulkTonneWeightPage.new.check_translation
end

And(/^I navigate to Quantity of waste page with "([^"]*)" has waste code$/) do |waste_code|
  TaskListPage.new.waste_codes_and_description
  WasteCodeController.complete waste_code
  EwcCodeController.complete
  NationalCodeController.complete
  DescribeTheWasteController.complete
end

And(/^I complete Waste codes and description task with "([^"]*)" has waste code$/) do |waste_code|
  TaskListPage.new.waste_codes_and_description
  WasteCodeController.complete waste_code
  EwcCodeController.complete
  NationalCodeController.complete
  DescribeTheWasteController.complete
  sleep 0.5
  QuantityOfSmallWastePage.new.check_page_displayed
  QuantityOfBulkWastePage.new.back
  sleep 0.5
  DescribeTheWastePage.new.save_and_return_to_draft
end

Then(/^What is the actual net weight of the small weight waste is displayed$/) do
  NetSmallWeightPage.new.check_page_displayed
end

And(/^I should see net small weight page is correctly translated$/) do
  NetSmallWeightPage.new.check_translation
end

Then(/^the What is the estimate net weight of the small weight waste is displayed$/) do
  EstimateSmallWeightPage.new.check_page_displayed
end

And(/^I should see estimate net small weight page is correctly translated$/) do
  EstimateSmallWeightPage.new.check_translation
end

And(/^I enter valid weight in kilograms$/) do
  weight_in_kilograms = Faker::Number.between(from: 0.0, to: 25.0).round(2)
  ActualBulkTonneWeightPage.new.enter_weight_in_kilograms weight_in_kilograms
  TestStatus.set_test_status(:weight_in_kilograms, weight_in_kilograms)
  Log.info("Weight in kilograms, #{weight_in_kilograms}")
end

Then(/^I should see previously entered weight in kilograms pre\-populated$/) do
  expect(QuantityOfBulkWastePage.new.weight_in_kilograms).to eq TestStatus.test_status(:weight_in_kilograms).to_s
end

Then(/^I should see quantity option "([^"]*)" is not selected$/) do |option|
  expect(QuantityOfBulkWastePage.new.quantity_of_weight(option)).not_to be_checked
end

When(/^I enter invalid weight in kilograms$/) do
  weight_in_kilometers = '7,1'
  ActualBulkTonneWeightPage.new.enter_weight_in_kilograms weight_in_kilometers
  TestStatus.set_test_status(:weight_in_kilometers, weight_in_kilometers)
  Log.info("Weight in kilograms, #{weight_in_kilometers}")
end

And(/^I enter weight more than 25 kilograms$/) do
  weight_in_kilometers = Faker::Number.between(from: 25.0, to: 1000.0).round(2)
  ActualBulkTonneWeightPage.new.enter_weight_in_kilograms weight_in_kilometers
  TestStatus.set_test_status(:weight_in_kilometers, weight_in_kilometers)
  Log.info("Weight in kilograms, #{weight_in_kilometers}")
end

Then(/^the quantity of small waste page is displayed$/) do
  QuantityOfSmallWastePage.new.check_page_displayed
end

Then(/^I should see quantity of waste correctly translated$/) do
  QuantityOfBulkWastePage.new.check_page_translated
end

And(/^I should see quantity of small waste correctly translated$/) do
  QuantityOfSmallWastePage.new.check_page_translated
end

And(/^I complete Quantity of waste sub\-section$/) do
  QuantityOfWasteController.complete
end

When(/^I complete Quantity of waste with estimated bulk waste$/) do
  QuantityOfWasteController.complete Translations.value 'exportJourney.quantity.bulk.estimateWeight'
end

When(/^I complete Quantity of waste with estimated small waste$/) do
  QuantityOfSmallWasteController.complete Translations.value 'exportJourney.quantity.small.estimateWeight'
end

And(/^I complete Quantity of waste with actual small waste$/) do
  QuantityOfSmallWasteController.complete
end

Then(/^the What is the estimate net volume of the waste is displayed$/) do
  EstimateBulkVolumeWeightPage.new.check_page_displayed
end

And(/^I should see estimate net volume page is correctly translated$/) do
  EstimateBulkVolumeWeightPage.new.check_translation
end

Then(/^the What is the actual net volume of the waste is displayed$/) do
  ActualBulkVolumeWeightPage.new.check_translation
end

And(/^I should see actual net volume page is correctly translated$/) do
  ActualBulkVolumeWeightPage.new.check_translation
end

Then(/^What is the actual net bulk tonne weight of the waste is displayed$/) do
  ActualBulkTonneWeightPage.new.check_page_displayed
end

When(/^I enter zero weight in tonnes$/) do
  weight_in_tonnes = 0
  ActualBulkTonneWeightPage.new.enter_weight_in_tonnes ''
  ActualBulkTonneWeightPage.new.enter_weight_in_tonnes weight_in_tonnes
  TestStatus.set_test_status(:weight_in_tonnes, weight_in_tonnes)
  Log.info("Weight in tonnes, #{weight_in_tonnes}")
end

And(/^I enter zero weight in cubic meters$/) do
  weight_in_cubic_meters = 0
  ActualBulkTonneWeightPage.new.enter_weight_in_cubic_meters ''
  ActualBulkTonneWeightPage.new.enter_weight_in_cubic_meters weight_in_cubic_meters
  TestStatus.set_test_status(:weight_in_tonnes, weight_in_cubic_meters)
  Log.info("Weight in cubic meters, #{weight_in_cubic_meters}")
end

And(/^I clear weight in cubic meters$/) do
  ActualBulkTonneWeightPage.new.enter_weight_in_cubic_meters ''
end

And(/^I clear weight in volume$/) do
  ActualBulkTonneWeightPage.new.enter_weight_in_cubic_meters ''
end

And(/^I enter zero weight in kilograms$/) do
  ActualBulkTonneWeightPage.new.enter_weight_in_kilograms '0'
end
