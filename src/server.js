import app from './app'
import Config from './config'

app.listen(Config.port, () => {
  console.log(`Server start on port ${Config.port}...`)
})
