<template>
  <div class="home">
    <section class="hero">
      <img src="../assets/hero.jpg" alt="Travel Adventure" class="hero-img" />
      <div class="hero-text">
        <h1>Wander & Discover</h1>
        <h3>Latest travel stories, tips, and adventures from around the globe.</h3>
      </div>
    </section>

    <section class="updates">
      <h2>Latest News & Updates</h2>
      <p>Explore our newest blog entries, curated to inspire your next journey.</p>
    </section>

    <section class="content">
      <div v-if="loading" class="status-message">Loading posts...</div>
      <div v-else-if="posts.length === 0" class="status-message">No travel stories yet.</div>

      <div v-else class="post-list">
        <PostCard v-for="post in posts" :key="post._id" :post="post" />
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import PostCard from '../components/PostCard.vue';

export default {
  components: { PostCard },
  data() {
    return {
      posts: [],
      loading: true
    };
  },
  async mounted() {
    try {
      const res = await axios.get('https://travelblogapp-kpka.onrender.com/posts');
      this.posts = Array.isArray(res.data) ? res.data : res.data.posts || [];
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.home {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  margin: 2rem 0;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.hero-img {
  width: 100%;
  height: 340px;
  object-fit: cover;
  filter: brightness(65%);
}

.hero-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  padding: 0 1rem;
}

.hero-text h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}

.hero-text h3 {
  font-size: 1.3rem;
  font-weight: 300;
}

.updates {
  text-align: center;
  margin-bottom: 2rem;
}

.updates h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.3rem;
  font-weight: 600;
}

.updates p {
  font-size: 1.05rem;
  color: #666;
}

.status-message {
  text-align: center;
  font-size: 1.1rem;
  color: #888;
  margin-top: 2rem;
}

.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}
</style>
