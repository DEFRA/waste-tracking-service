# frozen_string_literal: true

# Provides a way to happy path flow
module JourneyOfAWasteController
  def self.complete(collection_date_option = 'Yes')
    location_leaves_uk_page = LocationWasteLeavesTheUkPage.new
    who_is_waste_carrier_page = WhoIsTheWasteCarrierPage.new
    collection_date_page = CollectionDatePage.new
    how_will_the_waste_carrier_transport_the_waste_page = HowWillTheWasteCarrierTransportTheWastePage.new
    waste_carriers_list_page = MultiWasteCarriersPage.new
    waste_carrier_contact_details_page = WhatAreTheWasteCarriersContactDetailsPage.new

    road_transport_details_page = RoadTransportDetailsPage.new
    waste_collection_details_page = WasteCollectionAddressPage.new
    contact_details_address_page = ContactDetailsCollectionAddressPage.new
    countries_waste_will_travel_page = CountriesWasteWillTravelPage.new

    collection_date_page.choose_option collection_date_option
    if collection_date_option == 'Yes'
      collection_date_page.enter_actual_collection_date DateTime.now.next_day(7).strftime('%-d %m %Y')
    end
    if collection_date_option == 'No, I’ll enter an estimate date'
      collection_date_page.enter_estimate_collection_date DateTime.now.next_day(7).strftime('%-d %m %Y')
    end

    collection_date_page.save_and_continue
    sleep(1)
    who_is_waste_carrier_page.check_page_displayed
    who_is_waste_carrier_page.wait_for_element 'country'
    who_is_waste_carrier_page.enter_organisation_name 'CompanyLTD'
    who_is_waste_carrier_page.enter_address 'Sample Address 1'
    who_is_waste_carrier_page.enter_country 'Wales'
    who_is_waste_carrier_page.select_first_country
    who_is_waste_carrier_page.save_and_continue
    sleep 1
    waste_carrier_contact_details_page.check_page_displayed
    waste_carrier_contact_details_page.enter_organisation_contact 'Nick Pope'
    waste_carrier_contact_details_page.enter_email 'sample@mail.com'
    waste_carrier_contact_details_page.enter_phone_number '+359-89 88-1(434)55 5'
    waste_carrier_contact_details_page.save_and_continue
    how_will_the_waste_carrier_transport_the_waste_page.check_page_displayed
    how_will_the_waste_carrier_transport_the_waste_page.choose_option 'Road'
    TestStatus.set_test_status(:waste_carrier_mode_of_transport, 'Road')
    how_will_the_waste_carrier_transport_the_waste_page.save_and_continue
    road_transport_details_page.check_page_displayed
    road_transport_details_page.enter_transportation_description 'Trailer number - ABC123, Shipping Container - ANC123'
    road_transport_details_page.save_and_continue
    waste_carriers_list_page.choose_option 'No'
    waste_carriers_list_page.save_and_continue
    waste_collection_details_page.enter_postcode 'AL3 8QE'
    waste_collection_details_page.find_address
    waste_collection_details_page.choose_first_address
    waste_collection_details_page.save_and_continue
    CheckTheCollectionAddressPage.new.check_page_displayed
    CheckTheCollectionAddressPage.new.save_and_continue
    sleep(1)
    contact_details_address_page.enter_organisation_name 'OrgName LTD'
    contact_details_address_page.enter_full_name 'Nick Almiron'
    contact_details_address_page.enter_email 'sample@mail.com'
    contact_details_address_page.enter_phone_number '+44 12345 6789(12-34)12'
    TestStatus.set_test_status(:waste_carrier_details_phone_number, '+44 12345 6789(12-34)12')
    contact_details_address_page.save_and_continue

    location_leaves_uk_page.choose_option 'Yes'
    location_leaves_uk_page.enter_location 'N,ew-Por\'t.'
    location_leaves_uk_page.save_and_continue

    sleep(2)
    countries_waste_will_travel_page.choose_option 'Yes'
    countries_waste_will_travel_page.wait_for_element('country')
    countries_waste_will_travel_page.select_country_of_waste
    countries_waste_will_travel_page.save_and_continue
    countries_waste_will_travel_page.page_refresh
    sleep(3)
    WasteTransitCountriesPage.new.choose_option 'No'
    sleep(1)
    WasteTransitCountriesPage.new.save_and_continue
  end
end
