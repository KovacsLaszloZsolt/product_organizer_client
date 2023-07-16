import styled from '@emotion/styled';

export const ProductSelectFieldWrapper = styled.div<{ isOnModal: boolean }>`
  display: 'flex';
  flex-direction: 'column';

  ${({ isOnModal }): Record<string, string> =>
    isOnModal
      ? {
          width: '100%',
          marginBottom: '2rem'
        }
      : {
          width: '7rem',
          marginBottom: '0'
        }};
`;
