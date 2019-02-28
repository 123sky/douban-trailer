const nanoid = require('nanoid')
const cp = require('child_process')
const { resolve } = require('path')
const { model } = require('mongoose')
const upload = require('../lib/upload')

const Movie = model('Movie')
const Video = model('Video')

async function saveVideos (movie, videos) {
  let videoKeys = []
  for (let index = 0; index < videos.length; index++) {
    try {
      let params = videos[index]

      try {
        let videoRes = await upload(params.video, nanoid() + '.mp4')
        if (videoRes.key) {
          params.videoKey = videoRes.key
        } else {
          console.log('error video upload res no key', videoRes)
        }
      } catch (error) {
        console.log('error upload video', error)
      }

      try {
        let coverRes = await upload(params.cover, nanoid() + '.jpg')
        if (coverRes.key) {
          params.coverKey = coverRes.key
        } else {
          console.log('error cover upload res no key', coverRes)
        }
      } catch (error) {
        console.log('error upload cover', error)
      }

      params.movie = movie._id
      let video = new Video(params)
      let res = await video.save()
      videoKeys.push(res._id)
    } catch (error) {
      console.error('save video err', error)
    }
  }
  return videoKeys
}

async function uploadPictures (pictures) {
  let pictureKeys = []
  for (let index = 0; index < pictures.length; index++) {
    const picture = pictures[index]
    try {
      let pictureRes = await upload(picture, nanoid() + '.jpg')
      if (pictureRes.key) {
        pictureKeys.push(pictureRes.key)
      }
    } catch (error) {
      console.log('error upload picture', error)
    }
  }
  return pictureKeys
}

;(async () => {
  const script = resolve(__dirname, '../crawler/video.js')
  const child = cp.fork(script, [])
  let invoked = false

  let movies = await Movie.find({
    pictures: []
  })

  child.on('error', err => {
    if (invoked) return
    invoked = true
    console.log('movie child process err: ', err)
  })

  child.on('exit', code => {
    if (invoked) return
    invoked = false
    if (code !== 0) {
      console.log('movie child process exit err: ', new Error('exit code' + code))
    } else {
      console.log('movie child process exit code: ' + code)
    }
  })

  child.on('message', async ({ movie, videos, pictures }) => {
    let videoKeys = await saveVideos(movie, videos)
    let pictureKeys = await uploadPictures(pictures)

    let movieModel = await Movie.findOne({ _id: movie._id })
    movieModel.videos = videoKeys
    movieModel.pictures = pictures
    movieModel.pictureKeys = pictureKeys
    await movieModel.save()
  })

  child.send(movies)
})()
