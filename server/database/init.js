const mongoose = require('mongoose')
const glob = require('glob')
const { resolve } = require('path')

const db = 'mongodb://localhost/doubanTrailer'
const MAXCONNECTTIMES = 5

mongoose.Promise = global.Promise

// 解决告警问题
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

exports.initSchema = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.connect = () => {
  let connectTimes = 0

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
    mongoose.connect(db)

    mongoose.connection.on('disconnected', () => {
      if (++connectTimes < MAXCONNECTTIMES) {
        console.log('MongoDB Reconnect ' + connectTimes)
        mongoose.connect(db)
      } else {
        throw new Error('MongoDB Connected Error!')
      }
    })

    mongoose.connection.on('error', () => {
      if (++connectTimes < MAXCONNECTTIMES) {
        console.log('MongoDB Reconnect ' + connectTimes)
        mongoose.connect(db)
      } else {
        throw new Error('MongoDB Connected Error!')
      }
    })

    mongoose.connection.on('open', async () => {
      resolve()
      console.log('MongoDB Connected Successfully!')
    })
  })
}
