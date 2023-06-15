# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
require_relative '../shared_components/common_components'

# this page is for recovery facility page details
class RecoveryFacilityAddressPage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers


  TITLE = Translations.value 'exportJourney.recoveryFacilities.addressTitle'
  FACILITY_NAME = Translations.value 'exportJourney.recoveryFacilities.name'
  ADDRESS = Translations.value 'exportJourney.importerDetails.address'
  COUNTRY = Translations.value 'exportJourney.importerDetails.country'
  CAPTION = Translations.value 'exportJourney.recoveryFacilities.caption'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(page).to have_text FACILITY_NAME
    expect(page).to have_text ADDRESS
    expect(page).to have_text COUNTRY
    expect(page).to have_text CAPTION
  end

end