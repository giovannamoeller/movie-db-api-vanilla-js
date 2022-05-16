const localStorageKey = 'favoriteMovies'

function getFavoriteMovies() {
  return JSON.parse(localStorage.getItem(localStorageKey))
}

function saveToLocalStorage(movie) {
  const movies = getFavoriteMovies() || []
  movies.push(movie)
  const moviesJSON = JSON.stringify(movies)
  localStorage.setItem(localStorageKey, moviesJSON)
}

function checkMovieIsFavorited(id) {
  const movies = getFavoriteMovies() || []
  return movies.find(movie => movie.id == id)
}

function removeFromLocalStorage(id) {
  const movies = getFavoriteMovies() || []
  const findMovie = movies.find(movie => movie.id == id)
  const newMovies = movies.filter(movie => movie.id != findMovie.id)
  localStorage.setItem(localStorageKey, JSON.stringify(newMovies))
}

export const LocalStorage = {
  getFavoriteMovies,
  saveToLocalStorage,
  checkMovieIsFavorited,
  removeFromLocalStorage
}