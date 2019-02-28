<template>
  <div class="main">
    <div class="poster">
      <div>{{ data.year }}</div>
      <img :src="data.poster" alt="海报">
      <div class="play" />
    </div>
    <div class="info">
      <h1>{{ data.title }}</h1>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  async asyncData({ params }) {
    const { data } = await axios.get('http://localhost:3000/movies/all')
    return { data: data.data[0] }
  }
}
</script>

<style lang="scss" scoped>
.main {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  .poster {
    width: 55%;
  }
  .info {
    width: 45%;
  }
}
</style>
