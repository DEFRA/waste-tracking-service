import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import EwcCodes from 'pages/export/incomplete/about/ewc-code';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

const defaultJsonResponse = { status: 'NotStarted' };
const startedJsonResponse = {
  status: 'Started',
  wasteCode: {
    type: 'AnnexIIIA',
    code: 'B1010 and B1050',
  },
  ewcCodes: [
    {
      code: '010101',
    },
  ],
};
const refDataResponse = [
  {
    code: '010101',
    description: 'wastes from mineral metalliferous excavation',
  },
  {
    code: '010102',
    description: 'wastes from mineral non-metalliferous excavation',
  },
  {
    code: '010304*',
    description: 'acid-generating tailings from processing of sulphide ore',
  },
  {
    code: '010305*',
    description: 'other tailings containing hazardous substances',
  },
  {
    code: '010306',
    description: 'tailings other than those mentioned in 01 03 04 and 01 03 05',
  },
  {
    code: '010307*',
    description:
      'other wastes containing hazardous substances from physical and chemical processing of metalliferous minerals',
  },
];

function setupFetchStub(started = false) {
  return function fetchStub(_url) {
    let data = {};
    if (_url.includes('/wts-info/ewc-codes?language=en')) {
      data = refDataResponse;
    }
    if (_url.includes('/submissions/123/waste-description')) {
      data = defaultJsonResponse;
    }
    if (_url.includes('/submissions/123/waste-description') && started) {
      data = startedJsonResponse;
    }
    return new Promise((resolve) => {
      resolve({
        ok: true,
        json: () => Promise.resolve(data),
      });
    });
  };
}

global.fetch = jest.fn().mockImplementation(setupFetchStub());

describe('EWC code page', () => {
  it('should display the page', async () => {
    await act(async () => {
      render(<EwcCodes />);
    });
  });

  it('should show validation message if no radio is selected', async () => {
    await act(async () => {
      render(<EwcCodes />);
    });

    const pageTitle = screen.getByText(
      'What is the first European Waste Catalogue (EWC) code?'
    );
    expect(pageTitle).toBeTruthy();

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show validation message if no EWC code is entered', async () => {
    await act(async () => {
      render(<EwcCodes />);
    });

    const ewcCode = screen.getByLabelText('Enter code');
    fireEvent.click(ewcCode);

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show validation message if only 4 chars entered for EWC code', async () => {
    await act(async () => {
      render(<EwcCodes />);
    });

    const ewcCode = screen.getByLabelText('Enter code');
    fireEvent.change(ewcCode, { target: { value: '0101' } });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show list page if EWC codes are returned from the API', async () => {
    global.fetch = jest.fn().mockImplementation(setupFetchStub(true));

    await act(async () => {
      render(<EwcCodes />);
    });

    const ewcCode = screen.getByText('01 01 01');
    expect(ewcCode).toBeTruthy();

    const pageTitle = screen.getByText(
      'You have added 1 European Waste Catalogue (EWC) code'
    );
    expect(pageTitle).toBeTruthy();
  });

  it('should show validation message if selected YES to additional EWC code and do not enter a code', async () => {
    await act(async () => {
      render(<EwcCodes />);
    });

    const yesRadio = screen.getByLabelText('Yes');
    fireEvent.click(yesRadio);

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show confirm view when remove link is clicked', async () => {
    await act(async () => {
      render(<EwcCodes />);
    });

    const removeLink = screen.getByText('Remove');
    fireEvent.click(removeLink);

    const pageTitle = screen.getByText(
      'Are you sure you want to remove code: 01 01 01?'
    );
    expect(pageTitle).toBeTruthy();
  });
});
