import React from 'react';
import { SessionEvent, SessionNotifier } from './sessionNotifier';
import './find.css';

export function DislikeButton({movie}) {
  const [count, setCount] = React.useState(movie.dislike_count);
  const [isDisabled, setIsDisabled] = React.useState(false);

  async function handleClick() {
    const userName = localStorage.getItem('userName');
    setCount(count + 1);
    setIsDisabled(true);
    fetch('api/movies', {
      method: 'PUT',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({movie: movie, type: 'like-count'})
    })

    SessionNotifier.broadcastEvent(userName, SessionEvent.Dislike, {title: movie.title});
  }

  return (
    <button className='like-btn btn btn-dark' onClick = {handleClick} disabled={isDisabled}>
    <span>{count}</span>
    <img src='/thumb-down.png' className='btn-img' />
  </button>
  );
}