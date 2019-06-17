import app from '../src/app'
import User from '../src/models/user'
import supertest from 'supertest'
import fs from 'fs'
import path from 'path'


const request = supertest(app.callback())

beforeAll(async () => {
  // init test Data first
  await User.create({ email: 'test123@example.com', name: 'test name' })
})

afterAll(async () => {
  // delete test data
  await User.destroy({ where: { email: 'test123@example.com' } })
})

describe('API', () => {
  describe('User', () => {
    let id
    const testUser = { email: 'test456@example.com', name: 'test name 2' }
  
    test("List", async () => {
      let response = await request.get('/user')
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body[1].email).toEqual('test123@example.com')
      expect(response.body[1].name).toEqual('test name')
  
      id = response.body[1].id

      response = await request.get('/user').query({ offset: 10000 })
      expect(response.status).toEqual(204)
    })
  
    test("Find One", async () => {
      let response = await request.get(`/user/${id}`)
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(response.body.email).toEqual('test123@example.com')
      expect(response.body.name).toEqual('test name')

      response = await request.get('/user/test-path')
      expect(response.status).toEqual(204)
    })

    test("Create", async () => {
      let response = await request.post('/user').send(testUser)
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(response.body.email).toEqual(testUser.email)
      expect(response.body.name).toEqual(testUser.name)

      id = response.body.id

      response = await request.post('/user').send({})
      expect(response.status).toEqual(400)
      expect(response.type).toEqual('application/json')
      expect(response.body.success).toBe(false)
      expect(response.body.message).toEqual('parameter `email` is required')

      response = await request.post('/user').send(testUser)
      expect(response.status).toEqual(400)
      expect(response.type).toEqual('application/json')
      expect(response.body.success).toBe(false)
      expect(response.body.message).toEqual('The email is exists')
    })

    test("Update", async () => {
      const testUser2 = { email: 'test789@example.com', name: 'test name 3' }
      let response = await request.put(`/user/${id}`).send(testUser2)
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(response.body.success).toBe(true)
      expect(response.body.message).toEqual(`update ID: ${id} is success`)

      response = await request.put(`/user/${id}`).send({})
      expect(response.status).toEqual(400)
      expect(response.type).toEqual('application/json')
      expect(response.body.success).toBe(false)
      expect(response.body.message).toEqual('body has no parameters')
    })

    test("Delete", async () => {
      let response = await request.delete(`/user/${id}`)
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(response.body.success).toBe(true)
      expect(response.body.message).toEqual(`delete ID: ${id} is success`)

      response = await request.delete(`/user/${id}`)
      expect(response.status).toEqual(400)
      expect(response.type).toEqual('application/json')
      expect(response.body.success).toBe(false)
      expect(response.body.message).toEqual('The id is not exists')
    })
  })

  describe('Upload', () => {
    afterAll(() => {
      const filePath = path.resolve('public/uploads')
      fs.readdirSync(filePath)
        .filter(file => file !== '.gitkeep')
        .forEach(async file => {
          await fs.unlinkSync(path.resolve(filePath, file))
        })
    })

    test('single', async () => {
      const response = await request.post('/upload').attach('file', path.resolve('README.md'))
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(response.body.fieldname).toEqual('file')
      expect(response.body.originalname).toEqual('README.md')
    })
  })
})
