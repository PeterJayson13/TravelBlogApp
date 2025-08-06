<template>
  <div class="admin-dashboard">
    <section class="hero">
      <img src="../assets/hero.jpg" alt="Admin Panel" class="hero-img" />
      <div class="hero-text">
        <h1>Admin Dashboard</h1>
        <h3>Oversee posts and comments across the blog</h3>
      </div>
    </section>

    <section class="content">
      <div v-if="loading" class="status-message">Loading all posts...</div>
      <div v-else-if="posts.length === 0" class="status-message">No posts available.</div>

      <div v-else class="post-list">
        <div v-for="post in posts" :key="post._id" class="admin-card">
          <div class="card-header">
            <h2>{{ post.title }}</h2>
            <div class="card-actions">
              <!-- Edit button for admin's own posts -->
              <router-link
                v-if="post.author?._id === userId"
                :to="`/post/${post._id}/edit`"
                class="edit-btn"
              >
                Edit
              </router-link>

              <button class="delete-btn" @click="deletePost(post._id)">
                Delete Post
              </button>
            </div>
          </div>

          <p class="content">{{ post.content }}</p>
          <p class="author">By: {{ post.author?.username }}</p>

          <div class="comments-section">
            <h4>Comments</h4>
            <div v-if="post.comments?.length === 0" class="no-comments">No comments</div>
            <ul v-else class="comment-list">
              <li v-for="comment in post.comments" :key="comment._id">
                <strong>{{ comment.userId?.username }}:</strong> {{ comment.comment }}
                <button @click="deleteComment(comment._id)">Delete</button>
              </li>
            </ul>
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
      token: localStorage.getItem('token') || '',
      userId: ''
    };
  },
  methods: {
    async fetchAllPostsWithComments() {
      try {
        const userRes = await axios.get('https://travelblogapp-kpka.onrender.com/users/details', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.userId = userRes.data._id;

        const postRes = await axios.get('https://travelblogapp-kpka.onrender.com/posts', {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        const postsWithComments = await Promise.all(
          postRes.data.map(async post => {
            const commentRes = await axios.get(
              `https://travelblogapp-kpka.onrender.com/comments/post/${post._id}`
            );
            return { ...post, comments: commentRes.data || [] };
          })
        );

        this.posts = postsWithComments;
      } catch (err) {
        this.message = 'Failed to load posts or comments.';
        notyf.error(this.message);
      } finally {
        this.loading = false;
      }
    },
    async deletePost(postId) {
      if (!confirm('Are you sure you want to delete this post?')) return;
      try {
        await axios.delete(`https://travelblogapp-kpka.onrender.com/posts/${postId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.message = 'Post deleted.';
        notyf.success('Post deleted');
        this.fetchAllPostsWithComments();
      } catch {
        this.message = 'Failed to delete post.';
        notyf.error(this.message);
      }
    },
    async deleteComment(commentId) {
      if (!confirm('Delete this comment?')) return;
      try {
        await axios.delete(`https://travelblogapp-kpka.onrender.com/comments/${commentId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.message = 'Comment deleted.';
        notyf.success('Comment deleted');
        this.fetchAllPostsWithComments();
      } catch {
        this.message = 'Failed to delete comment.';
        notyf.error(this.message);
      }
    }
  },
  mounted() {
    this.fetchAllPostsWithComments();
  }
};
</script>


<style scoped>
.admin-dashboard {
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
  margin-bottom: 3rem;
}

.status-message {
  text-align: center;
  color: #666;
  margin-top: 2rem;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.admin-card {
  background-color: #fefefe;
  border: 1px solid #ddd;
  padding: 1.5rem;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  background-color: #1976d2;
  border: none;
  padding: 0.4rem 0.8rem;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.9rem;
}

.edit-btn:hover {
  background-color: #0d47a1;
}

.delete-btn {
  background-color: #ff4d4d;
}

.delete-btn:hover {
  background-color: #e60000;
}

.admin-card .author {
  font-size: 0.9rem;
  color: #666;
  margin: 0.5rem 0 1rem;
}

.comments-section {
  margin-top: 1rem;
  background-color: #f8f8f8;
  padding: 1rem;
  border-radius: 6px;
}

.comments-section h4 {
  margin-bottom: 0.8rem;
}

.no-comments {
  color: #888;
}

.comment-list {
  list-style-type: none;
  padding: 0;
}

.comment-list li {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border: 1px solid #eee;
  padding: 0.6rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  align-items: center;
}

.comment-list button {
  background-color: #ff4d4d;
  border: none;
  padding: 0.3rem 0.6rem;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}
</style>
