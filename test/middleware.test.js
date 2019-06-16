import middleware from "../src/middleware"

describe('middleware', () => {
  describe('beforeAction', () => {
    test('offSetAndLimit', async () => {
      let ctx = { query: { limit: 50, offset: 70 }}, noop = () => {}
      await middleware.beforeAction.offSetAndLimit(ctx, noop)
      expect(ctx.query.limit).toEqual(50)
      expect(ctx.query.offset).toEqual(70)

      ctx = { query: { limit: 'aaa', offset: 'bbb' }}
      await middleware.beforeAction.offSetAndLimit(ctx, noop)
      expect(ctx.query.limit).toEqual(30)
      expect(ctx.query.offset).toEqual(0)
    })
  })
})

import { mainRouter } from "../src/routes"

test('123', async () => {
  // const ctx = {}, noop = () => {}
  // await route(ctx, noop)
  console.log(mainRouter.routes().router.stack)
  // expect(ctx).toStrictEqual({})
})
