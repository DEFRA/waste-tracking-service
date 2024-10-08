import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmittedFilters } from './SubmittedFilters';
import { NextIntlClientProvider } from 'next-intl';
import { useForm } from 'react-hook-form';

const messages = {
  multiples: {
    manage: {
      submittedTable: {
        filters: {
          heading: 'Filter',
          show: 'Show',
          hide: 'Hide',
          showAll: 'Show all sections',
          hideAll: 'Hide all sections',
          collectionDate: {
            title: 'Collection Date',
            hint: 'The date the waste was collected from the producer',
            error: 'Enter the full date',
            labelOne: 'Day',
            labelTwo: 'Month',
            labelThree: 'Year',
          },
          ewcCode: {
            title: 'EWC Code',
            hint: 'Search for any EWC code in your waste movements',
          },
          producerName: {
            title: 'Producer Name',
            hint: 'Search for a producer name',
          },
          wasteMovementId: {
            title: 'Waste Movement ID',
            hint: 'Search for a waste movement ID',
          },
          buttons: {
            apply: 'Apply filters',
            reset: 'Reset filters',
          },
        },
      },
    },
  },
};

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: () => null,
      useParams: () => null,
    };
  },
  useParams() {
    return { id: '123' };
  },
  usePathname() {
    return '/123';
  },
  useSearchParams() {
    return {
      get: () => null,
      has: () => null,
    };
  },
}));

beforeEach(() => {
  window.scrollTo = jest.fn();
});

describe('SubmittedFilters component', () => {
  it('renders the filter heading', () => {
    (useForm as jest.Mock).mockReturnValue({
      handleSubmit: () => null,
      register: () => null,
      formState: { errors: {} },
    });

    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <SubmittedFilters />
      </NextIntlClientProvider>,
    );

    const heading = screen.getByRole('heading', { level: 2, name: 'Filter' });

    expect(heading).toBeInTheDocument();
  });

  it('Renders a show all sections button', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <SubmittedFilters />
      </NextIntlClientProvider>,
    );

    const showAllButton = screen.getByRole('button', {
      name: 'Show all sections',
    });

    expect(showAllButton).toBeInTheDocument();
  });

  it('renders four show section buttons', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <SubmittedFilters />
      </NextIntlClientProvider>,
    );

    const collectionDateButton = screen.getByRole('button', {
      name: 'Collection Date',
    });
    const ewcCodeButton = screen.getByRole('button', {
      name: 'EWC Code',
    });
    const producerNameButton = screen.getByRole('button', {
      name: 'Producer Name',
    });
    const wasteMovementIdButton = screen.getByRole('button', {
      name: 'Waste Movement ID',
    });

    expect(collectionDateButton).toBeInTheDocument();
    expect(ewcCodeButton).toBeInTheDocument();
    expect(producerNameButton).toBeInTheDocument();
    expect(wasteMovementIdButton).toBeInTheDocument();
  });

  it('renders an apply filters button', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <SubmittedFilters />
      </NextIntlClientProvider>,
    );

    const applyButton = screen.getByRole('button', { name: 'Apply filters' });

    expect(applyButton).toBeInTheDocument();
  });

  it('renders a reset filters button', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <SubmittedFilters />
      </NextIntlClientProvider>,
    );

    const resetButton = screen.getByRole('button', { name: 'Reset filters' });

    expect(resetButton).toBeInTheDocument();
  });

  it('calls react-hook-form reset function when the Reset filters button is clicked', async () => {
    const mockReset = jest.fn();
    (useForm as jest.Mock).mockReturnValue({
      handleSubmit: () => null,
      register: () => null,
      reset: mockReset,
      formState: { errors: {} },
    });

    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <SubmittedFilters />
      </NextIntlClientProvider>,
    );

    const resetButton = screen.getByRole('button', { name: 'Reset filters' });

    await userEvent.click(resetButton);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
