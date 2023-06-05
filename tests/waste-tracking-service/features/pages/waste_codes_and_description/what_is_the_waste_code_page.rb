# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Add Reference Number page details
class WhatIsTheWasteCodePage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  WASTE_CODE_BASEL_ANNEX_IX_CODE = 'BaselAnnexIXCode'
  WASTE_CODE_OECD = 'BaselAnnexIXCode'
  WASTE_CODE_BASEL_ANNEX_IIIA = 'AnnexIIIACode'
  WASTE_CODE_BASEL_ANNEX_IIIB = 'AnnexIIIBCode'

  def check_page_displayed
    expect(self).to have_css 'h1', text: "What's the waste code?", exact_text: true
  end

  def waste_code_option(option)
    find(waste_code_options.fetch(option), visible: all)
  end

  def select_first_option
    first('BaselAnnexIXCode', minimum: 1).click
    first('BaselAnnexIXCode__option--0', minimum: 1).select_option
    TestStatus.set_test_status(:waste_code_description, first('BaselAnnexIXCode').value)
  end

  def waste_code_options
    {
      'Basel Annex IX' => 'wasteCodeCategoryBaselAnnexIX',
      'OECD' => 'wasteCodeCategoryBaselOECD',
      'Annex IIIA' => 'wasteCodeCategoryAnnexIIIA',
      'Annex IIIB' => 'wasteCodeCategoryAnnexIIIB',
      'Not applicable' => 'wasteCodeCategoryNA'
    }
  end

  def has_waste_code?(reference)
    find(WASTE_CODE_BASEL_ANNEX_IX_CODE).value == reference
  end

end