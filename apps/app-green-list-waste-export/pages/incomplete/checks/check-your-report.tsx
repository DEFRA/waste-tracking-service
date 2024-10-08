import React, {
  useEffect,
  useState,
  useReducer,
  useCallback,
  FormEvent,
} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import { useTranslation } from 'react-i18next';
import {
  Footer,
  Header,
  BreadcrumbWrap,
  ButtonGroup,
  Paragraph,
  SubmissionNotFound,
  SaveReturnButton,
  Loading,
  SubmissionSummary,
} from 'components';

import { DraftSubmission } from '@wts/api/waste-tracking-gateway';
import useApiConfig from 'utils/useApiConfig';

interface State {
  data: DraftSubmission;
  isLoading: boolean;
  isError: boolean;
}

interface Action {
  type: 'DATA_FETCH_INIT' | 'DATA_FETCH_SUCCESS' | 'DATA_FETCH_FAILURE';
  payload?: DraftSubmission;
}

const initialWasteDescState: State = {
  data: null,
  isLoading: true,
  isError: false,
};

const checkYourReportReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'DATA_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'DATA_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'DATA_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const CheckYourReport = (): React.ReactNode => {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();
  const [checkYourReportPage, dispatchCheckYourReportPage] = useReducer(
    checkYourReportReducer,
    initialWasteDescState,
  );
  const [id, setId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    const fetchData = async () => {
      dispatchCheckYourReportPage({ type: 'DATA_FETCH_INIT' });
      if (id !== null) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}`,
          {
            headers: apiConfig,
          },
        )
          .then((response) => {
            if (response.ok) return response.json();
            else {
              dispatchCheckYourReportPage({ type: 'DATA_FETCH_FAILURE' });
            }
          })
          .then((data) => {
            if (data !== undefined) {
              dispatchCheckYourReportPage({
                type: 'DATA_FETCH_SUCCESS',
                payload: data,
              });
            }
          });
      }
    };
    fetchData();
  }, [router.isReady, id]);

  useEffect(() => {
    if (checkYourReportPage.data !== null) {
      const sectionOneStatus = isSectionComplete([
        'wasteDescription',
        'wasteQuantity',
      ]);
      const sectionTwoStatus = isSectionComplete([
        'exporterDetail',
        'importerDetail',
      ]);
      const sectionThreeStatus = isSectionComplete([
        'collectionDate',
        'carriers',
        'collectionDetail',
        'ukExitLocation',
        'transitCountries',
      ]);
      const sectionFourStatus = isSectionComplete(['recoveryFacilityDetail']);
      const sectionFiveStatus = isSectionComplete([
        'submissionConfirmation',
        'submissionDeclaration',
      ]);
      const statusCount = [
        sectionOneStatus,
        sectionTwoStatus,
        sectionThreeStatus,
        sectionFourStatus,
        sectionFiveStatus,
      ].filter(Boolean).length;

      if (statusCount != 4) {
        router.push('/incomplete/tasklist?id=' + id);
      }
    }
  }, [checkYourReportPage.data, id, router]);

  const isSectionComplete = (sections) => {
    const completedSections = sections.filter((section) => {
      return checkYourReportPage.data[section].status === 'Complete';
    });
    return sections.length === completedSections.length;
  };

  const handleSubmit = useCallback(
    async (e: FormEvent, returnToDraft = false) => {
      e.preventDefault();
      await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/submission-confirmation`,
        {
          method: 'PUT',
          headers: apiConfig,
          body: JSON.stringify({
            status: 'Complete',
            confirmation: true,
          }),
        },
      )
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          if (data !== undefined) {
            const path = returnToDraft
              ? `/incomplete/tasklist`
              : `/incomplete/checks/sign-declaration`;
            router.push({
              pathname: path,
              query: { id },
            });
          }
        });
    },
    [id, router, checkYourReportPage],
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            history.back();
          }}
        >
          {t('back')}
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('exportJourney.checkAnswers.pageTitle')}</title>
      </Head>

      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        {checkYourReportPage.isError && !checkYourReportPage.isLoading && (
          <SubmissionNotFound />
        )}
        {checkYourReportPage.isLoading && <Loading />}
        {!checkYourReportPage.isError && !checkYourReportPage.isLoading && (
          <>
            <GovUK.GridRow>
              <GovUK.GridCol setWidth="two-thirds">
                <GovUK.Caption id="my-reference">
                  {t('exportJourney.checkAnswers.caption')}
                </GovUK.Caption>
                <GovUK.Heading size="LARGE" id="template-heading">
                  {t('exportJourney.checkAnswers.heading')}
                </GovUK.Heading>
                <Paragraph>
                  {t('exportJourney.checkAnswers.paragraph')}
                </Paragraph>
                {((checkYourReportPage.data?.wasteQuantity.status ===
                  'Complete' &&
                  checkYourReportPage.data?.wasteQuantity?.value.type ===
                    'EstimateData') ||
                  (checkYourReportPage.data?.collectionDate.status ===
                    'Complete' &&
                    checkYourReportPage.data?.collectionDate?.value.type ===
                      'EstimateDate')) && (
                  <div id="estimate-date-warning-text">
                    <GovUK.WarningText>
                      {t('exportJourney.checkAnswers.warning')}
                    </GovUK.WarningText>
                  </div>
                )}

                <SubmissionSummary
                  data={checkYourReportPage.data}
                  apiConfig={apiConfig}
                />
              </GovUK.GridCol>
            </GovUK.GridRow>
            <ButtonGroup>
              <GovUK.Button id="saveButton" onClick={handleSubmit}>
                {t('exportJourney.checkAnswers.conformButton')}
              </GovUK.Button>
              <SaveReturnButton
                onClick={() =>
                  router.push({
                    pathname: `/incomplete/tasklist`,
                    query: { id },
                  })
                }
              >
                {t('exportJourney.checkAnswers.returnButton')}
              </SaveReturnButton>
            </ButtonGroup>
          </>
        )}
      </GovUK.Page>
    </>
  );
};

export default CheckYourReport;
CheckYourReport.auth = true;
