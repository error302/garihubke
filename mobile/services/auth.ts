import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post('/auth/callback/credentials', { email, password });
    if (res.data.user) {
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      await AsyncStorage.setItem('token', res.data.token || 'logged_in');
    }
    return res.data;
  },

  async register(name: string, email: string, password: string) {
    const res = await api.post('/register', { name, email, password });
    return res.data;
  },

  async logout() {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
  },

  async getUser() {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async isLoggedIn() {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },
};
