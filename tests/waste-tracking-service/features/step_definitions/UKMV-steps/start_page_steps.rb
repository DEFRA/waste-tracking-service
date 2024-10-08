Given(/^I navigate to start page$/) do
  Log.info("Start url: #{Env.start_page_url}")
  TestStatus.set_test_status('Start url', Env.start_page_url)
  visit(Env.start_page_url)
end

Then(/^I should see start page is correctly translated$/) do
  StartPage.new.check_page_translation
end

Given(/^I login into UKWM app$/) do
  Log.info("Start url: #{Env.start_page_url}")
  TestStatus.set_test_status('Test ENV', Env.test_env)
  TestStatus.set_test_status('Start url', Env.start_page_url)
  visit(Env.start_page_url)
  set_feature_cookies
  click_link('Start now')
  HelperMethods.wait_for_a_sec
  user = "USER#{@current_process}"
  OverviewPage.new.login_to_dcid(user)
  AccountPage.new.check_page_displayed
  AccountPage.new.move_waste_in_uk_card
end

Given(/^I navigate to waste tracking accounts page$/) do
  Log.info("Start url: #{Env.start_page_url}")
  TestStatus.set_test_status('Test ENV', Env.test_env)
  TestStatus.set_test_status('Start url', Env.start_page_url)
  visit(Env.start_page_url)
  set_feature_cookies
  click_link('Start now')
  HelperMethods.wait_for_a_sec
  user = "USER#{@current_process}"
  OverviewPage.new.login_to_dcid(user)
  AccountPage.new.check_page_displayed
end
