const { get } = require('http');

function createImageArray() {
    const fs = require('fs');
    const path = require('path');

    const imgArray = new Array();
    const filenames = fs.readdirSync('posters');

    filenames.forEach((file) => {
        imgArray.push(file);
    });

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

function loadRandomImages() {
    const images = getRandomImages();

    const image1 = document.createElement('img');
    const image2 = document.createElement('img');
    const image3 = document.createElement('img');

    image1.src = images[0];
    image1.className = 'movie-img'
    image2.src = images[1];
    image2.className = 'movie-img'
    image3.src = images[2];
    image3.className = 'movie-img'

    document.querySelector('#random-1').appendChild(image1);
}
