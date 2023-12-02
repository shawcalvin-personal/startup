import React from 'react';
import { SessionEvent, SessionNotifier } from './sessionNotifier';
import './find.css';

export function SaveButton({movie, isSavePage}) {
  const [isDisabled, setIsDisabled] = React.useState(false);

  async function handleClick() {
    setIsDisabled(true);
    const userName = localStorage.getItem('userName');
    const savedMovie = {name: userName, _id: userName + "-" + movie._id, src: movie.src}
    const response = await fetch('api/save-movie', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(savedMovie)
    });
    const saved_movies = await response.json();
    localStorage.setItem('saved-movies', saved_movies);
  }

  async function handleClick() {
    setIsDisabled(true);
    const userName = localStorage.getItem('userName');
    const savedMovie = {name: userName, _id: userName + "-" + movie._id, src: movie.src}
    const response = await fetch('api/save-movie', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(savedMovie)
    });
    const saved_movies = await response.json();
    localStorage.setItem('saved-movies', saved_movies);

    SessionNotifier.broadcastEvent(userName, SessionEvent.Save, {title: movie.title});
  }

  return (
    <button className='save-btn btn btn-dark' onClick = {handleClick} disabled={isDisabled}>
        <span>Save Movie</span>
    </button>
  );
}