# frozen_string_literal: true

# this page is for Exporter details page details
class EstimateBulkVolumeWeightPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  TITLE = Translations.value 'exportJourney.quantity.entry.bulk.estimateVolume.title'
  SUB_TEXT = Translations.value 'exportJourney.quantity.entry.bulk.estimateVolume.intro'
  WARNING_TEXT = Translations.value 'exportJourney.quantity.entry.bulk.warning'
  HELPER_TEXT = Translations.value 'exportJourney.quantityValue.inputHint'
  WEIGHT_IN_CUBIC_METERS = Translations.value 'exportJourney.quantity.entry.bulk.estimateVolumeInputLabel'
  CAPTION = Translations.value 'exportJourney.quantity.caption'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text SUB_TEXT
    expect(self).to have_text WARNING_TEXT
    expect(self).to have_text WEIGHT_IN_CUBIC_METERS
    expect(self).to have_text HELPER_TEXT
    expect(self).to have_text CAPTION
  end

end
