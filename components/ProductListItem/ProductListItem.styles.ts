import styled from '@emotion/styled';
import { Badge, BadgeProps, Box } from '@mui/material';
import Breakpoints from '../../styles/Breakpoints';
import Colors from '../../styles/Colors';
import { theme } from '../../styles/theme';

export const Product = styled(Box)`
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem;
  border-radius: 0.5rem;

  @media (max-width: ${Breakpoints.medium}) {
    flex-direction: column;
  }
`;

export const DetailsWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const StyledBadge = styled(Badge)<BadgeProps>(() => ({
  '& .MuiBadge-badge': {
    right: -50,
    top: 16,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px'
  }
}));

export const ActionsContainer = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  align-self: flex-end;
  width: 100%;
  gap: 0.5rem;
`;

export const ProductHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${Breakpoints.small}) {
    flex-direction: column;
    align-items: flex-start;

    & ${ActionsContainer} {
      align-self: center;
    }
  }
`;

export const ProductName = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  max-width: 44rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: ${Breakpoints.extraLarge}) {
    max-width: 32rem;
  }

  @media (max-width: ${Breakpoints.large}) {
    max-width: 20rem;
  }

  @media (max-width: ${Breakpoints.small}) {
    max-width: 60vw;
  }
`;

export const ActionsContainerButton = styled(ActionsContainer)`
  width: 100%;
  justify-content: flex-end;
  margin-top: auto;
  padding: 1rem;
`;

export const Line = styled.div`
  width: 1px;
  background-color: ${Colors.border};
`;
