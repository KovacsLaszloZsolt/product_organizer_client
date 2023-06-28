import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import createEmotionCache from '../lib/createEmotionCache';
import '../styles/globals.css';
// import { GlobalStyle } from '../styles/globalStyles';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function App({ Component, pageProps, emotionCache = clientSideEmotionCache }: MyAppProps) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>Next App</title>
            <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
          </Head>
          <div id="root">
            <CssBaseline />
            <Component {...pageProps} />
            {/* </Layout> */}
            {/* <GlobalStyle /> */}
            {/* </ThemeProvider> */}
          </div>
        </CacheProvider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default appWithTranslation(App);
