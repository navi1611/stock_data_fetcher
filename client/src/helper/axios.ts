
import axios from "axios";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  },
  timeout: 30000,
});


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getRequest = async <T>(URL: string): Promise<{ data: T }> => {
  const response = await axiosInstance.get<T>(`${API_BASE_URL}${URL}`);
  return { data: response.data };
};

