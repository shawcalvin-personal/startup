import React from 'react';

export function Movies() {
  return (
    <main>
      <div className="users bg-secondary">
        <span id="user-name"></span>
        <div id="user-messages"></div>
      </div>
      <div className="movie-section" id="top-movies">
        <h2 className="section-header">Top Movies</h2>
      </div>
      <br />
      <br />
      <div className="movie-section" id="random-movies">
        <h2>Random Movies</h2>
        <div className="button-container">
          <button type="button" className="btn btn-dark" onclick="session.loadRandomMovies()">Generate Random Movies</button>
        </div>
      </div>
    </main>
  );
}