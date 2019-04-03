import cp from 'child_process'
import path from 'path'
import nanoid from 'nanoid'
import { Movie, Video } from '../database/schema'
import upload from '../lib/upload'
import logger from '../lib/logger'

async function saveVideos(movie, videos) {
  const videoKeys = []
  for (let index = 0; index < videos.length; index++) {
    try {
      const params = videos[index]

      try {
        const path = `/video/${nanoid()}.mp4`
        const videoRes = await upload(params.video, path)
        if (videoRes) {
          params.videoKey = path
        } else {
          logger.error('error video upload res no key', videoRes)
        }
      } catch (error) {
        logger.error('error upload video', error)
      }

      try {
        const path = `/video-cover/${nanoid()}.jpg`
        const coverRes = await upload(params.cover, path)
        if (coverRes) {
          params.coverKey = path
        } else {
          logger.error('error cover upload res no key', coverRes)
        }
      } catch (error) {
        logger.error('error upload cover', error)
      }

      params.movie = movie._id
      const video = new Video(params)
      const res = await video.save()
      videoKeys.push(res._id)
    } catch (error) {
      logger.error('save video err', error)
    }
  }
  return videoKeys
}

async function uploadPictures(pictures) {
  const pictureKeys = []
  for (let index = 0; index < pictures.length; index++) {
    const picture = pictures[index]
    try {
      const path = `/picture/${nanoid()}.jpg`
      const pictureRes = await upload(picture, path)
      if (pictureRes) {
        pictureKeys.push(path)
      }
    } catch (error) {
      logger.error('error upload picture', error)
    }
  }
  return pictureKeys
}

export default function() {
  return new Promise(async (resolve, reject) => {
    const script = path.resolve(__dirname, '../crawler/video.js')
    const child = cp.fork(script, [])
    let invoked = false

    const movies = await Movie.find({
      pictures: []
    })

    child.on('error', err => {
      if (invoked) return
      invoked = true
      logger.error('movie child process err: ', err)
      reject(err)
    })

    child.on('exit', code => {
      if (invoked) return
      invoked = false
      if (code !== 0) {
        logger.error(
          'movie child process exit err: ',
          new Error('exit code' + code)
        )
        reject(new Error('exit code' + code))
      } else {
        logger.error('movie child process exit code: ' + code)
      }
    })

    child.on('message', async ({ movie, videos, pictures }) => {
      const videoKeys = await saveVideos(movie, videos)
      const pictureKeys = await uploadPictures(pictures)

      const movieModel = await Movie.findOne({ _id: movie._id })
      movieModel.videos = videoKeys
      movieModel.pictures = pictures
      movieModel.pictureKeys = pictureKeys
      await movieModel.save()

      resolve()
    })

    child.send(movies)
  })
}
