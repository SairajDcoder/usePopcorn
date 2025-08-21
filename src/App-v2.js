import './index.css';
import { useEffect, useRef, useState } from "react";
import StarRatings from "./StarRatings"
import { useMovies } from './useMovies';
import { useLocalStorageState } from './useLocalStorageState';
import { useKey } from './useKey';


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = 'aaaede1c';

export default function App() {


  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedMovieData, setSelectedMovieData] = useState({});
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  // const newData = null;

  // const [watched, setWatched] = useState([]);
  const { movies, isLoading, error } = useMovies(query)

  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleAddWatchedMovie(movie) {
    setWatched(watched => [...watched, movie])

  }

  function handleDeleteWatchedMovie(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id))
  }




  useEffect(function () {
    async function handleSelectedMovie() {
      setIsLoadingInfo(true)
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await res.json();
      setSelectedMovieData(data);
      setIsLoadingInfo(false)
    }
    handleSelectedMovie();
  }, [selectedId])






  return (
    <>
      <NavBar >
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Results movies={movies} />
      </NavBar>

      <Main >
        <Box >
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList getId={selectedId} setId={setSelectedId} movies={movies} />}
          {error && <ErrorComp msg={error} />}

        </Box>

        <Box>
          {selectedId && <MovieInfo watchedOne={watched} onAddWatch={handleAddWatchedMovie} isLoading={isLoadingInfo} handleIt={setSelectedId} movieData={selectedMovieData} getId={selectedId} />}
          {!selectedId && <>
            <Summary watched={watched} />
            <WatchedMoviesList onWatchedDelete={handleDeleteWatchedMovie} watched={watched} />
          </>}
        </Box>
      </Main>
    </>
  );
}



function ErrorComp({ msg }) {
  return <p className='error' >
    <span>🛑 {msg}</span>
  </p>
}

function Loader() {
  return <p className="loader">Loading...</p>
}

function Main({ children }) {
  return <main className="main">
    {children}

  </main>
}

// function WatchedList({ children }) {

//   const [isOpen2, setIsOpen2] = useState(true);

//   return <div className="box">
//     <button
//       className="btn-toggle"
//       onClick={() => setIsOpen2((open) => !open)}
//     >
//       {isOpen2 ? "–" : "+"}
//     </button>
//     {isOpen2 && children}
//   </div>
// }

function WatchedMoviesList({ watched, onWatchedDelete }) {
  return <ul className="list">
    {watched.map((movie) => (
      <WatchedMovie onWatchedDelete={onWatchedDelete} movie={movie} key={movie.imdbID} />
    ))}
  </ul>
}
function WatchedMovie({ movie, onWatchedDelete }) {

  return <li key={movie.imdbID}>
    <img src={movie.poster} alt={`${movie.title} poster`} />
    <h3>{movie.title}</h3>
    <div>
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.runtime} min</span>
      </p>
      <button className='btn-delete' onClick={() => onWatchedDelete(movie.imdbID)}>X</button>
    </div>
  </li>
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return <div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating.toFixed(2)}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating.toFixed(2)}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime} min</span>
      </p>
    </div>
  </div>
}


function NavBar({ children }) {
  return <nav className="nav-bar">
    {children}

  </nav>
}

function Logo() {
  return <div className="logo">
    <span role="img">🍿</span>
    <h1>usePopcorn</h1>
  </div>
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current)
      return;
    inputEl.current.focus();
    setQuery("");
  })



  return <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    ref={inputEl}
  />
}

function Results({ movies }) {
  return <p className="num-results">
    Found <strong>{movies.length}</strong> results
  </p>
}



function Box({ children }) {


  const [isOpen, setIsOpen] = useState(true);

  return <div className="box">
    <button
      className="btn-toggle"
      onClick={() => setIsOpen((open) => !open)}
    >
      {isOpen ? "–" : "+"}
    </button>
    {isOpen &&
      children
    }
  </div>
}

function MovieList({ movies, setId, getId }) {


  return <ul className="list list-movies">
    {movies?.map((movie) => (
      <Movie getId={getId} setId={setId} movie={movie} key={movie.imdbID} />
    ))}
  </ul>
}

function Movie({ movie, setId, getId }) {



  function handleOpenMovie(id) {
    id === getId ? setId(id => null) : setId(id)

  }

  return <li onClick={() => setId(() => handleOpenMovie(movie.imdbID))}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  </li>
}

function MovieInfo({ getId, movieData, handleIt, isLoading, onAddWatch, watchedOne }) {
  const [rate, setRate] = useState(0);

  const isWatched = watchedOne.map(ele => ele.imdbID).includes(getId);
  const useWatchedRating = watchedOne.find(movie => movie.imdbID === getId)?.userRating

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: movieData.imdbID,
      title: movieData.Title,
      poster: movieData.Poster,
      year: movieData.Year,
      imdbRating: Number(movieData.imdbRating),
      userRating: rate,
      runtime: Number(movieData.Runtime.split(" ").at(0)),
      count: countRate.current
    }
    onAddWatch(newWatchedMovie);
    handleIt(null);

  }

  const countRate = useRef(0)
  useEffect(function () {
    if (rate) countRate.current = countRate.current + 1;
  }, [rate])

  useKey("Escape", handleIt)
  // useEffect(function () {
  //   // if (selectedId)
  //   function callBack(e) {
  //     e.code === "Escape" && handleIt(null);
  //   }
  //   document.addEventListener("keydown", callBack)

  //   return function () {
  //     document.removeEventListener("keydown", callBack)
  //   }
  // }, [handleIt])

  useEffect(function () {
    if (!movieData.Title) return;
    document.title = `Movie | ${movieData.Title}`

    return function () {
      document.title = "usePopcorn";
    }
  }, [movieData.Title])



  return <>
    <div className='details'>
      {isLoading ? <Loader /> :
        <>
          <header >
            <button className="btn-back" onClick={() => handleIt(null)}>⇐</button>
            <img
              src={movieData.Poster}
              alt={movieData.Title}
            />
            <div className="details-overview">
              <h2>{movieData.Title}</h2>
              <p>{movieData.Released} • {movieData.Runtime}</p>
              <p>{movieData.Genre}</p>
              <p>⭐ {movieData.imdbRating} IMDb rating</p>
            </div>
          </header>

          <section >
            {/* <div style={{ fontSize: "2rem", display: "flex", gap: "0.3rem" }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i}>⭐</span>
          ))}
        </div> */}

            <div className='rating'>

              {isWatched ? <p>You rated this movie {useWatchedRating} <span>⭐️</span> </p> :
                <>
                  <StarRatings maxRating={10} size={24} onSetRating={setRate} />
                  {rate > 0 && (<button className='btn-add' onClick={() => handleAdd()}>+ Add to list</button>)}
                </>
              }
            </div>

            <p > <em>
              {movieData.Plot}
            </em>
            </p>
            <p>
              Starring {movieData.Actors}
            </p>
            <p>
              Directed by {movieData.Director}
            </p>
          </section>
        </>}
    </div>
  </>
}