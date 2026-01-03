import { AxiosRequestConfig } from 'axios';
import apiClient from './apiClient';

export const apiRequest = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: 'Something went wrong',
    };
  }
};
