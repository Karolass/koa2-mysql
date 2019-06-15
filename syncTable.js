import fs from 'fs'
import path from 'path'
import { sequelize } from './src/models'

const ORM = {}

fs
  .readdirSync(path.resolve('./src/models/'))
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== 'index.js'
  })
  .forEach(file => {
    const temp = file.split('.')[0]
    ORM[temp] = require('./src/models/' + file).default
  })

console.log('***** Creating/Altering Table *****')
sequelize
  .sync({ alter: true })
  .then(async() => {
    console.log('***** Creating/Altering Table Success *****')

    // example for initial data
    await ORM.user.findOrCreate({ where: { email: 'test@example.com' }, defaults: { name: 'test' }})

    process.exit()
  })
  .catch(error => {
    console.error('***** Creating/Altering Table With Error *****')
    console.error(error)
    process.exit()
  })