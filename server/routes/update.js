import { Controller, Put } from '../decorator/router'
import movie from '../task/movie'
import movieDetail from '../task/detail'
import video from '../task/video'
import logger from '../lib/logger'

@Controller('/update')
class UpdateRouter {
  @Put('/')
  async update(ctx, next) {
    try {
      await movie()
      await movieDetail()
      await video()
      ctx.body = {
        data: {
          code: 0,
          message: null
        },
        success: true
      }
    } catch (error) {
      ctx.body = {
        data: {
          code: 1,
          message: error
        },
        success: true
      }
      logger.error(error)
    }
  }
}

export default UpdateRouter
