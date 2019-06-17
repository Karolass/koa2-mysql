import app from './app'
import { sequelize, testDBConnection } from './models'
import Config from './config'

app.listen(Config.port, () => {
  console.log(`Server start on port ${Config.port}...`)
  testDBConnection(sequelize)
})
