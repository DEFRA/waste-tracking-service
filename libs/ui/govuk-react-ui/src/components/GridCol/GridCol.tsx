import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  size?:
    | 'full'
    | 'one-half'
    | 'one-third'
    | 'two-thirds'
    | 'one-quarter'
    | 'three-quarters'
    | 'two-thirds-from-desktop'
    | 'one-third-from-desktop';
  testId?: string;
};

export const GridCol = ({ children, size = 'two-thirds', testId }: Props) => {
  return (
    <div className={`govuk-grid-column-${size}`} data-testid={testId}>
      {children}
    </div>
  );
};
