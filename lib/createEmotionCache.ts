import createCache, { EmotionCache } from '@emotion/cache';

const createEmotionCache = (): EmotionCache => {
  return createCache({ key: 'css' });
};

// eslint-disable-next-line import/no-default-export
export default createEmotionCache;
