# frozen_string_literal: true

# this page is for Add EWC Code page details
class EwcCodeListPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  def check_page_displayed
    expect(self).to have_css 'h1', text: 'You have added 1 European Waste Catalogue (EWC) code', exact_text: true
  end

end
