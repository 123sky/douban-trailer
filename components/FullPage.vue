<template>
  <div class="full-page-wrap">
    <!-- <div class="operation">
      <div class="last" @click="last">
        <i class="iconfont icon-up" />
      </div>
      <div class="next" @click="next">
        <i class="iconfont icon-up" />
      </div>
    </div> -->

    <div class="full-page" :style="style">
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
import util from '@/lib/util.js'
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
  mounted() {
    if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
      document.addEventListener('mousewheel', this.handleMouseWheel())
    } else {
      document.addEventListener('DOMMouseScroll', this.handleMouseWheel())
    }
  },
  methods: {
    handleMouseWheel() {
      return util.throttle(this.scrollMouse, this, 1000)
    },
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
    },
    // 鼠标滚动逻辑（全屏滚动关键逻辑）
    scrollMouse(event) {
      const delta = util.getWheelDelta(event)
      // delta < 0，鼠标往前滚动，页面向下滚动
      if (delta < 0) {
        this.next()
      } else {
        this.last()
      }
    },
    // 触屏事件
    touchEnd(event) {
      const endY = event.changedTouches[0].pageY
      if (endY - this.startY < 0) {
        // 手指向上滑动，对应页面向下滚动
        this.next()
      } else {
        // 手指向下滑动，对应页面向上滚动
        this.last()
      }
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
