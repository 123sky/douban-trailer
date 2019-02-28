const cp = require('child_process')
const { resolve } = require('path')
const { model } = require('mongoose')

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
    let err = code === 0 ? null : new Error('exit code' + code)
    if (err) console.log('movie child process exit err: ', err)
  })

  child.on('message', data => {
    let result = data.result
    result.forEach(async item => {
      let movie = await Movie.find({ doubanId: item.doubanId })
      if (movie.length <= 0) {
        try {
          movie = new Movie(item)
          await movie.save()
        } catch (error) {
          console.error('save movie err', error)
        }
      }
    })
  })
})()
