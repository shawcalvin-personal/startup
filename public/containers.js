function loadImages(container_id, images, is_save_page) {
    let container = document.querySelector(container_id);
    let movie_section = new MovieSection(images, is_save_page);
    if (container.lastChild.id == 'movie') {
        removeMovieChildren(container);
    }
    for (let i = 0; i < movie_section.movies.length; i++) {
        container.appendChild(movie_section.movies[i].container);
    }
}

function createImageArray() {
    const imgArray = new Array();
    for (let i = 1; i < 56; i++) {
        image = {
            imgName: i + '.png',
            likeCount: getLikeCount(this.imgName),
            dislikeCount: getDislikeCount(this.imgName)
        }
        imgArray.push(image);
        localStorage.setItem('movies', JSON.stringify(imgArray));
    };
}

function getLikeCount(imgName) { // temporary, will eventually be replaced by database data
    return Math.floor(Math.random() * 100);
}

function getDislikeCount(imgName) { // temporary, will eventually be replaced by database data
    return Math.floor(Math.random() * 100);
}

function loadMainPageDetails() {
    createImageArray();
    loadTopMovies(3);
    loadRandomMovies(3);
}

function loadSavedPageDetails() {
    createImageArray();
    loadSavedMovies();
}

function loadTopMovies(count) {
    const storedMovies = JSON.parse(localStorage.getItem('movies'));
    let sorted = storedMovies.sort((a, b) => {
        return (a.likeCount - a.dislikeCount) - (b.likeCount - b.dislikeCount);
    }).reverse();
    
    loadImages('#top-movies', moviesToString(sorted.slice(0, count)), false);
}

function getRandomMovie(imgArray) {
    const index = Math.floor(Math.random() * imgArray.length);
    image = imgArray[index];
    imgArray.splice(index, 1);
    return image;
}

function loadRandomMovies(count) {
    const storedMovies = JSON.parse(localStorage.getItem('movies'));
    let movies = new Array();
    for (let i = 0; i < count; i++) {
        movies.push(getRandomMovie(storedMovies));
    }
    loadImages('#random-movies', moviesToString(movies), false);
}

function loadSavedMovies() {
    const userName = getUserName();
    const savedMovies = JSON.parse(localStorage.getItem('saved'));
    const userMovies = getUserMovies(userName, savedMovies);

    loadImages('#saved-movies', userMovies, true);
}

function getUserName() {
    return localStorage.getItem('userName');
}

function getUserMovies(userName, savedMovies) {
    let userMovies = new Array();
    for (let i = 0; i < savedMovies.length; i++) {
        if (savedMovies[i]['userName'] == userName) {
            userMovies.push(savedMovies[i]['movie']);
        }
    }
    return moviesToString(userMovies);
}

function moviesToString(movies) {
    let movies_string = new Array();
    for (let i = 0; i < movies.length; i++) {
        movies_string.push(movies[i].imgName);
    }
    return movies_string;
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
    constructor(movie_image, is_save_page) {
        this.movie_image = movie_image
        this.is_save_page = is_save_page
        this.buttons = new ButtonContainer(this.movie_image, this.is_save_page)
        this.container = this.createContainer();
    }

    createImage(image) {
        let movie_image = document.createElement('img');
        movie_image.src = 'posters/' + image;
        movie_image.className = 'movie-img';

        return movie_image;
    }

    createContainer() {
        const poster = this.createImage(this.movie_image);
        let container = document.createElement('div');
        container.className = 'movie-container';
        container.id = 'movie';

        container.appendChild(poster);
        container.appendChild(this.buttons.container);
        

        return container;
    }
}

class ButtonContainer {
    constructor(image_name, is_save_page) {
        this.like_button = new LikeButton(image_name);
        this.dislike_button = new DislikeButton(image_name);
        this.save_button = new SaveButton(image_name, is_save_page);
        this.container = this.createContainer();
    }

    createContainer() {
        let container = document.createElement('div');
        container.className = 'button-container';

        container.appendChild(this.like_button.button);
        container.appendChild(this.dislike_button.button);
        container.appendChild(this.save_button.button);

        return container;
    }
}

class Button {
    constructor(image_name) {
        this.image_name = image_name;
    }

    getMovies() {
        return JSON.parse(localStorage.getItem('movies'));
    }

    getImageIndex() {
        return this.image_name.substring(0, this.image_name.indexOf('.'))-1;
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
        this.count = this.getCount();
        this.button = this.createButton();
    }

    createButton() {
        let button = document.createElement('button');
        button.className = ('btn btn-dark');

        let button_image = this.createButtonImage('images/thumb-up.png');
        button.onclick = this.updateCount

        let like_count = document.createElement('span');
        like_count.className = 'like-count'
        like_count.textContent = this.count;

        button.appendChild(like_count);
        button.appendChild(button_image);

        return button;
    }

