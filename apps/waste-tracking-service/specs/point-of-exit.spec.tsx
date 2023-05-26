import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import PointOfExit from '../pages/point-of-exit';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ wasteCode: { type: 'NotApplicable' } }),
  })
);

describe('Point Of Exit page', () => {
  it('should fetch the data when the component mounts', async () => {
    await act(async () => {
      render(<PointOfExit />);
    });
  });

  it('should display a loading message while data is being fetched', async () => {
    global.fetch.mockImplementationOnce(
      () =>
        new Promise(() => {
          return;
        })
    );

    await act(async () => {
      render(<PointOfExit />);
    });

    expect(screen.getByText('Loading')).toBeTruthy();
  });

  it('should display an error message if the data fetching fails', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));

    await act(async () => {
      render(<PointOfExit />);
    });

    expect(
      screen.getByText('The export record has not been found')
    ).toBeTruthy();
  });

  it('should show validation message if no radio is selected', async () => {
    await act(async () => {
      render(<PointOfExit />);
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show validation message if selected YES and do not enter a location', async () => {
    await act(async () => {
      render(<PointOfExit />);
    });

    const yesRadioLabel = screen.getByLabelText('Yes');
    fireEvent.click(yesRadioLabel);

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });
});
