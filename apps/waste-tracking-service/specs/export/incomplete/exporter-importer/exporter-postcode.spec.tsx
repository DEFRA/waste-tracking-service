import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import ExporterPostcode from 'pages/export/incomplete/exporter-importer/exporter-postcode';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

const defaultJsonResponse = { data: '123' };
const addressResponse = [
  {
    addressLine1: 'Hitachi Solutions',
    addressLine2: '110 Bishopsgate',
    townCity: 'LONDON',
    postcode: 'EC2N 4AY',
    country: 'United Kingdom',
  },
];

function setupFetchStub(data) {
  return function fetchStub(_url) {
    return new Promise((resolve) => {
      resolve({
        ok: true,
        json: () => Promise.resolve(data),
      });
    });
  };
}

beforeEach(() => {
  global.fetch = jest
    .fn()
    .mockImplementation(setupFetchStub(defaultJsonResponse));
});

afterEach(() => {
  global.fetch.mockClear();
});

describe('Exporter postcode page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<ExporterPostcode />);
    });
  });

  it('should show validation message if no content is entered', async () => {
    await act(async () => {
      render(<ExporterPostcode />);
    });

    const submitButton = screen.getByText('Find address');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText('Enter a postcode');
    expect(errorMessage).toBeTruthy();
  });

  it('should show validation message if invalid postcode is entered', async () => {
    await act(async () => {
      render(<ExporterPostcode />);
    });

    const postcode = screen.getByLabelText('Postcode');
    fireEvent.change(postcode, { target: { value: '123456' } });

    const submitButton = screen.getByText('Find address');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText('Enter a real postcode');
    expect(errorMessage).toBeTruthy();
  });

  it('should show address drop down and validation if no option is selected', async () => {
    await act(async () => {
      render(<ExporterPostcode />);
    });

    const postcode = screen.getByLabelText('Postcode');
    fireEvent.change(postcode, { target: { value: 'EC2N4AY' } });

    global.fetch = jest
      .fn()
      .mockImplementation(setupFetchStub(addressResponse));

    const submitButton = screen.getByText('Find address');
    fireEvent.click(submitButton);

    expect(await screen.findByText('Save and continue')).toBeTruthy();

    const submitButtonSave = screen.getByText('Save and continue');
    fireEvent.click(submitButtonSave);

    const errorMessage = screen.getAllByText('Select an address')[0];
    expect(errorMessage).toBeTruthy();
  });
});