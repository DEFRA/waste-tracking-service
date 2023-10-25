# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for remove waste carrier page details
class RemoveRecoveryFacilityPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  MULTI_WASTE_TITLE = 'h2 > div'
  TITLE = Translations.value 'exportJourney.recoveryFacilities.confirmRemoveTitle'

  def check_page_displayed(name)
    expect(self).to have_css 'h1', text: TITLE.gsub('{{name}}', name), exact_text: true
  end

end
