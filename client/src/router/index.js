import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import PostDetails from '../views/PostDetails.vue';
import CreatePost from '../views/CreatePost.vue';
import EditPost from '../views/EditPost.vue';
import Dashboard from '../views/Dashboard.vue';
import AdminDashboard from '../views/AdminDashboard.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/post/:id', component: PostDetails },
  {
    path: '/create',
    component: CreatePost,
    meta: { requiresAuth: true } 
  },
  {
    path: '/post/:id/edit',
    component: EditPost,
    meta: { requiresAuth: true } 
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } 
  },
  {
	path: '/admin',
	component: AdminDashboard,
	meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// ✅ Add global navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
