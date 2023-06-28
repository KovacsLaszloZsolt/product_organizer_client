import styled from '@emotion/styled';
import { TextField } from '@mui/material';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 16rem;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
`;

export const InputField = styled(TextField)`
  width: inherit;
  margin-bottom: 2rem;
`;
