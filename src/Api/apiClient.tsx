import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 15000,
});

// 🔐 Request Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken(); // AsyncStorage / SecureStore

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
