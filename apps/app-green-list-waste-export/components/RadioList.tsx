import React, { ChangeEvent, ReactElement } from 'react';
import { GREY_2, ERROR_COLOUR } from 'govuk-colours';
import { Fieldset, HintText, ErrorText, Radio } from 'govuk-react';
import styled from 'styled-components';
import boldUpToFirstColon from '../utils/boldUpToFirstColon';
import i18n from 'i18next';

type codeType = Array<{
  code: string;
  description: string;
}>;

interface Props {
  id?: string;
  name: string;
  label: ReactElement | string;
  size?: string;
  hint?: string;
  value?: string | number;
  options: Array<string> | codeType;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  testId?: string;
}

const SmallRadio = styled(Radio)`
  float: left;
  margin: 0;
  padding-top: 2px;
  padding-bottom: 2px;
  input {
    margin: 0;
  }
  span {
    padding-left: 0;
  }
  span:before {
    height: 24px;
    width: 24px;
    top: 8px;
  }
  span:after {
    border-width: 5px;
    top: 15px;
    left: 7px;
  }
  :hover {
    span:before {
      box-shadow: 0 0 0 10px ${GREY_2};
    }
  }
`;

const NormalWeight = styled.span`
  font-weight: 400;
`;

const RadioFormGroup = styled.div<{ error?: boolean }>`
  margin-bottom: 20px;
  @media (min-width: 40.0625em) {
    margin-bottom: 30px;
  }
  border-left-width: ${(props) => (props.error ? '4px' : '0')};
  border-left-style: solid;
  border-left-color: ${(props) => (props.error ? ERROR_COLOUR : '#fff')};
  padding-left: ${(props) => (props.error ? '10px' : '0')};
`;

const idify = (value) => {
  return value.replace(/\W/g, '-').toLowerCase();
};

export const RadioList = ({
  name,
  id,
  label,
  size = 'S',
  hint,
  value,
  options,
  errorMessage,
  onChange,
}: Props): React.ReactNode => {
  const currentLanguage = i18n.language;
  return (
    <RadioFormGroup id={id} error={!!errorMessage}>
      <Fieldset>
        <Fieldset.Legend size="S">
          <NormalWeight>{label}</NormalWeight>
        </Fieldset.Legend>
        {hint !== undefined && <HintText>{hint}</HintText>}
        {errorMessage !== undefined && (
          <ErrorText mb={2}>{errorMessage}</ErrorText>
        )}
        {options.map((option, index) => {
          const radioSavedVal = value;
          let radioVal;
          let radioId;
          let radioLabel;
          if (typeof option === 'object') {
            radioVal = option.code;
            radioId = `${id}-${option.code}`;
            radioLabel = `${option.code}: ${option.value.description[currentLanguage]}`;
          } else {
            radioVal = option;
            radioId = `${id}-${idify(option)}`;
            radioLabel = option;
          }
          return size === ('S' || 'Small') ? (
            <SmallRadio
              key={index}
              name={name}
              onChange={onChange}
              value={radioVal}
              checked={radioVal === radioSavedVal}
              id={radioId}
            >
              {boldUpToFirstColon(radioLabel)}
            </SmallRadio>
          ) : (
            <Radio
              key={index}
              name={name}
              onChange={onChange}
              value={radioVal}
              checked={radioVal === radioSavedVal}
              id={radioId}
            >
              {boldUpToFirstColon(radioLabel)}
            </Radio>
          );
        })}
      </Fieldset>
    </RadioFormGroup>
  );
};
