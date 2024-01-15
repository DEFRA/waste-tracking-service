import React, {
  FormEvent,
  useCallback,
  useEffect,
  useState,
  useReducer,
} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  Footer,
  Header,
  CountrySelector,
  ConditionalRadioWrap,
  BreadcrumbWrap,
  Loading,
  SubmissionNotFound,
  SaveReturnButton,
  ButtonGroup,
  SummaryListWithActions,
} from 'components';
import {
  isNotEmpty,
  validateTransitCountries,
  validateTransitCountry,
  validateSingleTransitCountry,
  validateConfirmRemove,
} from 'utils/validators';
import { GetTransitCountriesResponse } from '@wts/api/waste-tracking-gateway';
import { getApiConfig } from 'utils/api/apiConfig';
import { PageProps } from 'types/wts';

export const getServerSideProps = async (context) => {
  return getApiConfig(context);
};

const VIEWS = {
  ADD_FORM: 1,
  LIST: 2,
  EDIT_FORM: 3,
  CONFIRM: 4,
};

type State = {
  data: GetTransitCountriesResponse;
  isLoading: boolean;
  isError: boolean;
  showView: number;
  provided: string;
  errors: {
    hasCountries?: string;
    country?: string;
    changedCountry?: string;
    confirmRemove?: string;
  };
};

type Action = {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'DATA_UPDATE'
    | 'PROVIDED_UPDATE'
    | 'ERRORS_UPDATE'
    | 'SHOW_VIEW';
  payload?: any;
};

const initialState: State = {
  data: { status: 'Started', values: [] },
  isLoading: true,
  isError: false,
  showView: VIEWS.LIST,
  provided: null,
  errors: null,
};

const wasteTransitReducer = (state: State, action: Action) => {
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
    case 'DATA_UPDATE':
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case 'PROVIDED_UPDATE':
      return {
        ...state,
        provided: action.payload,
      };
    case 'ERRORS_UPDATE':
      return {
        ...state,
        errors: action.payload,
      };
    case 'SHOW_VIEW':
      return {
        ...state,
        errors: null,
        isLoading: false,
        isError: false,
        showView: action.payload,
      };
    default:
      throw new Error();
  }
};

