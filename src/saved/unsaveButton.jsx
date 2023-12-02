import React from 'react';
import './saved.css';

export function UnsaveButton({movie, isSavePage}) {
  const [isDisabled, setIsDisabled] = React.useState(false);

  async function handleClick() {
    const userName = localStorage.getItem('userName');
    const savedMovie = {name: userName, _id: movie._id, src: movie.src}
    const response = await fetch('api/save-movie', {
        method: 'DELETE',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(savedMovie)
    });
    const saved_movies = await response.json();
    localStorage.setItem('saved-movies', saved_movies);
    window.location.reload();
  
  }

  return (
    <button className='save-btn btn btn-dark' onClick = {handleClick} disabled={isDisabled}>
        <span>Unsave Movie</span>
    </button>
  );
}