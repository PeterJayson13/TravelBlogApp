<template>
  <div class="post-details">
    <div v-if="loading" class="loading">Loading post...</div>

    <div v-else-if="post" class="post-box">
      <h1 class="post-title">{{ post.title }}</h1>
      <p class="post-author">By: {{ post.author?.username }}</p>
      <p class="content" v-html="formatContent(post.content)"></p>
    </div>

    <hr />

    <section class="comments-section">
      <h3 class="comment-heading">Comments</h3>
      <div v-if="comments.length === 0" class="no-comments">No comments yet.</div>
      <ul class="comment-list">
        <li v-for="comment in comments" :key="comment._id" class="comment-item">
          <strong>{{ comment.userId?.username }}:</strong> {{ comment.comment }}
        </li>
      </ul>
    </section>

    <div v-if="token" class="comment-form">
      <h4>Add a comment</h4>
      <form @submit.prevent="submitComment">
        <textarea v-model="newComment" required placeholder="Write your comment..."></textarea>
        <button type="submit">Post Comment</button>
      </form>
    </div>

    <div v-else class="login-prompt">
      <p><router-link to="/login">Log in</router-link> to comment</p>
    </div>
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
      post: null,
      comments: [],
      newComment: '',
      loading: true,
      token: localStorage.getItem('token') || ''
    };
  },
  methods: {
    async fetchPost() {
      try {
        const res = await axios.get(`https://travelblogapp-kpka.onrender.com/posts/${this.$route.params.id}`);
        this.post = res.data;
      } catch (err) {
        console.error('Error fetching post:', err);
        notyf.error('Failed to load post.');
      }
    },
    async fetchComments() {
      try {
        const res = await axios.get(`https://travelblogapp-kpka.onrender.com/comments/post/${this.$route.params.id}`);
        this.comments = res.data;
      } catch (err) {
        console.error('Error fetching comments:', err);
        notyf.error('Failed to load comments.');
      }
    },
    async submitComment() {
      try {
        await axios.post(
          `https://travelblogapp-kpka.onrender.com/comments/post/${this.$route.params.id}`,
          { comment: this.newComment },
          {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }
        );
        this.newComment = '';
        notyf.success('Comment posted!');
        this.fetchComments(); // reload comments
      } catch (err) {
        console.error('Failed to post comment:', err);
        notyf.error('Failed to post comment.');
      }
    },
    formatContent(text) {
      return text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    }
  },
  async mounted() {
    await this.fetchPost();
    await this.fetchComments();
    this.loading = false;
  }
};
</script>

<style scoped>
.post-details {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.post-box {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}

.post-title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.post-author {
  color: #777;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.post-content {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
}

.comments-section {
  margin-top: 2rem;
}

.comment-heading {
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.comment-list {
  list-style: none;
  padding: 0;
}

.comment-item {
  background-color: #f2f2f2;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
}

.comment-form {
  margin-top: 2rem;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-height: 100px;
  font-size: 1rem;
  margin-bottom: 1rem;
}

button {
  background-color: #333;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #222;
}

.no-comments,
.loading,
.login-prompt {
  text-align: center;
  color: #888;
  margin-top: 1rem;
}
</style>
