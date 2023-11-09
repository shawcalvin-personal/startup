function loadImages(container_id, images, is_save_page) {
    let container = document.querySelector(container_id);
    let movie_section = new MovieSection(images, is_save_page);
    if (container.lastChild.id == 'movie') {
        removeMovieChildren(container);
    }
    for (let i = 0; i < movie_section.movies.length; i++) {
        container.appendChild(movie_section.movies[i].container);
    }
    ;
}

function fetchMovies(page, movie_array) {
    const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDI5MzFkZmZiNzJhNTU0Y2RhZmU1ODM0NTY5NmQwMCIsInN1YiI6IjY1NGM0YmY3ZDQ2NTM3MDBlMWE2NzcwMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.K8uZP4e99qMSl-5Dig92mdqlwl6Swf1W7lQmlcYAO30'
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then(json => {
            for (i = 0; i < json['results'].length; i++) {
                movie_array.push({
                    id: json['results'][i]['id'],
                    src: `https://image.tmdb.org/t/p/original${json['results'][i]['poster_path']}`,
                    like_count:  getLikeCount(json['results'][i]['id']),
                    dislike_count:  getDislikeCount(json['results'][i]['id'])
                });
            }
        })
        .then(() => {
            localStorage.setItem('movies', JSON.stringify(movie_array));
        })
        .catch(err => console.error('error:' + err));
}

function createImageArray() {
    let movie_array = [];
    for (let i = 1; i < 10; i++) {
        fetchMovies(i, movie_array);
    }
}

function getLikeCount(id) { // temporary, will eventually be replaced by database data
    return Math.floor(Math.random() * 100);
}

function getDislikeCount(id) { // temporary, will eventually be replaced by database data
    return Math.floor(Math.random() * 100);
}

function loadMainPageDetails() {
    createImageArray();
    // loadTopMovies(3);
    // loadRandomMovies(3);
}

function loadSavedPageDetails() {
    createImageArray();
    loadSavedMovies();
}

function loadTopMovies(count) {
    const storedMovies = JSON.parse(localStorage.getItem('movies'));
    let sorted = storedMovies.sort((a, b) => {
        return (a.like_count - a.dislike_count) - (b.like_count - b.dislike_count);
    }).reverse();
    
    loadImages('#top-movies', sorted.slice(0, 3), false);
}

function getRandomMovie(imgArray) {
    const index = Math.floor(Math.random() * imgArray.length);
    image = imgArray[index];
    imgArray.splice(index, 1);
    return image;
}

async function loadRandomMovies(count) {
    const storedMovies = JSON.parse(localStorage.getItem('movies'));
    let movies = new Array();
    for (let i = 0; i < count; i++) {
        movies.push(getRandomMovie(storedMovies));
    }
    loadImages('#random-movies', movies, false);
}

async function loadSavedMovies() {
    let saved_movies = []
    let user_name;
    let user_movie_ids;
    let user_movies;

    const response = await fetch('api/saved-movies');
    saved_movies = await response.json();

    user_name = getUserName()
    user_movie_ids = saved_movies.filter(movie => movie['name'] == user_name).map(movie => parseInt(movie['movie']));
    user_movies = getMoviesByID(user_movie_ids);

    loadImages('#saved-movies', user_movies, true);
}

function getUserName() {
    return localStorage.getItem('userName');
}

function getMoviesByID(id_list) {
    let movies = [];
    const storedMovies = JSON.parse(localStorage.getItem('movies'));
    for (let i = 0; i < storedMovies.length; i++) {
        if (id_list.includes(storedMovies[i]['id'])) {
            movies.push(storedMovies[i])
        }
    }
    return movies;
}

function removeMovieChildren(container) {
    let children = container.children;
    for (let i = children.length - 1; i >= 0; i--) {
        if (children[i].id == 'movie') {
            container.removeChild(children[i])
        }
    }
}

class MovieSection {
    constructor(images, is_save_page) {
        this.movies = this.createMovieContainers(images, is_save_page);
    }

    createMovieContainers(images, is_save_page) {
        let movie_containers = new Array();
        for (let i = 0; i < images.length; i++) {
            movie_containers.push(new MovieContainer(images[i], is_save_page))
        }

        return movie_containers;
    }
}

class MovieContainer {
    constructor(image, is_save_page) {
        this.image = image
        this.is_save_page = is_save_page
        this.buttons = new ButtonContainer(image, this.is_save_page)
        this.container = this.createContainer();
    }

    createImage(image) {
        let movie_image = document.createElement('img');
        movie_image.src = this.image['src'];
        movie_image.className = 'movie-img';

        return movie_image;
    }

    createContainer() {
        const poster = this.createImage(this.image);
        let container = document.createElement('div');
        container.className = 'movie-container';
        container.id = 'movie';

        container.appendChild(poster);
        container.appendChild(this.buttons.container);
        

        return container;
    }
}

