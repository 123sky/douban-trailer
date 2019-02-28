const rp = require('request-promise-native')
const { model } = require('mongoose')
const Movie = model('Movie')
const Category = model('Category')

async function fetchMovie (item) {
  const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`
  const res = await rp(url)
  let body
  try {
    body = JSON.parse(res)
  } catch (error) {
    console.log(error)
  }
  return body
}

async function richMovie (movie) {
  let movieData = await fetchMovie(movie)
  if (movieData) {
    movie.summary = movieData.summary || ''
    movie.year = movieData.year || null
    movie.countries = movieData.countries || []

    for (let index = 0; index < movieData.genres.length; index++) {
      const item = movieData.genres[index]

      let cat = await Category.findOne({ name: item })

      if (!cat) {
        cat = new Category({
          name: item,
          movies: [movie._id]
        })
        await cat.save()
      } else {
        if (!cat.movies.includes(movie._id)) {
          cat.movies.push(movie._id)
        }
      }

      if (!movie.category.includes(cat._id)) {
        movie.category.push(cat._id)
      }
    }

    await movie.save()
  }
}

;
(async () => {
  let movies = await Movie.find({
    $or: [
      { summary: { $exists: false } },
      { summary: null },
      { summary: '' },
      { year: { $exists: false } },
      { title: '' }
    ]
  })

  for (let index = 0; index < movies.length; index++) {
    const movie = movies[index]
    await richMovie(movie)
  }
})()
