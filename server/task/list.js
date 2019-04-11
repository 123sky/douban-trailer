import nanoid from 'nanoid'
import { Movie } from '../database/schema'
import upload from '../lib/upload'
import logger from '../lib/logger'
import getList from '../crawler/list'

export default async page => {
  const data = await getList(page)
  const result = data.result
  let newMoviesCount = 0
  for (let index = 0; index < result.length; index++) {
    const item = result[index]
    let movie = await Movie.findOne({ doubanId: item.doubanId })
    if (!movie) {
      try {
        const path = `poster/${nanoid()}.jpg`
        const res = await upload(item.poster, path)
        if (res) {
          item.posterKey = path
        } else {
          logger.error('api success but error poster upload', res)
        }

        movie = new Movie(item)
        await movie.save()
        newMoviesCount++
      } catch (error) {
        logger.error('save movie err', error)
      }
    }
  }
  logger.info(`total:${result.length}  new:${newMoviesCount}`)
}
