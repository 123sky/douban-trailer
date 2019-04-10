<template>
  <div v-show="visible" class="modal-wrap">
    <div class="modal" :style="{ width: width }">
      <div class="header">
        <slot name="title" />
        <span v-if="!$slots.header" class="title">{{ title }}</span>
        <i class="iconfont icon-ic_close" @click="close" />
      </div>
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '500px'
    }
  },
  data() {
    return {
      visible: false
    }
  },
  watch: {
    value: function(val) {
      this.visible = val
    }
  },
  methods: {
    close() {
      this.visible = false
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2001;
  background: rgba(0, 0, 0, 0.5);
  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 200px;
    background-color: #fff;
    .header {
      padding: 20px 20px 10px;
      .icon-ic_close {
        position: absolute;
        right: 20px;
        top: 25px;
        cursor: pointer;
      }
    }
    .content {
      padding: 10px 20px 20px;
    }
  }
}
</style>
