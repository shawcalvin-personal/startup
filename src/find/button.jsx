import React from 'react';
import './find.css';

export function LikeButton({movie, buttonType,}) {
  let renderedButton;

  const [likeCount, setLikeCount] = React.useState(movie.like_count);
  const [dislikeCount, setDislikeCount] = React.useState(movie.dislike_count);

  async function handleLikeClick() {
    const response = fetch('api/movies', {
      method: 'PUT',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({movie: movie, type: 'like-count'})
    })
    .then((res) => res.json())
    .then((json) => {
      setLikeCount(likeCount + 1)});
  }

  if (buttonType == "like-button") {
    renderedButton = <button className='like-btn btn btn-dark' onClick = {handleLikeClick} disabled={handleDisabled}>
      <span>{likeCount}</span>
      <img src='/thumb-up.png' className='btn-img' />
    </button>
  } else if (buttonType == 'dislike-button') {
    renderedButton = <button className='like-btn btn btn-dark' onClick = {handleOnClick} disabled={handleDisabled}>
    <span>{movie.dislike_count}</span>
    <img src='/thumb-down.png' className='btn-img' />
  </button>
  } else if (buttonType == 'save-button') {
    renderedButton = <button className='save-btn btn btn-dark' onClick = {handleOnClick} disabled={handleDisabled}>
    <span>Save Movie</span>
  </button>
  }

  return (
      renderedButton
  );
}