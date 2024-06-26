# frozen_string_literal: true

# this page is for interim site address details
class InterimSiteAddressPage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers

  TITLE = Translations.value 'exportJourney.interimSite.addressTitle'
  ADDRESS = Translations.value 'address'
  COUNTRY = Translations.value 'address.country'
  COUNTRY_FIELD_ID = 'country'
  CAPTION = Translations.value 'exportJourney.recoveryFacilities.caption'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(page).to have_text TITLE
    expect(page).to have_text ADDRESS
    expect(page).to have_text COUNTRY
    expect(page).to have_text CAPTION
  end

  def select_interim_site_country
    index = rand(0..25)
    find('country', visible: false).click
    HelperMethods.wait_for_a_sec
    country = "country__option--#{index}"
    first('country', minimum: 1).click
    first(country, minimum: 1).select_option
    interim_site_country = find('country').value
    TestStatus.set_test_status(:interim_site_country, interim_site_country)
  end
end
