# frozen_string_literal: true

# this page is for overview page details
class DraftRecordsPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include CommonComponents

  TITLE = Translations.value 'exportJourney.incompleteAnnexSeven.title'
  CAPTION = Translations.value 'exportJourney.incompleteAnnexSeven.paragraph'
  YOUR_OWN_REF = Translations.value 'exportJourney.updateAnnexSeven.table.yourOwnReference'
  LAST_SAVED = Translations.value 'exportJourney.incompleteAnnexSeven.table.date'
  WASTE_CODE = Translations.value 'exportJourney.updateAnnexSeven.table.wasteCode'
  ACTIONS = Translations.value 'exportJourney.updateAnnexSeven.table.actions'

  #bread crumbs
  GREEN_LIST_WASTE = Translations.value 'app.channel.title'
  APP_TITLE = Translations.value 'app.title'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text CAPTION
    expect(self).to have_text YOUR_OWN_REF
    expect(self).to have_text LAST_SAVED
    expect(self).to have_text WASTE_CODE
    expect(self).to have_text ACTIONS
    expect(self).to have_text GREEN_LIST_WASTE
    expect(self).to have_text APP_TITLE
  end

end
