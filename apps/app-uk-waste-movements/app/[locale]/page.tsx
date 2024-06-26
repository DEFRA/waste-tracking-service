import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslations } from 'next-intl';
import { Page, GridRow } from '@wts/ui/shared-ui/server';
import { DashboardCard } from '@wts/app-uk-waste-movements/feature-homepage/server';
import { Breadcrumbs } from '@wts/ui/shared-ui';

export const metadata = {
  title: 'UK waste movements',
};

export default function Index() {
  const t = useTranslations('moveWastePage');
  const breadcrumbs = [
    { text: t('breadcrumbs.home'), href: '../account' },
    { text: t('breadcrumbs.current') },
  ];
  return (
    <Page beforeChildren={<Breadcrumbs items={breadcrumbs} />}>
      <GovUK.GridRow>
        <GovUK.GridCol size={'full'}>
          <GovUK.Heading size={'l'} level={1}>
            {t('title')}
          </GovUK.Heading>
          <GovUK.SectionBreak size="m" />
          <GridRow display="flex-from-tablet">
            <GovUK.GridCol size={'full'}>
              <DashboardCard />
            </GovUK.GridCol>
          </GridRow>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
