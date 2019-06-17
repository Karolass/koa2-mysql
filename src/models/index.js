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
export const testDBConnection = async seql => {
  try {
    await seql.authenticate()
    console.log('Database connection has been established successfully.')
  } catch (err) {
    console.error('Unable to connect to the database:', err)
  }
}
