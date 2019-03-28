import { Movie } from '../database/schema'

export const getAllMovies = async (type, year) => {
  const query = {}

  if (type) {
    query.movieTypes = { $in: [type] }
  }
  if (year) {
    query.year = year
  }

  const movies = await Movie.find(query)
    .populate('category')
    .populate('videos')

  return movies
}

export const getRelativeMovies = async movie => {
  const relativeMovies = await Movie.find({
    movieTypes: { $in: movie.movieTypes }
  })

  return relativeMovies
}

export const getSingleMovie = async id => {
  const movie = await Movie.findOne({ _id: id })

  return movie
}
