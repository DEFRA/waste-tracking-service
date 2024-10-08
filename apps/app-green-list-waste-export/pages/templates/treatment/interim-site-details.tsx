import React, {
  FormEvent,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  Footer,
  Header,
  BreadcrumbWrap,
  SubmissionNotFound,
  Loading,
  ButtonGroup,
  ErrorSummary,
  SaveReturnButton,
  RadioList,
  Paragraph,
  CountrySelector,
} from 'components';
import styled from 'styled-components';

import {
  isNotEmpty,
  validateEmail,
  validateInternationalPhone,
  validateInternationalFax,
} from 'utils/validators';

import i18n from 'i18next';
import useApiConfig from 'utils/useApiConfig';
import { getTreatmentStatus } from '../../../utils/statuses/getTreatmentStatus';
const VIEWS = {
  ADDRESS_DETAILS: 1,
  CONTACT_DETAILS: 2,
  RECOVERY_CODE: 3,
};

interface State {
  data: any;
  facilityData: any;
  isLoading: boolean;
  isError: boolean;
  showView: number;
  errors: any;
}

interface Action {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'DATA_UPDATE'
    | 'FACILITY_DATA_UPDATE'
    | 'ERRORS_UPDATE'
    | 'SHOW_VIEW';
  payload?: any;
}

const initialState: State = {
  data: null,
  facilityData: null,
  isLoading: true,
  isError: false,
  showView: VIEWS.ADDRESS_DETAILS,
  errors: null,
};

