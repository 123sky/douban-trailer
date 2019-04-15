import nanoid from 'nanoid'
import { Movie } from '../database/schema'
import qiniuApi from '../lib/upload'
import logger from '../lib/logger'
import getList from '../crawler/list'

export default async page => {
  const data = await getList(page)
  const result = data.result
  let newMoviesCount = 0
  const oldMovieMap = {} // 用于标记数据
  let oldMovies = []

  try {
    oldMovies = await Movie.find({}).populate('videos')
    oldMovies.forEach(movie => {
      oldMovieMap[movie.doubanId] = movie
    })
  } catch (error) {
    logger.error(error)
  }

  for (let index = 0; index < result.length; index++) {
    const item = result[index]
    if (oldMovieMap[item.doubanId] === undefined) {
      try {
        const path = `poster/${nanoid()}.jpg`
        const res = await qiniuApi.upload(item.poster, path)
        if (res) {
          item.posterKey = path
        } else {
          logger.error('api success but error poster upload', res)
        }

        const movie = new Movie(item)
        await movie.save()
        newMoviesCount++
      } catch (error) {
        logger.error('save movie err', error)
      }
    } else {
      delete oldMovieMap[item.doubanId]
    }
  }

  // 删除旧数据
  const oldMovieDoubanId = Object.keys(oldMovieMap)
  const oldMovieValues = Object.values(oldMovieMap)
  try {
    for (let index = 0; index < oldMovieValues.length; index++) {
      const movie = oldMovieValues[index]
      const deleteOperations = [
        ...movie.casts.map(item => item.avatarKey),
        ...movie.directors.map(item => item.avatarKey),
        ...movie.related.map(item => item.posterKey),
        ...movie.pictureKeys,
        movie.posterKey
      ]
      movie.videos.forEach(item => {
        deleteOperations.push(item.coverKey)
        deleteOperations.push(item.videoKey)
      })

      await qiniuApi.remove(deleteOperations)
    }

    // 删除movie记录
    await Movie.deleteMany({ doubanId: { $in: oldMovieDoubanId } })
  } catch (error) {
    logger.error(error)
  }

  logger.info(
    `crawler total:${result.length} \
    crawler new:${newMoviesCount} \
    old total:${oldMovies.length} \
    delete old:${oldMovieDoubanId.length}`
  )
}
