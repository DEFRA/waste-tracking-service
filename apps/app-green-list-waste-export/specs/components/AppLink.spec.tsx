import React from 'react';
import { render, screen, fireEvent, act } from 'jest-utils';
import '@testing-library/jest-dom';
import { AppLink } from 'components/AppLink';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

describe('App Link', () => {
  const href = '/example-link';
  const children = 'Link text';
  const onClick = jest.fn();
  const testId = 'app-link';

  it('renders a link with correct text and href', async () => {
    await act(async () => {
      render(
        <AppLink href={href} testId={testId}>
          {children}
        </AppLink>,
      );
    });
    const link = screen.getByTestId(testId);
    expect(link).toBeTruthy();
    expect(link).toHaveAttribute('href', href);
    expect(link).toHaveTextContent(children);
  });

  it('calls onClick handler when clicked', async () => {
    await act(async () => {
      render(
        <AppLink href={href} testId={testId} onClick={onClick}>
          {children}
        </AppLink>,
      );
    });
    const link = screen.getByTestId(testId);
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalled();
  });
});
