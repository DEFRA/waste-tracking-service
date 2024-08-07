'use client';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { formatAddress } from './formatAddress';
import { AddressSearchResult, FormValues, ViewType } from './types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Page } from '@wts/ui/shared-ui/server';

interface ConfirmProps {
  token: string | null | undefined;
  confirmationContent: React.ReactNode;
  formValues: FormValues;
  addressData?: AddressSearchResult[];
  updateFormValues: (formValues: FormValues) => void;
  updateView: (view: ViewType) => void;
  id: string;
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

export function Confirm({
  token,
  confirmationContent,
  formValues,
  addressData,
  updateFormValues,
  updateView,
  id,
}: ConfirmProps): JSX.Element {
  const router = useRouter();
  const handleSearchAgain = (e: React.MouseEvent) => {
    e.preventDefault();
    updateFormValues(defaultFormValues);
    updateView('search');
  };

  const handleSecondaryButton = async (event: React.MouseEvent) => {
    await handleSubmit(event, true);
  };

  const handleSubmit = async (
    event: React.FormEvent,
    returnToDraft = false,
  ): Promise<void> => {
    event.preventDefault();

    let response: Response;
    try {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/ukwm/drafts/${id}/producer-address?saveAsDraft=false`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: formValues.addressSelection,
        },
      );
      if (response.ok) {
        if (returnToDraft) {
          router.push(`/single/${id}`);
        } else {
          router.push(`/single/${id}/producer/contact`);
        }
      }
    } catch (error) {
      console.error(error);
      router.push('/error');
    }
  };

  const handleBackLink = (event: React.MouseEvent) => {
    event.preventDefault();
    updateFormValues({ ...formValues, postcode: '' });
    let backView: ViewType = 'edit';
    if (addressData && addressData.length === 1) {
      backView = 'search';
    } else if (addressData && addressData.length > 1) {
      backView = 'results';
    }
    updateView(backView);
  };

  return (
    <Page beforeChildren={<GovUK.BackLink onClick={handleBackLink} />}>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          {confirmationContent}

          <form onSubmit={handleSubmit}>
            {addressData && (
              <GovUK.Paragraph>
                {addressData.length}{' '}
                {addressData.length > 1 ? 'addresses' : 'address'} found for{' '}
                {formValues.postcode}.{' '}
                <Link href="#" onClick={handleSearchAgain}>
                  Search again
                </Link>
              </GovUK.Paragraph>
            )}
            <GovUK.InsetText>
              {formatAddress(formValues.addressSelection)}
            </GovUK.InsetText>
            <GovUK.ButtonGroup>
              <GovUK.Button
                text="Use this address and continue"
                id="button-save-continue"
              />
              <GovUK.Button
                secondary
                text="Save and return"
                id="button-save-and-return"
                onClick={(e: React.MouseEvent) => handleSecondaryButton(e)}
              />
            </GovUK.ButtonGroup>
            <GovUK.Paragraph>
              <Link href="#" onClick={handleSearchAgain}>
                Use a different address
              </Link>
            </GovUK.Paragraph>
          </form>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
