<template>
  <div class="main-wrap">
    <!-- <div class="main-wrap-header">
      HI,Jump
    </div> -->
    <div class="main-wrap-content">
      <nuxt />
    </div>
  </div>
</template>

<style lang="scss">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

ul {
  padding: 0;
  li {
    list-style: none;
  }
}

.main-wrap {
  .main-wrap-header {
    width: 100%;
    height: 100px;
    line-height: 100px;
  }
}
</style>
