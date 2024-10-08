import '@testing-library/jest-dom';
import { render, screen, act } from 'jest-utils';
import { SubmissionConfirmation } from 'features/multiples';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {
      id: '123',
    },
  }),
}));

describe('SubmissionConfirmation component', () => {
  it('Renders without errors', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={1}
        />,
      );
    });
  });

  it('Has an h1 heading', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={1}
        />,
      );
    });

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
  });

  it('Has the correct heading text for a multiple submission', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={100}
        />,
      );
    });

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toHaveTextContent('100 Annex VII records submitted');
  });

  it('Has the correct heading text for a single submission', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={1}
        />,
      );
    });

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toHaveTextContent('1 Annex VII record submitted');
  });

  it('Has a link to view the details with the correct text', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={1}
        />,
      );
    });

    const link = screen.getByRole('link', {
      name: 'View Annex VII record details for this transaction (opens in new tab)',
    });

    expect(link).toBeInTheDocument();
  });

  it('Has an h2 heading for the next steps', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={1}
        />,
      );
    });

    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'What you must do next',
    });

    expect(heading).toBeInTheDocument();
  });

  it('Has text prompting the user to the next steps', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={1}
        />,
      );
    });

    const promptText = screen.getByText(
      'Now you have completed the forms, you need to:',
    );
    expect(promptText).toBeInTheDocument();
  });

  it('Displays the first next step', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={1}
        />,
      );
    });

    const firstStep = screen.getByText(
      'make a note of all transaction numbers',
    );

    expect(firstStep).toBeInTheDocument();
  });

  it('Displays the second next step', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={1}
        />,
      );
    });

    const secondStep = screen.getByText(
      'send these details to any relevant UK regulatory authorities (if this applies to the nation you are exporting the waste from)',
    );

    expect(secondStep).toBeInTheDocument();
  });

  it('Displays the third next step', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={1}
        />,
      );
    });

    const secondStep = screen.getByText(
      'send relevant completed Annex VII records with the waste',
    );

    expect(secondStep).toBeInTheDocument();
  });

  it('Has an h2 for the update estimates', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={1}
        />,
      );
    });

    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Update records with actual details',
    });

    expect(heading).toBeInTheDocument();
  });

  it('Has text detailing the possible updates required', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={1}
        />,
      );
    });

    const promptText = screen.getByText(
      "If you've provided any estimates, you'll need to provide actual details as soon as possible. This includes the:",
    );

    expect(promptText).toBeInTheDocument();
  });

  it('Displays the first possible estimate update required', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={1}
        />,
      );
    });

    const firstEstimate = screen.getByText('weight or volume');

    expect(firstEstimate).toBeInTheDocument();
  });

  it('Displays the second possible estimate update required', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={1}
        />,
      );
    });

    const secondEstimate = screen.getByText('collection date');

    expect(secondEstimate).toBeInTheDocument();
  });

  it('Displays the correct text string for part one of legal requirement paragraph', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={1}
        />,
      );
    });

    const partOne = screen.getByText(
      'It is a legal requirement that completed Annex VII records travel with the waste. You can use your own or',
    );

    expect(partOne).toBeInTheDocument();
  });

  it('Displays the correct text string for part two of legal requirement paragraph', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={1}
        />,
      );
    });

    const partTwo = screen.getByText(
      'Any estimated details you have entered will not appear on the downloaded records.',
    );

    expect(partTwo).toBeInTheDocument();
  });

  it('Link to export page has correct text', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={1}
        />,
      );
    });

    const link = screen.getByRole('link', {
      name: 'Return to export waste from the UK',
    });

    expect(link).toBeInTheDocument();
  });

  it('Link to export page has correct href text', async () => {
    await act(async () => {
      render(
        <SubmissionConfirmation
          submissionId={'A123'}
          transactionId={'B456'}
          pageCount={100}
          recordCount={1}
        />,
      );
    });

    const link = screen.getByRole('link', {
      name: 'Return to export waste from the UK',
    });

    expect(link).toHaveAttribute('href', '/');
  });
});