const interimReducer = (state: State, action: Action) => {
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
    case 'FACILITY_DATA_UPDATE':
      return {
        ...state,
        facilityData: action.payload,
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

const AddressField = styled(GovUK.InputField)`
  @media (min-width: 641px) {
    width: 75%;
  }
`;

const TelephoneInput = styled(GovUK.Input)`
  max-width: 20.5em;
`;

type codeType = Array<{
  code: string;
  description: string;
}>;

const InterimSiteDetails = (): React.ReactNode => {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();
  const [interimPage, dispatchInterimPage] = useReducer(
    interimReducer,
    initialState,
  );
  const [refData, setRefData] = useState<codeType>();
  const [templateId, setTemplateId] = useState<string>(null);
  const [page, setPage] = useState(null);
  const [startPage, setStartPage] = useState(1);
  const [addressDetails, setAddressDetails] = useState<{
    name: string;
    address: string;
    country: string;
  }>({
    name: '',
    address: '',
    country: '',
  });

  const [contactDetails, setContactDetails] = useState<{
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber: string;
  }>({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    faxNumber: '',
  });

  const [recoveryFacilityType, setRecoveryFacilityType] = useState<{
    type: string;
    recoveryCode: string;
  }>({ type: 'InterimSite', recoveryCode: '' });

  useEffect(() => {
    if (router.isReady) {
      setTemplateId(String(router.query.templateId));
      setPage(router.query.page);
    }
  }, [router.isReady, router.query.templateId]);

  const currentLanguage = i18n.language;

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/reference-data/recovery-codes`,
        { headers: apiConfig },
      )
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          if (data !== undefined) {
            const filterInterimCodes = data.filter(
              (code) => code.value.interim,
            );
            setRefData(filterInterimCodes);
          }
        });
    };
    if (currentLanguage) {
      fetchData();
    }
  }, [currentLanguage]);

  useEffect(() => {
    const fetchData = async () => {
      dispatchInterimPage({ type: 'DATA_FETCH_INIT' });
      if (templateId !== null) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/recovery-facility`,
          { headers: apiConfig },
        )
          .then((response) => {
            if (response.ok) return response.json();
            else {
              dispatchInterimPage({ type: 'DATA_FETCH_FAILURE' });
            }
          })
          .then((data) => {
            if (data !== undefined) {
              dispatchInterimPage({
                type: 'DATA_FETCH_SUCCESS',
                payload: data,
              });
              if (data.values !== undefined) {
                const interimSite = data.values.filter(
                  (site) => site.recoveryFacilityType?.type === 'InterimSite',
                );
                const emptyRecords = data.values.filter(
                  (site) => site.addressDetails === undefined,
                );

                if (interimSite.length > 0) {
                  const [site] = interimSite;
                  dispatchInterimPage({
                    type: 'FACILITY_DATA_UPDATE',
                    payload: site,
                  });
                  if (site.addressDetails !== undefined)
                    setAddressDetails(site.addressDetails);

                  if (site.contactDetails !== undefined)
                    setContactDetails(site.contactDetails);

                  if (site.recoveryFacilityType !== undefined)
                    setRecoveryFacilityType(site.recoveryFacilityType);

                  if (page !== undefined) {
                    dispatchInterimPage({
                      type: 'SHOW_VIEW',
                      payload: VIEWS[page],
                    });
                  }
                } else if (emptyRecords.length > 0) {
                  const [emptyInterimSite] = emptyRecords;
                  dispatchInterimPage({
                    type: 'FACILITY_DATA_UPDATE',
                    payload: emptyInterimSite,
                  });
                  setStartPage(VIEWS.ADDRESS_DETAILS);
                } else {
                  createInterimSite();
                }
              } else {
                createInterimSite();
              }
            }
          });
      }
    };
    fetchData();
  }, [router.isReady, templateId, startPage]);

  const handleSubmit = useCallback(
    async (e: FormEvent, form, returnToDraft = false) => {
      e.preventDefault();
      let nextView;
      let newErrors;
      let body;
      switch (form) {
        case 'address':
          nextView = VIEWS.CONTACT_DETAILS;
          newErrors = {};
          body = {
            values: [
              {
                ...interimPage.facilityData,
                addressDetails,
                recoveryFacilityType: {
                  ...interimPage.facilityData.recoveryFacilityType,
                  ...recoveryFacilityType,
                },
              },
            ],
          };
          break;
        case 'contact':
          nextView = VIEWS.RECOVERY_CODE;

          newErrors = {
            emailAddress: validateEmail(contactDetails?.emailAddress, true),
            phoneNumber: validateInternationalPhone(
              contactDetails?.phoneNumber,
              true,
            ),
            faxNumber: validateInternationalFax(
              contactDetails?.faxNumber,
              true,
            ),
          };
          body = {
            values: [
              {
                ...interimPage.facilityData,
                contactDetails,
              },
            ],
          };
          break;
        case 'code':
          newErrors = {};

          body = {
            values: [
              {
                ...interimPage.facilityData,
                recoveryFacilityType,
              },
            ],
          };
          break;
      }
      body.status = getTreatmentStatus(interimPage.data, body);

      if (isNotEmpty(newErrors)) {
        dispatchInterimPage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchInterimPage({ type: 'ERRORS_UPDATE', payload: null });
        dispatchInterimPage({ type: 'DATA_FETCH_INIT' });
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/recovery-facility/${interimPage.facilityData.id}`,
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
                const currentData = interimPage.data;
                let updatedData;
                if (currentData.values !== undefined) {
                  updatedData = {
                    ...currentData,
                    values: currentData.values.map((obj) => {
                      return data.values.find((o) => o.id === obj.id) || obj;
                    }),
                  };
                } else {
                  updatedData = data;
                }

                dispatchInterimPage({
                  type: 'FACILITY_DATA_UPDATE',
                  payload: data.values[0],
                });

                dispatchInterimPage({
                  type: 'DATA_FETCH_SUCCESS',
                  payload: updatedData,
                });

                if (returnToDraft) {
                  router.push({
                    pathname: `/templates/tasklist`,
                    query: { templateId },
                  });
                } else if (form === 'code') {
                  router.push({
                    pathname: `/templates/treatment/recovery-facility-details`,
                    query: { templateId },
                  });
                } else {
                  dispatchInterimPage({
                    type: 'SHOW_VIEW',
                    payload: nextView,
                  });
                }
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    },
    [interimPage.data, addressDetails, contactDetails, recoveryFacilityType],
  );

  const onAddressDetailsChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails((addressDetails) => ({
      ...addressDetails,
      [name]: value || '',
    }));
  };

  const onCountryChange = (option) => {
    setAddressDetails((addressDetails) => ({
      ...addressDetails,
      ['country']: option,
    }));
  };

  const onContactDetailsChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((contactDetails) => ({
      ...contactDetails,
      [name]: value || '',
    }));
  };

  const createInterimSite = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/recovery-facility`,
        {
          method: 'POST',
          headers: apiConfig,
          body: JSON.stringify({ status: 'Started' }),
        },
      )
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          if (data !== undefined) {
            const [interimSite] = data.values;
            dispatchInterimPage({
              type: 'FACILITY_DATA_UPDATE',
              payload: interimSite,
            });
            dispatchInterimPage({
              type: 'DATA_FETCH_SUCCESS',
              payload: { status: 'Started', values: data.values },
            });
            dispatchInterimPage({
              type: 'SHOW_VIEW',
              payload: VIEWS.ADDRESS_DETAILS,
            });
          }
        });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelReturn = (e) => {
    e.preventDefault();
    router.push({
      pathname: `/templates/tasklist`,
      query: { templateId },
    });
  };

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            if (startPage === interimPage.showView) {
              router.push({
                pathname: `/templates/treatment/interim-site`,
                query: { templateId },
              });
            } else {
              dispatchInterimPage({
                type: 'SHOW_VIEW',
                payload: interimPage.showView - 1,
              });
            }
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
        <title>{t('exportJourney.interimSite.addressTitle')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {interimPage.isError && !interimPage.isLoading && (
              <SubmissionNotFound />
            )}
            {interimPage.isLoading && <Loading />}
            {!interimPage.isError && !interimPage.isLoading && (
              <>
                {interimPage.errors &&
                  !!Object.keys(interimPage.errors).length && (
                    <ErrorSummary
                      heading={t('errorSummary.title')}
                      errors={Object.keys(interimPage.errors).map((key) => ({
                        targetName: key,
                        text: interimPage.errors[key],
                      }))}
                    />
                  )}
                <GovUK.Caption size="L">
                  {t('exportJourney.recoveryFacilities.caption')}
                </GovUK.Caption>
                {interimPage.showView === VIEWS.ADDRESS_DETAILS && (
                  <div id="page-interim-site-address-details">
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.interimSite.addressTitle')}
                    </GovUK.Heading>
                    <Paragraph>{t('address.hintCannotBeInUk')}</Paragraph>
                    <form onSubmit={(e) => handleSubmit(e, 'address')}>
                      <AddressField
                        mb={6}
                        input={{
                          name: 'name',
                          id: 'name',
                          value: addressDetails?.name,
                          maxLength: 250,
                          onChange: onAddressDetailsChange,
                        }}
                        meta={{
                          error: interimPage.errors?.name,
                          touched: !!interimPage.errors?.name,
                        }}
                      >
                        {t('exportJourney.interimSite.name')}
                      </AddressField>
                      <GovUK.TextArea
                        mb={6}
                        input={{
                          name: 'address',
                          id: 'address',
                          value: addressDetails?.address,
                          onChange: onAddressDetailsChange,
                        }}
                        meta={{
                          error: interimPage.errors?.address,
                          touched: !!interimPage.errors?.address,
                        }}
                      >
                        {t('address')}
                      </GovUK.TextArea>
                      <CountrySelector
                        id="country"
                        name="country"
                        label={t('address.country')}
                        error={interimPage.errors?.country}
                        value={addressDetails?.country}
                        onChange={onCountryChange}
                        size={75}
                        apiConfig={apiConfig}
                      />
                      <ButtonGroup>
                        <GovUK.Button id="saveButtonAddress">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton onClick={handleCancelReturn}>
                          {t('templates.cancelReturnButton')}
                        </SaveReturnButton>
                      </ButtonGroup>
                    </form>
                  </div>
                )}
                {interimPage.showView === VIEWS.CONTACT_DETAILS && (
                  <div id="page-interim-site-contact-details">
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.interimSite.contactTitle')}
                    </GovUK.Heading>
                    <form
                      onSubmit={(e) => handleSubmit(e, 'contact')}
                      noValidate={true}
                    >
                      <GovUK.InputField
                        mb={6}
                        hint={t('contact.nameHint')}
                        input={{
                          name: 'fullName',
                          id: 'fullName',
                          value: contactDetails?.fullName,
                          maxLength: 250,
                          onChange: onContactDetailsChange,
                        }}
                        meta={{
                          error: interimPage.errors?.fullName,
                          touched: !!interimPage.errors?.fullName,
                        }}
                      >
                        {t('exportJourney.interimSite.contactPerson')}
                      </GovUK.InputField>
                      <GovUK.InputField
                        mb={6}
                        input={{
                          name: 'emailAddress',
                          id: 'emailAddress',
                          type: 'email',
                          value: contactDetails?.emailAddress,
                          maxLength: 250,
                          onChange: onContactDetailsChange,
                        }}
                        meta={{
                          error: interimPage.errors?.emailAddress,
                          touched: !!interimPage.errors?.emailAddress,
                        }}
                      >
                        {t('contact.emailAddress')}
                      </GovUK.InputField>
                      <GovUK.FormGroup>
                        <GovUK.Label
                          htmlFor={'phoneNumber'}
                          error={!!interimPage.errors?.phoneNumber}
                        >
                          <GovUK.LabelText>
                            {t('contact.phoneNumber')}
                          </GovUK.LabelText>

                          {interimPage.errors?.phoneNumber && (
                            <GovUK.ErrorText>
                              {interimPage.errors?.phoneNumber}
                            </GovUK.ErrorText>
                          )}
                          <GovUK.HintText>
                            {t('contact.numberHint')}
                          </GovUK.HintText>
                          <TelephoneInput
                            name="phoneNumber"
                            id="phoneNumber"
                            value={contactDetails?.phoneNumber}
                            maxLength={50}
                            type="tel"
                            error={interimPage.errors?.phoneNumber}
                            onChange={onContactDetailsChange}
                          />
                        </GovUK.Label>
                      </GovUK.FormGroup>
                      <GovUK.FormGroup>
                        <GovUK.Label
                          htmlFor={'faxNumber'}
                          error={!!interimPage.errors?.faxNumber}
                        >
                          <GovUK.LabelText>
                            {t('contact.faxNumber')}
                          </GovUK.LabelText>

                          {interimPage.errors?.faxNumber && (
                            <GovUK.ErrorText>
                              {interimPage.errors?.faxNumber}
                            </GovUK.ErrorText>
                          )}
                          <GovUK.HintText>
                            {t('contact.numberHint')}
                          </GovUK.HintText>
                          <TelephoneInput
                            name="faxNumber"
                            id="faxNumber"
                            value={contactDetails?.faxNumber}
                            maxLength={50}
                            type="tel"
                            error={interimPage.errors?.faxNumber}
                            onChange={onContactDetailsChange}
                          />
                        </GovUK.Label>
                      </GovUK.FormGroup>
                      <ButtonGroup>
                        <GovUK.Button id="saveButtonContact">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton onClick={handleCancelReturn}>
                          {t('templates.cancelReturnButton')}
                        </SaveReturnButton>
                      </ButtonGroup>
                    </form>
                  </div>
                )}
                {interimPage.showView === VIEWS.RECOVERY_CODE && (
                  <div id="page-interim-site-recovery-details">
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.interimSite.codeTitle')}
                    </GovUK.Heading>
                    <form
                      onSubmit={(e) => handleSubmit(e, 'code')}
                      noValidate={true}
                    >
                      <RadioList
                        id="recoveryCode"
                        name="recoveryCode"
                        size="L"
                        value={recoveryFacilityType.recoveryCode}
                        label={
                          <GovUK.VisuallyHidden>
                            {t('exportJourney.interimSite.codeTitle')}
                          </GovUK.VisuallyHidden>
                        }
                        errorMessage={interimPage.errors?.recoveryCode}
                        options={refData}
                        onChange={(e) =>
                          setRecoveryFacilityType({
                            type: 'InterimSite',
                            recoveryCode: e.target.value,
                          })
                        }
                      />
                      <ButtonGroup>
                        <GovUK.Button id="saveButtonCode">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton onClick={handleCancelReturn}>
                          {t('templates.cancelReturnButton')}
                        </SaveReturnButton>
                      </ButtonGroup>
                    </form>
                  </div>
                )}
              </>
            )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default InterimSiteDetails;
InterimSiteDetails.auth = true;
