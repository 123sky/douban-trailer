<template>
  <div class="login-form">
    <div class="item">
      <label class="label" for="email">
        邮箱:
      </label>
      <input id="email" v-model="form.email" type="text" />
    </div>
    <div class="item" for="password">
      <label class="label">
        密码:
      </label>
      <input id="password" v-model="form.password" type="password" />
    </div>
    <div class="submit">
      <button @click="submit">
        登录
      </button>
    </div>
    <alert
      v-show="response.code !== 1 && response.code !== undefined"
      :title="response.message"
      :type="response.type"
    >
    </alert>
  </div>
</template>

<script>
import axios from '@/plugins/axios'
import Alert from '@/components/Alert'
export default {
  components: {
    Alert
  },
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      response: {}
    }
  },
  methods: {
    async submit() {
      const res = await axios.post('/user/login', this.form)
      if (res.code === 1) {
        const res = await axios.put('/update/')
        this.$emit('close')
        console.log(res)
      } else {
        this.response = res
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-form {
  padding: 20px 30px;
  .item {
    margin-bottom: 30px;
    .label {
      display: block;
      color: #a5a5a5;
      margin-bottom: 5px;
    }
    input {
      width: 100%;
      height: 30px;
      border: none;
      border-bottom: 1px solid #d2d2d2;
      outline: none;
    }
  }
  .submit {
    margin-top: 50px;
    button {
      width: 100%;
      padding: 15px;
      border-radius: 4px;
      border: none;
      background: #2d62f7;
      color: #fff;
    }
  }
  .alert {
    margin-top: 20px;
  }
}
</style>
