import mongoose from 'mongoose'
import logger from '../lib/logger'
import User from './schema/user'

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
        logger.info('MongoDB Reconnect ' + connectTimes)
        mongoose.connect(db)
      } else {
        throw new Error('MongoDB Connected Error!')
      }
    })

    mongoose.connection.on('error', () => {
      if (++connectTimes < MAXCONNECTTIMES) {
        logger.info('MongoDB Reconnect ' + connectTimes)
        mongoose.connect(db)
      } else {
        throw new Error('MongoDB Connected Error!')
      }
    })

    mongoose.connection.on('open', () => {
      resolve()
      logger.info('MongoDB Connected Successfully!')
    })
  })
}

export const initAdmin = async () => {
  const user = await User.findOne({ userName: 'Admin' })
  if (!user) {
    const newUser = new User({
      userName: 'Admin',
      email: '1210929612@qq.com',
      password: '1q2w3e'
    })
    await newUser.save()
  }
}
