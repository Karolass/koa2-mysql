import Sequelize from 'sequelize'
import { BaseModel, sequelize } from './index'

const user = Object.assign({
  email: { type: Sequelize.STRING, allowNull: false },
  name: { type: Sequelize.STRING },
}, BaseModel)

const options = {
  indexes: [
    {
      unique: true,
      fields: ['email'],
    },
  ],
}

export default sequelize.define('user', user, options)
