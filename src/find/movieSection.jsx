import React, { useEffect } from 'react';
import { MovieContainer } from './movieContainer';

export function MovieSection({movies, isSavePage}) {
    let movieContainers = [];
    if (movies) {
        for (let i = 0; i < movies.length; i++) {
            movieContainers.push(<MovieContainer key = {i} movie={movies[i]} isSavePage={isSavePage}/>);
        }
    }

    return (
    <div>
        { movieContainers }
    </ div>
    );
}