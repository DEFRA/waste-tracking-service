import { useTranslation } from 'react-i18next';
import {
  GridRow,
  GridCol,
  Panel,
  H2,
  UnorderedList,
  ListItem,
} from 'govuk-react';
import { AppLink, Paragraph } from 'components';
import { YELLOW, GREY_3, BLACK } from 'govuk-colours';
import styled from 'styled-components';
import Link from 'next/link';

type SubmissionConfirmationProps = {
  uploadId: string;
  submissionCount: number;
  pageCount?: number;
};

const LinkWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 30px;
`;

const StyledLinkAsButton = styled(Link)`
  font-weight: 400;
  font-size: 16px;
  line-height: 1.2;
  box-sizing: border-box;
  display: inline-block;
  position: relative;
  width: 100%;
  margin: 0 0 22px 0;
  padding: 7px 10px 7px;
  border: 2px solid rgba(0, 0, 0, 0);
  border-radius: 0;
  color: ${BLACK};
  background-color: ${GREY_3};
  box-shadow: 0 2px 0 #929191;
  text-align: center;
  vertical-align: top;
  cursor: pointer;
  -webkit-appearance: none;
  text-decoration: none;
  &:hover {
    background: #dbdad9;
  }
  &:active {
    top: 2px;
  }
  &:focus {
    border-color: ${YELLOW};
    outline: 3px solid rgba(0, 0, 0, 0);
    box-shadow: inset 0 0 0 1px ${YELLOW};
  }
  &:focus:not(:active):not(:hover) {
    border-color: ${YELLOW};
    color: ${BLACK};
    background-color: ${YELLOW};
    box-shadow: 0 2px 0 ${BLACK};
  }
  @media (min-width: 40.0625em) {
    font-size: 19px;
    line-height: 1;
    width: auto;
    margin-bottom: 20px;
  }
`;

export function SubmissionConfirmation({
  submissionCount,
  pageCount = 200,
}: SubmissionConfirmationProps) {
  const { t } = useTranslation();

  return (
    <>
      <GridRow>
        <GridCol setWidth="two-thirds">
          <Panel
            title={t('multiples.confirmation.title', {
              count: submissionCount,
              plural: submissionCount > 1 ? 's' : '',
            })}
          />
          {/* TODO: Add link to actual page once backend capable */}
          <LinkWrapper>
            <AppLink href="" target="__blank">
              {t('multiples.confirmation.detailsLink')}
            </AppLink>
          </LinkWrapper>
          <H2 size="MEDIUM">{t('mulitples.confirmation.nextSteps')}</H2>
          <Paragraph>{t('multiples.confirmation.stepsPrompt')}</Paragraph>
          <UnorderedList>
            <ListItem>{t('multiples.confirmation.stepOne')}</ListItem>
            <ListItem>{t('multiples.confirmation.stepTwo')}</ListItem>
            <ListItem>{t('multiples.confirmation.stepThree')}</ListItem>
          </UnorderedList>
          <H2 size="MEDIUM">{t('mulitples.confirmation.updateTitle')}</H2>
          <Paragraph>{t('multiples.confirmation.estimatesPrompt')}</Paragraph>
          <UnorderedList>
            <ListItem>{t('multiples.confirmation.estimatesOne')}</ListItem>
            <ListItem>{t('multiples.confirmation.estimatesTwo')}</ListItem>
          </UnorderedList>
          <Paragraph mb={7}>
            <span>{t('multiples.confirmation.legalStatementp1')}</span>
            {/* TODO: Add link to actual page once backend capable */}
            <AppLink href="">
              {t('multiples.confirmation.legalStatementLink', {
                count: pageCount,
              })}
            </AppLink>
            <span>{t('multiples.confirmation.legalStatementp2')}</span>
          </Paragraph>
          <StyledLinkAsButton href="/export">
            {t('multiples.confirmation.returnButton')}
          </StyledLinkAsButton>
        </GridCol>
      </GridRow>
    </>
  );
}
