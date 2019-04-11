<template>
  <div class="main">
    <full-page v-model="currentIndex" :data="data">
      <template slot-scope="scope">
        <movie :data="scope.data" />
      </template>
    </full-page>
    <div class="tools">
      <span @click="check">更新数据</span>
    </div>
    <modal v-model="dialogVisible" title="请进行管理员校验">
      <login-form @close="dialogVisible = false" />
    </modal>
  </div>
</template>

<script>
import axios from '@/plugins/axios'
import FullPage from '@/components/FullPage'
import Modal from '@/components/Modal'
import movie from './movie'
import loginForm from './loginForm'
export default {
  layout: 'main',
  components: {
    movie,
    loginForm,
    FullPage,
    Modal
  },
  data() {
    return {
      currentIndex: 0,
      dialogVisible: false
    }
  },
  async asyncData({ app }) {
    const res = await axios.get('/movies/all')
    return { data: res.data }
  },
  methods: {
    check() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  .tools {
    position: absolute;
    right: 0px;
    bottom: 0px;
    z-index: 1;
    cursor: pointer;
    color: #ccc;
    opacity: 0.2;
  }
}
</style>
