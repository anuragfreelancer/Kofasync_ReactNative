import axios from 'axios';
import { BASE_URL } from '../constant';
import { store } from '../redux/store';
// import { logout, setToken } from '../redux/authSlice';
import {
  startLoading,
  stopLoading
} from '../redux/feature/loadingSlice';

declare module 'axios' {
  export interface AxiosRequestConfig {
    showLoader?: boolean;
  }
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue = [];

// Request Interceptor
apiClient.interceptors.request.use(
  async (config: any) => {
    if (config.showLoader !== false) {
      store.dispatch(startLoading());
    }
    const { token } = store.getState().auth;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    store.dispatch(stopLoading());
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: any) => {
    if (response.config.showLoader !== false) {
      store.dispatch(stopLoading());
    }
    return response;
  },
  async (error: any) => {
    if (!error.config || error.config.showLoader !== false) {
      store.dispatch(stopLoading());
    }
    const originalRequest = error.config;

    // Network Error
    if (!error.response) {
      console.log('Network Error');
      return Promise.reject(error);
    }

    // Token Expired
    if (
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        })
          .then((token) => {
            originalRequest.headers.Authorization =
              `Bearer ${token}`;

            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

    }

    switch (error.response.status) {
      case 400:
        console.log('Bad Request');
        break;

      case 403:
        console.log('Forbidden');
        break;

      case 404:
        console.log('Not Found');
        break;

      case 500:
        console.log('Server Error');
        break;

      default:
        break;
    }

    return Promise.reject(error);
  }
);

export default apiClient;