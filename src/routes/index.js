import compose from 'koa-compose'
import Router from 'koa-router'

import user from './user'
import middleware from '../middleware'

import Config from '../config'

const routeMap = {
  '/user': user,
  '/upload': [{
    method: 'post',
    path: '/',
    beforeAction: [middleware.multer.single('file')],
    controller: (ctx) => {
      ctx.body = ctx.req.file
    },
  }],
}

export const proceedNestedRoute = routes => {
  const router = new Router()

  if (Array.isArray(routes)) {
    for (let i = 0; i < routes.length; i++) {
      const {
        method, path, controller, beforeAction = [], afterAction = [],
      } = routes[i]

      // offSetAndLimit for all get
      if (method === 'get') {
        beforeAction.push(middleware.beforeAction.offSetAndLimit)
      }

      router[method](path, ...beforeAction, controller, ...afterAction)
    }
  } else if (routes instanceof Object) {
    Object.keys(routes).forEach(key => {
      const nestedRouter = proceedNestedRoute(routes[key])
      router.use(key, nestedRouter.routes())
    })
  }

  return router
}

export const proceedRouteMap = (routes, router) => {
  if (!routes || !router) return

  Object.keys(routes).forEach(key => {
    const nestedRouter = proceedNestedRoute(routes[key])
    router.use(key, nestedRouter.routes())
  })
}

const mainRouter = new Router()
proceedRouteMap(routeMap, mainRouter)

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