class ButtonContainer {
    constructor(image, is_save_page) {
        this.is_save_page = is_save_page;
        this.like_button = new LikeButton(image);
        this.dislike_button = new DislikeButton(image);
        this.save_button = new SaveButton(image, is_save_page);
        this.container = this.createContainer();
    }

    createContainer() {
        let container = document.createElement('div');
        container.className = 'button-container';

        if (!this.is_save_page) {
            container.appendChild(this.like_button.button);
            container.appendChild(this.dislike_button.button);
        }
        container.appendChild(this.save_button.button);

        return container;
    }
}

class Button {
    constructor(image) {
        this.image = image;
    }

    createButtonImage(src) {
        const image = document.createElement('img');
        image.src = src;
        image.className = 'button-img';
        return image;
    }
}

class LikeButton extends Button {
    constructor(image_name) {
        super(image_name);
        this.button = this.createButton();
    }

    createButton() {
        let button = document.createElement('button');
        button.className = ('btn btn-dark');
        button.name = this.image['id'];

        let button_image = this.createButtonImage('images/thumb-up.png');
        button.onclick = this.updateLikeCount

        let like_count = document.createElement('span');
        like_count.className = 'like-count'
        if (this.image['id'] == 507089) {
            console.log(this.image['like_count']);
        }
        like_count.textContent = this.image['like_count'];

        button.appendChild(like_count);
        button.appendChild(button_image);

        return button;
    }

    updateLikeCount() {
        let movies = JSON.parse(localStorage.getItem('movies'));
        for (let i = 0; i < movies.length; i++) {
            if (movies[i]['id'] == this.name) {
                movies[i]['like_count'] += 1;
                this.children[0].textContent = movies[i]['like_count'];
                localStorage.setItem('movies', JSON.stringify(movies));
                return;
            }
        }
    }
}

class DislikeButton extends Button {
    constructor(image_name) {
        super(image_name);
        this.button = this.createButton();
    }

    createButton() {
        let button = document.createElement('button');
        button.className = ('btn btn-dark');
        button.name = this.image['id'];

        let button_image = this.createButtonImage('images/thumb-down.png');
        button.onclick = this.updateDislikeCount

        let dislike_count = document.createElement('span');
        dislike_count.className = 'like-count'
        dislike_count.textContent = this.image['dislike_count'];

        button.appendChild(dislike_count);
        button.appendChild(button_image);

        return button;
    }

    updateDislikeCount() {
        let movies = JSON.parse(localStorage.getItem('movies'));
        for (let i = 0; i < movies.length; i++) {
            if (movies[i]['id'] == this.name) {
                movies[i]['dislike_count'] += 1;
                this.children[0].textContent = movies[i]['dislike_count'];
                localStorage.setItem('movies', JSON.stringify(movies));
                return;
            }
        }
    }
}

class SaveButton extends Button {
    constructor(image, is_save_page) {
        super(image);
        this.is_save_page = is_save_page;
        this.button = this.createButton();
    }

    createButton() {
        let button = document.createElement('button');
        button.className = ('save-button btn btn-dark');
        button.name = this.image['id'];

        if (this.is_save_page) {
            button.textContent = 'Remove Movie';
            button.onclick = this.unsaveMovie
        } else {
            button.textContent = 'Save Movie';
            button.onclick = this.saveMovie
        }

        return button;
    }

    async saveMovie() {
        const user_name = localStorage.getItem('userName');
        const saved_movie = {name: user_name, movie: this.name}
        try {
            const response = await fetch('api/save-movie', {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(saved_movie)
            });
            const saved_movies = await response.json();
            localStorage.setItem('saved-movies', saved_movies);
        } catch {
            let saved_movies = localStorage.getItem('saved-movies');
            if (!JSON.stringify(saved_movies).includes(JSON.stringify(saved_movie))) {
                saved_movies.push(saved_movie);
                localStorage.setItem('saved-movies', saved_movies);
            };
        }
       
    }

    async unsaveMovie() {
        const user_name = getUserName();
        const unsaved_movie = {name: user_name, movie: this.name}
        try {
            const response = await fetch('api/save-movie', {
                method: 'DELETE',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(unsaved_movie)
            });
            const saved_movies = await response.json();
            localStorage.setItem('saved-movies', saved_movies);
            location.reload();
        } catch {
            let saved_movies = localStorage.getItem('saved-movies');
            for (let i = 0; i < saved_movies.length; i++) {
                if (JSON.stringify(saved_movies[i]) == JSON.stringify(movie)) {
                  saved_movies.splice(i, 1);
                  localStorage.setItem('saved-movies', saved_movies);
                }
              }
              location.reload();
        }
    }
}
