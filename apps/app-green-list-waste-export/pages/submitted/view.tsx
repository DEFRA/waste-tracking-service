import React, { useEffect, useState, useReducer } from 'react';
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
  DownloadPDFLink,
  SubmittedSummary,
  AppLink,
} from 'components';
import styled from 'styled-components';
import { Submission } from '@wts/api/waste-tracking-gateway';
import useApiConfig from 'utils/useApiConfig';

interface State {
  data: Submission;
  isLoading: boolean;
  isError: boolean;
}

interface Action {
  type: 'DATA_FETCH_INIT' | 'DATA_FETCH_SUCCESS' | 'DATA_FETCH_FAILURE';
  payload?: Submission;
}

const initialState: State = {
  data: null,
  isLoading: true,
  isError: false,
};

const ActionHeader = styled(GovUK.H2)`
  border-top: 2px solid #1d70b8;
  padding-top: 1em;
  margin-bottom: 0.5em;
`;

const viewRecordReducer = (state: State, action: Action) => {
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

const ViewRecord = (): React.ReactNode => {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();
  const [viewRecordPage, dispatchViewRecordPage] = useReducer(
    viewRecordReducer,
    initialState,
  );
  const [id, setId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    const fetchData = async () => {
      dispatchViewRecordPage({ type: 'DATA_FETCH_INIT' });
      if (id !== null) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}?submitted=true`,
          {
            headers: apiConfig,
          },
        )
          .then((response) => {
            if (response.ok) return response.json();
            else {
              dispatchViewRecordPage({ type: 'DATA_FETCH_FAILURE' });
            }
          })
          .then((data) => {
            if (data !== undefined) {
              dispatchViewRecordPage({
                type: 'DATA_FETCH_SUCCESS',
                payload: data,
              });
            }
          });
      }
    };
    fetchData();
  }, [router.isReady, id]);

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: `/submitted`,
            });
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
        <title>{t('exportJourney.submittedView.caption')}</title>
      </Head>

      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        {viewRecordPage.isError && !viewRecordPage.isLoading && (
          <SubmissionNotFound />
        )}
        {viewRecordPage.isLoading && <Loading />}
        {!viewRecordPage.isError && !viewRecordPage.isLoading && (
          <>
            {
              <GovUK.GridRow>
                <GovUK.GridCol setWidth="two-thirds">
                  <GovUK.Caption id="my-reference">
                    {t('exportJourney.submittedView.caption')}
                  </GovUK.Caption>
                  <GovUK.Heading size="LARGE" id="template-heading">
                    {t('exportJourney.submittedView.title')}:{' '}
                    {viewRecordPage.data.submissionDeclaration.transactionId}
                  </GovUK.Heading>
                  <SubmittedSummary
                    data={viewRecordPage.data}
                    showChangeLinks={false}
                    apiConfig={apiConfig}
                  />
                  <ButtonGroup>
                    <SaveReturnButton
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push({
                          pathname: `/submitted`,
                        });
                      }}
                    >
                      {t('exportJourney.submittedView.button')}
                    </SaveReturnButton>
                  </ButtonGroup>
                </GovUK.GridCol>
                <GovUK.GridCol setWidth="one-third">
                  <ActionHeader size="S">{t('actions')}</ActionHeader>
                  <DownloadPDFLink
                    submissionId={id}
                    transactionId={
                      viewRecordPage.data.submissionDeclaration.transactionId
                    }
                    data={viewRecordPage.data}
                  >
                    {t('exportJourney.submittedView.downloadPDF')}
                  </DownloadPDFLink>
                  <Paragraph>
                    {t('exportJourney.submittedView.downloadPDFinfo')}
                  </Paragraph>
                  <AppLink
                    href={{
                      pathname: `/templates/create-from-record`,
                      query: { id, context: 'view' },
                    }}
                  >
                    {t('templates.create.fromRecord.linkUse')}
                  </AppLink>
                </GovUK.GridCol>
              </GovUK.GridRow>
            }
          </>
        )}
      </GovUK.Page>
    </>
  );
};

export default ViewRecord;
ViewRecord.auth = true;
