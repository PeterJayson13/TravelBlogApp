<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login to Your Account</h2>

      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />

        <button type="submit" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '../store/auth';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
  data() {
    return {
      email: '',
      password: '',
      loading: false
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;

      try {
        const res = await axios.post('https://travelblogapp-kpka.onrender.com/users/login', {
          email: this.email,
          password: this.password
        });

        const token = res.data.access;
        useAuthStore().login(token);
        notyf.success('Login successful!');
        this.$router.push('/');
      } catch (err) {
        const msg = err.response?.data?.message || 'Login failed';
        notyf.error(msg);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem;
}

.login-box {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

button {
  background-color: #333;
  color: #fff;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

button:disabled {
  background-color: #888;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #fff;
  border-top: 2px solid #333;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.7s linear infinite;
  margin-right: 6px;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
