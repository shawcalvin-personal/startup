function createSavedContainer() {
    const container = document.querySelector("#saved-movies");
    const savedMovies = JSON.parse(localStorage.getItem('saved'));
    for (let i = 0; i < savedMovies.length; i++) {
        createMovieContainer(container);
    }
}

function createMovieContainer(parentContainer) {
    let movieContainer = document.createElement('div');
    movieContainer.className = 'movie-container';
    movieContainer.id = 'movie';

    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container'

    movieContainer.appendChild(buttonContainer);
    parentContainer.appendChild(movieContainer);
}