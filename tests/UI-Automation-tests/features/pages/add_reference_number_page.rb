# frozen_string_literal: true

require_relative 'shared_components/save_and_continue'
require_relative 'shared_components/error_box'
# this page is for Add Reference Number page details
class AddReferenceNumberPage < GenericPage
  include SaveAndContinue
  include ErrorBox

  REFERENCE_NUMBER_INPUT_ID = 'reference'

  def check_page_displayed
    expect(self).to have_css 'h1', text: 'Do you want to add your own reference to this export?', exact_text: true
  end

  def choose_option option
    choose(option, visible: false)
  end

  def enter_reference_number(reference)
    fill_in REFERENCE_NUMBER_INPUT_ID, with: reference, visible: false
  end

  def has_reference?(reference)
    find(REFERENCE_NUMBER_INPUT_ID).value == reference
  end
end
