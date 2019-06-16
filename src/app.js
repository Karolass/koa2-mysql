import path from 'path'

// koa
import Koa from 'koa'
import logger from 'koa-logger'
import views from 'koa-views'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static2'
import favicon from 'koa-favicon'

// unit
import router from './routes'

import Config from './config'

const app = new Koa()

// no logger for testing
if (process.env.NODE_ENV !== 'test') {
  app.use(logger())
}

app
  .use(async (ctx, next) => {
    try {
      await next()

      // handle 404
      const { status = 404 } = ctx
      if (status === 404) {
        ctx.throw(404)
      }
    } catch (err) {
      ctx.status = err.status || 500

      if (ctx.status === 404) {
        ctx.body = '404 Not Found'
      } else {
        ctx.body = {
          success: false,
          message: err.message,
        }
        ctx.app.emit('error', err, ctx)
      }
    }
  })
  .use(bodyParser({
    jsonLimit: '5mb',
    formLimit: '5mb',
    textLimit: '5mb',
  }))
  .use(serve('public', path.resolve(__dirname, '../public')))
  .use(favicon(`${path.resolve(__dirname, '../public')}/favicon.ico`))
  .use(views(`${path.resolve(__dirname, '../views')}`, { extension: 'ejs' }))
  .use(router())

app.on('error', (err, ctx) => {
  const { message } = err
  const { method, url, body } = ctx.request

  // no logger for testing
  if (process.env.NODE_ENV !== 'test') {
    console.error(`error: ${message}, method: ${method}, url: ${url}, body:`, body)
  }
})

// no run server for testing
if (process.env.NODE_ENV !== 'test') {
  app.listen(Config.port, () => {
    console.log(`Server start on port ${Config.port}...`)
  })
}

export default app
