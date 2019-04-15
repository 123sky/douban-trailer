<template>
  <div
    class="movie"
    :style="{ 'background-color': `rgba(${dominant},0.5)`, color: opposite }"
  >
    <div
      class="bg-img"
      :style="{ 'background-image': `url(${backgroundImg})` }"
    />
    <transition name="fade-transform" mode="out-in">
      <div v-if="isPlaying" key="video" class="video">
        <div class="back" @click="back">
          <i class="iconfont icon-fanhui"></i>
        </div>
        <video controls autoplay>
          <source
            v-for="video in data.videos"
            :key="video._id"
            :src="host + video.videoKey"
          />
        </video>
      </div>
      <div v-else key="content" class="content">
        <div class="info">
          <div class="primary">
            <div class="title">
              {{ data.title }}
            </div>
            <div class="line summary">
              {{ data.summary }}
            </div>
            <div class="line">
              <span class="runtime" :style="{ 'background-color': palette }">
                {{ data.duration[0] }}
              </span>
              <span
                v-for="(director, index) in data.directors"
                :key="index"
                class="director"
              >
                {{ director.name }}
              </span>
            </div>
            <div class="line">
              <span>{{ data.year }}</span>
              <span
                v-for="category in data.category"
                :key="category._id"
                class="category"
              >
                {{ category.name }}
              </span>
            </div>
            <div class="line rate">
              <i :style="{ color: palette }" class="iconfont icon-redu" />
              <span class="num" :style="{ color: palette }">{{
                data.rate.toFixed(1)
              }}</span>
              <span class="total-num">/ 10</span>
            </div>
          </div>
          <div class="cast-reviews">
            <div class="cast">
              <div class="section-title">
                演职人员
              </div>
              <ul>
                <li v-for="cast in data.casts" :key="cast._id">
                  <img :src="host + cast.avatarKey" alt="cast.name" />
                  <div class="cast-name">
                    {{ cast.name }}
                  </div>
                </li>
              </ul>
            </div>
            <div class="reviews">
              <ul>
                <li v-for="index in 2" :key="index">
                  <rate :data="data.comments[index - 1].rate" />
                  <span class="time">{{ data.comments[index - 1].time }}</span>
                  <p>{{ data.comments[index - 1].content }}</p>
                  <div class="from">
                    {{ '—— ' + data.comments[index - 1].name }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="sub-info">
          <div class="play">
            <i class="iconfont icon-bofang" @click="play"></i>
          </div>
          <div class="picture-related">
            <div class="pictures">
              <img
                v-if="data.videos.length > 1"
                :src="host + data.videos[1].coverKey"
                alt="tupian1"
              /><img :src="host + data.pictureKeys[0]" alt="tupian1" /><img
                :src="host + data.pictureKeys[1]"
                alt="tupian2"
              /><img
                v-if="data.videos.length <= 1"
                :src="host + data.pictureKeys[2]"
                alt="tupian3"
              />
            </div>
            <div class="related">
              <div class="section-title">
                相同类型
              </div>
              <div v-for="row in 2" :key="row">
                <a v-for="col in 2" :key="col" :href="data.related[0].url">
                  <img
                    :src="host + data.related[(row - 1) * 2 + col].posterKey"
                    :alt="data.related[(row - 1) * 2 + col].name"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Rate from '@/components/Rate'
import RGBaster from '@/lib/color.js'
export default {
  components: {
    Rate
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      host:
        process.env.NODE_ENV === 'production'
          ? 'http://pn9g0l6pg.bkt.clouddn.com/'
          : 'http://ppopiaif8.bkt.clouddn.com/',
      dominant: '',
      dominantRGB: '',
      opposite: '',
      palette: '',
      backgroundImg: '',
      isPlaying: false
    }
  },
  watch: {
    data: {
      immediate: true,
      handler: function(val) {
        if (!val._id) return
        const img =
          this.host +
          (this.data.videos.length > 0
            ? this.data.videos[0].coverKey
            : this.data.posterKey)
        this.backgroundImg = img
        RGBaster.colors(img, {
          paletteSize: 1,
          exclude: ['rgb(255,255,255)', 'rgb(0,0,0)'],
          success: payload => {
            this.dominant = payload.dominant.name
            this.dominantRGB = payload.dominant.rgb
            this.opposite = payload.opposite
            this.palette = payload.palette[0].rgb
          }
        })
      }
    }
  },
  methods: {
    play() {
      this.isPlaying = true
    },
    back() {
      this.isPlaying = false
    }
  }
}
</script>

