const cp = require('child_process')
const { resolve } = require('path')
const { model } = require('mongoose')
const nanoid = require('nanoid')
const upload = require('../lib/upload')

const Movie = model('Movie')
;(() => {
  const script = resolve(__dirname, '../crawler/trailer-list.js')
  const child = cp.fork(script, [])
  let invoked = false

  child.on('error', err => {
    if (invoked) return
    invoked = true
    console.log('movie child process err: ', err)
  })

  child.on('exit', code => {
    if (invoked) return
    invoked = false
    const err = code === 0 ? null : new Error('exit code' + code)
    if (err) console.log('movie child process exit err: ', err)
  })

  child.on('message', async data => {
    const result = data.result
    for (let index = 0; index < result.length; index++) {
      const item = result[index]
      let movie = await Movie.findOne({ doubanId: item.doubanId })
      if (!movie) {
        const posterKey = await upload(item.poster, nanoid() + '.jpg')
        item.posterKey = posterKey.key
        try {
          movie = new Movie(item)
          await movie.save()
        } catch (error) {
          console.error('save movie err', error)
        }
      }
    }
  })
})()
