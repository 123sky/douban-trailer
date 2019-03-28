import mongoose from'mongoose'

const db =
  process.env.NODE_ENV === 'production'
    ? 'mongodb://db/doubanTrailer'
    : 'mongodb://localhost/doubanTrailer'
const MAXCONNECTTIMES = 5

mongoose.Promise = global.Promise

// 解决告警问题
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

export const connect = () => {
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

    mongoose.connection.on('open', () => {
      resolve()
      console.log('MongoDB Connected Successfully!')
    })
  })
}
