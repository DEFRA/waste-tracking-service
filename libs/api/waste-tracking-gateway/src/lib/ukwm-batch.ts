export type UkwmBulkSubmissionState =
  | {
      status: 'Processing';
      timestamp: Date;
    }
  | {
      status: 'FailedCsvValidation';
      timestamp: Date;
      error: string;
    }
  | {
      status: 'FailedValidation';
      timestamp: Date;
    }
  | {
      status: 'PassedValidation';
      timestamp: Date;
      hasEstimates: boolean;
    }
  | {
      status: 'Submitted';
      timestamp: Date;
      transactionId: string;
    };

export type UkwmBulkSubmission = {
  id: string;
  state: UkwmBulkSubmissionState;
};

export type GetUwkwmBulkSubmissionResponse = UkwmBulkSubmission;