<template>
  <div class="post-card">
    <div class="card-body">
      <h3>{{ post.title }}</h3>
      <p class="snippet">{{ truncate(post.content) }}</p>
      <p class="author">By: {{ post.author?.username || 'Unknown' }}</p>
    </div>
    <router-link :to="`/post/${post._id}`" class="read-more">Read More</router-link>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    truncate(content) {
      return content.length > 100 ? content.slice(0, 100) + '...' : content;
    }
  }
};
</script>

<style scoped>
.post-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid #eee;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.card-body h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-size: 1.4rem;
}

.snippet {
  color: #555;
  font-size: 1rem;
  margin-bottom: 0.8rem;
  line-height: 1.4;
}

.author {
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 1rem;
}

.read-more {
  align-self: flex-start;
  background-color: #1f1f1f;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.2s ease;
  font-size: 0.95rem;
}

.read-more:hover {
  background-color: #007a63;
}
</style>
