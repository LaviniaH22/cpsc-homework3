import { useEffect, useState } from 'react'
import './App.css'

const IMG_URL = 'https://image.tmdb.org/t/p/w500'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('')
  const [currentMovies, setCurrentMovies] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    async function fetchData() {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY
      const BASE_URL = 'https://api.themoviedb.org/3/movie/popular'
      const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie'
      const searchText = searchQuery.trim()
      let API_URL

      if (searchText !== '') {
        API_URL = SEARCH_URL + '?api_key=' + API_KEY +
          '&query=' + encodeURIComponent(searchText) + '&page=' + pageNumber
      } else {
        API_URL = BASE_URL + '?api_key=' + API_KEY + '&page=' + pageNumber
      }

      const response = await fetch(API_URL)
      const data = await response.json()
      setCurrentMovies(data.results)
      setTotalPages(Math.ceil(data.total_results / 20))
    }

    fetchData()
  }, [searchQuery, pageNumber])

  function searchMovies(event) {
    setSearchQuery(event.target.value)
    setPageNumber(1)
  }

  function nextPage() {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1)
    }
  }

  function prevPage() {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    }
  }

  function sortMovies() {
    let sortedMovies = [...currentMovies]
    if (sortOption === 'rdesc') {
      sortedMovies.sort(function(a, b) {
        return b.vote_average - a.vote_average
      })
    } else if (sortOption === 'rasc') {
      sortedMovies.sort(function(a, b) {
        return a.vote_average - b.vote_average
      })
    } else if (sortOption === 'rddesc') {
      sortedMovies.sort(function(a, b) {
        return new Date(b.release_date) - new Date(a.release_date)
      })
    } else if (sortOption === 'rdasc') {
      sortedMovies.sort(function(a, b) {
        return new Date(a.release_date) - new Date(b.release_date)
      })
    }
    return sortedMovies
  }

  return (
    <header>
      <h1>Movie Explorer</h1>
      <div className="searchnsort">
        <input
          type="search"
          id="search"
          placeholder="search for a movie..."
          value={searchQuery}
          onChange={searchMovies}
        />
        <select
          id="sort"
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value)}
        >
          <option value="">Sort By</option>
          <option value="rdasc">Release Date (Asc)</option>
          <option value="rddesc">Release Date (Desc)</option>
          <option value="rasc">Rating (Asc)</option>
          <option value="rdesc">Rating (Desc)</option>
        </select>
      </div>
      <div className="moviegrid" id="moviegrid">
        {sortMovies().map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img src={IMG_URL + movie.poster_path} alt={movie.title} />
            <p className="movie-title">{movie.title}</p>
            <p className="movie-date">Release Date: {movie.release_date}</p>
            <p className="movie-rating">Rating: {movie.vote_average}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button id="prev" onClick={prevPage} disabled={pageNumber <= 1}>
          Previous
        </button>
        <p>Page <span id="current-page">{pageNumber}</span> of <span id="total-pages">{totalPages}</span></p>
        <button id="next" onClick={nextPage} disabled={pageNumber >= totalPages}>
          Next
        </button>
      </div>
    </header>
  )
}

export default App










