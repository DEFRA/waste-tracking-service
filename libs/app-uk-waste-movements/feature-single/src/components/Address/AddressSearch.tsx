'use client';
import { useState } from 'react';
import { Search } from './_Search';
import { Results } from './_Results';
import { NoResults } from './_NoResults';
import { Manual } from './_Manual';
import { Confirm } from './_Confirm';
import {
  AddressSearchResult,
  ContentStrings,
  FormValues,
  ViewType,
} from './types';
import { ukwm } from '@wts/util/shared-validation';

interface AddressSearchProps {
  defaultView?: ViewType;
  searchContent?: React.ReactNode;
  resultsContent?: React.ReactNode;
  noResultsContent?: React.ReactNode;
  confirmationContent?: React.ReactNode;
  manualContent?: React.ReactNode;
  editContent?: React.ReactNode;
  token: string | null | undefined;
  content: ContentStrings;
  id: string;
  savedFormValues: FormValues | undefined;
  destination: string;
  apiPartial: string;
  section: ukwm.Section;
}

const defaultFormValues: FormValues = {
  postcode: '',
  buildingNameOrNumber: '',
  addressLine1: '',
  addressLine2: '',
  townCity: '',
  country: '',
  addressSelection: '',
};

export function AddressSearch({
  defaultView = 'search',
  searchContent,
  resultsContent,
  noResultsContent,
  confirmationContent,
  manualContent,
  editContent,
  token,
  content,
  id,
  savedFormValues,
  destination,
  apiPartial,
  section,
}: AddressSearchProps): JSX.Element {
  const [formValues, setFormValues] = useState(
    savedFormValues ? savedFormValues : defaultFormValues,
  );
  const [view, setView] = useState(defaultView);
  const [addressData, setAddressData] = useState<AddressSearchResult[]>();

  const renderView = (): JSX.Element | null => {
    switch (view) {
      case 'search':
        return (
          <Search
            token={token}
            searchContent={searchContent}
            formValues={formValues}
            updateFormValues={setFormValues}
            updateView={setView}
            updateAddressData={setAddressData}
            content={content}
            section={section}
          />
        );
      case 'results':
        return (
          <Results
            id={id}
            token={token}
            resultsContent={resultsContent}
            formValues={formValues}
            addressData={addressData}
            updateFormValues={setFormValues}
            updateView={setView}
            content={content}
            apiPartial={apiPartial}
          />
        );
      case 'noResults':
        return (
          <NoResults
            noResultsContent={noResultsContent}
            formValues={formValues}
            updateFormValues={setFormValues}
            updateView={setView}
            content={content}
          />
        );
      case 'confirm':
        return (
          <Confirm
            id={id}
            token={token}
            confirmationContent={confirmationContent}
            formValues={formValues}
            addressData={addressData}
            updateFormValues={setFormValues}
            updateView={setView}
            content={content}
            destination={destination}
            apiPartial={apiPartial}
          />
        );
      case 'manual':
        return (
          <Manual
            id={id}
            token={token}
            manualContent={manualContent}
            formValues={formValues}
            updateFormValues={setFormValues}
            updateView={setView}
            content={content}
            apiPartial={apiPartial}
            section={section}
          />
        );
      case 'edit':
        return (
          <Manual
            id={id}
            token={token}
            manualContent={editContent}
            formValues={formValues}
            updateFormValues={setFormValues}
            updateView={setView}
            content={content}
            mode={'edit'}
            apiPartial={apiPartial}
            section={section}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderView()}</>;
}
