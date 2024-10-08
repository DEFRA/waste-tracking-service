import * as GovUK from '@wts/ui/govuk-react-ui';
import { ContentStrings, FormValues, ViewType } from './types';
import Link from 'next/link';
import { Page } from '@wts/ui/shared-ui/server';

interface NoResultsProps {
  noResultsContent: React.ReactNode;
  formValues: FormValues;
  updateFormValues: (formValues: FormValues) => void;
  updateView: (view: ViewType) => void;
  content: ContentStrings;
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

export function NoResults({
  noResultsContent,
  formValues,
  updateFormValues,
  updateView,
  content,
}: NoResultsProps): JSX.Element {
  const handleClick = (e: React.MouseEvent, view: 'search' | 'manual') => {
    e.preventDefault();
    updateFormValues(defaultFormValues);
    updateView(view);
  };

  const handleBackLink = (event: React.MouseEvent) => {
    event.preventDefault();
    updateFormValues({ ...formValues, postcode: '' });
    updateView('search');
  };

  return (
    <Page beforeChildren={<GovUK.BackLink onClick={handleBackLink} />}>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          {noResultsContent}
          <GovUK.Paragraph>
            {content.notFound} {formValues.postcode}
            {formValues.buildingNameOrNumber &&
              ` and ${formValues.buildingNameOrNumber}`}
            . {content.notFoundPrompt}
          </GovUK.Paragraph>
          <GovUK.Paragraph>
            <Link href="#" onClick={(e) => handleClick(e, 'search')}>
              {content.searchAgain}
            </Link>
          </GovUK.Paragraph>
          <GovUK.Paragraph mb={8}>
            <Link href="#" onClick={(e) => handleClick(e, 'manual')}>
              {content.manualLinkShort}
            </Link>
          </GovUK.Paragraph>
          <GovUK.ButtonGroup>
            <GovUK.Button text="Save and continue" href="../" />
            <GovUK.Button secondary text="Save and return" href="../" />
          </GovUK.ButtonGroup>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
