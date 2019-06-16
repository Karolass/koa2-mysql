import app from "../src/app"
import supertest from "supertest"

let server, request
beforeAll(async () => {
  server = await app.listen('3000')
  request = supertest(server)
})

afterAll(async () => {
  await server.close()
})

describe(' test ', () => {
  test(' pass ', () => {
    expect(true).toBe(true)
  })

  test("should respond as expected", async (done) => {
    const response = await request.get("/")
    expect(response.status).toEqual(200)
    // expect(response.type).toEqual("application/json")
    // expect(response.body.data).toEqual("Sending some JSON")
    done()
  })
})
