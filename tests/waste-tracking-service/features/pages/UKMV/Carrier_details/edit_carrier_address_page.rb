# frozen_string_literal: true

# this page is for enter producer address manual page
class EditCarrierAddressPage < GenericPage
  include CommonComponents
  include PageHelper
  include ErrorBox

  TITLE = Translations.ukmv_value 'single.carrierAddress.postcode.edit.heading'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

end