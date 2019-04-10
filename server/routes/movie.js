import { Controller, Get } from '../decorator/router'
import {
  getAllMovies,
  getSingleMovie,
  getRelativeMovies
} from '../service/movie'

@Controller('/movies')
class MovieRouter {
  @Get('/all')
  async getMovieList(ctx, next) {
    const type = ctx.query.type
    const year = ctx.query.year
    const movies = await getAllMovies(type, year)

    ctx.body = {
      code: 1,
      type: 'success',
      data: movies
    }
  }

  @Get('/detail/:id')
  async getMovieDetail(ctx, next) {
    const id = ctx.params.id
    const movie = await getSingleMovie(id)
    const relativeMovies = await getRelativeMovies(movie)

    ctx.body = {
      code: 1,
      type: 'success',
      data: {
        movie,
        relativeMovies
      }
    }
  }
}

export default MovieRouter
