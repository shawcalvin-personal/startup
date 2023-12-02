import React from 'react';
import { SessionEvent, SessionNotifier } from './sessionNotifier';
import './find.css';

export function LikeButton({movie}) {
  const [count, setCount] = React.useState(movie.like_count);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const userName = localStorage.getItem('userName');

  async function handleClick() {
    setCount(count + 1);
    setIsDisabled(true);
    fetch('api/movies', {
      method: 'PUT',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({movie: movie, type: 'like-count'})
    })

    SessionNotifier.broadcastEvent(userName, SessionEvent.Like, {title: movie.title});
  }

  return (
    <button className='like-btn btn btn-dark' onClick = {handleClick} disabled={isDisabled}>
    <span>{count}</span>
    <img src='/thumb-up.png' className='btn-img' />
  </button>
  );
}