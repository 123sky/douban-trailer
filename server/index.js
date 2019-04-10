import Koa from 'koa'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import config from '../nuxt.config.js'
import general from './middleware/general'
import { Route } from './decorator/router'
import { connect, initAdmin } from './database/init'

const appLogger = consola.withScope(`APP`)
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

;(async () => {
  await connect()
  await initAdmin()

  const app = new Koa()

  config.dev = !(app.env === 'production')

  general(app)

  const RouteInstance = new Route(app)
  await RouteInstance.init()

  const nuxt = new Nuxt(config)

  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(ctx => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host, function koaInitEnd() {
    appLogger.start(
      `server is listening at ${host}:${port}`,
      `on mode ${app.env}`
    )
  })
})()
