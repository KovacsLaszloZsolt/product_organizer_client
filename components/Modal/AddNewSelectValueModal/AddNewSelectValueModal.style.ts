import styled from '@emotion/styled';
import { Button, DialogContent } from '@mui/material';

export const TextButton = styled(Button)`
  cursor: pointer;
  margin-left: 0.375rem;
  font-size: 0.675rem;
  align-self: flex-start;
  text-decoration: underline;

  &:hover {
    text-decoration: underline;
    background-color: unset;
  }
`;

export const CustomDialogContent = styled(DialogContent)`
  padding-top: 0.375rem !important;
`;
