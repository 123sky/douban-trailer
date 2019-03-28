<template>
  <div class="main">
    <div class="header">
      <i class="iconfont icon-yonghu" />
      <i class="iconfont icon-liebiao" />
      <i class="iconfont icon-gengxinzhuanhuan" @click="update" />
    </div>
    <full-page v-model="currentIndex" :data="data">
      <template slot-scope="{ data: item }">
        <movie :data="item" />
      </template>
    </full-page>
  </div>
</template>

<script>
import axios from 'axios'
import FullPage from '@/components/FullPage'
import movie from './movie'
export default {
  layout: 'main',
  components: {
    movie,
    FullPage
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  async asyncData({ app }) {
    const { data } = await axios.get('http://localhost:3000/movies/all')
    const res = {
      data: data.data
    }
    return res
  },
  created() {},
  methods: {
    async update() {
      const res = await axios.put('http://localhost:3000/update/')
      console.log(res)
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  .header {
    height: 25px;
    position: absolute;
    right: 80px;
    top: 45px;
    z-index: 1;
    i {
      margin: 0 5px;
      font-size: 25px;
      cursor: pointer;
    }
  }
}
</style>
