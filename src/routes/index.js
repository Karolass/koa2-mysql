import compose from 'koa-compose'
import Router from 'koa-router'

import user from './user'
import middleware from '../middleware'

import Config from '../config'

const routeMap = {
  '/user': user,
}

const mainRouter = new Router()

// proceed route map
Object.keys(routeMap).forEach(key => {
  if (Array.isArray(routeMap[key])) {
    const router = new Router()

    for (let i = 0; i < routeMap[key].length; i++) {
      const {
        method, path, controller, beforeAction = [], afterAction = [],
      } = routeMap[key][i]

      // offSetAndLimit for all get
      if (method === 'get') {
        router[method](path, middleware.beforeAction.offSetAndLimit)
      }

      router[method](path, ...beforeAction)
      router[method](path, controller)
      router[method](path, ...afterAction)
    }

    mainRouter.use(key, router.routes())
  }
})

// index html
mainRouter.get('/', async ctx => {
  const { projectName, commitId } = Config
  await ctx.render('index', { title: projectName, commitId })
})

export default function () {
  return compose([
    mainRouter.routes(),
    mainRouter.allowedMethods(),
  ])
}
