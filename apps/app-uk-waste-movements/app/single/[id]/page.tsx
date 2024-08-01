import { Page } from '@wts/ui/shared-ui/server';
import { Metadata } from 'next';
import { Breadcrumbs } from '@wts/ui/shared-ui';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { getTranslations } from 'next-intl/server';
import { TaskList } from '@wts/app-uk-waste-movements/feature-single';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { options } from '../../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Create a new single waste movement',
  description: 'Create a new single waste movement',
};

interface PageProps {
  params: {
    id: string;
  };
}

export default async function TaskListPage({
  params,
}: PageProps): Promise<React.ReactNode> {
  const t = await getTranslations('single.taskList');
  const session = await getServerSession(options);

  const headerList = headers();
  let hostname = headerList.get('host') || '';
  let protocol = 'https';

  if (hostname.indexOf('localhost') === 0) {
    hostname = 'localhost:3000';
    protocol = 'http';
  }
  const apiUrl = `${protocol}://${hostname}/api`;

  let response: Response;
  try {
    response = await fetch(`${apiUrl}/ukwm/drafts/${params.id}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    });
  } catch (error) {
    console.error(error);
    return redirect('/error');
  }

  const draft = await response.json();

  const producerAndCollectionOverallStatus =
    draft.producerAndCollection.producer.contact.status === 'Complete' &&
    draft.producerAndCollection.producer.address.status === 'Complete' &&
    draft.producerAndCollection.wasteCollection.status === 'Complete'
      ? 'Completed'
      : 'Incomplete';

  return (
    <Page
      beforeChildren={
        <Breadcrumbs
          items={[
            { text: t('breadCrumbs.one'), href: '../../../' },
            { text: t('breadCrumbs.two'), href: '/' },
            { text: t('breadCrumbs.three') },
          ]}
        />
      }
    >
      <GovUK.GridRow>
        <GovUK.GridCol>
          <p className="govuk-heading-l">
            <GovUK.Caption>{t('caption')}</GovUK.Caption>
            {draft.producerAndCollection.producer.reference}
          </p>
          <GovUK.Heading>{t('title')}</GovUK.Heading>
          <TaskList
            sections={[
              {
                heading: t('producerAndCollection.heading'),
                description: t('producerAndCollection.description'),
                overallSectionStatus: producerAndCollectionOverallStatus,
                tasks: [
                  {
                    name: t('producerAndCollection.taskOne'),
                    href: `${params.id}/producer/address`,
                    status: draft.producerAndCollection.producer.address.status,
                  },
                  {
                    name: t('producerAndCollection.taskTwo'),
                    href: '/',
                    status: draft.producerAndCollection.producer.contact.status,
                  },
                  {
                    name: t('producerAndCollection.taskThree'),
                    href: '/',
                    status: draft.producerAndCollection.wasteCollection.status,
                  },
                ],
              },
            ]}
          />
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
