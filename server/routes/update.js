import puppeteer from 'puppeteer'
import { Controller, Put, Auth } from '../decorator/router'
import list from '../task/list'
import media from '../task/media'
import detail from '../task/detail'
import logger from '../lib/logger'

let isUpdating = false

const updateTask = async () => {
  isUpdating = true
  try {
    const launchOptions = {
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
      dumpio: false
    }
    if (process.env.NODE_ENV === 'production') {
      launchOptions.executablePath = process.env.CHROME_BIN
    }
    const browser = await puppeteer.launch(launchOptions)
    const page = await browser.newPage()

    logger.info('start getting movie list')
    await list(page)

    logger.info('start getting movie media')
    await media(page)

    await browser.close()

    logger.info('start getting movie detail')
    await detail()

    logger.info('update end')
  } catch (error) {
    logger.error('update error', error)
  }
  isUpdating = false
}

@Controller('/update')
class UpdateRouter {
  @Put('/')
  @Auth
  update(ctx, next) {
    if (isUpdating) {
      ctx.body = {
        data: {
          code: 2,
          type: 'warning',
          message: '数据已经在更新了，请稍后再试'
        },
        success: true
      }
    } else {
      updateTask()
      ctx.body = {
        data: {
          code: 1,
          type: 'success',
          message: '开始更新数据，请稍后'
        },
        success: true
      }
    }
  }
}

export default UpdateRouter
