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

  const media = {
    videos: [],
    pictures: [],
    comments: [],
    related: []
  }

  // 视频图片
  const mediaEl = Array.from($('.related-pic-bd li')) || []
  for (let indexOfMedia = 0; indexOfMedia < mediaEl.length; indexOfMedia++) {
    const element = mediaEl[indexOfMedia]
    const it = $(element)

    // 预告片
    const trailer = it.find('.related-pic-video')
    if (trailer && trailer.length > 0) {
      const video = {}
      const $t = $(trailer[0])
      video.link = $t.attr('href')
      try {
        video.cover = $t
          .attr('style')
          .replace('background-image:url(', '')
          .replace(')', '')
      } catch (error) {}
      media.videos.push(video)
      continue
    }

    // 图片
    const picture = it.find('img')
    if (picture && picture.length > 0) {
      const $p = $(picture[0])
      media.pictures.push($p.attr('src'))
    }
  }

  // 评论
  const commentEl = Array.from($('#hot-comments .comment-item')) || []
  for (
    let indexOfComment = 0;
    indexOfComment < commentEl.length;
    indexOfComment++
  ) {
    const element = commentEl[indexOfComment]
    const it = $(element)
    const comment = {}

    const $t = it.find('.comment-info')

    try {
      comment.name = $t
        .find('a')
        .text()
        .trim()
    } catch (error) {
      comment.name = ''
    }

    try {
      comment.time = $t
        .find('.comment-time')
        .text()
        .trim()
    } catch (error) {
      comment.time = ''
    }

    try {
      comment.rate =
        $t
          .find('.rating')
          .attr('class')
          .split(' ')[0]
          .slice(-2, -1) * 2 || 0
    } catch (error) {
      comment.rate = 0
    }

    try {
      const $commit = it.find('.comment p')
      const $full = $commit.find('.full')
      if ($full.length > 0) {
        comment.content = $full.text().trim()
      } else {
        const $short = $commit.find('.short')
        comment.content = $short.text().trim()
      }
    } catch (error) {
      comment.content = ''
    }

    media.comments.push(comment)
  }

  // 相关电影
  const relatedEl = Array.from($('#recommendations dl dt')) || []
  for (
    let indexOfRelated = 0;
    indexOfRelated < relatedEl.length;
    indexOfRelated++
  ) {
    const element = relatedEl[indexOfRelated]
    const it = $(element)
    const related = {}

    try {
      related.url = it.find('a').attr('href')
    } catch (error) {
      related.url = ''
    }

    try {
      related.poster = it.find('a img').attr('src')
    } catch (error) {
      related.poster = ''
    }

    try {
      related.name = it
        .find('a img')
        .attr('alt')
        .trim()
    } catch (error) {
      related.name = ''
    }

    media.related.push(related)
  }

  return media
}

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
