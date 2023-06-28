import styled from '@emotion/styled';
import Breakpoints from './Breakpoints';

// export const GlobalStyle = createGlobalStyle`
//   html, body {
//     margin: 0;
//     padding: 0;
//     font-family: Montserrat, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
//       'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
//     -webkit-font-smoothing: antialiased;
//     -moz-osx-font-smoothing: grayscale;
//     background-color: #001233;
//     color: #787878;
//   }

//   * {
//     box-sizing: border-box;
//   }

//   input::-moz-placeholder {
//     opacity:  1;
//   }
// `;

export const MainContentWrapper = styled.div<{ isToolbarOpen?: boolean }>`
  margin: ${({ isToolbarOpen }) => `${isToolbarOpen ? '28rem' : '15rem'} auto 0 auto`};
  width: 100%;
  max-width: calc(${Breakpoints.small} - 1rem);

  @media (min-width: ${Breakpoints.small}) {
    margin-top: ${({ isToolbarOpen }) => (isToolbarOpen ? '18.5rem' : '15rem')};

    max-width: calc(${Breakpoints.small} - 1rem);
  }

  @media (min-width: ${Breakpoints.medium}) {
    margin-top: ${({ isToolbarOpen }) => (isToolbarOpen ? '18.5rem' : '15rem')};

    max-width: calc(${Breakpoints.medium} - 1rem);
  }

  @media (min-width: ${Breakpoints.large}) {
    margin-top: ${({ isToolbarOpen }) => (isToolbarOpen ? '18.5rem' : '15rem')};

    max-width: calc(${Breakpoints.large} - 1rem);
  }

  @media (min-width: ${Breakpoints.extraLarge}) {
    margin-top: 15rem;
    max-width: ${Breakpoints.extraLarge};
  }
`;
