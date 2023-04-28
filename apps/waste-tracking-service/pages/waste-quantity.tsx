import Head from 'next/head';
import * as GovUK from 'govuk-react';
import {
  BreadcrumbWrap,
  CompleteFooter,
  CompleteHeader,
  SaveReturnLink,
} from '../components';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import '../i18n/config';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { isNotEmpty, validateQuantityType } from '../utils/validators';
import { GetWasteQuantityResponse } from '@wts/api/waste-tracking-gateway';

const BreadCrumbs = ({ id }) => {
  const router = useRouter();
  return (
    <BreadcrumbWrap>
      <GovUK.BackLink
        href="#"
        onClick={() => {
          router.push({
            pathname: '/describe-waste',
            query: { id },
          });
        }}
      >
        Back
      </GovUK.BackLink>
    </BreadcrumbWrap>
  );
};

const WasteQuantity = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState<string | string[]>(null);
  const [data, setData] = useState<GetWasteQuantityResponse>(null);
  const [quantityType, setQuantityType] = useState(null);
  const [savedQuantityType, setSavedQuantityType] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    quantityTypeError?: string;
  }>({});

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
        quantityTypeError: validateQuantityType(quantityType),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        if (savedQuantityType !== quantityType) {
          const newStatus =
            data.status === 'NotStarted'
              ? 'Started'
              : data.status === 'Complete'
              ? 'Started'
              : data.status;
          try {
            fetch(
              `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/waste-quantity`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  status: newStatus,
                  wasteQuantity: { type: quantityType },
                }),
              }
            )
              .then((response) => {
                if (response.ok) return response.json();
              })
              .then((data) => {
                if (data !== undefined) {
                  const path =
                    returnToDraft || quantityType === 'NotApplicable'
                      ? '/submit-an-export-tasklist'
                      : '/waste-quantity-entry';
                  router.push({
                    pathname: path,
                    query: { id },
                  });
                }
              });
          } catch (e) {
            console.error(e);
          }
        } else {
          const path = returnToDraft
            ? '/submit-an-export-tasklist'
            : '/waste-quantity-entry';
          router.push({
            pathname: path,
            query: { id },
          });
        }
      }
      e.preventDefault();
    },
    [id, quantityType, data]
  );

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    if (id !== null) {
      fetch(
        `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/waste-quantity`
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
            setIsLoading(false);
            setIsError(false);
            setQuantityType(data.wasteQuantity?.type || null);
            setSavedQuantityType(data.wasteQuantity?.type || null);
          }
        });
    }
  }, [router.isReady, id]);

  return (
    <>
      <Head>
        <title>{t('exportJourney.quantity.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs id={id} />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {isError && !isLoading && <p>No valid record found</p>}
            {isLoading && <p>Loading</p>}
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
                <form onSubmit={handleSubmit}>
                  <GovUK.Fieldset>
                    <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                      {t('exportJourney.quantity.title')}
                    </GovUK.Fieldset.Legend>
                    <GovUK.Paragraph>
                      {t('exportJourney.quantity.intro')}
                    </GovUK.Paragraph>
                    <GovUK.MultiChoice
                      mb={8}
                      label=""
                      meta={{
                        error: errors?.quantityTypeError,
                        touched: !!errors?.quantityTypeError,
                      }}
                    >
                      <GovUK.Radio
                        name="quantityType"
                        id="quantityTypeYes"
                        checked={quantityType === 'ActualData'}
                        onChange={(e) => setQuantityType('ActualData')}
                        value="ActualData"
                      >
                        {t('exportJourney.quantity.radioYes')}
                      </GovUK.Radio>
                      <GovUK.Radio
                        name="quantityType"
                        id="quantityTypeEstimate"
                        checked={quantityType === 'EstimateData'}
                        onChange={(e) => setQuantityType('EstimateData')}
                        value="EstimateData"
                      >
                        {t('exportJourney.quantity.radioEstimate')}
                      </GovUK.Radio>
                      <GovUK.Radio
                        name="quantityType"
                        id="quantityTypeNo"
                        checked={quantityType === 'NotApplicable'}
                        onChange={(e) => setQuantityType('NotApplicable')}
                        value="NotApplicable"
                      >
                        {t('exportJourney.quantity.radioNo')}
                      </GovUK.Radio>
                    </GovUK.MultiChoice>
                  </GovUK.Fieldset>
                  <GovUK.Button id="saveButton">{t('saveButton')}</GovUK.Button>
                  <SaveReturnLink onClick={handleLinkSubmit} />
                </form>
              </>
            )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default WasteQuantity;
