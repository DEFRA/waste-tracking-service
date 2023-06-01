# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Who is the waste carrier page details
class WhoIsTheWasteCarrierPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.wasteCarrierDetails.firstPageQuestion'
  SUB_TEXT = Translations.value 'exportJourney.wasteCarrierDetails.title'
  COPY_TEXT = Translations.value 'exportJourney.wasteCarrierDetails.YouCanEditMessage'
  ORGANISATION_NAME = Translations.value 'exportJourney.wasteCarrierDetails.organisationName'
  ADDRESS = Translations.value 'exportJourney.wasteCarrierDetails.address'
  COUNTRY = Translations.value 'exportJourney.wasteCarrierDetails.country'

  ORGANISATION_NAME_FIELD_ID = 'organisationName'
  ADDRESS_FIELD_ID = 'address'
  COUNTRY_FIELD_ID = 'country'
  def check_page_displayed
    # expect(self).to have_css 'h1', text: TITLE, exact_text: true
    expect(self).to have_css 'h1', text: 'Who is the waste carrier?', exact_text: true
  end

  def check_translation
    expect(self).to have_text SUB_TEXT
    expect(self).to have_text COPY_TEXT
    expect(self).to have_text ORGANISATION_NAME
    expect(self).to have_text ADDRESS
    expect(self).to have_text COUNTRY
  end

  def enter_address(address)
    fill_in ADDRESS_FIELD_ID, with: address, visible: false
    TestStatus.set_test_status(:address, address)
  end

  def enter_country(country)
    fill_in COUNTRY_FIELD_ID, with: country, visible: false
    TestStatus.set_test_status(:country, country)
  end

  def enter_organisation_name(organisation_name)
    fill_in ORGANISATION_NAME_FIELD_ID, with: organisation_name, visible: false
    TestStatus.set_test_status(:organisation_name, organisation_name)
  end

  def has_reference_organisation_name?(organisation_name)
    find(ORGANISATION_NAME_FIELD_ID).value == organisation_name
  end

  def has_reference_address?(address)
    find(ADDRESS_FIELD_ID).value == address
  end

  def has_reference_country?(country)
    find(COUNTRY_FIELD_ID).value == country
  end

end
