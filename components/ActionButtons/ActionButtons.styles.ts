import styled from '@emotion/styled';

export const FormButtons = styled.div<{ isVisible: boolean }>`
  display: flex;
  opacity: ${({ isVisible }): number => (isVisible ? 1 : 0)};
`;