    getCount() {
        const movies = this.getMovies();
        return movies[this.getImageIndex()].likeCount;
    }

    updateCount() {
        function getImageIndex(movie_name, movie_list) {
            let movieIndex;
            movie_list.forEach((element, index) => {
                if (element["imgName"] == movie_name) {
                    movieIndex = index;
                };
            });
            return movieIndex;

        }
        let movies = JSON.parse(localStorage.getItem('movies'));
        const movie = String(this.parentElement.parentElement.children[0].src);
        const image_name = movie.substring(movie.lastIndexOf("/") + 1);
        const index = getImageIndex(image_name, movies)

        movies[index].likeCount += 1;
        this.children[0].textContent = movies[index].likeCount;

        localStorage.setItem('movies', JSON.stringify(movies));
    }
}

class DislikeButton extends Button {
    constructor(image_name) {
        super(image_name);
        this.count = this.getCount();
        this.button = this.createButton();
    }

    createButton() {
        let button = document.createElement('button');
        button.className = ('btn btn-dark');

        let button_image = this.createButtonImage('images/thumb-up.png');
        button.onclick = this.updateCount

        let dislike_count = document.createElement('span');
        dislike_count.className = 'like-count'
        dislike_count.textContent = this.count;

        button.appendChild(dislike_count);
        button.appendChild(button_image);

        return button;
    }

    getCount() {
        const movies = JSON.parse(localStorage.getItem('movies'));
        return movies[this.getImageIndex()].dislikeCount;
    }

    updateCount() {
        function getImageIndex(movie_name, movie_list) {
            let movieIndex;
            movie_list.forEach((element, index) => {
                if (element["imgName"] == movie_name) {
                    movieIndex = index;
                };
            });
            return movieIndex;

        }
        let movies = JSON.parse(localStorage.getItem('movies'));
        const movie = String(this.parentElement.parentElement.children[0].src);
        const image_name = movie.substring(movie.lastIndexOf("/") + 1);
        const index = getImageIndex(image_name, movies);

        movies[index].dislikeCount += 1;
        this.children[0].textContent = movies[index].dislikeCount;

        localStorage.setItem('movies', JSON.stringify(movies));
    }
}

class SaveButton extends Button {
    constructor(image_name, is_save_page) {
        super(image_name);
        this.is_save_page = is_save_page;
        this.button = this.createButton();
    }

    createButton() {
        let button = document.createElement('button');
        button.className = ('save-button btn btn-dark');
        button.onclick = this.saveImage
        if (this.is_save_page) {
            button.textContent = 'Remove Movie';
            button.onclick = this.unsaveMovie
        } else {
            button.textContent = 'Save Movie';
            button.onclick = this.saveMovie
        }

        return button;
    }

    getSavedMovies() {
        return JSON.parse(localStorage.getItem('saved'));
    }

    saveMovie() {

        function getImageIndex(movie_name, movie_list) {
            let movieIndex;
            movie_list.forEach((element, index) => {
                if (element["imgName"] == movie_name) {
                    movieIndex = index;
                };
            });
            return movieIndex;

        }

        let movieTitles = new Array();
        const movies = JSON.parse(localStorage.getItem('movies'));
        const movie = String(this.parentElement.parentElement.children[0].src);
        const image_name = movie.substring(movie.lastIndexOf("/") + 1);
        const image_index = getImageIndex(image_name, movies);
        let savedMovies = JSON.parse(localStorage.getItem('saved'));

        if (savedMovies == null) {
            savedMovies = new Array();
        }  
        for (let i = 0; i < savedMovies.length; i++) {
            movieTitles.push(savedMovies[i]['movie']['imgName']);
        }

        if (movieTitles.includes(image_name)) return;
        savedMovies.push({
            userName: localStorage.getItem('userName'),
            movie: movies[image_index]
        });

        localStorage.setItem('saved', JSON.stringify(savedMovies));
    }

    unsaveMovie() {

        function getImageIndex(movie_name, movie_list) {
            let movieIndex;
            movie_list.forEach((element, index) => {
                if (element["movie"]["imgName"] == movie_name) {
                    movieIndex = index;
                };
            });
            return movieIndex;

        }

        const saved_movies = JSON.parse(localStorage.getItem('saved'));
        const movie = String(this.parentElement.parentElement.children[0].src);
        const image_name = movie.substring(movie.lastIndexOf("/") + 1);
        const image_index = getImageIndex(image_name, saved_movies);
        saved_movies.splice(image_index, 1);
        localStorage.setItem('saved', JSON.stringify(saved_movies));
        location.reload();
    }
}