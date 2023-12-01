import React, { useCallback, useEffect, useState, useReducer } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  SubmissionNotFound,
  Loading,
  SaveReturnButton,
  ButtonGroup,
} from 'components';

import styled from 'styled-components';

import { Submission } from '@wts/api/waste-tracking-gateway';

type State = {
  data: Submission;
  isLoading: boolean;
  isError: boolean;
};

type Action = {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'DATA_UPDATE';
  payload?: Submission;
};

const initialWasteDescState: State = {
  data: null,
  isLoading: true,
  isError: false,
};

const SignDeclarationReducer = (state: State, action: Action) => {
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
        data: action.payload,
      };
    default:
      throw new Error();
  }
};

const StyledHeading = styled(GovUK.Heading)`
  margin-bottom: 15px;
`;

const SignDeclaration = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [signDeclarationPage, dispatchSignDeclarationPage] = useReducer(
    SignDeclarationReducer,
    initialWasteDescState
  );

  const [id, setId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  const [errors] = useState<{
    description?: string;
  }>({});

  useEffect(() => {
    dispatchSignDeclarationPage({ type: 'DATA_FETCH_INIT' });
    if (id !== null) {
      fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}`)
        .then((response) => {
          if (response.ok) return response.json();
          else {
            dispatchSignDeclarationPage({ type: 'DATA_FETCH_FAILURE' });
          }
        })
        .then((data) => {
          if (data !== undefined) {
            dispatchSignDeclarationPage({
              type: 'DATA_FETCH_SUCCESS',
              payload: data,
            });
          }
        });
    }
  }, [router.isReady, id]);

  const handleConfirmClick = useCallback(
    (e) => {
      fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/submission-declaration`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'Complete',
          }),
        }
      )
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          if (data !== undefined) {
            router.push({
              pathname: `/export/submitted/export-submitted`,
              query: { id },
            });
          }
        });
      e.preventDefault();
    },
    [id, router, signDeclarationPage.data]
  );

  if (signDeclarationPage.data?.submissionDeclaration.status === 'Complete') {
    router.push('/export');
  }

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
        <title>{t('exportJourney.checkAnswers.signDeclaration.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {signDeclarationPage.isError && !signDeclarationPage.isLoading && (
              <SubmissionNotFound />
            )}
            {signDeclarationPage.isLoading && <Loading />}
            {!signDeclarationPage.isError && !signDeclarationPage.isLoading && (
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
                <StyledHeading size="LARGE">
                  {t('exportJourney.checkAnswers.signDeclaration.title')}
                </StyledHeading>
                <GovUK.Paragraph id="first-paragraph">
                  {t('exportJourney.checkAnswers.signDeclaration.paragraph')}
                </GovUK.Paragraph>
                {signDeclarationPage.data.wasteDescription.status ===
                  'Complete' && (
                  <GovUK.UnorderedList>
                    <GovUK.ListItem>
                      {t(
                        'exportJourney.checkAnswers.signDeclaration.listItemOne'
                      )}
                    </GovUK.ListItem>
                    {signDeclarationPage.data?.wasteDescription?.wasteCode
                      .type !== 'NotApplicable' && (
                      <GovUK.ListItem id="conditional-item">
                        {t(
                          'exportJourney.checkAnswers.signDeclaration.listItemTwo'
                        )}
                      </GovUK.ListItem>
                    )}

                    <GovUK.ListItem>
                      {t(
                        'exportJourney.checkAnswers.signDeclaration.listItemThree'
                      )}
                    </GovUK.ListItem>

                    <GovUK.ListItem>
                      {t(
                        'exportJourney.checkAnswers.signDeclaration.listItemFour'
                      )}
                    </GovUK.ListItem>
                  </GovUK.UnorderedList>
                )}
                <ButtonGroup>
                  <GovUK.Button id="saveButton" onClick={handleConfirmClick}>
                    {t(
                      'exportJourney.checkAnswers.signDeclaration.confirmButton'
                    )}
                  </GovUK.Button>
                  <SaveReturnButton
                    onClick={() =>
                      router.push({
                        pathname: `/export/incomplete/tasklist`,
                        query: { id },
                      })
                    }
                  >
                    {t('exportJourney.checkAnswers.returnButton')}
                  </SaveReturnButton>
                </ButtonGroup>
              </>
            )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default SignDeclaration;
