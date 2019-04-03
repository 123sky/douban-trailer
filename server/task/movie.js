import cp from 'child_process'
import path from 'path'
import nanoid from 'nanoid'
import { Movie } from '../database/schema'
import upload from '../lib/upload'
import logger from '../lib/logger'

export default function() {
  return new Promise((resolve, reject) => {
    const script = path.resolve(__dirname, '../crawler/trailer-list.js')
    const child = cp.fork(script, [])
    let invoked = false

    child.on('error', err => {
      if (invoked) return
      invoked = true
      logger.error('movie child process err: ', err)
      reject(err)
    })

    child.on('exit', code => {
      if (invoked) return
      invoked = false
      const err = code === 0 ? null : new Error('exit code' + code)
      if (err) {
        logger.error('movie child process exit err: ', err)
        reject(err)
      } else {
        logger.info('movie child process exit normally')
      }
    })

    child.on('message', async data => {
      const result = data.result
      let newMoviesCount = 0
      for (let index = 0; index < result.length; index++) {
        const item = result[index]
        let movie = await Movie.findOne({ doubanId: item.doubanId })
        if (!movie) {
          try {
            const path = `/poster/${nanoid()}.jpg`
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
      resolve()
    })
  })
}
