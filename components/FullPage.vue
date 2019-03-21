<template>
  <div class="full-page-wrap">
    <div class="operation">
      <div class="last" @click="last">
        <i class="iconfont icon-up" />
      </div>
      <div class="next" @click="next">
        <i class="iconfont icon-up" />
      </div>
    </div>
    
    <div
      class="full-page"
      :style="style"
    >
      <div
        v-for="(item, index) in data"
        :key="item._id"
        class="full-page-section"
      >
        <template v-if="loadTag[index]">
          <slot :data="item" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentIndex: 0,
      loadTag: {}
    }
  },
  computed: {
    style() {
      const style = {}
      const percent = -this.currentIndex * (100 / this.data.length)
      style.transform = `translateY(${percent}%)`
      return style
    }
  },
  watch: {
    value: function(val) {
      this.currentIndex = val
    },
    currentIndex: {
      immediate: true,
      handler: function(val) {
        this.loadTag[val] = true
        this.loadTag[val + 1] = true
      }
    }
  },
  methods: {
    last() {
      this.currentIndex = this.currentIndex - 1 < 0 ? 0 : this.currentIndex - 1
      this.$emit('input', this.currentIndex)
    },
    next() {
      this.currentIndex =
        this.currentIndex + 1 < this.data.length
          ? this.currentIndex + 1
          : this.currentIndex
      this.$emit('input', this.currentIndex)
    }
  }
}
</script>


<style lang="scss" scoped>
.full-page-wrap {
  height: calc(100vh);
  position: relative;
  overflow: hidden;
  .operation {
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    .last,
    .next {
      width: 34px;
      height: 34px;
      cursor: pointer;
      i {
        font-size: 34px;
      }
    }
    .next {
      margin-top: 40px;
      transform: rotate(180deg);
    }
  }
  .tools {
    position: absolute;
    right: 50px;
  }
  .full-page {
    position: relative;
    top: 0;
    transition: 1s all ease;
    .full-page-section {
      height: calc(100vh);
      position: relative;
      width: 100%;
    }
  }
}
</style>
