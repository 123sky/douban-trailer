<template>
  <div class="rate">
    <ul class="stars">
      <li v-for="item in 5" :key="item">
        <i
          class="iconfont icon-pingfen"
          :style="{ color: item <= Math.ceil(data / 2) ? '#febd36' : '#ccc' }"
        />
      </li>
    </ul>
    <!-- <span>{{ data }}</span> -->
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.rate {
  display: inline-block;
  line-height: 16px;
  .stars {
    display: inline-block;
    list-style: none;
    padding: 0;
    margin-right: 10px;
    li {
      margin-right: 10px;
      display: inline-block;

      &:last-child {
        margin: 0;
      }
    }
  }
  span {
    vertical-align: top;
  }
}
</style>
