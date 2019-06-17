import { proceedRouteMap } from '../src/routes'
import Router from 'koa-router'

describe('Route', () => {
  test('proceedRouteMap', () => {
    const router = new Router()
    const routes = { 
      '/test': [{
        method: 'get',
        path: '/',
        controller: () => {},
      }]
    }
    proceedRouteMap(routes, router)
    expect(router.stack).toHaveLength(1)
    expect(router.stack[0].methods).toEqual(['HEAD', 'GET'])
    expect(router.stack[0].path).toEqual('/test/')
    expect(router.stack[0].stack).toHaveLength(2)
  })

  test('proceedRouteMap - no parameters', () => {
    const router = new Router()
    proceedRouteMap()
    expect(router.stack).toHaveLength(0)
  })

  test('proceedRouteMap - nested route', () => {
    const router = new Router()
    const routes = { 
      '/test': {
        '/nested': [{
          method: 'get',
          path: '/',
          controller: () => {},
        },{
          method: 'post',
          path: '/',
          controller: () => {},
        }]
      }
    }
    proceedRouteMap(routes, router)
    expect(router.stack).toHaveLength(2)
    expect(router.stack[0].methods).toEqual(['HEAD', 'GET'])
    expect(router.stack[1].methods).toEqual(['POST'])
    expect(router.stack[0].path).toEqual('/test/nested/')
    expect(router.stack[0].stack).toHaveLength(2)
  })
})