<style lang="scss" scoped>
.movie {
  position: relative;
  height: 100%;
  .bg-img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: -1;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    &:before {
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
  }
  .video {
    background: #000;
    height: 100%;
    width: 100%;
    position: relative;
    .back {
      position: absolute;
      top: 40px;
      left: 50px;
      color: #fff;
      width: 60px;
      height: 60px;
      padding: 10px;
      border-radius: 50%;
      z-index: 1;
      background: rgba(0, 0, 0, 0.3);
      cursor: pointer;
      i {
        font-size: 40px;
      }
    }
    video {
      height: 100%;
      width: 100%;
    }
  }
  .content {
    height: 100%;
    padding: 4% 6%;
  }
  .content {
    height: 100%;
    display: flex;
    align-items: flex-end;
    font-size: 12px;
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      margin-right: 100px;
      .primary {
        .title {
          position: relative;
          font-size: 60px;
        }
        .summary {
          margin-bottom: 10px;
          width: 450px;
          max-height: 75px;
          overflow: hidden;
        }
        .line {
          padding: 10px 0;
        }
        .runtime {
          margin-right: 20px;
          padding: 5px 10px;
          border-radius: 6px;
        }
        .director {
          margin: 0 5px;
        }
        .category {
          margin: 0 5px;
        }
        .rate {
          .icon-redu {
            font-size: 25px;
          }
          .num {
            margin-right: 5px;
            height: 25px;
            font-size: 25px;
            font-weight: bold;
            line-height: 1;
            vertical-align: top;
          }
          .total-num {
            vertical-align: top;
          }
        }
      }
      .cast-reviews {
        font-size: 12px;
        .cast {
          margin-bottom: 20px;
          ul {
            margin: 0 -10px;
            li {
              padding: 0 10px;
              display: inline-block;
              vertical-align: top;
              img,
              .cast-name {
                width: 65px;
                border-radius: 4px;
              }
            }
          }
        }
        .reviews {
          ul {
            display: flex;
            li {
              flex: 1;
              margin-right: 50px;
              &:last-child {
                margin: 0;
              }
              .rate {
                margin-bottom: 10px;
              }
              .time {
                float: right;
              }
              p {
                max-height: 50px;
                overflow: hidden;
              }
              .from {
                margin-top: 10px;
              }
            }
          }
        }
      }
    }

    .sub-info {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .play {
        text-align: right;
        i {
          font-size: 70px;
          transition: all 0.2s ease;
          opacity: 0.6;
          cursor: pointer;
          &:hover {
            font-size: 75px;
            opacity: 1;
          }
        }
      }
      .picture-related {
        display: flex;
        align-items: flex-end;
        .pictures {
          font-size: 0;
          margin-right: 40px;
          width: 260px;
          flex: 0 0 auto;
          img {
            width: 120px;
            border-radius: 4px;
            &:first-child {
              margin-bottom: 20px;
              width: 100%;
            }
            &:last-child {
              margin-left: 20px;
            }
          }
        }
        .related {
          flex: 0 0 auto;
          font-size: 0;
          margin: -5px;
          img {
            margin: 5px;
            height: 160px;
            border-radius: 4px;
          }
        }
      }
    }
  }
}

.section-title {
  margin-bottom: 15px;
  font-size: 25px;
  font-weight: bold;
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
}

.left-fade-transform-leave-to {
  opacity: 0;
}
</style>
