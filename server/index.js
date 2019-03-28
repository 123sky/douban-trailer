import Koa from 'koa'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import config from '../nuxt.config.js'
import { Route } from './decorator/router'
import { connect } from './database/init'

const appLogger = consola.withScope(`APP`)

;(async () => {
  await connect()

  const app = new Koa()

  config.dev = !(app.env === 'production')

  const instance = new Route(app)
  await instance.init()

  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '0.0.0.0',
    port = process.env.PORT || 3000
  } = nuxt.options.server

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
