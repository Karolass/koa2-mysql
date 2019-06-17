import app from '../src/app'
import supertest from 'supertest'

const spyConsole = fn => {
  let spy = {}

  beforeAll(() => {
    spy[fn] = jest.spyOn(console, fn).mockImplementation(() => {})
  })

  afterEach(() => {
    spy[fn].mockClear()
  })

  afterAll(() => {
    spy[fn].mockRestore()
  })

  return spy
}

const request = supertest(app.callback())

describe('app', () => {
  const spy = spyConsole('error')

  test("index html", async () => {
    const response = await request.get('/')
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('text/html')
    expect(response.text).toContain('Koa2 Server')
  })

  test('404 Not Found', async () => {
    const response = await request.get('/404-test')
    expect(response.status).toEqual(404)
    expect(response.type).toEqual('text/plain')
    expect(response.text).toBe('404 Not Found')
  })

  test('app error handler', async () => {
    app.use(async ctx => {
      if (ctx.request.url === '/error-test') {
        throw new Error('app error')
      }
    })

    const response = await request.get('/error-test')
    expect(response.status).toEqual(500)
    expect(response.type).toEqual('application/json')
    expect(response.body.success).toEqual(false)
    expect(response.body.message).toEqual('app error')

    expect(spy.error).toHaveBeenCalledTimes(1)
    expect(spy.error.mock.calls[0][0]).toContain(`error: app error, method: GET, url: /error-test, body:`)
  })
})
