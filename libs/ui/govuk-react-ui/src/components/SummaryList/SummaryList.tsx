import { ReactNode } from 'react';

interface SummaryListProps {
  testId?: string;
  items: Array<{ key: string; value: ReactNode }>;
  hideBorders?: boolean;
  hideEmptyRows?: boolean;
}

function slugify(
  value: string | ReactNode | number | null | undefined
): string {
  if (!value) return '';
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function SummaryList({
  testId,
  items,
  hideBorders = false,
  hideEmptyRows = false,
}: SummaryListProps): JSX.Element {
  return (
    <dl
      className={`govuk-summary-list ${
        hideBorders && 'govuk-summary-list--no-border'
      }`}
      data-testid={testId}
    >
      {items.map((item, index) => {
        if (hideEmptyRows && item.value === undefined) {
          return null;
        } else {
          return (
            <div
              key={`${slugify(item.value)}-${index}`}
              className="govuk-summary-list__row"
            >
              <dt className="govuk-summary-list__key">{item.key}</dt>
              <dd className="govuk-summary-list__value">{item.value}</dd>
            </div>
          );
        }
      })}
    </dl>
  );
}
