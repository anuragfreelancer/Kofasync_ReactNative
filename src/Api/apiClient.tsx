import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { BASE_URL } from '../constant';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// 🔐 Request Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const jsonValue = await AsyncStorage.getItem('authData');
    const token = jsonValue != null ? JSON.parse(jsonValue).token : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // logout or refresh token
    }
    return Promise.reject(error);
  }
);

export default apiClient;
