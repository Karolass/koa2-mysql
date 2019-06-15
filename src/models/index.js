import Sequelize from 'sequelize'

import Config from '../config'

const { db } = Config
export const sequelize = new Sequelize(db.database, null, null, db)

export const BaseModel = {
  isValid: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
}

// test connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
