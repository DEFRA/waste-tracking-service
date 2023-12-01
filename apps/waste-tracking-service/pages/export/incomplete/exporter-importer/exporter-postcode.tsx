import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  AppLink,
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  ButtonGroup,
  SaveReturnButton,
} from 'components';
import styled from 'styled-components';
import {
  isNotEmpty,
  validatePostcode,
  validateSelectAddress,
} from 'utils/validators';

const PostcodeInput = styled(GovUK.Input)`
  max-width: 23ex;
`;

const Paragraph = styled.div`
  margin-bottom: 20px;
  font-size: 19px;
`;

const ExporterPostcode = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState(null);
  const [postcode, setPostcode] = useState<string>('');
  const [buildingNameOrNumber, setNumber] = useState<string>('');
  const [addresses, setAddresses] = useState<[]>();
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [errors, setErrors] = useState<{
    postcode?: string;
    selectedAddress?: string;
  }>({});

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      const newErrors = {
        postcode: validatePostcode(postcode),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        try {
          fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/addresses?postcode=${postcode}&buildingNameOrNumber=${buildingNameOrNumber}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                if (data.length === 1) {
                  putAddress(
                    JSON.stringify(data[0]),
                    '/export/incomplete/exporter-importer/exporter-address-edit'
                  );
                } else {
                  setAddresses(data);
                }
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
      e.preventDefault();
    },
    [buildingNameOrNumber, postcode]
  );

  const handleLinkSubmit = (e) => {
    handleSubmitAddress(e, true);
  };

  const handleSubmitAddress = useCallback(
    (e, returnToDraft = false) => {
      const newErrors = {
        selectedAddress: validateSelectAddress(selectedAddress),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        putAddress(
          selectedAddress,
          returnToDraft
            ? `/export/incomplete/tasklist`
            : `/export/incomplete/exporter-importer/exporter-address`
        );
      }
      e.preventDefault();
    },
    [id, router, selectedAddress]
  );

  const putAddress = useCallback(
    async (address, path) => {
      if (address) {
        const body = {
          status: 'Started',
          exporterAddress: JSON.parse(address),
        };
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/exporter-detail`,
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
    [id, router]
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            if (addresses) {
              setAddresses(null);
            } else {
              router.push({
                pathname: `/export/incomplete/tasklist`,
                query: { id },
              });
            }
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
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
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
              {t('exportJourney.exporterPostcode.title')}
            </GovUK.Heading>

            {addresses && (
              <div id="page-exporter-postcode-search-results">
                <form onSubmit={handleSubmitAddress}>
                  <GovUK.Fieldset>
                    <GovUK.MultiChoice
                      mb={6}
                      label=""
                      meta={{
                        error: errors?.selectedAddress,
                        touched: !!errors?.selectedAddress,
                      }}
                    >
                      {addresses.map((address, key) => {
                        return (
                          <GovUK.Radio
                            key={key}
                            name="addressSelection"
                            id={JSON.stringify(address)}
                            checked={
                              selectedAddress === JSON.stringify(address)
                            }
                            onChange={(e) => setSelectedAddress(e.target.value)}
                            value={JSON.stringify(address)}
                          >
                            {Object.keys(address)
                              .map((line) => address[line])
                              .join(', ')}
                          </GovUK.Radio>
                        );
                      })}
                    </GovUK.MultiChoice>
                  </GovUK.Fieldset>
                  <Paragraph>
                    <AppLink
                      href={{
                        pathname: `exporter-details-manual`,
                        query: { id },
                      }}
                    >
                      {t('postcode.enterManualy')}
                    </AppLink>
                  </Paragraph>
                  <ButtonGroup>
                    <GovUK.Button id="saveButton">
                      {t('saveButton')}
                    </GovUK.Button>
                    <SaveReturnButton onClick={handleLinkSubmit} />
                  </ButtonGroup>
                </form>
              </div>
            )}

            {!addresses && (
              <div id="page-exporter-postcode-search">
                <form onSubmit={handleSubmit}>
                  <GovUK.HintText>
                    {t('exportJourney.exporterPostcode.hint')}
                  </GovUK.HintText>
                  <GovUK.FormGroup error={!!errors?.postcode}>
                    <GovUK.Label htmlFor={'postcode'}>
                      <GovUK.LabelText>{t('postcode.label')}</GovUK.LabelText>
                    </GovUK.Label>
                    <GovUK.ErrorText>{errors?.postcode}</GovUK.ErrorText>
                    <PostcodeInput
                      name="postcode"
                      id="postcode"
                      value={postcode}
                      maxLength={50}
                      autoComplete="postal-code"
                      onChange={(e) => setPostcode(e.target.value)}
                    />
                  </GovUK.FormGroup>
                  <GovUK.FormGroup>
                    <GovUK.Label htmlFor={'buildingNameOrNumber'}>
                      <GovUK.LabelText>
                        {t('buildingNameNumber.label')}
                      </GovUK.LabelText>
                    </GovUK.Label>
                    <GovUK.ErrorText />
                    <PostcodeInput
                      name="buildingNameOrNumber"
                      id="buildingNameOrNumber"
                      value={buildingNameOrNumber}
                      maxLength={50}
                      autoComplete="street-address"
                      onChange={(e) => setNumber(e.target.value)}
                    />
                  </GovUK.FormGroup>
                  <GovUK.Button id="saveButton">
                    {t('postcode.findButton')}
                  </GovUK.Button>
                  <Paragraph>
                    <AppLink
                      href={{
                        pathname: 'exporter-details-manual',
                        query: { id },
                      }}
                    >
                      {t('postcode.manualAddressLink')}
                    </AppLink>
                  </Paragraph>
                  <SaveReturnButton
                    onClick={() =>
                      router.push({
                        pathname: `/export/incomplete/tasklist`,
                        query: { id },
                      })
                    }
                  >
                    {t('saveReturnButton')}
                  </SaveReturnButton>
                </form>
              </div>
            )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default ExporterPostcode;
