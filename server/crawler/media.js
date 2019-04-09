import logger from '../lib/logger'

const BASE_URL = `https://movie.douban.com/subject/`

const sleep = time =>
  new Promise(resolve => {
    setTimeout(resolve, time)
  })

let page = null

const getVideoUrl = async link => {
  await page.goto(link, {
    waitUntil: 'networkidle2'
  })
  await sleep(1000)

  const url = await page.evaluate(() => {
    const $ = window.$
    return $('source').attr('src')
  })

  return url
}

const handlePage = () => {
  const $ = window.$
  const mediaEl = Array.from($('.related-pic-bd li')) || []
  const media = {
    videos: [],
    pictures: []
  }

  for (let indexOfMedia = 0; indexOfMedia < mediaEl.length; indexOfMedia++) {
    const element = mediaEl[indexOfMedia]
    const it = $(element)

    // 预告片
    const trailer = it.find('.related-pic-video')
    if (trailer && trailer.length > 0) {
      const $t = $(trailer[0])
      const link = $t.attr('href')
      const cover = $t
        .attr('style')
        .replace('background-image:url(', '')
        .replace(')', '')
      media.videos.push({
        cover,
        link
      })
      continue
    }

    // 图片
    const picture = it.find('img')
    if (picture && picture.length > 0) {
      const $p = $(picture[0])
      media.pictures.push($p.attr('src'))
    }
  }

  return media
}

// 获取视频页面，视频封面图
export default async (pageInstance, movies) => {
  page = pageInstance
  for (let index = 0; index < movies.length; index++) {
    const movie = movies[index]
    const url = BASE_URL + movie.doubanId

    logger.info(
      `get media of the ${index + 1}th movie. total is ${movies.length}`
    )
    await page.goto(url, { waitUntil: 'networkidle2' })
    await sleep(1000)
    const media = await page.evaluate(handlePage)

    for (let mediaIndex = 0; mediaIndex < media.videos.length; mediaIndex++) {
      const video = media.videos[mediaIndex]
      const url = await getVideoUrl(video.link)
      video.url = url
    }
    movie.media = media
  }
  return movies
}
