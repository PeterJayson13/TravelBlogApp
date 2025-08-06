<template>
  <div class="create-post">
    <section class="hero">
      <img src="../assets/hero.jpg" alt="Create Post" class="hero-img" />
      <div class="hero-text">
        <h1>Share Your Adventure</h1>
        <h3>Tell the world about your latest journey</h3>
      </div>
    </section>

    <section class="form-container">
      <form @submit.prevent="submitPost">
        <input
          v-model="title"
          type="text"
          placeholder="Post title"
          required
        />
        <textarea
          v-model="content"
          placeholder="Write your travel story..."
          required
        ></textarea>
        <button type="submit">Publish</button>
      </form>

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
      title: '',
      content: '',
      message: '',
      token: localStorage.getItem('token') || ''
    };
  },
  methods: {
    async submitPost() {
      if (!this.token) {
        this.message = 'You must be logged in to create a post.';
        notyf.error('Please log in to create a post.');
        return;
      }

      try {
        const res = await axios.post(
          'https://travelblogapp-kpka.onrender.com/posts',
          { title: this.title, content: this.content },
          {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }
        );
        this.message = 'Post created successfully!';
        notyf.success('Post published!');
        this.$router.push(`/post/${res.data.post._id}`);
      } catch (err) {
        console.error(err);
        this.message = err.response?.data?.message || 'Failed to create post.';
        notyf.error(this.message);
      }
    }
  }
};
</script>


<style scoped>
.create-post {
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

.form-container {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 3rem;
}

input,
textarea {
  display: block;
  width: 100%;
  margin-bottom: 1.2rem;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
}

textarea {
  min-height: 150px;
  resize: vertical;
}

button {
  background-color: #1976d2;
  border: none;
  padding: 0.6rem 1.2rem;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #125ea5;
}

.status-message {
  color: #1976d2;
  margin-top: 1rem;
  text-align: center;
}
</style>
