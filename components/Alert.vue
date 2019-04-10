<template>
  <div class="alert" :class="type">
    {{ title }}
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info'
    }
  }
}
</script>

<style lang="scss" scoped>
.alert {
  border-radius: 4px;
  padding: 10px 20px;
}

.success {
  background-color: #f0f9eb;
  color: #67c23a;
}

.info {
  background-color: #f4f4f5;
  color: #909399;
}

.warning {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.error {
  background-color: #fef0f0;
  color: #f56c6c;
}
</style>
