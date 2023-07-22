import styled from '@emotion/styled';
import { Box } from '@mui/material';
import Breakpoints from '../../styles/Breakpoints';
import Colors from '../../styles/Colors';

export const Header = styled.header`
  width: 100%;
  background-color: ${Colors.white};
  position: fixed;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  row-gap: 1.5rem;
  top: 0;
  z-index: 5;
`;

export const BaseElement = styled(Box)`
  display: flex;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  max-width: calc(${Breakpoints.small} - 1rem);

  @media (min-width: ${Breakpoints.medium}) {
    max-width: calc(${Breakpoints.medium} - 1rem);
  }

  @media (min-width: ${Breakpoints.large}) {
    max-width: calc(${Breakpoints.large} - 1rem);
  }

  @media (min-width: ${Breakpoints.extraLarge}) {
    max-width: ${Breakpoints.extraLarge};
  }
`;

export const Wrapper = styled(BaseElement)`
  justify-content: space-between;
`;

export const PageTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`;

export const ActionContainer = styled(BaseElement)`
  justify-content: space-between;

  & > span {
    display: flex;
    gap: 1rem;
    height: 40px;
  }

  @media (max-width: ${Breakpoints.medium}) {
    justify-content: center;
  }
`;
