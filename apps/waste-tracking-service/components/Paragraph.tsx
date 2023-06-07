import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  mb?: number;
  testId?: string;
}

const P = styled('p')<{ mb?: number }>`
  color: #0b0c0c;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.25;
  margin-top: 0;
  margin-bottom: ${(props) => `${props.mb * 3}px`};
  @media (min-width: 40.0625em) {
    font-size: 19px;
    line-height: 1.32;
    margin-bottom: ${(props) => `${props.mb * 5}px`};
  }
`;

export const Paragraph = ({ children, mb = 4, testId }: Props) => {
  return (
    <P data-testid={testId} mb={mb}>
      {children}
    </P>
  );
};
