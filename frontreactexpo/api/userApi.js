import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// POST /api/users/login
export const loginUser = async (email, password) => {
  const res = await apiClient.post('/users/login', { email, password });

  const { token, ...user } = res.data;

  if (token) {
    await AsyncStorage.setItem('token', token); // guardamos token
  }

  return user; // devolvemos el usuario sin el token
};

// GET /api/users/profile (protegida)
export const getProfile = async () => {
  const res = await apiClient.get('/users/profile'); 
  // el token se añade solo por el interceptor
  return res.data;
};
