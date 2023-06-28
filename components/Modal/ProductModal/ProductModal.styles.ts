import styled from '@emotion/styled';
import { TextField, Tooltip } from '@mui/material';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

export const InputField = styled(TextField)`
  width: inherit;
  margin-bottom: ${({ error }): string => (error ? '0.50625rem' : '2rem')};
`;

export const InputWrapper = styled.span`
  width: inherit;
  display: flex;
  align-items: flex-start;
`;

export const SelectContainer = styled.span`
  width: inherit;
  margin-bottom: 2rem;
`;

export const ImageWrapper = styled.span`
  position: relative;
  display: inline-block;
  margin: 0.5rem;
  border-radius: 0.75rem;

  & img {
    border: 1px solid black;
    border-radius: 0.75rem;
  }
`;

export const CustomTooltip = styled(Tooltip)`
  position: absolute;
  top: 0;
  right: 0;
`;
