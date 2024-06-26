# frozen_string_literal: true

class EditExporterAddressPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.exporterPostcodeEdit.title'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    address1 = Translations.value 'address.addressLine1'
    address2 = Translations.value 'address.addressLine2'
    town = Translations.value 'address.townCity'
    postcode = Translations.value 'address.postcodeOptional'
    country = Translations.value 'address.country'

    expect(self).to have_css 'h1', text: title, exact_text: true
    expect(page).to have_text address1
    expect(page).to have_text address2
    expect(page).to have_text town
    expect(page).to have_text postcode
    expect(page).to have_text country
  end

end
