<template>
  <div class="main">
    <div class="poster">
      <div class="img-wrap">
        <div class="date">
          <div class="day">
            30
          </div>
          <div class="divider" />
          <div class="month-year">
            <div class="month">
              NOV
            </div>
            <div class="year">
              2019
            </div>
          </div>
        </div>
        <img
          :src="HOST+currentData.posterKey"
          alt="海报"
        >
        <div class="next" @click="next">
          <div class="triangle" />
        </div>
        <div class="play">
          <div class="triangle" />
        </div>
      </div>
    </div>
    <div class="info">
      <h1 class="name">
        {{ currentData.title }}
      </h1>
      <div class="sub-info">
        <div class="sub-info-item">
          <span
            v-for="(item, index) in currentData.category"
            :key="item._id"
          >
            {{ item.name }}
            <template v-if="index !== currentData.category.length-1">/</template>
          </span>
        </div>
        <div class="sub-info-item">
          <span
            v-for="(item, index) in currentData.countries"
            :key="item"
          >
            {{ item }}
            <template v-if="index !== currentData.countries.length-1">/</template>
          </span>
        </div>
        <div class="sub-info-item">
          <span
            v-for="item in currentData.language"
            :key="item"
          >
            {{ item }}
            <template v-if="index !== currentData.countries.length-1">/</template>
          </span>
        </div>
      </div>
      <div class="rate">
        <ul class="stars">
          <li
            v-for="item in 5"
            :key="item"
            :style="{background: item <= Math.ceil(currentData.rate/2) ? '#febd36' : '#fff'}"
          />
        </ul>
        <span>{{ currentData.rate }}</span>
      </div>
      <div class="sub-title">
        THE CAST
      </div>
      <ul class="casts">
        <li
          v-for="avatar in currentData.casts"
          :key="avatar._id"
          class="avatar"
          :style="{'background-image': `url(${HOST+avatar.avatarKey})`}"
        />
      </ul>
      <div class="sub-title">
        SYNOPSIS
      </div>
      <p class="summary">
        {{ currentData.summary }}
      </p>
      <div class="sub-title">
        VIDEO / PICTURE
      </div>
      <ul class="media">
        <li
          v-for="video in currentData.videos"
          :key="video._id"
          class="video"
          :style="{'background-image': `url(${HOST + video.coverKey})`}"
        />
        <li
          v-for="picture in currentData.pictureKeys"
          :key="picture"
          class="picture"
          :style="{'background-image': `url(${HOST + picture})`}"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      HOST: 'http://pn9g0l6pg.bkt.clouddn.com/',
      currentIndex: 0
    }
  },
  async asyncData({ app }) {
    const { data } = await axios.get('http://localhost:3000/movies/all')
    const res = {
      data: data.data,
      currentData: data.data[0]
    }
    return res
  },
  methods: {
    handleScroll(e) {
      console.log(e)
    },
    next() {
      if (this.currentIndex + 1 < this.data.length) {
        this.currentData = this.data[++this.currentIndex]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  height: calc(100vh);
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  .poster,
  .info {
    position: relative;
    height: 100%;
    box-sizing: border-box;
  }
  .poster {
    width: 55%;
    padding: 80px 70px;
    .img-wrap {
      position: relative;
      height: 100%;
      width: 100%;
      img {
        height: 100%;
        border-radius: 4px;
      }
      .date {
        position: absolute;
        top: 60px;
        left: -70px;
        width: 140px;
        padding: 30px 0;
        background-color: #3587ff;
        color: #fff;
        border-radius: 2px;
        .day {
          font-size: 70px;
          line-height: 1;
          text-align: center;
          font-weight: 600;
        }
        .divider {
          margin: 20px auto;
          height: 4px;
          width: 30px;
          background: #fff;
        }
        .month-year {
          display: flex;
          justify-content: space-evenly;
          font-weight: bold;
        }
      }
      .play,
      .next {
        position: absolute;
        right: -50px;
        width: 100px;
        height: 100px;
        background-color: #3587ff;
        border-radius: 2px;
        cursor: pointer;
        .triangle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;

          &:before,
          &:after {
            position: absolute;
            content: '';
            top: 50%;
            left: 50%;
          }
          &:before {
            transform: translate(-40%, -50%);
            border-top: 25px solid transparent;
            border-bottom: 25px solid transparent;
            border-left: 35.35px solid #fff;
          }
          &:after {
            transform: translate(-42%, -50%);
            border-top: 16px solid transparent;
            border-bottom: 16px solid transparent;
            border-left: 22.624px solid #3587ff;
          }
        }
      }
      .play {
        bottom: 60px;
      }
      .next {
        bottom: 170px;
      }
    }
  }
  .info {
    width: 45%;
    padding: 80px 0 80px 30px;
    .name {
      margin-bottom: 10px;
      color: #09172a;
    }
    .sub-info {
      color: #c3c3cb;
      .sub-info-item {
        display: inline-block;
        margin-right: 20px;
        &:last-child {
          margin: 0;
        }
      }
    }

    .rate {
      padding: 15px 0;
      line-height: 16px;
      .stars {
        display: inline-block;
        list-style: none;
        padding: 0;
        margin-right: 10px;
        li {
          margin-right: 10px;
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid #febd36;
          border-radius: 50%;
          &:last-child {
            margin: 0;
          }
        }
      }
      span {
        vertical-align: top;
      }
    }

    .casts {
      list-style: none;
      padding: 0;
      margin: -10px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: inline-block;
        margin: 10px;
        overflow: hidden;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
    }

    .summary {
      height: 85px;
      overflow: hidden;
      color: #c2c6ca;
    }
    .media {
      margin: -10px;
      padding: 0;
      list-style: none;
      .video,
      .picture {
        display: inline-block;
        margin: 10px;
        overflow: hidden;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
      .video {
        width: 217px;
        height: 115px;
      }
      .picture {
        width: 115px;
        height: 115px;
      }
    }
    .sub-title {
      padding: 35px 0 10px;
      color: #09172a;
      font-size: 20px;
      font-weight: bold;
    }
  }
}
</style>
