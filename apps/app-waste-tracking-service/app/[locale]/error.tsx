'use client';

import React from 'react';
import { Page } from '@wts/ui/shared-ui/server';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error }: ErrorPageProps): JSX.Element {
  console.error(error);
  return (
    <Page>
      <h1 className="govuk-heading-l">
        Sorry, there is a problem with the service
      </h1>
      <p>Try again later.</p>
    </Page>
  );
}
