# frozen_string_literal: true

# this page is for recovery facility contact page details
class RecoveryCodePage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers

  DEFAULT_TITLE = Translations.value 'exportJourney.recoveryFacilities.codeDefaultTitle'
  TITLE = Translations.value 'exportJourney.recoveryFacilities.codeTitle'
  AUTO_HINT = Translations.value 'autocompleteHint'
  CAPTION = Translations.value 'exportJourney.recoveryFacilities.caption'

  def check_page_title_displayed(title = 'First')
    expect(self).to have_css 'h1', text: TITLE.gsub!('{{n}}', title), exact_text: true
  end

  def check_page_displayed
    expect(self).to have_css 'h1', text: DEFAULT_TITLE, exact_text: true
  end

  def check_page_translation
    expect(page).to have_text AUTO_HINT
    expect(page).to have_text CAPTION
  end

  def select_first_option
    first('recoveryCode', minimum: 1).click
    first('recoveryCode__option--0', minimum: 1).select_option
    TestStatus.set_test_status(:first_recovery_facility_code, find('recoveryCode').value)
  end

end
