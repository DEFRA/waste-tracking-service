import { Link } from '@wts/ui/navigation';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslations } from 'next-intl';
import { Page } from '@wts/ui/shared-ui/server';

export default function NotFound() {
  const t = useTranslations('404');

  return (
    <Page>
      <GovUK.Heading size="l">{t('title')}</GovUK.Heading>
      <GovUK.Paragraph>{t('paragraph1')}</GovUK.Paragraph>
      <GovUK.Paragraph>{t('paragraph2')}</GovUK.Paragraph>
      <GovUK.Paragraph>
        <Link
          href={{
            pathname: '/account',
          }}
          className={'govuk-link govuk-link--no-visited-state'}
        >
          {t('link')}
        </Link>
      </GovUK.Paragraph>
    </Page>
  );
}
