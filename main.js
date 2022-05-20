import { API } from "./services/api.js"
import { LocalStorage } from "./services/localStorage.js"

const moviesContainer = document.querySelector('.movies')
const form = document.querySelector('form')
const input = document.querySelector('input')
const searchButton = document.querySelector('.searchIcon')
const checkboxInput = document.querySelector('input[type="checkbox"]')

checkboxInput.addEventListener('change', checkCheckboxStatus)
searchButton.addEventListener('click', searchMovie)
form.addEventListener('submit', function(event) {
  event.preventDefault()
  searchMovie()
})

function checkCheckboxStatus() {
  const isChecked = checkboxInput.checked
  cleanAllMovies()
  if (isChecked) {
    const movies = LocalStorage.getFavoriteMovies() || []
    movies.forEach(movie => renderMovie(movie))
  } else {
    getAllPopularMovies()
  }
}

async function searchMovie() {
  const inputValue = input.value
  cleanAllMovies()
  if (inputValue != '') {
    const movies = await API.searchMovieByName(inputValue)
    movies.forEach(movie => renderMovie(movie))
  } else {
    getAllPopularMovies()
  }
}

function cleanAllMovies() {
  moviesContainer.innerHTML = ''
}

function favoriteButtonPressed(event, movie) {
  const favoriteState = {
    favorited: 'images/heart-fill.svg',
    notFavorited: 'images/heart.svg'
  }
  if(event.target.src.includes(favoriteState.notFavorited)) {
    // aqui ele será favoritado
    event.target.src = favoriteState.favorited
    LocalStorage.saveToLocalStorage(movie)
  } else {
    // aqui ele será desfavoritado
    event.target.src = favoriteState.notFavorited
    LocalStorage.removeFromLocalStorage(movie.id)
  }
}

async function getAllPopularMovies() {
  const movies = await API.getPopularMovies()
  movies.forEach(movie => renderMovie(movie))
}

window.onload = function() {
  getAllPopularMovies()
}

function renderMovie(movie) {
  const { id, title, poster_path, vote_average, release_date, overview } = movie

  const isFavorited = LocalStorage.checkMovieIsFavorited(id)
  const year = new Date(release_date).getFullYear()
  const image = `https://image.tmdb.org/t/p/w500${poster_path}`

  const movieElement = document.createElement('div')
  movieElement.classList.add('movie')
  moviesContainer.appendChild(movieElement)

  const movieInformations = document.createElement('div')
  movieInformations.classList.add('movie-informations')

  const movieImageContainer = document.createElement('div')
  movieImageContainer.classList.add('movie-image')

  const movieImage = document.createElement('img')
  movieImage.src = image
  movieImage.alt = `${title} Poster`

  movieImageContainer.appendChild(movieImage)
  movieInformations.appendChild(movieImageContainer)

  const movieTextContainer = document.createElement('div')
  movieTextContainer.classList.add('movie-text')

  const movieTitle = document.createElement('h4')
  movieTitle.textContent = `${title} (${year})`

  movieTextContainer.appendChild(movieTitle)
  movieInformations.appendChild(movieTextContainer)

  const informations = document.createElement('div')
  informations.classList.add('movie-informations')

  movieTextContainer.appendChild(informations)

  const ratingContainer = document.createElement('div')
  ratingContainer.classList.add('rating')

  const starImage = document.createElement('img')
  starImage.src = 'images/star.png'
  starImage.alt = 'Star'

  const movieRate = document.createElement('span')
  movieRate.classList.add('movie-rate')
  movieRate.textContent = vote_average

  ratingContainer.appendChild(starImage)
  ratingContainer.appendChild(movieRate)
  informations.appendChild(ratingContainer)

  const favorite = document.createElement('div')
  favorite.classList.add('favorite')

  const favoriteImage = document.createElement('img')
  favoriteImage.src = isFavorited ? 'images/heart-fill.svg' : 'images/heart.svg'
  favoriteImage.alt = 'Heart'
  favoriteImage.classList.add('favoriteImage')
  favoriteImage.addEventListener('click', (event) => favoriteButtonPressed(event, movie))

  const favoriteText = document.createElement('span')
  favoriteText.classList.add('movie-favorite')
  favoriteText.textContent = 'Favoritar'

  favorite.appendChild(favoriteImage)
  favorite.appendChild(favoriteText)
  informations.appendChild(favorite)

  const movieDescriptionContainer = document.createElement('div')
  movieDescriptionContainer.classList.add('movie-description')

  const movieDescription = document.createElement('span')
  movieDescription.textContent = overview

  movieDescriptionContainer.appendChild(movieDescription)
  
  movieElement.appendChild(movieInformations)
  movieElement.appendChild(movieDescriptionContainer)
}
