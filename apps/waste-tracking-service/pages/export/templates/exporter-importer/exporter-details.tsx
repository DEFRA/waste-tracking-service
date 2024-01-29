import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  Footer,
  Header,
  BreadcrumbWrap,
  Loading,
  SubmissionNotFound,
  SaveReturnButton,
  ButtonGroup,
} from 'components';
import { GetExporterDetailResponse } from '@wts/api/waste-tracking-gateway';
import styled from 'styled-components';

import {
  isNotEmpty,
  validateEmail,
  validatePhone,
  validateFax,
} from 'utils/validators';
import { getStatusExporter } from 'utils/statuses/getStatusExporter';
import useApiConfig from 'utils/useApiConfig';

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

const ExporterDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();
  const [templateId, setTemplateId] = useState<string>(null);
  const [data, setData] = useState<GetExporterDetailResponse>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const [organisationName, setOrganisationName] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [fax, setFax] = useState<string>('');
  const [errors, setErrors] = useState<{
    organisationName?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    fax?: string;
  }>({});

  useEffect(() => {
    if (router.isReady) {
      setTemplateId(String(router.query.templateId));
    }
  }, [router.isReady, router.query.templateId]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      if (templateId !== null) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/exporter-detail`,
          { headers: apiConfig }
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
              setOrganisationName(
                data.exporterContactDetails?.organisationName
              );
              setFullName(data.exporterContactDetails?.fullName);
              setEmail(data.exporterContactDetails?.emailAddress);
              setPhone(data.exporterContactDetails?.phoneNumber);
              setFax(data.exporterContactDetails?.faxNumber);
              setIsLoading(false);
              setIsError(false);
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
    async (e: FormEvent) => {
      e.preventDefault();
      const newErrors = {
        email: validateEmail(email, true),
        phone: validatePhone(phone, true),
        fax: validateFax(fax, true),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        const body = {
          ...data,
          exporterContactDetails: {
            organisationName: organisationName || '',
            fullName: fullName || '',
            emailAddress: email || '',
            phoneNumber: phone || '',
            faxNumber: fax || '',
          },
        };

        const updatedStatus = {
          ...body,
          status: getStatusExporter(body),
        };

        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/exporter-detail`,
            {
              method: 'PUT',
              headers: apiConfig,
              body: JSON.stringify(updatedStatus),
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                const path = `/export/templates/exporter-importer/importer-details`;
                router.push({
                  pathname: path,
                  query: { templateId },
                });
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    },
    [organisationName, fullName, email, phone, fax, data]
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
          {t('Back')}
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('exportJourney.exporterDetails.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow id="page-exporter-contact-details">
          <GovUK.GridCol setWidth="two-thirds">
            {isError && !isLoading && <SubmissionNotFound />}
            {isLoading && <Loading />}
            {!isError && !isLoading && (
              <>
                {errors && !!Object.keys(errors).length && (
                  <GovUK.ErrorSummary
                    heading={t('errorSummary.title')}
                    errors={Object.keys(errors).map((key) => ({
                      targetName: key,
                      text: errors[key],
                    }))}
                  />
                )}
                <GovUK.Caption size="L">
                  {t('exportJourney.exporterDetails.caption')}
                </GovUK.Caption>
                <GovUK.Heading size={'LARGE'}>
                  {t('exportJourney.exporterDetails.title')}
                </GovUK.Heading>

                <form onSubmit={handleSubmit}>
                  <GovUK.FormGroup>
                    <AddressInput
                      input={{
                        name: 'organisationName',
                        id: 'organisationName',
                        value: organisationName || '',
                        maxLength: 250,
                        onChange: (e) => setOrganisationName(e.target.value),
                      }}
                      meta={{
                        error: errors?.organisationName,
                        touched: !!errors?.organisationName,
                      }}
                    >
                      {t('contact.orgName')}
                    </AddressInput>
                    <AddressInput
                      hint={t('contact.fullName')}
                      input={{
                        name: 'fullName',
                        id: 'fullName',
                        value: fullName || '',
                        maxLength: 250,
                        autoComplete: 'name',
                        onChange: (e) => setFullName(e.target.value),
                      }}
                      meta={{
                        error: errors?.fullName,
                        touched: !!errors?.fullName,
                      }}
                    >
                      {t('contact.orgContactName')}
                    </AddressInput>
                    <TownCountryInput
                      input={{
                        name: 'email',
                        id: 'email',
                        value: email || '',
                        spellCheck: false,
                        autoComplete: 'email',
                        maxLength: 250,
                        onChange: (e) => setEmail(e.target.value),
                      }}
                      meta={{
                        error: errors?.email,
                        touched: !!errors?.email,
                      }}
                    >
                      {t('contact.emailAddress')}
                    </TownCountryInput>
                    <PostcodeInput
                      input={{
                        name: 'phone',
                        id: 'phone',
                        value: phone || '',
                        autoComplete: 'tel',
                        maxLength: 250,
                        onChange: (e) => setPhone(e.target.value),
                      }}
                      meta={{
                        error: errors?.phone,
                        touched: !!errors?.phone,
                      }}
                    >
                      {t('contact.phoneNumber')}
                    </PostcodeInput>
                    <PostcodeInput
                      input={{
                        name: 'fax',
                        id: 'fax',
                        value: fax || '',
                        maxLength: 250,
                        onChange: (e) => setFax(e.target.value),
                      }}
                      meta={{
                        error: errors?.fax,
                        touched: !!errors?.fax,
                      }}
                    >
                      {t('contact.faxNumber')}
                    </PostcodeInput>
                  </GovUK.FormGroup>

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
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default ExporterDetails;
ExporterDetails.auth = true;
