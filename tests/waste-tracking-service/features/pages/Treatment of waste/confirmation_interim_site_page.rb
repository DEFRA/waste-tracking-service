# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
require_relative '../shared_components/common_components'

# this page is for confirmation if you have interim site
class ConfirmationInterimSitePage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers
  include PageHelper


  TITLE = Translations.value 'exportJourney.interimSite.confirmTitle'
  TITLE_HINT = Translations.value 'exportJourney.interimSite.confirmHint'
  INTERIM_HINT = Translations.value 'exportJourney.interimSite.summary'
  INTERIM_DESCRIPTION = Translations.value 'exportJourney.interimSite.details'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(page).to have_text TITLE
    expect(page).to have_text TITLE_HINT
    expect(page).to have_text INTERIM_HINT
  end

  def check_description_translation
    expect(page).to have_text INTERIM_DESCRIPTION
  end

  def option_checked?(selected_option)
    find(yes_or_no.fetch(selected_option), visible: false).checked?
  end

  def yes_or_no
    {
      'Yes' => 'removeTransitCountriesYes',
      'No' => 'removeTransitCountriesNo'
    }
  end

end
