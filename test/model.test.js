import Sequelize from 'sequelize'
import { sequelize, testDBConnection } from '../src/models'
import User from '../src/models/user'

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

describe('model', () => {
  describe('index', () => {
    const spy = spyConsole('log')
    const spyE = spyConsole('error')

    test('testDBConnection', async () => {
      await testDBConnection(sequelize)
      expect(spy.log).toHaveBeenCalledTimes(1)
      expect(spy.log.mock.calls[0][0]).toContain('Database connection has been established successfully.')

      const seql = new Sequelize(null, null, null, { dialect: 'mariadb' })
      await testDBConnection(seql)
      expect(spyE.error).toHaveBeenCalledTimes(1)
      expect(spyE.error.mock.calls[0][0]).toContain('Unable to connect to the database:')
      expect(spyE.error.mock.calls[0][1]).toBeInstanceOf(Error)
    })
  })

  describe('User', () => {
    beforeAll(async () => {
      // init test Data first
      await User.create({ email: 'test123@example.com', name: 'test name' })
    })
    
    afterAll(async () => {
      // delete test data
      await User.destroy({ where: { email: 'test123@example.com' } })
    })

    test('column', async () => {
      const user = await User.findOne({ where: { email: 'test123@example.com' } })
      expect(Object.keys(user.dataValues)).toEqual(['id', 'email', 'name', 'isValid', 'createdAt', 'updatedAt'])
    })

    test('not null', async () => {
      try {
        await User.create({ email: null })
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toContain('user.email cannot be null')
      }
    })

    test('unique', async () => {
      try {
        await User.create({ email: 'test123@example.com' })
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toContain('Validation error')
      }
    })
  })
})