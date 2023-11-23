Before do |scenario|
  Log.console("***********************New Scenario is #{scenario.name}*************************")
  TestStatus.reset_test_status
  @current_process = if ENV[:TEST_ENV_NUMBER.to_s].nil? || ENV[:TEST_ENV_NUMBER.to_s].empty?
                       '1'
                     else
                       ENV[:TEST_ENV_NUMBER.to_s]
                     end
  ENV[:TEST_ENV_NUMBER.to_s] = '1' if ENV[:TEST_ENV_NUMBER.to_s].nil? || ENV[:TEST_ENV_NUMBER.to_s].empty?
  @feature_name = File.basename(scenario.location.file, '.feature').to_s
  Log.info("Started: #{scenario.name} - #{@feature_name} feature")
  Log.console("STARTING FEATURE: #{@feature_name} for current process #{@current_process}")
end

Before('not @cookies') do
  @reset_cookies = true
end

After do |scenario|
  if scenario.failed?
    File.open('failed_scenarios.txt', 'a+') do |f|
      f.write(scenario.location)
      f.write(' ')
      f.close
    end
    Log.console("Failed scenario is #{scenario.name}")
    Log.warn("Test status report: #{JSON.pretty_generate(TestStatus.test_status)}")
    Log.warn("Error page URL: #{URI.parse(page.current_url)}")
    png_files = Dir.glob(File.join('report', 'screenshot_*.png'))
    attach "#{png_files}", 'image/png'
  end
end

