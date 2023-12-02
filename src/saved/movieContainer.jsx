import React from 'react';
import { UnsaveButton } from './unsaveButton';

export function MovieContainer({movie}) {
  return (
    <div className='movie-container'>
      <img src= {movie.src} className='movie-img' />
      <div className='btn-container'>
        <UnsaveButton movie={movie} isSavePage={true}/>
      </div>
    </div>
  );
}