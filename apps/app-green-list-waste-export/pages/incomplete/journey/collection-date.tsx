import Head from 'next/head';
import * as GovUK from 'govuk-react';
import {
  BreadcrumbWrap,
  Footer,
  Header,
  ConditionalRadioWrap,
  ButtonGroup,
  ErrorSummary,
  SaveReturnButton,
  Paragraph,
  Loading,
  SubmissionNotFound,
} from 'components';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { isNotEmpty, validateDate, validateDateType } from 'utils/validators';
import useApiConfig from 'utils/useApiConfig';

const CollectionDate = (): React.ReactNode => {
  interface Date {
    day: string;
    month: string;
    year: string;
  }
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();
  const [id, setId] = useState<string | string[]>(null);
  const [data, setData] = useState(null);
  const [dateType, setDateType] = useState<'ActualDate' | 'EstimateDate'>(null);
  const [collectionDate, setCollectionDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    dateType?: string;
    date?: string;
  }>({});

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    const fetchData = async () => {
      if (id !== null) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/collection-date`,
          { headers: apiConfig },
        )
          .then((response) => {
            if (response.ok) return response.json();
            else {
              setIsLoading(false);
              setIsError(true);
            }
          })
          .then((data) => {
            if (data !== undefined) {
              if (data.status === 'Complete') {
                setData(data);
                const type =
                  data.value.type === 'EstimateDate'
                    ? 'estimateDate'
                    : 'actualDate';
                setDateType(data.value.type);
                setCollectionDate({
                  day: data.value[type].day,
                  month: data.value[type].month,
                  year: data.value[type].year,
                });
              }
              setIsLoading(false);
              setIsError(false);
            }
          });
      }
    };
    fetchData();
  }, [router.isReady, id]);

  const handleRadioChange = (e, dateType) => {
    setDateType(dateType);
    setCollectionDate({ day: null, month: null, year: null });
  };

  const handleReturnClick = async (e) => {
    await handleSubmit(e, true);
  };

  const handleSubmit = useCallback(
    async (e: FormEvent, returnToDraft = false) => {
      e.preventDefault();
      const newErrors = {
        dateType: validateDateType(dateType),
        date:
          dateType === 'ActualDate' || dateType === 'EstimateDate'
            ? validateDate(collectionDate)
            : null,
      };

      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        const type =
          dateType === 'EstimateDate' ? 'estimateDate' : 'actualDate';
        const body = {
          status: 'Complete',
          value: {
            type: dateType,
            actualDate: { ...data?.value?.actualDate },
            estimateDate: { ...data?.value?.estimateDate },
          },
        };

        body.value[type] = collectionDate;

        try {
          fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/collection-date`,
            {
              method: 'PUT',
              headers: apiConfig,
              body: JSON.stringify(body),
            },
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                const path = returnToDraft
                  ? `/incomplete/tasklist`
                  : `/incomplete/journey/waste-carriers`;
                router.push({
                  pathname: path,
                  query: { id },
                });
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    },
    [dateType, collectionDate],
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: router.query.dashboard
                ? `/incomplete/tasklist`
                : `/incomplete/about/description`,
              query: { id },
            });
          }}
        >
          {t('Back')}
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('exportJourney.wasteCollectionDate.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {isError && !isLoading && <SubmissionNotFound />}
            {isLoading && <Loading />}
            {!isError && !isLoading && (
              <>
                {errors && !!Object.keys(errors).length && (
                  <ErrorSummary
                    heading={t('errorSummary.title')}
                    errors={Object.keys(errors).map((key) => ({
                      targetName: key,
                      text: errors[key],
                    }))}
                  />
                )}
                <GovUK.Caption size="L">
                  {t('exportJourney.wasteCollectionDate.caption')}
                </GovUK.Caption>
                <form onSubmit={handleSubmit}>
                  <GovUK.Fieldset>
                    <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                      {t('exportJourney.wasteCollectionDate.title')}
                    </GovUK.Fieldset.Legend>
                    <Paragraph>
                      <>{t('exportJourney.wasteCollectionDate.intro')}</>
                    </Paragraph>
                    <GovUK.MultiChoice
                      label=""
                      mb={6}
                      meta={{
                        error: errors?.dateType,
                        touched: !!errors?.dateType,
                      }}
                    >
                      <GovUK.Radio
                        name="collectionDateKnown"
                        id="collectionDateKnownYes"
                        value="ActualDate"
                        checked={dateType === 'ActualDate'}
                        onChange={(e) => handleRadioChange(e, 'ActualDate')}
                      >
                        {t('exportJourney.wasteCollectionDate.radioYes')}
                      </GovUK.Radio>
                      {dateType === 'ActualDate' && (
                        <ConditionalRadioWrap>
                          <GovUK.HintText>
                            {t(
                              'exportJourney.wasteCollectionDate.radioYesHint',
                            )}
                          </GovUK.HintText>
                          <GovUK.DateField
                            defaultValues={collectionDate}
                            errorText={errors?.date}
                            inputs={{
                              day: {
                                maxLength: 2,
                                id: 'wasteCollActualDay',
                              },
                              month: {
                                maxLength: 2,
                                id: 'wasteCollActualMonth',
                              },
                              year: {
                                maxLength: 4,
                                id: 'wasteCollActualYear',
                              },
                            }}
                            input={{
                              onChange: (date) =>
                                setCollectionDate({
                                  ...collectionDate,
                                  ...date,
                                }),
                            }}
                          >
                            {null}
                          </GovUK.DateField>
                        </ConditionalRadioWrap>
                      )}
                      <GovUK.Radio
                        name="collectionDateKnown"
                        id="collectionDateKnownNo"
                        value="EstimateDate"
                        checked={dateType === 'EstimateDate'}
                        onChange={(e) => handleRadioChange(e, 'EstimateDate')}
                      >
                        {t('exportJourney.wasteCollectionDate.radioNo')}
                      </GovUK.Radio>
                      {dateType === 'EstimateDate' && (
                        <ConditionalRadioWrap>
                          <GovUK.HintText>
                            {t('exportJourney.wasteCollectionDate.radioNoHint')}
                          </GovUK.HintText>
                          <GovUK.DateField
                            defaultValues={collectionDate}
                            errorText={errors?.date}
                            inputs={{
                              day: {
                                maxLength: 2,
                                id: 'wasteCollEstimateDay',
                              },
                              month: {
                                maxLength: 2,
                                id: 'wasteCollEstimateMonth',
                              },
                              year: {
                                maxLength: 4,
                                id: 'wasteCollEstimateYear',
                              },
                            }}
                            input={{
                              onChange: (date) =>
                                setCollectionDate({
                                  ...collectionDate,
                                  ...date,
                                }),
                            }}
                          >
                            {null}
                          </GovUK.DateField>
                        </ConditionalRadioWrap>
                      )}
                    </GovUK.MultiChoice>
                  </GovUK.Fieldset>
                  <ButtonGroup>
                    <GovUK.Button id="saveButton">
                      {t('saveButton')}
                    </GovUK.Button>
                    <SaveReturnButton
                      id="saveReturnButton"
                      onClick={handleReturnClick}
                    />
                  </ButtonGroup>
                </form>
              </>
            )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default CollectionDate;
CollectionDate.auth = true;
