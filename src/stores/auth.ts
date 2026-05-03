import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import ApiService from '../services/ApiService';

import type { User } from '../types/user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: !!Cookies.get('token'),
  }),
  actions: {
    async login(credentials: Record<string, any>): Promise<boolean> {
      try {
        console.log('authStore.login called with:', credentials);
        console.log('ApiService instance:', ApiService);
        
        // Call the actual backend API
        const response: any = await ApiService.post('/auth/login', credentials);
        console.log('Login response:', response);
        const token = response.data.access_token;
        
        // Save token in cookies (expires in 1 day)
        Cookies.set('token', token, { expires: 1 });
        
        this.isAuthenticated = true;
        
        // Fetch user info after login
        await this.fetchMe();
        
        return true;
      } catch (error) {
        console.error('Login failed', error);
        throw error;
      }
    },
    
    async fetchMe(): Promise<void> {
      if (!Cookies.get('token')) {
        this.isAuthenticated = false;
        this.user = null;
        return;
      }
      
      try {
        // Call the actual backend API to get user info
        const response: any = await ApiService.get('/auth/me');
        this.user = response.data;
        
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Failed to fetch user', error);
        this.logout();
      }
    },
    
    logout(): void {
      Cookies.remove('token');
      this.user = null;
      this.isAuthenticated = false;
    }
  }
});
