<template>
  <div class="main">
    <div class="header">
      <i class="iconfont icon-yonghu" @click="handleLogin" />
      <i v-if="userId" class="iconfont icon-gengxinzhuanhuan" @click="update" />
    </div>
    <full-page v-model="currentIndex" :data="data">
      <template slot-scope="{ data: item }">
        <movie :data="item" />
      </template>
    </full-page>
    <modal v-model="dialogVisible" title="登陆">
      <login-form @afterLogin="afterLogin" />
    </modal>
  </div>
</template>

<script>
import axios from '@/plugins/axios'
import FullPage from '@/components/FullPage'
import Modal from '@/components/Modal'
import movie from './movie'
import loginForm from './loginForm'
import Cookies from 'js-cookie'
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
      dialogVisible: false,
      userId: Cookies.get('userId')
    }
  },
  async asyncData({ app }) {
    const { data } = await axios.get('/movies/all')
    return { data }
  },
  methods: {
    async handleLogin() {
      if (this.userId) {
        const res = await axios.get('/user/logout')
        if (res.code === 1) {
          Cookies.remove('userId')
          this.userId = null
        }
      } else {
        this.dialogVisible = true
      }
    },
    async update() {
      const res = await axios.put('/update/')
      console.log(res)
    },
    afterLogin(id) {
      this.dialogVisible = false
      this.userId = id
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
