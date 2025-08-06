import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    isAdmin: false
  }),

  actions: {
    login(token) {
      this.token = token;
      localStorage.setItem('token', token);

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.isAdmin = payload.isAdmin;
      } catch (error) {
        console.error('Failed to decode token during login', error);
        this.isAdmin = false;
      }
    },

    logout() {
      this.token = '';
      this.isAdmin = false;
      localStorage.removeItem('token');
    },

    hydrate() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.isAdmin = payload.isAdmin;
        } catch (e) {
          console.error("Invalid token on hydrate", e);
          this.logout();
        }
      }
    }
  },

  getters: {
    isLoggedIn: (state) => !!state.token
  }
});
