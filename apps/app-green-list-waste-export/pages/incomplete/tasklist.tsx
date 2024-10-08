import React, { useEffect, useState, useReducer } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import { useTranslation } from 'react-i18next';
import {
  AppLink,
  Footer,
  Header,
  BreadCrumbLink,
  BreadcrumbWrap,
  DocumentStatus,
  Paragraph,
  SubmissionNotFound,
  SaveReturnButton,
  Loading,
  NotificationBanner,
} from 'components';
import styled from 'styled-components';
import { BORDER_COLOUR } from 'govuk-colours';
import { DraftSubmission } from '@wts/api/waste-tracking-gateway';
import { differenceInSeconds, parseISO } from 'date-fns';
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

const tasklistReducer = (state: State, action: Action) => {
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

const TaskListOL = styled.ol`
  counter-reset: tasklist;
  list-style-type: none;
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 0;
  max-width: 550px;
  > li {
    counter-increment: tasklist;
  }
`;

const TaskListSectionHeading = styled(GovUK.H2)`
  display: table;
  margin-top: 1em;
  margin-bottom: 1em;
  &:before {
    content: counter(tasklist) '.';
    display: inline-block;
    min-width: 1em;
    @media (min-width: 40.0625em) {
      min-width: 30px;
    }
  }
`;

const TaskListItems = styled(GovUK.UnorderedList)`
  padding: 0;
  margin: 0 0 40px;
  list-style: none;
  @media (min-width: 40.0625em) {
    padding-left: 30px;
    margin-bottom: 60px;
  }
`;

const TaskListItem = styled(GovUK.ListItem)`
  border-bottom: 1px solid ${BORDER_COLOUR};
  margin-bottom: 0 !important;
  padding-top: 10px;
  padding-bottom: 10px;
  overflow: hidden;
  &:first-child {
    border-top: 1px solid ${BORDER_COLOUR};
  }
`;

const TaskName = styled.span`
  display: block;
  @media (min-width: 28.125em) {
    float: left;
  }
`;

const TaskStatus = styled.span`
  margin-top: 10px;
  margin-bottom: 5px;
  display: inline-block;
  @media (min-width: 28.125em) {
    float: right;
    margin: 0;
  }
`;

const Tasklist = (): React.ReactNode => {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();
  const [tasklistPage, dispatchTasklistPage] = useReducer(
    tasklistReducer,
    initialWasteDescState,
  );
  const [id, setId] = useState<string>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [context, setContext] = useState<string>(null);

  const [sectionStatus, setSectionStatus] = useState<number>(0);

  useEffect(() => {
    if (router.isReady) {
      setId(String(router.query.id));
      if (router.query.context) {
        setContext(String(router.query.context));
      }
    }
  }, [router.isReady, router.query.id, router.query.context]);

  useEffect(() => {
    dispatchTasklistPage({ type: 'DATA_FETCH_INIT' });

    if (id !== null) {
      fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}`, {
        headers: apiConfig,
      })
        .then((response) => {
          if (response.ok) return response.json();
          else {
            dispatchTasklistPage({ type: 'DATA_FETCH_FAILURE' });
          }
        })
        .then((data) => {
          if (data !== undefined) {
            if (data.submissionState) {
              if (data.submissionState.status === 'Deleted') {
                dispatchTasklistPage({
                  type: 'DATA_FETCH_FAILURE',
                });
              } else {
                dispatchTasklistPage({
                  type: 'DATA_FETCH_SUCCESS',
                  payload: data,
                });
                setShowBanner(
                  differenceInSeconds(
                    new Date(),
                    parseISO(data?.submissionState.timestamp),
                  ) < 5,
                );
              }
            }
          }
        });
    }
  }, [id]);

  useEffect(() => {
    if (tasklistPage.data !== null) {
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
      setSectionStatus(statusCount);
    }
  }, [tasklistPage.data]);

  const isSectionComplete = (sections) => {
    const completedSections = sections.filter((section) => {
      return tasklistPage.data[section].status === 'Complete';
    });
    return sections.length === completedSections.length;
  };

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.Breadcrumbs>
          <BreadCrumbLink href="/" id="index-link">
            {t('app.parentTitle')}
          </BreadCrumbLink>
          <BreadCrumbLink href="/" id="glw-index-link">
            {t('app.title')}
          </BreadCrumbLink>
          <BreadCrumbLink
            id="add-reference-link"
            href={`/incomplete/reference?id=${id}`}
          >
            {t('yourReference.breadcrumb')}
          </BreadCrumbLink>
          <GovUK.Breadcrumbs.Link>
            {t('exportJourney.submitAnExport.title')}
          </GovUK.Breadcrumbs.Link>
        </GovUK.Breadcrumbs>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('exportJourney.submitAnExport.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        {tasklistPage.isError && !tasklistPage.isLoading && (
          <SubmissionNotFound />
        )}
        {tasklistPage.isLoading && <Loading />}

        {!tasklistPage.isError && !tasklistPage.isLoading && (
          <>
            <GovUK.GridRow>
              <GovUK.GridCol setWidth="two-thirds">
                {showBanner && context === 'createdFromTemplate' && (
                  <NotificationBanner
                    headingText={t('templates.use.banner.title')}
                    type={'important'}
                  >
                    {t('templates.use.banner.content')}
                  </NotificationBanner>
                )}

                {tasklistPage.data?.reference && (
                  <GovUK.Caption id="my-reference">
                    {t('exportJourney.submitAnExport.yourRef')}:{' '}
                    {tasklistPage.data?.reference}
                  </GovUK.Caption>
                )}

                <GovUK.Heading size="LARGE" id="template-heading">
                  {t('exportJourney.submitAnExport.title')}
                </GovUK.Heading>

                <Paragraph>{t('exportJourney.submitAnExport.intro')}</Paragraph>

                <GovUK.Heading as="h2" size="SMALL">
                  {sectionStatus < 5
                    ? t('exportJourney.submitAnExport.submissionIncomplete')
                    : t('exportJourney.submitAnExport.submissionComplete')}
                </GovUK.Heading>

                <Paragraph>
                  {`You have completed ${sectionStatus} of 5 sections.`}
                </Paragraph>
              </GovUK.GridCol>
            </GovUK.GridRow>

            <TaskListOL>
              <li>
                <TaskListSectionHeading size="M">
                  {t('exportJourney.submitAnExport.SectionOne.heading')}
                </TaskListSectionHeading>
                <TaskListItems>
                  <TaskListItem>
                    <TaskName>
                      <AppLink
                        href={{
                          pathname: `/incomplete/about/waste-code`,
                          query: { id },
                        }}
                      >
                        {t(
                          'exportJourney.submitAnExport.SectionOne.wasteCodesAndDescription',
                        )}
                      </AppLink>
                    </TaskName>
                    <TaskStatus>
                      <DocumentStatus
                        id="waste-codes-and-description-status"
                        status={tasklistPage.data?.wasteDescription.status}
                      />
                    </TaskStatus>
                  </TaskListItem>
                  <TaskListItem>
                    <TaskName id="quantity-of-waste">
                      {tasklistPage.data?.wasteQuantity.status ===
                      'CannotStart' ? (
                        t(
                          'exportJourney.submitAnExport.SectionOne.quantityOfWaste',
                        )
                      ) : (
                        <AppLink
                          href={{
                            pathname: `/incomplete/about/quantity`,
                            query: { id, context: 'tasklist' },
                          }}
                        >
                          {t(
                            'exportJourney.submitAnExport.SectionOne.quantityOfWaste',
                          )}
                        </AppLink>
                      )}
                    </TaskName>
                    <TaskStatus>
                      <DocumentStatus
                        id="quantity-of-waste-status"
                        status={tasklistPage.data?.wasteQuantity.status}
                      />
                    </TaskStatus>
                  </TaskListItem>
                </TaskListItems>
              </li>
              <li>
                <TaskListSectionHeading size="M">
                  {t('exportJourney.submitAnExport.SectionTwo.heading')}
                </TaskListSectionHeading>
                <TaskListItems>
                  <TaskListItem>
                    <TaskName>
                      <AppLink
                        href={{
                          pathname:
                            tasklistPage.data?.exporterDetail.status ===
                            'Complete'
                              ? `/incomplete/exporter-importer/exporter-address`
                              : tasklistPage.data?.exporterDetail.status ===
                                  'Started'
                                ? `/incomplete/exporter-importer/exporter-details-manual`
                                : `/incomplete/exporter-importer/exporter-postcode`,
                          query: { id, dashboard: true },
                        }}
                        id="exporter-details"
                      >
                        {t(
                          'exportJourney.submitAnExport.SectionTwo.exporterDetails',
                        )}
                      </AppLink>
                    </TaskName>
                    <TaskStatus>
                      <DocumentStatus
                        id="exporter-details-status"
                        status={tasklistPage.data?.exporterDetail.status}
                      />
                    </TaskStatus>
                  </TaskListItem>
                  <TaskListItem>
                    <TaskName>
                      <AppLink
                        href={{
                          pathname: `/incomplete/exporter-importer/importer-details`,
                          query: { id },
                        }}
                        id="importer-details"
                      >
                        {t(
                          'exportJourney.submitAnExport.SectionTwo.importerDetails',
                        )}
                      </AppLink>
                    </TaskName>
                    <TaskStatus>
                      <DocumentStatus
                        id="importer-details-status"
                        status={tasklistPage.data?.importerDetail.status}
                      />
                    </TaskStatus>
                  </TaskListItem>
                </TaskListItems>
              </li>
              <li>
                <TaskListSectionHeading size="M">
                  {t('exportJourney.submitAnExport.SectionThree.heading')}
                </TaskListSectionHeading>
                <TaskListItems>
                  <TaskListItem>
                    <TaskName>
                      <AppLink
                        href={{
                          pathname: `/incomplete/journey/collection-date`,
                          query: { id, dashboard: true },
                        }}
                        id="collection-date"
                      >
                        {t(
                          'exportJourney.submitAnExport.SectionThree.collectionDate',
                        )}
                      </AppLink>
                    </TaskName>
                    <TaskStatus>
                      <DocumentStatus
                        id="collection-date-status"
                        status={tasklistPage.data?.collectionDate.status}
                      />
                    </TaskStatus>
                  </TaskListItem>
                  <TaskListItem>
                    <TaskName>
                      <AppLink
                        href={{
                          pathname: `/incomplete/journey/waste-carriers`,
                          query: { id },
                        }}
                        id="waste-carriers"
                      >
                        {t(
                          'exportJourney.submitAnExport.SectionThree.wasteCarriers',
                        )}
                      </AppLink>
                    </TaskName>
                    <TaskStatus>
                      <DocumentStatus
                        id="waste-carriers-status"
                        status={tasklistPage.data?.carriers.status}
                      />
                    </TaskStatus>
                  </TaskListItem>
                  <TaskListItem>
                    <TaskName>
                      <AppLink
                        href={{
                          pathname: `/incomplete/journey/collection-details`,
                          query: { id, dashboard: true },
                        }}
                        id="collection-details"
                      >
                        {t(
                          'exportJourney.submitAnExport.SectionThree.wasteCollectionDetails',
                        )}
                      </AppLink>
                    </TaskName>
                    <TaskStatus>
                      <DocumentStatus
                        id="waste-collection-details-status"
                        status={tasklistPage.data?.collectionDetail.status}
                      />
                    </TaskStatus>
                  </TaskListItem>
                  <TaskListItem>
                    <TaskName>
                      <AppLink
                        href={{
                          pathname: `/incomplete/journey/exit-location`,
                          query: { id, dashboard: true },
                        }}
                        id="location-waste-leaves-the-uk"
                      >
                        {t(
                          'exportJourney.submitAnExport.SectionThree.locationWasteLeavesUK',
                        )}
                      </AppLink>
                    </TaskName>
                    <TaskStatus>
                      <DocumentStatus
                        id="location-waste-leaves-the-uk-status"
                        status={tasklistPage.data?.ukExitLocation.status}
                      />
                    </TaskStatus>
                  </TaskListItem>
                  <TaskListItem>
                    <TaskName>
                      <AppLink
                        href={{
                          pathname: `/incomplete/journey/transit-countries`,
                          query: { id, dashboard: true },
                        }}
                        id="countries-waste-will-travel-through"
                      >
                        {t(
                          'exportJourney.submitAnExport.SectionThree.countriesWasteWillTravel',
                        )}
                      </AppLink>
                    </TaskName>
                    <TaskStatus>
                      <DocumentStatus
                        id="countries-waste-will-travel-through-status"
                        status={tasklistPage.data?.transitCountries.status}
                      />
                    </TaskStatus>
                  </TaskListItem>
                </TaskListItems>
              </li>
              <li>
                <TaskListSectionHeading size="M">
                  {t('exportJourney.submitAnExport.SectionFour.heading')}
                </TaskListSectionHeading>
                <TaskListItems>
                  <TaskListItem>
                    <TaskName>
                      {tasklistPage.data?.recoveryFacilityDetail.status ===
                        'CannotStart' &&
                        t(
                          'exportJourney.submitAnExport.SectionFour.recoveryFacilityLaboratory',
                        )}
                      {(tasklistPage.data?.wasteDescription.status ===
                        'Started' ||
                        tasklistPage.data?.wasteDescription.status ===
                          'Complete') &&
                        tasklistPage.data?.wasteDescription?.wasteCode?.type ===
                          'NotApplicable' && (
                          <AppLink
                            id="recovery-facility-or-laboratory"
                            href={{
                              pathname: `/incomplete/treatment/laboratory`,
                              query: { id, dashboard: true },
                            }}
                          >
                            {t(
                              'exportJourney.submitAnExport.SectionFour.laboratoryDetails',
                            )}
                          </AppLink>
                        )}
                      {(tasklistPage.data?.wasteDescription.status ===
                        'Started' ||
                        tasklistPage.data?.wasteDescription.status ===
                          'Complete') &&
                        tasklistPage.data?.wasteDescription?.wasteCode?.type !==
                          'NotApplicable' &&
                        tasklistPage.data?.wasteDescription?.wasteCode?.type !==
                          undefined && (
                          <AppLink
                            id="recovery-facility-or-laboratory"
                            href={{
                              pathname: `/incomplete/treatment/interim-site`,
                              query: { id, dashboard: true },
                            }}
                          >
                            {t(
                              'exportJourney.submitAnExport.SectionFour.recoveryDetails',
                            )}
                          </AppLink>
                        )}
                    </TaskName>
                    <TaskStatus>
                      <DocumentStatus
                        id="recovery-facility-or-laboratory-status"
                        status={
                          tasklistPage.data?.recoveryFacilityDetail.status
                        }
                      />
                    </TaskStatus>
                  </TaskListItem>
                </TaskListItems>
              </li>

              <li>
                <TaskListSectionHeading size="M">
                  {t('exportJourney.submitAnExport.SectionFive.heading')}
                </TaskListSectionHeading>
                <TaskListItems>
                  <TaskListItem>
                    <TaskName>
                      {tasklistPage.data?.submissionConfirmation.status !==
                      'CannotStart' ? (
                        <AppLink
                          href={{
                            pathname: `/incomplete/checks/check-your-report`,
                            query: { id, dashboard: true },
                          }}
                        >
                          {t(
                            'exportJourney.submitAnExport.SectionFive.checkYourReport',
                          )}
                        </AppLink>
                      ) : (
                        t(
                          'exportJourney.submitAnExport.SectionFive.checkYourReport',
                        )
                      )}
                    </TaskName>
                    <TaskStatus>
                      <DocumentStatus
                        id="check-your-report-status"
                        status={
                          tasklistPage.data?.submissionConfirmation.status
                        }
                      />
                    </TaskStatus>
                  </TaskListItem>

                  <TaskListItem>
                    <TaskName>
                      {tasklistPage.data?.submissionDeclaration.status !==
                      'CannotStart' ? (
                        <AppLink
                          href={{
                            pathname: `/incomplete/checks/sign-declaration`,
                            query: { id, dashboard: true },
                          }}
                        >
                          {t(
                            'exportJourney.submitAnExport.SectionFive.signDeclaration',
                          )}
                        </AppLink>
                      ) : (
                        t(
                          'exportJourney.submitAnExport.SectionFive.signDeclaration',
                        )
                      )}
                    </TaskName>
                    <TaskStatus>
                      <DocumentStatus
                        id="sign-declaration-status"
                        status={tasklistPage.data?.submissionDeclaration.status}
                      />
                    </TaskStatus>
                  </TaskListItem>
                </TaskListItems>
              </li>
            </TaskListOL>

            <SaveReturnButton
              onClick={() =>
                router.push({
                  pathname: `/`,
                })
              }
            >
              {t('exportJourney.submitAnExport.returnLink')}
            </SaveReturnButton>
          </>
        )}
      </GovUK.Page>
    </>
  );
};

export default Tasklist;
Tasklist.auth = true;
