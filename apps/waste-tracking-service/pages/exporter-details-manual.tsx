import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import '../i18n/config';
import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  Loading,
  SubmissionNotFound,
  ButtonGroup,
  SaveReturnButton,
  SmallRadioList,
} from '../components';
import { GetExporterDetailResponse } from '@wts/api/waste-tracking-gateway';
import styled from 'styled-components';
import {
  isNotEmpty,
  validateTownCity,
  validateCountrySelect,
  validateAddress,
} from '../utils/validators';
import { countriesData } from '../utils/countriesData';

const AddressInput = styled(GovUK.InputField)`
  max-width: 66ex;
  margin-bottom: 20px;
`;

const PostcodeInput = styled(GovUK.InputField)`
  max-width: 23ex;
  margin-bottom: 20px;
`;

const TownCountryInput = styled(GovUK.InputField)`
  max-width: 46ex;
  margin-bottom: 20px;
`;

const ExporterManual = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState(null);
  const [data, setData] = useState<GetExporterDetailResponse>(null);
  const [postcode, setPostcode] = useState<string>('');
  const [townCity, setTownCity] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [address2, setAddress2] = useState<string>('');
  const [errors, setErrors] = useState<{
    postcode?: string;
    townCity?: string;
    country?: string;
    address?: string;
    address2?: string;
  }>({});

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    if (id !== null) {
      fetch(
        `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/exporter-detail`
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
            setData(data);
            setAddress(data.exporterAddress?.addressLine1);
            setAddress2(data.exporterAddress?.addressLine2);
            setTownCity(data.exporterAddress?.townCity);
            setPostcode(data.exporterAddress?.postcode);
            setCountry(data.exporterAddress?.country);
            setIsLoading(false);
            setIsError(false);
          }
        });
    }
  }, [router.isReady, id]);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  const handleLinkSubmit = (e) => {
    handleSubmit(e, true);
  };

  const handleSubmit = useCallback(
    (e: FormEvent, returnToDraft = false) => {
      const newErrors = {
        townCity: validateTownCity(townCity),
        country: validateCountrySelect(country),
        address: validateAddress(address),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        const body = {
          ...data,
          status: 'Started',
          exporterAddress: {
            addressLine1: address,
            addressLine2: address2,
            townCity: townCity,
            country: country,
            postcode: postcode,
          },
        };
        try {
          fetch(
            `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/exporter-detail`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                const path = returnToDraft
                  ? '/submit-an-export-tasklist'
                  : '/exporter-details';
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
      e.preventDefault();
    },
    [townCity, country, address, data, address2, postcode, id, router]
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
          Back
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('exportJourney.exporterPostcode.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow id="page-exporter-manual-address">
          <GovUK.GridCol setWidth="two-thirds">
            {isError && !isLoading && <SubmissionNotFound />}
            {isLoading && <Loading />}
            {!isError && !isLoading && (
              <>
                <GovUK.Heading size={'LARGE'}>
                  {t('exportJourney.exporterPostcode.title')}
                </GovUK.Heading>
                {errors && !!Object.keys(errors).length && (
                  <GovUK.ErrorSummary
                    heading={t('errorSummary.title')}
                    errors={Object.keys(errors).map((key) => ({
                      targetName: key,
                      text: errors[key],
                    }))}
                  />
                )}
                <form onSubmit={handleSubmit}>
                  <GovUK.FormGroup>
                    <AddressInput
                      hint={t(
                        'exportJourney.exporterManual.addressOneLabel.hint'
                      )}
                      input={{
                        name: 'address',
                        id: 'address',
                        value: address,
                        maxLength: 250,
                        onChange: (e) => setAddress(e.target.value),
                      }}
                      meta={{
                        error: errors?.address,
                        touched: !!errors?.address,
                      }}
                    >
                      {t('exportJourney.exporterManual.addressOneLabel')}
                    </AddressInput>
                    <AddressInput
                      hint={t(
                        'exportJourney.exporterManual.addressTwoLabel.hint'
                      )}
                      input={{
                        name: 'address2',
                        id: 'address2',
                        value: address2,
                        maxLength: 250,
                        onChange: (e) => setAddress2(e.target.value),
                      }}
                    >
                      {t('exportJourney.exporterManual.addressTwoLabel')}
                    </AddressInput>
                    <TownCountryInput
                      input={{
                        name: 'townCity',
                        id: 'townCity',
                        value: townCity,
                        maxLength: 250,
                        onChange: (e) => setTownCity(e.target.value),
                      }}
                      meta={{
                        error: errors?.townCity,
                        touched: !!errors?.townCity,
                      }}
                    >
                      {t('exportJourney.exporterManual.townLabel')}
                    </TownCountryInput>
                    <PostcodeInput
                      input={{
                        name: 'postcode',
                        id: 'postcode',
                        value: postcode,
                        maxLength: 8,
                        onChange: (e) => setPostcode(e.target.value),
                      }}
                    >
                      {t('exportJourney.exporterManual.postCodeLabel')}
                    </PostcodeInput>
                    <SmallRadioList
                      value={country}
                      id="country"
                      name="country"
                      label={t('address.country')}
                      hint={t(
                        'exportJourney.wasteCollectionDetails.countryHint'
                      )}
                      errorMessage={errors?.country}
                      options={countriesData.UK}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </GovUK.FormGroup>
                  <ButtonGroup>
                    <GovUK.Button id="saveButton">
                      {t('saveButton')}
                    </GovUK.Button>
                    <SaveReturnButton onClick={handleLinkSubmit} />
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

export default ExporterManual;
