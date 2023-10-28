function createImageArray() {
    const imgArray = new Array();
    for (let i = 1; i < 57; i++) {
        imgArray.push(i + '.png');
    };
    return imgArray;
}

function getRandomImage(imgArray) {
    const index = Math.floor(Math.random() * imgArray.length);
    image = imgArray[index];
    imgArray.splice(index, 1);
    return image;
}

function getRandomImages() {
    const path = 'posters/'
    let imgArray = createImageArray();
    const image1 = path + getRandomImage(imgArray);
    const image2 = path + getRandomImage(imgArray);
    const image3 = path + getRandomImage(imgArray);

    return [image1, image2, image3];
}

function createButtons(container) {
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

    const dislikeButton = document.createElement('button');
    dislikeButton.className = ('btn btn-dark');

    const saveButton = document.createElement('button');
    saveButton.className = ('save-button btn btn-dark');
    saveButton.textContent = 'Save Movie';

    likeButton.appendChild(likeImage);
    dislikeButton.appendChild(dislikeImage);

    buttonContainer.appendChild(likeButton);
    buttonContainer.appendChild(dislikeButton);
    buttonContainer.appendChild(saveButton);

    container.replaceChild(buttonContainer, container.lastChild);
}

function loadImages(containerID, images) {
    const container = document.querySelector(containerID);
    const containerChildren = container.children;
    const movieContainers = new Array();

    let imageElements = new Array();
    let imageElement;

    images.forEach(element => {
        imageElement = document.createElement('img');
        imageElement.src = element;
        imageElement.className = 'movie-img';
        imageElements.push(imageElement);
    });

    for (let i = 0; i < containerChildren.length; i++) {
        if (containerChildren[i].id == 'movie') {
            let newContainer = containerChildren[i];
            createButtons(newContainer);
            movieContainers.push(newContainer);
        }
    }

    for (let i = 0; i < movieContainers.length; i++) {
        movieContainers[i].replaceChild(imageElements[i], movieContainers[i].firstChild);
    }
}