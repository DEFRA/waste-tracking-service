import React, { useEffect, useReducer, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import { useTranslation } from 'react-i18next';
import {
  AppLink,
  Footer,
  Header,
  BreadcrumbWrap,
  Paragraph,
  Pagination,
  SubmissionNotFound,
  Loading,
} from 'components';
import styled from 'styled-components';
import { format } from 'date-fns';
import { GetSubmissionsResponse } from '@wts/api/waste-tracking-gateway';
import { getApiConfig } from 'utils/api/apiConfig';
import { PageProps } from 'types/wts';
import useRefDataLookup from '../../../utils/useRefDataLookup';

export const getServerSideProps = async (context) => {
  return getApiConfig(context);
};

type State = {
  data: GetSubmissionsResponse;
  isLoading: boolean;
  isError: boolean;
};

type Action = {
  type: 'DATA_FETCH_INIT' | 'DATA_FETCH_SUCCESS' | 'DATA_FETCH_FAILURE';
  payload?: GetSubmissionsResponse;
};

const initialWasteDescState: State = {
  data: null,
  isLoading: true,
  isError: false,
};

const submittedAnnex7Reducer = (state: State, action: Action) => {
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

const TableCell = styled(GovUK.Table.Cell)`
  vertical-align: top;
`;

const TableCellActions = styled(GovUK.Table.Cell)`
  vertical-align: top;
`;

const TableHeader = styled(GovUK.Table.CellHeader)`
  vertical-align: top;
`;

const Action = styled.div`
  margin-bottom: 7px;
`;

const Index = ({ apiConfig }: PageProps) => {
  const { t } = useTranslation();
  const getRefData = useRefDataLookup(apiConfig);
  const router = useRouter();
  const [submittedAnnex7Page, dispatchSubmittedAnnex7Page] = useReducer(
    submittedAnnex7Reducer,
    initialWasteDescState
  );

  const [token, setToken] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setToken(router.query.token || null);
    }
  }, [router.isReady, router.query.token]);

  useEffect(() => {
    const fetchData = async () => {
      if (router.isReady) {
        dispatchSubmittedAnnex7Page({ type: 'DATA_FETCH_INIT' });
        let url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions?state=SubmittedWithActuals,UpdatedWithActuals&order=desc`;
        if (token) {
          url = `${url}&token=${token}`;
        }

        await fetch(url, { headers: apiConfig })
          .then((response) => {
            if (response.ok) return response.json();
            else {
              if (response.status === 403) {
                router.push({
                  pathname: `/403/`,
                });
              }
              dispatchSubmittedAnnex7Page({ type: 'DATA_FETCH_FAILURE' });
            }
          })
          .then((data) => {
            let filteredData;
            if (data) {
              filteredData = data;
            }
            dispatchSubmittedAnnex7Page({
              type: 'DATA_FETCH_SUCCESS',
              payload: filteredData,
            });
          });
      }
    };
    fetchData();
  }, [router.isReady, token]);

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.Breadcrumbs>
          <GovUK.Breadcrumbs.Link href="/">
            {t('app.parentTitle')}
          </GovUK.Breadcrumbs.Link>
          <GovUK.Breadcrumbs.Link href="/export">
            {t('app.title')}
          </GovUK.Breadcrumbs.Link>
          {t('exportJourney.submittedAnnexSeven.title')}
        </GovUK.Breadcrumbs>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('exportJourney.submittedAnnexSeven.title')}</title>
      </Head>

      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        {submittedAnnex7Page.isError && !submittedAnnex7Page.isLoading && (
          <SubmissionNotFound />
        )}
        {submittedAnnex7Page.isLoading && <Loading />}
        {!submittedAnnex7Page.isError && !submittedAnnex7Page.isLoading && (
          <>
            <GovUK.GridRow>
              <GovUK.GridCol setWidth="two-thirds">
                <GovUK.Heading size="LARGE" id="template-heading">
                  {t('exportJourney.submittedAnnexSeven.title')}
                </GovUK.Heading>
                <Paragraph>
                  {t('exportJourney.submittedAnnexSeven.paragraph')}
                </Paragraph>
              </GovUK.GridCol>
            </GovUK.GridRow>
            <GovUK.GridRow>
              <GovUK.GridCol>
                {submittedAnnex7Page.data === undefined ||
                submittedAnnex7Page.data.values.length === 0 ? (
                  <>
                    <GovUK.Heading size="SMALL">
                      {t('exportJourney.submittedAnnexSeven.notResultsMessage')}
                    </GovUK.Heading>
                  </>
                ) : (
                  <>
                    <GovUK.Table>
                      <GovUK.Table.Row>
                        <TableHeader id="table-header-transaction-number">
                          {t(
                            'exportJourney.updateAnnexSeven.table.transactionNumber'
                          )}
                        </TableHeader>

                        <TableHeader
                          setWidth="15%"
                          id="table-header-collection-date"
                        >
                          {t(
                            'exportJourney.submittedAnnexSeven.collectionDate'
                          )}
                        </TableHeader>

                        <TableHeader
                          setWidth="40%"
                          id="table-header-waste-code"
                        >
                          {t('exportJourney.updateAnnexSeven.table.wasteCode')}
                        </TableHeader>

                        <TableHeader
                          setWidth="15%"
                          id="table-header-your-own-ref"
                        >
                          {t(
                            'exportJourney.updateAnnexSeven.table.yourOwnReference'
                          )}
                        </TableHeader>

                        <TableHeader id="table-header-actions" setWidth="15%">
                          {t('exportJourney.updateAnnexSeven.table.actions')}
                        </TableHeader>
                      </GovUK.Table.Row>

                      {submittedAnnex7Page.data.values.map((item, index) => (
                        <GovUK.Table.Row key={index}>
                          <TableCell id={'transaction-id-' + index}>
                            {item.submissionDeclaration.status ===
                              'Complete' && (
                              <b>
                                {
                                  item.submissionDeclaration.values
                                    .transactionId
                                }
                              </b>
                            )}
                          </TableCell>
                          <TableCell id={'date-' + index}>
                            {item.collectionDate.status === 'Complete' && (
                              <>
                                {format(
                                  new Date(
                                    Number(
                                      item.collectionDate.value.actualDate.year
                                    ),
                                    Number(
                                      item.collectionDate.value.actualDate.month
                                    ) - 1,
                                    Number(
                                      item.collectionDate.value.actualDate.day
                                    )
                                  ),
                                  'd MMM y'
                                )}
                              </>
                            )}
                          </TableCell>

                          <TableCell id={'waste-code-' + index}>
                            {item.wasteDescription?.status === 'Complete' && (
                              <>
                                {item.wasteDescription?.wasteCode.type !==
                                  'NotApplicable' && (
                                  <>
                                    <strong>
                                      {item.wasteDescription?.wasteCode.code}:{' '}
                                    </strong>
                                    {getRefData(
                                      'WasteCode',
                                      item.wasteDescription?.wasteCode.code,
                                      item.wasteDescription?.wasteCode.type
                                    )}
                                  </>
                                )}
                                {item.wasteDescription?.wasteCode.type ===
                                  'NotApplicable' && (
                                  <span id="waste-code-not-provided">
                                    {t(
                                      'exportJourney.updateAnnexSeven.notApplicable'
                                    )}
                                  </span>
                                )}
                              </>
                            )}
                          </TableCell>
                          <TableCell id={'your-reference-' + index}>
                            {' '}
                            {item.reference && <span>{item.reference}</span>}
                            {!item.reference && (
                              <span id="your-reference-not-provided">
                                {t('exportJourney.checkAnswers.notProvided')}
                              </span>
                            )}
                          </TableCell>
                          <TableCellActions>
                            <Action>
                              <AppLink
                                id={'view-link-' + index}
                                href={{
                                  pathname: `/export/submitted/view`,
                                  query: { id: item.id },
                                }}
                              >
                                View record
                              </AppLink>
                            </Action>
                            <AppLink
                              id={'create-from-record-link-' + index}
                              href={{
                                pathname: `/export/templates/create-from-record`,
                                query: { id: item.id, context: 'index' },
                              }}
                            >
                              {t('templates.create.fromRecord.linkUseShort')}
                            </AppLink>
                          </TableCellActions>
                        </GovUK.Table.Row>
                      ))}
                    </GovUK.Table>
                    <Pagination
                      url="/export/submitted"
                      pages={submittedAnnex7Page.data.pages}
                      currentPage={submittedAnnex7Page.data.currentPage}
                      totalPages={submittedAnnex7Page.data.totalPages}
                    />
                  </>
                )}
              </GovUK.GridCol>
            </GovUK.GridRow>
          </>
        )}
      </GovUK.Page>
    </>
  );
};

export default Index;
Index.auth = true;
