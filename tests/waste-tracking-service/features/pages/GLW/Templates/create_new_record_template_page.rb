# frozen_string_literal: true

# this page is manage templates page details
class CreateNewRecordTemplatePage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'templates.create.title'
  CAPTION = Translations.value 'templates.create.caption'
  NAME_FIELD_LABEL = Translations.value 'templates.create.nameLabel'
  DESCRIPTION_FIELD_LABEL = Translations.value 'templates.create.descLabel'
  CREATE_BUTTON = Translations.value 'templates.create.createButton'

  TEMPLATE_NAME_FIELD_ID = 'templateName'
  DESCRIPTION_FIELD_ID = 'templateDesc'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text TITLE
    expect(self).to have_text CAPTION
    expect(self).to have_text NAME_FIELD_LABEL
    expect(self).to have_text DESCRIPTION_FIELD_LABEL
    expect(self).to have_text CREATE_BUTTON
  end

  def enter_template_name(template_name)
    fill_in TEMPLATE_NAME_FIELD_ID, with: template_name, visible: false
    TestStatus.set_test_status(:template_name, template_name)
  end

  def enter_description(template_description)
    fill_in DESCRIPTION_FIELD_ID, with: template_description, visible: false
    TestStatus.set_test_status(:template_description, template_description)
  end

  def create_template_button
    click_button CREATE_BUTTON
  end

  def quantity_not_in_template
    find('nit-quantity')
  end

  def collection_not_in_template
    find('nit-collection-date')
  end

  def mode_of_transport_not_in_template
    page.find('nit-transport-means-0')
  end

  def transport_details_not_in_template
    page.find('nit-transport-details-0')
  end

end
