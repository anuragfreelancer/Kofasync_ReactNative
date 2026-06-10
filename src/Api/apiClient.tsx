// import axios from 'axios';

// import { BASE_URL } from '../constant';
// import { store } from '../redux/store';

// const apiClient = axios.create({
//   baseURL: BASE_URL,
//   timeout: 15000,
// });

// // 🔐 Request Interceptor
// apiClient.interceptors.request.use(
//   async (config) => {
//     const { token } = store.getState().auth;

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // logout or refresh token
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;



import axios from 'axios';
import { BASE_URL } from '../constant';
import { store } from '../redux/store';
// import { logout, setToken } from '../redux/authSlice';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((promise) => {
//     if (error) {
//       promise.reject(error);
//     } else {
//       promise.resolve(token);
//     }
//   });

//   failedQueue = [];
// };

// Request Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const { token } = store.getState().auth;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
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

      // isRefreshing = true;

      // try {
      //   const { refreshToken } = store.getState().auth;

      //   const response = await axios.post(
      //     `${BASE_URL}/auth/refresh`,
      //     {
      //       refreshToken,
      //     }
      //   );

      //   const newAccessToken =
      //     response.data.accessToken;

      //   store.dispatch(
      //     setToken(newAccessToken)
      //   );

      //   apiClient.defaults.headers.common.Authorization =
      //     `Bearer ${newAccessToken}`;

      //   processQueue(null, newAccessToken);

      //   originalRequest.headers.Authorization =
      //     `Bearer ${newAccessToken}`;

      //   return apiClient(originalRequest);
      // } catch (refreshError) {
      //   processQueue(refreshError, null);

      //   store.dispatch(logout());

      //   return Promise.reject(refreshError);
      // } finally {
      //   isRefreshing = false;
      // }
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