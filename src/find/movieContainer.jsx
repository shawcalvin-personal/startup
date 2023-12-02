import React from 'react';
import { LikeButton } from './likeButton';
import { DislikeButton } from './dislikeButton';
import { SaveButton } from './saveButton';
import './find.css'

export function MovieContainer({movie}) {
  return (
    <div className='movie-container'>
      <img src= {movie.src} className='movie-img' />
      <div className='btn-container'>
        <LikeButton movie={movie} />
        <DislikeButton movie={movie} />
        <SaveButton movie={movie} isSavePage={false}/>
      </div>
    </div>
  );
}