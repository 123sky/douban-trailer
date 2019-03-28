import cp from 'child_process'
import path from 'path'
import nanoid from 'nanoid'
import { Movie, Video } from '../database/schema'
import upload from '../lib/upload'

async function saveVideos(movie, videos) {
  const videoKeys = []
  for (let index = 0; index < videos.length; index++) {
    try {
      const params = videos[index]

      try {
        const videoRes = await upload(params.video, nanoid() + '.mp4')
        if (videoRes.key) {
          params.videoKey = videoRes.key
        } else {
          console.log('error video upload res no key', videoRes)
        }
      } catch (error) {
        console.log('error upload video', error)
      }

      try {
        const coverRes = await upload(params.cover, nanoid() + '.jpg')
        if (coverRes.key) {
          params.coverKey = coverRes.key
        } else {
          console.log('error cover upload res no key', coverRes)
        }
      } catch (error) {
        console.log('error upload cover', error)
      }

      params.movie = movie._id
      const video = new Video(params)
      const res = await video.save()
      videoKeys.push(res._id)
    } catch (error) {
      console.error('save video err', error)
    }
  }
  return videoKeys
}

async function uploadPictures(pictures) {
  const pictureKeys = []
  for (let index = 0; index < pictures.length; index++) {
    const picture = pictures[index]
    try {
      const pictureRes = await upload(picture, nanoid() + '.jpg')
      if (pictureRes.key) {
        pictureKeys.push(pictureRes.key)
      }
    } catch (error) {
      console.log('error upload picture', error)
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
      console.log('movie child process err: ', err)
      reject(err)
    })

    child.on('exit', code => {
      if (invoked) return
      invoked = false
      if (code !== 0) {
        console.log(
          'movie child process exit err: ',
          new Error('exit code' + code)
        )
        reject(new Error('exit code' + code))
      } else {
        console.log('movie child process exit code: ' + code)
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
