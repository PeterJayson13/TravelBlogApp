<template>
  <div class="edit-post">
    <section class="hero">
      <img src="../assets/hero.jpg" alt="Edit Post" class="hero-img" />
      <div class="hero-text">
        <h1>Edit Your Adventure</h1>
        <h3>Update or delete your story below</h3>
      </div>
    </section>

    <section class="form-section">
      <form v-if="postLoaded" @submit.prevent="submitUpdate">
        <input v-model="title" type="text" placeholder="Post title" required />
        <textarea v-model="content" placeholder="Update your content..." required></textarea>
        <div class="form-actions">
          <button type="submit" class="save-button">Save Changes</button>
          <button type="button" class="delete-button" @click="deletePost">Delete Post</button>
        </div>
      </form>

      <div v-else class="status-message">Loading post...</div>
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
      token: localStorage.getItem('token') || '',
      postLoaded: false
    };
  },
  methods: {
    async fetchPost() {
      try {
        const res = await axios.get(`http://localhost:4000/posts/${this.$route.params.id}`);
        this.title = res.data.title;
        this.content = res.data.content;
        this.postLoaded = true;
      } catch (err) {
        this.message = 'Failed to load post or you are not authorized.';
        notyf.error(this.message);
      }
    },
    async submitUpdate() {
      try {
        await axios.patch(
          `http://localhost:4000/posts/${this.$route.params.id}`,
          { title: this.title, content: this.content },
          {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }
        );
        notyf.success('Post updated successfully!');
        this.$router.push(`/post/${this.$route.params.id}`);
      } catch (err) {
        const msg = err.response?.data?.message || 'Update failed.';
        notyf.error(msg);
      }
    },
    async deletePost() {
      const confirmDelete = confirm('Are you sure you want to delete this post?');
      if (!confirmDelete) return;

      try {
        await axios.delete(
          `http://localhost:4000/posts/${this.$route.params.id}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }
        );
        notyf.success('Post deleted.');
        this.$router.push('/');
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to delete post.';
        notyf.error(msg);
      }
    }
  },
  mounted() {
    this.fetchPost();
  }
};
</script>


<style scoped>
.edit-post {
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

.form-section {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 3rem;
}

input,
textarea {
  width: 100%;
  margin-bottom: 1.2rem;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.save-button {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button {
  background-color: #c0392b;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #145ca1;
}

.delete-button:hover {
  background-color: #a52a2a;
}

.status-message {
  text-align: center;
  color: #666;
  margin-top: 1rem;
}
</style>
