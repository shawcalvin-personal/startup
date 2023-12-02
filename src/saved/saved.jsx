import React from 'react';
import { MovieSection } from './movieSection';
import './saved.css'

export function Saved() {
  const [savedMovies, setSavedMovies] = React.useState([]);

  React.useEffect(() => {
    const userName = localStorage.getItem('userName');
    fetch('api/saved-movies/' + userName)
    .then((res) => res.json())
    .then((movies) => {
      setSavedMovies(movies);
      localStorage.setItem('saved', JSON.stringify(movies));
    })
    .catch(() => {
      const moviesText = localStorage.getItem('saved-movies');
      if (moviesText) {
        setSavedMovies(JSON.parse(moviesText));
      }
    })
  }, []);

  return (
    <main>
      <div className='movie-section'>
        <h2 className="section-header">Saved Movies</h2>
        <MovieSection movies={savedMovies}/>
      </div>
    </main>
  );
}