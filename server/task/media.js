import nanoid from 'nanoid'
import { Movie, Video } from '../database/schema'
import qiniuApi from '../lib/upload'
import logger from '../lib/logger'
import getMedia from '../crawler/media'

async function saveVideos({ _id, media }) {
  const videoKeys = []
  for (let index = 0; index < media.videos.length; index++) {
    const params = media.videos[index]

    try {
      const path = `video/${nanoid()}.mp4`
      const videoRes = await qiniuApi.upload(params.url, path)
      if (videoRes) {
        params.videoKey = path
      } else {
        logger.error('error video upload res no key', videoRes)
      }
    } catch (error) {
      logger.error('error upload video', error)
    }

    try {
      const path = `video-cover/${nanoid()}.jpg`
      const coverRes = await qiniuApi.upload(params.cover, path)
      if (coverRes) {
        params.coverKey = path
      } else {
        logger.error('error cover upload res no key', coverRes)
      }
    } catch (error) {
      logger.error('error upload cover', error)
    }

    try {
      params.movie = _id
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
      const path = `picture/${nanoid()}.jpg`
      const pictureRes = await qiniuApi.upload(picture, path)
      if (pictureRes) {
        pictureKeys.push(path)
      }
    } catch (error) {
      logger.error('error upload picture', error)
    }
  }
  return pictureKeys
}

async function saveRelated(related) {
  for (let index = 0; index < related.length; index++) {
    try {
      const path = `related/${nanoid()}.jpg`
      const res = await qiniuApi.upload(related[index].poster, path)
      if (res) {
        related[index].posterKey = path
      }
    } catch (error) {
      logger.error('error upload related poster', error)
    }
  }
  return related
}

export default async page => {
  const movies = await Movie.find({ pictures: [] })
  let moviesWithMedia = []

  try {
    moviesWithMedia = await getMedia(page, movies)
  } catch (error) {
    logger.error(`fail to crawl media of movie`, error)
  }

  logger.info('success to crawl media of movie. start to sava media')

  for (let index = 0; index < moviesWithMedia.length; index++) {
    logger.info(
      `start save media of the ${index + 1}th movie. total is ${
        moviesWithMedia.length
      }`
    )

    const movie = moviesWithMedia[index]
    const videoKeys = await saveVideos(movie)
    const pictures = movie.media.pictures
    const pictureKeys = await uploadPictures(pictures)
    const related = await saveRelated(movie.media.related)

    const movieModel = await Movie.findOne({ _id: movie._id })
    movieModel.videos = videoKeys
    movieModel.pictures = pictures
    movieModel.pictureKeys = pictureKeys
    movieModel.comments = movie.media.comments
    movieModel.related = related
    try {
      await movieModel.save()
    } catch (error) {
      logger.error(`fail to save media of the ${index + 1}th movie`, error)
    }
  }

  logger.info('finish to save all media')
}
