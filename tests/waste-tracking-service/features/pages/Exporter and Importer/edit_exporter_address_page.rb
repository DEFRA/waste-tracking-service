# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Exporter details page details
class EditExporterAddressPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.exporterPostcodeEdit.title'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    address1 = Translations.value 'exportJourney.exporterManual.addressOneLabel'
    address2 = Translations.value 'exportJourney.exporterManual.addressTwoLabel'
    town = Translations.value 'exportJourney.exporterManual.townLabel'
    postcode = Translations.value 'exportJourney.exporterManual.postCodeLabel'
    country = Translations.value 'exportJourney.exporterManual.countryLabel'
    exporter_text = Translations.value'exportJourney.wasteCollectionDetails.countryHint'

    expect(self).to have_css 'h1', text: title, exact_text: true
    expect(page).to have_text address1
    expect(page).to have_text address2
    expect(page).to have_text town
    expect(page).to have_text postcode
    expect(page).to have_text country
    expect(page).to have_text exporter_text
  end

end