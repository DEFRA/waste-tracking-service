import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import {
  PageLayout,
  getValidationResult,
  SubmissionConfirmation,
  SubmissionConfirmationBreadCrumbs,
  Loader,
} from 'features/multiples';

export default function ConfirmationPage(): React.ReactNode {
  const router = useRouter();

  const { isPending, data, error } = useQuery({
    queryKey: ['multiples', router.query.id],
    queryFn: async () => {
      return await getValidationResult(router.query.id as string);
    },
    enabled: !!router.query.id,
  });

  if (isPending) {
    return (
      <PageLayout setWidth="full">
        <Loader />
      </PageLayout>
    );
  }

  if (error) {
    router.push('/404');
    return;
  }

  const recordCount: number = data.data.state.submissions.length;
  const submissionId = data.data.id;
  const transactionId = data.data.state.transactionId;
  const pageCount = data.data.state.submissions.length * 2;

  return (
    <PageLayout breadCrumbs={<SubmissionConfirmationBreadCrumbs />}>
      <SubmissionConfirmation
        submissionId={submissionId}
        transactionId={transactionId}
        recordCount={recordCount}
        pageCount={pageCount}
      />
    </PageLayout>
  );
}

ConfirmationPage.auth = true;
