<template>
  <div class="dashboard">
    <section class="hero">
      <img src="../assets/hero.jpg" alt="Dashboard" class="hero-img" />
      <div class="hero-text">
        <h1>My Travel Posts</h1>
        <h3>Manage and update your shared adventures</h3>
      </div>
    </section>

    <section class="content">
      <div v-if="loading" class="status-message">Loading your posts...</div>

      <div v-else-if="posts.length === 0">
        <p>You haven't written any posts yet.</p>
        <router-link to="/create" class="create-link">Create your first post</router-link>
      </div>

      <div v-else>
        <router-link to="/create" class="create-link">+ New Post</router-link>

        <div class="post-list">
          <div v-for="post in posts" :key="post._id" class="post-card">
            <div class="post-header">
              <h3>{{ post.title }}</h3>
              <div class="actions">
                <router-link :to="`/post/${post._id}/edit`">Edit</router-link>
                <button @click="deletePost(post._id)">Delete</button>
              </div>
            </div>
            <p>{{ truncate(post.content) }}</p>
          </div>
        </div>
      </div>

      <p v-if="message" class="status-message">{{ message }}</p>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
  data() {
    return {
      posts: [],
      loading: true,
      message: '',
      token: localStorage.getItem('token') || ''
    };
  },
  methods: {
    async fetchMyPosts() {
      try {
        const res = await axios.get('http://localhost:4000/posts', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });

        const currentUser = JSON.parse(atob(this.token.split('.')[1]));
        this.posts = res.data.filter(post => post.author._id === currentUser.id);
      } catch (err) {
        this.message = 'Failed to load your posts.';
        notyf.error('Failed to load posts.');
      } finally {
        this.loading = false;
      }
    },
    async deletePost(id) {
      const confirmDelete = confirm('Are you sure you want to delete this post?');
      if (!confirmDelete) return;

      try {
        await axios.delete(`http://localhost:4000/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.message = 'Post deleted.';
        notyf.success('Post deleted successfully');
        this.fetchMyPosts();
      } catch (err) {
        this.message = 'Failed to delete post.';
        notyf.error('Failed to delete post');
      }
    },
    truncate(content) {
      return content.length > 100 ? content.slice(0, 100) + '...' : content;
    }
  },
  mounted() {
    this.fetchMyPosts();
  }
};
</script>


<style scoped>
.dashboard {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  margin: 2rem 0;
}

.hero-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  filter: brightness(70%);
}

.hero-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
}

.hero-text h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.hero-text h3 {
  font-size: 1.2rem;
  font-weight: normal;
}

.content {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 3rem;
}

.status-message {
  text-align: center;
  color: #666;
  margin-top: 1rem;
}

.create-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-weight: bold;
  color: #1976d2;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-card {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1.2rem;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 0.8rem;
}

.actions a {
  color: #1976d2;
  font-weight: bold;
}

.actions button {
  background-color: #ff4d4d;
  border: none;
  padding: 0.3rem 0.6rem;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:hover {
  background-color: #e60000;
}
</style>
