import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  Footer,
  Header,
  BreadcrumbWrap,
  SaveReturnButton,
  ButtonGroup,
  ErrorSummary,
  SubmissionNotFound,
  Loading,
} from 'components';
import { GetExporterDetailResponse } from '@wts/api/waste-tracking-gateway';
import styled from 'styled-components';
import {
  isNotEmpty,
  validateFullName,
  validateEmail,
  validateInternationalPhone,
  validateInternationalFax,
} from 'utils/validators';
import useApiConfig from 'utils/useApiConfig';

const AddressInput = styled(GovUK.InputField)`
  max-width: 66ex;
  margin-bottom: 20px;
`;
const PostcodeInput = styled(GovUK.InputField)`
  max-width: 56ex;
  margin-bottom: 20px;
`;

const ImporterContactDetails = (): React.ReactNode => {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();
  const [id, setId] = useState(null);
  const [data, setData] = useState<GetExporterDetailResponse>(null);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [fax, setFax] = useState<string>('');
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    fax?: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

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
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/importer-detail`,
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
                setData(data);
                setFullName(data.importerContactDetails?.fullName || '');
                setEmail(data.importerContactDetails?.emailAddress || '');
                setPhone(data.importerContactDetails?.phoneNumber || '');
                setFax(data.importerContactDetails?.faxNumber || '');
                setIsLoading(false);
                setIsError(false);
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchData();
  }, [router.isReady, id]);

  const handleLinkSubmit = async (e) => {
    await handleSubmit(e, true);
  };

  const handleSubmit = useCallback(
    async (e: FormEvent, returnToDraft = false) => {
      e.preventDefault();
      const newErrors = {
        fullName: validateFullName(fullName),
        email: validateEmail(email),
        phone: validateInternationalPhone(phone),
        fax: validateInternationalFax(fax),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        const body = {
          ...data,
          status: 'Complete',
          importerContactDetails: {
            fullName: fullName,
            emailAddress: email,
            phoneNumber: phone,
            faxNumber: fax,
          },
        };
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/importer-detail`,
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
                  : `/incomplete/tasklist`;
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
    [fullName, email, phone, fax],
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
        <title>{t('exportJourney.importerDetails.secondPageQuestion')}</title>
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
                  {t('exportJourney.importerDetails.title')}
                </GovUK.Caption>
                <GovUK.Heading size={'LARGE'}>
                  {t('exportJourney.importerDetails.secondPageQuestion')}
                </GovUK.Heading>

                <form onSubmit={handleSubmit}>
                  <GovUK.FormGroup>
                    <AddressInput
                      hint={<>{t('contact.nameHint')}</>}
                      input={{
                        name: 'fullName',
                        id: 'fullName',
                        value: fullName,
                        maxLength: 250,
                        onChange: (e) => setFullName(e.target.value),
                      }}
                      meta={{
                        error: errors?.fullName,
                        touched: !!errors?.fullName,
                      }}
                    >
                      {t('exportJourney.importerDetails.contactPerson')}
                    </AddressInput>
                    <AddressInput
                      input={{
                        name: 'email',
                        id: 'email',
                        value: email,
                        maxLength: 250,
                        onChange: (e) => setEmail(e.target.value),
                      }}
                      meta={{
                        error: errors?.email,
                        touched: !!errors?.email,
                      }}
                    >
                      {t('contact.emailAddress')}
                    </AddressInput>
                    <PostcodeInput
                      hint={t('contact.numberHint')}
                      input={{
                        name: 'phone',
                        id: 'phone',
                        value: phone,
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
                      hint={t('contact.numberHint')}
                      input={{
                        name: 'fax',
                        id: 'fax',
                        value: fax,
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
export default ImporterContactDetails;
ImporterContactDetails.auth = true;
