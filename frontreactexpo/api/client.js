import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/apiConfig';

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
});

// Interceptor para adjuntar el token en cada request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 👈 aquí va el token
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