const TransitCountries = ({ apiConfig }: PageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [wasteTransitPage, dispatchWasteTransitPage] = useReducer(
    wasteTransitReducer,
    initialState
  );
  const [templateId, setTemplateId] = useState(null);
  const [countryToChangeRemove, setCountryToChangeRemove] =
    useState<number>(null);
  const [additionalProvided, setAdditionalProvided] = useState(null);
  const [additionalCountry, setAdditionalCountry] = useState(null);
  const [changeCountry, setChangeCountry] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setTemplateId(router.query.templateId);
    }
  }, [router.isReady, router.query.templateId]);

  useEffect(() => {
    const fetchData = async () => {
      dispatchWasteTransitPage({ type: 'DATA_FETCH_INIT' });
      if (templateId !== null) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/transit-countries`,
          { headers: apiConfig }
        )
          .then((response) => {
            if (response.ok) return response.json();
            else {
              dispatchWasteTransitPage({ type: 'DATA_FETCH_FAILURE' });
            }
          })
          .then((data) => {
            if (data !== undefined) {
              dispatchWasteTransitPage({
                type: 'DATA_FETCH_SUCCESS',
                payload: data,
              });
              if (data.values === undefined || data.values.length === 0) {
                if (data.status !== 'NotStarted') {
                  dispatchWasteTransitPage({
                    type: 'PROVIDED_UPDATE',
                    payload: 'No',
                  });
                }
                dispatchWasteTransitPage({
                  type: 'SHOW_VIEW',
                  payload: VIEWS.ADD_FORM,
                });
              }
            }
          });
      }
    };
    fetchData();
  }, [router.isReady, templateId]);

  const handleCancelReturn = (e) => {
    e.preventDefault();
    router.push({
      pathname: `/export/templates/tasklist`,
      query: { templateId },
    });
  };

  const handleSubmit = useCallback(
    async (e: FormEvent, returnToDraft = false) => {
      e.preventDefault();
      const hasCountries = wasteTransitPage.provided;
      const country = wasteTransitPage.data.values;
      const newErrors = {
        hasCountries: validateTransitCountries(hasCountries),
        country: validateTransitCountry(hasCountries, country),
      };
      if (isNotEmpty(newErrors)) {
        dispatchWasteTransitPage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchWasteTransitPage({ type: 'ERRORS_UPDATE', payload: null });
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/transit-countries`,
            {
              method: 'PUT',
              headers: apiConfig,
              body: JSON.stringify(wasteTransitPage.data),
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                if (wasteTransitPage.provided === 'No' || returnToDraft) {
                  router.push({
                    pathname: `/export/templates/tasklist`,
                    query: { templateId },
                  });
                } else {
                  dispatchWasteTransitPage({
                    type: 'SHOW_VIEW',
                    payload: VIEWS.LIST,
                  });
                }
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    },
    [templateId, wasteTransitPage, router]
  );

  const handleSubmitAdditionalCountry = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const newErrors = {
        hasCountries: validateTransitCountries(additionalProvided),
        country: validateSingleTransitCountry(
          additionalProvided,
          additionalCountry
        ),
      };
      if (isNotEmpty(newErrors)) {
        dispatchWasteTransitPage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchWasteTransitPage({ type: 'ERRORS_UPDATE', payload: null });
        if (additionalProvided === 'No') {
          router.push({
            pathname: `/export/templates/tasklist`,
            query: { templateId },
          });
        } else {
          const countries = wasteTransitPage.data.values;
          countries.push(additionalCountry);
          await updateCountryData(countries);
        }
      }
    },
    [additionalProvided, additionalCountry]
  );

  const handleConfirmRemove = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const newErrors = {
        confirmRemove: validateConfirmRemove(confirmRemove, 'country'),
      };
      if (isNotEmpty(newErrors)) {
        dispatchWasteTransitPage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchWasteTransitPage({ type: 'ERRORS_UPDATE', payload: null });
        const callBack = () => {
          dispatchWasteTransitPage({
            type: 'SHOW_VIEW',
            payload: VIEWS.LIST,
          });
        };
        if (confirmRemove === 'No') {
          callBack();
        } else {
          const countries = wasteTransitPage.data.values;
          countries.splice(countryToChangeRemove, 1);
          await updateCountryData(countries, callBack);
        }
        setConfirmRemove(null);
      }
    },
    [confirmRemove, countryToChangeRemove]
  );

  const handleEditSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const newErrors = {
        changedCountry: validateSingleTransitCountry('Yes', changeCountry),
      };
      if (isNotEmpty(newErrors)) {
        dispatchWasteTransitPage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchWasteTransitPage({ type: 'ERRORS_UPDATE', payload: null });
        const countries = wasteTransitPage.data.values;
        countries[countryToChangeRemove] = changeCountry;
        const callBack = () => {
          dispatchWasteTransitPage({
            type: 'SHOW_VIEW',
            payload: VIEWS.LIST,
          });
        };
        await updateCountryData(countries, callBack);
      }
    },
    [changeCountry, countryToChangeRemove]
  );

  const updateCountryData = async (countries, callBack?) => {
    dispatchWasteTransitPage({
      type: 'DATA_UPDATE',
      payload: { status: 'Complete', values: countries },
    });
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/transit-countries`,
        {
          method: 'PUT',
          headers: apiConfig,
          body: JSON.stringify(wasteTransitPage.data),
        }
      )
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          if (data !== undefined) {
            setAdditionalProvided(null);
            setAdditionalCountry(null);
            setChangeCountry(null);
            setConfirmRemove(null);
            if (typeof callBack === 'function') {
              callBack();
            }

            if (countries.length === 0) {
              dispatchWasteTransitPage({
                type: 'PROVIDED_UPDATE',
                payload: null,
              });
              dispatchWasteTransitPage({
                type: 'SHOW_VIEW',
                payload: VIEWS.ADD_FORM,
              });
            }
          }
        });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCountrySelect = (country) => {
    dispatchWasteTransitPage({
      type: 'DATA_UPDATE',
      payload: { status: 'Complete', values: [country] },
    });
  };

  const handleInputChange = (input) => {
    dispatchWasteTransitPage({
      type: 'PROVIDED_UPDATE',
      payload: input.target.value,
    });
    dispatchWasteTransitPage({
      type: 'DATA_UPDATE',
      payload: { status: 'Complete', values: [] },
    });
  };

  const handleDelete = (index) => {
    setCountryToChangeRemove(index);
    dispatchWasteTransitPage({
      type: 'SHOW_VIEW',
      payload: VIEWS.CONFIRM,
    });
  };

  const handleChange = (index) => {
    setCountryToChangeRemove(index);
    dispatchWasteTransitPage({
      type: 'SHOW_VIEW',
      payload: VIEWS.EDIT_FORM,
    });
  };

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            if (
              wasteTransitPage.showView === VIEWS.CONFIRM ||
              wasteTransitPage.showView === VIEWS.EDIT_FORM
            ) {
              dispatchWasteTransitPage({
                type: 'SHOW_VIEW',
                payload: VIEWS.LIST,
              });
            } else {
              router.push({
                pathname: router.query.dashboard
                  ? `/export/templates/tasklist`
                  : `/export/templates/journey/exit-location`,
                query: { templateId },
              });
            }
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
        <title>{t('exportJourney.wasteTransitCountries.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {wasteTransitPage.isError && !wasteTransitPage.isLoading && (
              <SubmissionNotFound />
            )}
            {wasteTransitPage.isLoading && <Loading />}
            {!wasteTransitPage.isError && !wasteTransitPage.isLoading && (
              <>
                {wasteTransitPage.errors &&
                  !!Object.keys(wasteTransitPage.errors).length && (
                    <GovUK.ErrorSummary
                      heading={t('errorSummary.title')}
                      errors={Object.keys(wasteTransitPage.errors).map(
                        (key) => ({
                          targetName: key,
                          text: wasteTransitPage.errors[key],
                        })
                      )}
                    />
                  )}
                <GovUK.Caption size="L">
                  {t('exportJourney.wasteTransitCountries.caption')}
                </GovUK.Caption>
                {wasteTransitPage.showView === VIEWS.LIST && (
                  <>
                    <GovUK.Heading size="L">
                      {t('exportJourney.wasteTransitCountries.listTitle')}
                    </GovUK.Heading>
                    <SummaryListWithActions
                      content={wasteTransitPage.data.values}
                      id="waste-transit-country-list"
                      prefixNumbers
                      actions={[
                        { label: 'Change', action: handleChange },
                        { label: 'Remove', action: handleDelete },
                      ]}
                    />
                    <form onSubmit={handleSubmitAdditionalCountry}>
                      <GovUK.Fieldset>
                        <GovUK.Fieldset.Legend size="M">
                          {t(
                            'exportJourney.wasteTransitCountries.additionalCountryLegend'
                          )}
                        </GovUK.Fieldset.Legend>
                        <GovUK.MultiChoice
                          mb={6}
                          hint={t(
                            'exportJourney.wasteTransitCountries.additionalCountryHint'
                          )}
                          label=""
                          meta={{
                            error: wasteTransitPage.errors?.hasCountries,
                            touched: !!wasteTransitPage.errors?.hasCountries,
                          }}
                        >
                          <GovUK.Radio
                            name="hasTransitCountries"
                            id="hasTransitCountriesYes"
                            checked={additionalProvided === 'Yes'}
                            onChange={() => setAdditionalProvided('Yes')}
                            value="Yes"
                          >
                            {t('radio.yes')}
                          </GovUK.Radio>
                          {additionalProvided === 'Yes' && (
                            <ConditionalRadioWrap>
                              <GovUK.FormGroup
                                error={!!wasteTransitPage.errors?.country}
                              >
                                <CountrySelector
                                  id={'country'}
                                  name={'country'}
                                  label={t('autocompleteHint')}
                                  hint={t(
                                    'exportJourney.wasteTransitCountries.additionalCountryAutocompleteHint'
                                  )}
                                  value={''}
                                  onChange={setAdditionalCountry}
                                  error={wasteTransitPage.errors?.country}
                                  apiConfig={apiConfig}
                                />
                              </GovUK.FormGroup>
                            </ConditionalRadioWrap>
                          )}
                          <GovUK.Radio
                            name="hasTransitCountries"
                            id="hasTransitCountriesNo"
                            checked={additionalProvided === 'No'}
                            onChange={() => setAdditionalProvided('No')}
                            value="No"
                          >
                            {t('radio.no')}
                          </GovUK.Radio>
                        </GovUK.MultiChoice>
                      </GovUK.Fieldset>
                      <ButtonGroup>
                        <GovUK.Button id="saveButton">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton onClick={handleCancelReturn}>
                          {t('templates.cancelReturnButton')}
                        </SaveReturnButton>
                      </ButtonGroup>
                    </form>
                  </>
                )}
                {wasteTransitPage.showView === VIEWS.ADD_FORM && (
                  <>
                    <form onSubmit={handleSubmit}>
                      <GovUK.Fieldset>
                        <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                          {t('exportJourney.wasteTransitCountries.title')}
                        </GovUK.Fieldset.Legend>
                        <GovUK.MultiChoice
                          mb={6}
                          label=""
                          meta={{
                            error: wasteTransitPage.errors?.hasCountries,
                            touched: !!wasteTransitPage.errors?.hasCountries,
                          }}
                        >
                          <GovUK.Radio
                            name="hasTransitCountries"
                            id="hasTransitCountriesYes"
                            checked={wasteTransitPage.provided === 'Yes'}
                            onChange={(e) => handleInputChange(e)}
                            value="Yes"
                          >
                            {t('radio.yes')}
                          </GovUK.Radio>
                          {wasteTransitPage.provided === 'Yes' && (
                            <ConditionalRadioWrap>
                              <GovUK.FormGroup
                                error={!!wasteTransitPage.errors?.country}
                              >
                                <CountrySelector
                                  id={'country'}
                                  name={'country'}
                                  label={t('autocompleteHint')}
                                  hint={t(
                                    'exportJourney.wasteTransitCountries.hint'
                                  )}
                                  value={''}
                                  onChange={handleCountrySelect}
                                  error={wasteTransitPage.errors?.country}
                                  apiConfig={apiConfig}
                                />
                              </GovUK.FormGroup>
                            </ConditionalRadioWrap>
                          )}
                          <GovUK.Radio
                            name="hasTransitCountries"
                            id="hasTransitCountriesNo"
                            checked={wasteTransitPage.provided === 'No'}
                            onChange={(e) => handleInputChange(e)}
                            value="No"
                          >
                            {t('radio.no')}
                          </GovUK.Radio>
                        </GovUK.MultiChoice>
                      </GovUK.Fieldset>
                      <ButtonGroup>
                        <GovUK.Button id="saveButton">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton onClick={handleCancelReturn}>
                          {t('templates.cancelReturnButton')}
                        </SaveReturnButton>{' '}
                      </ButtonGroup>
                    </form>
                  </>
                )}
                {wasteTransitPage.showView === VIEWS.EDIT_FORM && (
                  <>
                    <form onSubmit={handleEditSubmit}>
                      <GovUK.Fieldset>
                        <GovUK.Fieldset.Legend
                          isPageHeading
                          size="LARGE"
                          mb={6}
                        >
                          {t(
                            'exportJourney.wasteTransitCountries.changeCountryTitle',
                            {
                              country:
                                wasteTransitPage.data.values[
                                  countryToChangeRemove
                                ],
                            }
                          )}
                        </GovUK.Fieldset.Legend>
                        <GovUK.FormGroup
                          error={!!wasteTransitPage.errors?.changedCountry}
                        >
                          <CountrySelector
                            id={'country'}
                            name={'country'}
                            label={t('autocompleteHint')}
                            hint={t(
                              'exportJourney.wasteTransitCountries.additionalCountryHint'
                            )}
                            value={''}
                            onChange={setChangeCountry}
                            error={wasteTransitPage.errors?.changedCountry}
                            apiConfig={apiConfig}
                          />
                        </GovUK.FormGroup>
                      </GovUK.Fieldset>
                      <ButtonGroup>
                        <GovUK.Button id="saveButton">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton onClick={handleCancelReturn}>
                          {t('templates.cancelReturnButton')}
                        </SaveReturnButton>
                      </ButtonGroup>
                    </form>
                  </>
                )}
                {wasteTransitPage.showView === VIEWS.CONFIRM && (
                  <>
                    <form onSubmit={handleConfirmRemove}>
                      <GovUK.Fieldset>
                        <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                          {t(
                            'exportJourney.wasteTransitCountries.confirmRemoveTitle',
                            {
                              country:
                                wasteTransitPage.data.values[
                                  countryToChangeRemove
                                ],
                            }
                          )}
                        </GovUK.Fieldset.Legend>
                        <GovUK.MultiChoice
                          mb={6}
                          label=""
                          meta={{
                            error: wasteTransitPage.errors?.confirmRemove,
                            touched: !!wasteTransitPage.errors?.confirmRemove,
                          }}
                        >
                          <GovUK.Radio
                            name="removeTransitCountries"
                            id="removeTransitCountriesYes"
                            checked={confirmRemove === 'Yes'}
                            onChange={(e) => setConfirmRemove(e.target.value)}
                            value="Yes"
                          >
                            {t('radio.yes')}
                          </GovUK.Radio>
                          <GovUK.Radio
                            name="removeTransitCountries"
                            id="removeTransitCountriesNo"
                            checked={confirmRemove === 'No'}
                            onChange={(e) => setConfirmRemove(e.target.value)}
                            value="No"
                          >
                            {t('radio.no')}
                          </GovUK.Radio>
                        </GovUK.MultiChoice>
                      </GovUK.Fieldset>
                      <ButtonGroup>
                        <GovUK.Button id="saveButton">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton onClick={handleCancelReturn}>
                          {t('templates.cancelReturnButton')}
                        </SaveReturnButton>
                      </ButtonGroup>
                    </form>
                  </>
                )}
              </>
            )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default TransitCountries;
TransitCountries.auth = true;
