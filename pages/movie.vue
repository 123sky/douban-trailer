<template>
  <div class="movie" :style="{'background-color':`rgba(${dominant},0.5)`,color:opposite}">
    <div class="bg-img" :style="{'background-image':`url(${backgroundImg})`}" />
    <div class="content">
      <div class="info">
        <div class="primary">
          <div class="title">
            {{ data.title }}
          </div>
          <div class="line summary">
            {{ data.summary }}
          </div>
          <div class="line">
            <span class="runtime" :style="{'background-color': palette}">2:02h</span>
            <span class="director">
              Christopher Nolan
            </span>
          </div>
          <div class="line">
            <span>{{ data.year }}</span>
            <span v-for="category in data.category" :key="category._id">{{ category.name }}</span>
          </div>
          <div class="line rate">
            <i :style="{'color': palette}" class="iconfont icon-redu" />
            <span class="num" :style="{'color': palette}">{{ data.rate.toFixed(1) }}</span>
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
                <img :src="host+cast.avatarKey" alt="cast.name">
                <div class="cast-name">
                  {{ cast.name }}
                </div>
              </li>
            </ul>
          </div>
          <div class="reviews">
            <ul>
              <li>
                <rate :data="4" />
                <p>
                  没想到还有这么多停留在春晚选花魁的审美，也活该养出次方AB和海量烂片。觉得女主有问题的拜托去看印度歌舞片和DC海王好吗？反正我从定妆照开始就觉得很有代入感，超级英雄又不是超级整容，这角色之前就是普通人，反而更凸显超能力带来的变化，marvel精神本就是普通人也可以成长为英雄；如果本来就是个引入注目的精致花瓶发型一丝不苟打一下看着就要坏了对这个角色塑造又有什么意义？文艺片出身的女主更让漫威电影有史诗感！
                </p>
                <div class="from">
                  —— 非青
                </div>
              </li>
              <li>
                <rate :data="8.4" />
                <p>
                  关于复联的来历，还有神盾局局长独眼的来历，后一个简直是包年笑点（喵~）。女性主义不是建立在向男性证明的基础上，漫威很与时俱进了。看完最大感想：不愧是以厂名命名的英雄，觉醒后惊奇队长这战力可以单挑灭霸！！！
                </p>
                <div class="from">
                  —— 同志亦凡人中文站
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="pictures">
        <img
          v-if="data.videos.length>1"
          :src="host+data.videos[1].coverKey" 
          alt="tupian1"
        ><img
          :src="host+data.pictureKeys[0]" 
          alt="tupian1"
        ><img
          :src="host+data.pictureKeys[1]" 
          alt="tupian2"
        ><img
          v-if="data.videos.length<=1"
          :src="host+data.pictureKeys[2]"
          alt="tupian3"
        >
      </div>
      <div class="related">
        <div class="section-title">
          相同类型
        </div>
        <div>
          <img 
            :src="host+data.posterKey"
            alt="haibao"
          ><img 
            :src="host+data.posterKey"
            alt="haibao"
          >
        </div>
        <div>
          <img 
            :src="host+data.posterKey"
            alt="haibao"
          ><img 
            :src="host+data.posterKey"
            alt="haibao"
          >
        </div>
      </div>
    </div>
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
      host: 'http://pn9g0l6pg.bkt.clouddn.com/',
      dominant: '',
      dominantRGB: '',
      opposite: '',
      palette: '',
      backgroundImg: ''
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
  }
}
</script>

<style lang="scss" scoped>
.movie {
  position: relative;
  height: 100%;
  .bg-img {
    width: 100%;
    height: 800px;
    position: absolute;
    top: 0;
    z-index: -1;
    text-align: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    &:after {
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      box-shadow: 0 -80px 200px 150px #ffffff inset;
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
    .pictures {
      font-size: 0;
      margin-right: 40px;
      width: 260px;
      flex: 0 0 auto;
      img {
        width: 120px;
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
      }
    }
  }
}

.section-title {
  margin-bottom: 15px;
  font-size: 25px;
  font-weight: bold;
}
</style>
