import path from 'path'

// koa
import Koa from 'koa'
import logger from 'koa-logger'
import views from 'koa-views'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static2'

// unit
import router from './routes'

import Config from './config'

const app = new Koa()

app
  .use(logger())
  .use(bodyParser({
    jsonLimit: '5mb',
    formLimit: '5mb',
    textLimit: '5mb',
  }))
  .use(serve('public', path.resolve(__dirname, '../public')))
  .use(views(`${__dirname}/views`, { extension: 'ejs' }))
  .use(router())

app.listen(Config.port, () => {
  console.log(`Server start on port ${Config.port}...`)
})
