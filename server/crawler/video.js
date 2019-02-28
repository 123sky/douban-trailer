const puppeteer = require('puppeteer')

const BASE_URL = `https://movie.douban.com/subject/`

const sleep = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})

process.on('message', async function (movies) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })
  const page = await browser.newPage()

  for (let index = 0; index < movies.length; index++) {
    const movie = movies[index]

    // 获取视频页面，视频封面图
    let url = BASE_URL + movie.doubanId
    console.log('opening ' + url)
    await page.goto(url, {
      waitUntil: 'networkidle2'
    })
    await sleep(1000)
    let result = await page.evaluate(() => {
      let $ = window.$
      let items = Array.from($('.related-pic-bd li')) || []
      let result = {
        videos: [],
        pictures: []
      }

      items.forEach(item => {
        let it = $(item)

        // 预告片
        let trailer = it.find('.related-pic-video')
        if (trailer && trailer.length > 0) {
          let $t = $(trailer[0])
          var link = $t.attr('href')
          var cover = $t.attr('style').replace('background-image:url(', '').replace(')', '')
          result.videos.push({
            link,
            cover
          })
        }

        // 图片
        let picture = it.find('img')
        if (picture && picture.length > 0) {
          let $p = $(picture[0])
          result.pictures.push($p.attr('src'))
        }
      })

      return result
    })

    // 获取视频地址
    let videos = []
    for (let index = 0; index < result.videos.length; index++) {
      const video = result.videos[index]
      await page.goto(video.link, {
        waitUntil: 'networkidle2'
      })
      await sleep(1000)

      let url = await page.evaluate(() => {
        let $ = window.$
        return $('source').attr('src')
      })

      videos.push({
        video: url,
        cover: video.cover
      })
    }

    let data = {
      videos,
      pictures: result.pictures,
      movie
    }

    process.send(data)
  }

  browser.close()
  process.exit(0)
})
