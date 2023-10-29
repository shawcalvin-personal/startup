function loadPageDetails() {
    createImageArray();
    const topMovies = getTopMovies(3);
    loadImages("#top-movies", topMovies)
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
    return imgArray;
}

function getLikeCount(imgName) { // temporary, will eventually be replaced by database data
    return Math.floor(Math.random() * 100);
}

function getDislikeCount(imgName) { // temporary, will eventually be replaced by database data
    return Math.floor(Math.random() * 100);
}

function getRandomMovie(imgArray) {
    const index = Math.floor(Math.random() * imgArray.length);
    image = imgArray[index];
    imgArray.splice(index, 1);
    return image;
}

function getRandomMovies(count) {
    const storedMovies = JSON.parse(localStorage.getItem('movies'));
    let movies = new Array();
    for (let i = 0; i < count; i++) {
        movies.push(getRandomMovie(storedMovies));
    }
    console.log(movies);
    return movies;
}

function getTopMovies(count) {
    let storedMovies = JSON.parse(localStorage.getItem('movies'));
    let sorted = storedMovies.sort((a, b) => {
        return (a.likeCount - a.dislikeCount) - (b.likeCount - b.dislikeCount);
    }).reverse();
    
    return sorted.slice(0, count)
}

function createButtons(container, isSavePage) {
    const movies = JSON.parse(localStorage.getItem('movies'));

    const img = String(container.children[0].src);
    const imgName = img.substring(img.lastIndexOf("/") + 1);
    const index = imgName.substring(0, imgName.indexOf('.')) - 1;
    const storedLikeCount = movies[index].likeCount;
    const storedDislikeCount = movies[index].dislikeCount;


    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const likeImage = document.createElement('img');
    likeImage.src = 'images/thumb-up.png';
    likeImage.className = 'button-img';

    const dislikeImage = document.createElement('img');
    dislikeImage.src = 'images/thumb-down.png';
    dislikeImage.className = 'button-img';

    const likeButton = document.createElement('button');
    likeButton.className = ('btn btn-dark');
    likeButton.onclick = updateLikeCount;

    const likeCount = document.createElement('span');
    likeCount.className = 'like-count';
    likeCount.textContent = storedLikeCount;

    const dislikeCount = document.createElement('span');
    dislikeCount.className = 'like-count'
    dislikeCount.textContent = storedDislikeCount;


    const dislikeButton = document.createElement('button');
    dislikeButton.className = ('btn btn-dark');
    dislikeButton.onclick = updateDislikeCount;

    const saveButton = document.createElement('button');
    saveButton.className = ('save-button btn btn-dark');
    
    if (isSavePage) {
        saveButton.textContent = 'Remove Movie';
        saveButton.onclick = unsaveMovie
    } else {
        saveButton.textContent = 'Save Movie';
        saveButton.onclick = saveMovie
    }
    

    likeButton.appendChild(likeCount);
    likeButton.appendChild(likeImage);
    dislikeButton.appendChild(dislikeCount);
    dislikeButton.appendChild(dislikeImage);

    buttonContainer.appendChild(likeButton);
    buttonContainer.appendChild(dislikeButton);
    buttonContainer.appendChild(saveButton);

    container.replaceChild(buttonContainer, container.lastChild);
}

function loadImages(containerID, images, isSavePage) {
    const container = document.querySelector(containerID);
    const containerChildren = container.children;
    const movieContainers = new Array();

    let imageElements = new Array();
    let imageElement;

    images.forEach(element => {
        imageElement = document.createElement('img');
        imageElement.src = 'posters/' + element.imgName;
        imageElement.className = 'movie-img';
        imageElements.push(imageElement);
    });

    console.log(imageElements)

    for (let i = 0; i < containerChildren.length; i++) {
        if (containerChildren[i].id == 'movie') {
            movieContainers.push(containerChildren[i]);
        }
    }

    for (let i = 0; i < movieContainers.length; i++) {
        console.log(movieContainers[i].firstChild)
        if (movieContainers[i].firstChild == "") {
            movieContainers[i].replaceChild(imageElements[i], movieContainers[i].firstChild);
        } else {
            movieContainers[i].prepend(imageElements[i]);
        }
        createButtons(movieContainers[i], isSavePage);
    }
}

function getMovieNameFromButton(button) {
    const movie = String(button.parentElement.parentElement.children[0].src);
    return movie.substring(movie.lastIndexOf("/") + 1);
}

function updateLikeCount() {
    let movies = JSON.parse(localStorage.getItem('movies'));
    const movie = String(this.parentElement.parentElement.children[0].src);
    const imgName = movie.substring(movie.lastIndexOf("/") + 1);
    const index = imgName.substring(0, imgName.indexOf('.')) - 1;
    movies[index].likeCount += 1;
    this.children[0].textContent = movies[index].likeCount;
    localStorage.setItem('movies', JSON.stringify(movies));
}

function updateDislikeCount() {
    let movies = JSON.parse(localStorage.getItem('movies'));
    const movie = String(this.parentElement.parentElement.children[0].src);
    const imgName = movie.substring(movie.lastIndexOf("/") + 1);
    const index = imgName.substring(0, imgName.indexOf('.')) - 1;
    movies[index].dislikeCount += 1;
    this.children[0].textContent = movies[index].dislikeCount;
    localStorage.setItem('movies', JSON.stringify(movies));
}

function saveMovie() {
    const movies = JSON.parse(localStorage.getItem('movies'));
    let movieTitles = new Array();
    let savedMovies = JSON.parse(localStorage.getItem('saved'));

    if (savedMovies == null) {
        savedMovies = new Array()
    }

    for (let i = 0; i < savedMovies.length; i++) {
        movieTitles.push(savedMovies[i]['movie']['imgName'])
    }

    const movie = String(this.parentElement.parentElement.children[0].src);
    const imgName = movie.substring(movie.lastIndexOf("/") + 1);
    const index = imgName.substring(0, imgName.indexOf('.')) - 1;
    
    if (movieTitles.includes(imgName)) return;
    savedMovies.push({
        userName: localStorage.getItem('userName'),
        movie: movies[index]
    });
    localStorage.setItem('saved', JSON.stringify(savedMovies))
}

function createSavedContainer(savedMovies) {
    const container = document.querySelector("#saved-movies");
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
    return userMovies;
}

function loadSavedMovies() {
    const userName = getUserName();
    const savedMovies = JSON.parse(localStorage.getItem('saved'));
    const userMovies = getUserMovies(userName, savedMovies);
    createSavedContainer(userMovies);
    loadImages('#saved-movies', userMovies, true);
}

function unsaveMovie() {
    let savedMovies = JSON.parse(localStorage.getItem('saved'));
    const movieName = getMovieNameFromButton(this);
    removeMovieFromList(movieName, savedMovies);
    localStorage.setItem('saved', JSON.stringify(savedMovies));
    location.reload()
    console.log(savedMovies)
}

function getMovieIndex(movieName, movieList) {
    let movieIndex;
    movieList.forEach((element, index) => {
        if (element["movie"]["imgName"] == movieName) {
            movieIndex = index;
        };
    });
    return movieIndex;
}

function removeMovieFromList(movieName, movieList) {
    const index = getMovieIndex(movieName, movieList);
    movieList.splice(index, 1);
}