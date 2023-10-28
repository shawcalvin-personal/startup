function loadPageDetails() {
    createImageArray();
    topMovies = getTopMovies(3);
    console.log(topMovies)
    loadImages("#top-movies", topMovies)
}

function createImageArray() {
    const imgArray = new Array();
    const likeCount = new Array();
    for (let i = 1; i < 57; i++) {
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

function getLikeCount(imgName) {
    return Math.floor(Math.random() * 100);
}

function getDislikeCount(imgName) {
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
    return movies;
}

function getTopMovies(count) {
    let storedMovies = JSON.parse(localStorage.getItem('movies'));
    let sorted = storedMovies.sort((a, b) => {
        return (a.likeCount - a.dislikeCount) - (b.likeCount - b.dislikeCount);
    }).reverse();
    
    return sorted.slice(0, count)
}

function createButtons(container) {
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
    saveButton.textContent = 'Save Movie';

    likeButton.appendChild(likeCount);
    likeButton.appendChild(likeImage);
    dislikeButton.appendChild(dislikeCount);
    dislikeButton.appendChild(dislikeImage);

    buttonContainer.appendChild(likeButton);
    buttonContainer.appendChild(dislikeButton);
    buttonContainer.appendChild(saveButton);

    container.replaceChild(buttonContainer, container.lastChild);
}

function appendImageToButton(button, image) {

}

function loadImages(containerID, images) {
    const container = document.querySelector(containerID);
    console.log(container);
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

    for (let i = 0; i < containerChildren.length; i++) {
        if (containerChildren[i].id == 'movie') {
            movieContainers.push(containerChildren[i]);
        }
    }

    for (let i = 0; i < movieContainers.length; i++) {
        movieContainers[i].replaceChild(imageElements[i], movieContainers[i].firstChild);
        createButtons(movieContainers[i]);
    }
}

function getMovieNameFromButton() {
    const movie = String(this.parentElement.parentElement.children[0].src);
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