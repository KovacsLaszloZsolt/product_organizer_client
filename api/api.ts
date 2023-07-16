import axios, { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';
import config from '../config/config';
import { getLocalStorageAuthToken } from '../utils/localStorageAuthToken';

// export const queryClient = new QueryClient();

const api = axios.create({
  baseURL: `${config.backendUrl}`
});

const unprotectedApi = axios.create({
  baseURL: `${config.backendUrl}`
});

api.interceptors.request.use(
  async (axiosConfig: InternalAxiosRequestConfig) => {
    if (axiosConfig.headers === undefined) {
      axiosConfig.headers = {} as AxiosRequestHeaders;
    }

    const localStorageAuthToken = getLocalStorageAuthToken();
    // const cookieAuthToken = await getCookie('authToken');

    if (localStorageAuthToken) {
      axiosConfig.headers.Authorization = `Bearer ${localStorageAuthToken}`;
    }
    // else if (cookieAuthToken) {
    //   axiosConfig.headers.Authorization = `Bearer ${cookieAuthToken}`;
    // }

    // const authToken = (axiosConfig.headers.Authorization as string)?.split(' ')[1];

    // logger.info({
    //   url: axiosConfig.url,
    //   method: axiosConfig.method,
    //   data: axiosConfig.data,
    //   authToken
    // });

    return axiosConfig;
  }
  // (error) => {
  //   // logger.error(error);
  //   Promise.reject(error);
  // }
);

api.interceptors.response.use(
  (_) => _,
  (error) => {
    //     // const authToken = (error.config.headers.Authorization as string)?.split(' ')[1];

    //     // logger.error({
    //     //   message: error.message,
    //     //   status: error.response.status,
    //     //   statusText: error.response.statusText,
    //     //   errorText: error.response.data.message,
    //     //   code: error.response.data.code,
    //     //   url: error.config.url,
    //     //   data: error.config.data,
    //     //   authToken
    //     // });

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('poAuthToken');
        location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export { api, unprotectedApi };
