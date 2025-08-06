<template>
  <nav class="navbar">
    <div class="navbar-left">
      <router-link to="/" class="brand">Travel-Blogs</router-link>
    </div>

    <div class="navbar-right">
      <router-link to="/">Home</router-link>

      <router-link v-if="isLoggedIn && !isAdmin" to="/dashboard">My Post</router-link>
      <router-link v-if="isLoggedIn && isAdmin" to="/admin">Admin Panel</router-link>

      <router-link v-if="isLoggedIn" to="/create">Create</router-link>

      <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
      <router-link v-if="!isLoggedIn" to="/register">Register</router-link>

      <button v-if="isLoggedIn" @click="logout" class="logout-btn">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const auth = useAuthStore();
const router = useRouter();

const isLoggedIn = computed(() => auth.isLoggedIn);
const isAdmin = computed(() => auth.isAdmin);

const logout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1f1f1f;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.navbar-left .brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}

.navbar-right {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.navbar-right a {
  color: #ddd;
  text-decoration: none;
  font-weight: 500;
  padding: 6px 10px;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.navbar-right a:hover {
  background-color: #444;
  color: #fff;
}

.logout-btn {
  background-color: transparent;
  border: 1px solid #ddd;
  padding: 6px 12px;
  color: #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.logout-btn:hover {
  background-color: #ff4d4d;
  border-color: transparent;
  color: white;
}
</style>
