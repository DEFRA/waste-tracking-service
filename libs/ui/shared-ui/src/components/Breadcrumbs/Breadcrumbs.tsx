import { Link } from '@wts/ui/navigation';

interface breadcrumbLink {
  text: string;
  href?: string;
}

interface BreadcrumbProps {
  items: Array<breadcrumbLink>;
  testId?: string;
}

export const Breadcrumbs = ({ items, testId }: BreadcrumbProps) => {
  return (
    <div className="govuk-breadcrumbs" data-testid={testId}>
      <ol className="govuk-breadcrumbs__list">
        {items.map((item, index) => {
          if (item.href) {
            return (
              <li
                className="govuk-breadcrumbs__list-item"
                key={`breadcrumb-link-${index}`}
              >
                <Link className="govuk-breadcrumbs__link" href={item.href}>
                  {item.text}
                </Link>
              </li>
            );
          } else {
            return (
              <li
                className="govuk-breadcrumbs__list-item"
                aria-current="page"
                key={`breadcrumb-link-${index}`}
              >
                {item.text}
              </li>
            );
          }
        })}
      </ol>
    </div>
  );
};
