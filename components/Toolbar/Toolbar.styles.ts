import styled from '@emotion/styled';
import { Box, ListItemText, MenuItem } from '@mui/material';
import { BaseElement } from '../Header/Header.styles';

export const Toolbar = styled(BaseElement)`
  display: flex;
  justify-content: right;
  row-gap: 1.5rem;
  width: 100%;
  margin-top: 0.5rem;
  min-height: 56px;
`;

export const Wrapper = styled.form`
  margin-right: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  row-gap: 2rem;
  column-gap: 1rem;
  width: 100%;
`;

export const CustomMenuItem = styled(MenuItem)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CustomListItemText = styled(ListItemText)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 10rem;
`;

export const ActionButtonsWrapper = styled(Box)`
  display: flex;
  align-self: flex-start;
`;

export const FormButtons = styled.div<{ isVisible: boolean }>`
  display: flex;
  opacity: ${({ isVisible }): number => (isVisible ? 1 : 0)};
`;
