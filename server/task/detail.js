import rp from 'request-promise-native'
import nanoid from 'nanoid'
import { Category, Movie } from '../database/schema'
import qiniuApi from '../lib/upload'
import logger from '../lib/logger'

async function fetchMovie(item) {
  const url1 = `http://api.douban.com/v2/movie/${item.doubanId}`
  const res1 = await rp(url1)
  const url2 = `http://api.douban.com/v2/movie/subject/${item.doubanId}`
  const res2 = await rp(url2)

  let body
  try {
    body = JSON.parse(res1)
    body.subject = JSON.parse(res2)
  } catch (error) {
    logger.error(error)
  }
  return body
}

export default async function() {
  const movies = await Movie.find({
    $or: [{ summary: { $exists: false } }, { summary: null }, { summary: '' }]
  })

  for (let index = 0; index < movies.length; index++) {
    const movie = movies[index]
    const movieData = await fetchMovie(movie)

    if (!movieData) return

    // 基本信息
    movie.summary = movieData.summary || ''
    movie.pubdate = movieData.attrs.pubdate || []
    movie.country = movieData.attrs.country || []
    movie.duration = movieData.attrs.movie_duration || []

    // 类型
    for (let index = 0; index < movieData.subject.genres.length; index++) {
      const item = movieData.subject.genres[index]

      let cat = await Category.findOne({ name: item })
      if (!cat) {
        cat = new Category({
          name: item,
          movies: [movie._id]
        })
        await cat.save()
      } else if (!cat.movies.includes(movie._id)) {
        cat.movies.push(movie._id)
      }

      if (!movie.category.includes(cat._id)) {
        movie.category.push(cat._id)
      }
    }

    // 演员
    for (let index = 0; index < movieData.subject.casts.length; index++) {
      const cast = movieData.subject.casts[index]
      const newCast = {
        name: cast.name,
        avatar: cast.avatars ? cast.avatars.small : ''
      }

      if (!newCast.avatar) {
        newCast.avatarKey = ''
        movie.casts.push(newCast)
        continue
      }

      try {
        const path = `avatar/${nanoid()}.jpg`
        const res = await qiniuApi.upload(newCast.avatar, path)
        if (res) {
          newCast.avatarKey = path
        } else {
          logger.error('api success but error avatar upload', res)
        }
      } catch (error) {
        logger.error('error upload avatar', error)
      }
      movie.casts.push(newCast)
    }

    // 导演
    for (let index = 0; index < movieData.subject.directors.length; index++) {
      const director = movieData.subject.directors[index]
      const newDirector = {
        name: director.name,
        avatar: director.avatars ? director.avatars.small : ''
      }

      if (!newDirector.avatar) {
        newDirector.avatarKey = ''
        movie.casts.push(newDirector)
        continue
      }

      try {
        const path = `avatar/${nanoid()}.jpg`
        const res = await qiniuApi.upload(director.avatars.small, path)
        if (res) {
          newDirector.avatarKey = path
        } else {
          logger.error('api success but error avatar upload', res)
        }
      } catch (error) {
        logger.error('error upload avatar', error)
      }
      movie.directors.push(newDirector)
    }

    await movie.save()
  }
}
