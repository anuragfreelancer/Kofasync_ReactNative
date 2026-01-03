import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { PermissionsAndroid, Platform } from 'react-native';
import { BASE_URL } from '../constant';
 
export interface ApiRequest {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT';
  data?: any;
  headers?: Record<string, string>;
  token?: string;
  redirect?:any
}


export const callMultipleApis = async (requests: ApiRequest[]) => {
  try {
    const responses: AxiosResponse[] = await Promise.all(
      requests.map((req) => {
 
        const config: AxiosRequestConfig = {
          method: req.method || 'GET',
          url: `${BASE_URL}${req.endpoint}`,
          data: (req.method === 'POST' || req.method === 'PUT') ? req.data : undefined,
          headers: {
            'Content-Type': req.data instanceof FormData ? 'multipart/form-data' : 'application/json',
            ...(req.token ? { Authorization: `Bearer ${req.token}` } : {}),
            ...req.headers,
          },
        };

        return axios(config);
      })
    );

    // Return only data from all responses
    return responses.map((res) => res.data);

  } catch (error) {
    console.error('API Error:', error);

    // Optional: You can customize how you want to handle the error (log, rethrow, etc.)
    throw error;
  }
};

export const callApi = async (
  method: string,
  url: string,
  headers: any = {},
  data: any = null
): Promise<any> => {
  try {
    const isFormData = data instanceof FormData;

    const config: AxiosRequestConfig = {
      method,
      url,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      data,
    };

    const response: AxiosResponse = await axios(config);
    return response.data;

  } catch (error: any) {
    console.error('API Error:', error);

    if (error.response) {
      throw new Error(
        error.response.data?.message || 'API request failed'
      );
    }
    throw new Error('Network error');
  }
};



export const requestCameraPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ]);

      return (
        granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (error) {
      console.warn('Permission request error:', error);
      return false;
    }
  }
  return true; // iOS handles permissions automatically
};

 
