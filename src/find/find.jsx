import React from 'react';
import { MovieSection } from './movieSection';
import { Users } from './users'
import './find.css'

export function Movies() {
  const [topMovies, setTopMovies] = React.useState([]);
  const [randomMovies, setRandomMovies] = React.useState([]);
  const userName = localStorage.getItem('userName');

  function getRandomMovies() {
    window.location.reload();
  }

  React.useEffect(() => {
    fetch('api/top-movies')
      .then((res) => res.json())
      .then((movies) => {
        setTopMovies(movies);
        localStorage.setItem('top-movies', JSON.stringify(movies));
      })
      .catch(() => {
        const moviesText = localStorage.getItem('top-movies');
        if (moviesText) {
          setTopMovies(JSON.parse(moviesText));
        }
      })
  }, []);

  React.useEffect(() => {
    fetch('api/random-movies')
    .then((res) => res.json())
    .then((movies) => {
      setRandomMovies(movies);
      localStorage.setItem('random-movies', JSON.stringify(movies));
      GameNotifier.broadcastEvent(userName, GameEvent.Start, {});
    })
    .catch(() => {
      const moviesText = localStorage.getItem('random-movies');
      if (moviesText) {
        setRandomMovies(JSON.parse(moviesText));
      }
    })
  }, []);

  return (
    <main>
      <Users userName={userName}/>
      <div className='movie-block'>
        <h2 className="section-header">Top Movies</h2>
        <div className='movie-section'>
          <MovieSection movies={topMovies}/>
        </div>
        
        <h2>Random Movies</h2>
        <button type="button" id='rand-btn' className="btn btn-dark" onClick= {() => getRandomMovies()}>Generate Random Movies</button>
        <div className='movie-section'>
          <MovieSection movies={randomMovies}/>
        </div>
      </div>
    </main>
  );
}