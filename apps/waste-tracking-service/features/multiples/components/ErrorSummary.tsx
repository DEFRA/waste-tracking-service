import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import { AppLink } from 'components';
import { BulkSubmissionValidationRowError } from '@wts/api/waste-tracking-gateway';

interface ErrorRowTableProps {
  errors: BulkSubmissionValidationRowError[];
}

export function ErrorSummary({ errors }: ErrorRowTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <GovUK.H3>{t('multiples.errorSummaryPage.errorSummary.title')}</GovUK.H3>
      <GovUK.Paragraph>
        {t('multiples.errorSummaryPage.errorSummary.startParagraph')}
      </GovUK.Paragraph>
      <GovUK.Table
        head={
          <GovUK.Table.Row>
            <GovUK.Table.CellHeader setWidth="one-quarter" scope="col">
              {t('multiples.errorSummaryPage.errorSummaryTableHeader.row')}
            </GovUK.Table.CellHeader>
            <GovUK.Table.CellHeader setWidth="one-half" scope="col">
              {t('multiples.errorSummaryPage.errorSummaryTableHeader.error')}
            </GovUK.Table.CellHeader>
            <GovUK.Table.CellHeader setWidth="one-quarter" scope="col">
              {t('multiples.errorSummaryPage.errorSummaryTableHeader.action')}
            </GovUK.Table.CellHeader>
          </GovUK.Table.Row>
        }
      >
        {errors.map((row, index) => (
          <GovUK.Table.Row key={`error-summary-row-${index}`}>
            <GovUK.Table.Cell>
              <strong>{row.rowNumber}</strong>
            </GovUK.Table.Cell>
            <GovUK.Table.Cell>
              {row.errorAmount}{' '}
              {t(
                'multiples.errorSummaryPage.errorSummaryTableHeader.errorCount',
                { count: row.errorAmount }
              )}
            </GovUK.Table.Cell>
            <GovUK.Table.Cell>
              <AppLink
                href={`/export/multiples/${router.query.id}/errors/${row.rowNumber}`}
                id={`action-view-error-`}
              >
                {t('multiples.errorSummaryPage.errorSummaryTable.actionLink')}
              </AppLink>
            </GovUK.Table.Cell>
          </GovUK.Table.Row>
        ))}
      </GovUK.Table>
    </>
  );
}