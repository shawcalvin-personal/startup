const express = require('express');
const app = express();

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.get('/movies', async (_req, res) => {
  const movies = await getAllMovies()
  res.send(movies);
});

// Get saved movies
apiRouter.get('/saved-movies', (_req, res) => {
  res.send(saved_movies);
});

// Add movie to saved movies
apiRouter.post('/save-movie', (req, res) => {
  const updated_saved_movies = addSavedMovies(req.body, saved_movies);
  res.send(updated_saved_movies);
});

apiRouter.delete('/save-movie', (req, res) => {
  const updated_saved_movies = deleteSavedMovies(req.body, saved_movies);
  res.send(updated_saved_movies);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

let movies = [];
async function getAllMovies() {
  if (movies.length != 0) {
    return movies;
  }

  for (let i = 1; i < 100; i++) {
    const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${i}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDI5MzFkZmZiNzJhNTU0Y2RhZmU1ODM0NTY5NmQwMCIsInN1YiI6IjY1NGM0YmY3ZDQ2NTM3MDBlMWE2NzcwMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.K8uZP4e99qMSl-5Dig92mdqlwl6Swf1W7lQmlcYAO30'
        }
    };

    fetch(url, options)
        .then(async res => await res.json())
        .then(json => {
            for (i = 0; i < json['results'].length; i++) {
                movies.push({
                    id: json['results'][i]['id'],
                    src: `https://image.tmdb.org/t/p/original${json['results'][i]['poster_path']}`,
                    like_count:  getLikeCount(json['results'][i]['id']),
                    dislike_count:  getDislikeCount(json['results'][i]['id'])
                });
            }
        })
        .then(() => {
            return movies;
        })
        .catch(err => console.error('error:' + err));
  }
}

function getLikeCount(id) { // temporary, will eventually be replaced by database data
  return Math.floor(Math.random() * 100);
}

function getDislikeCount(id) { // temporary, will eventually be replaced by database data
  return Math.floor(Math.random() * 100);
}

let saved_movies = [];
function addSavedMovies(new_movie, saved_movies) {
  if (JSON.stringify(saved_movies).includes(JSON.stringify(new_movie))) {return saved_movies};

  saved_movies.push(new_movie);
  return saved_movies;
}

function deleteSavedMovies(movie, saved_movies) {
  for (let i = 0; i < saved_movies.length; i++) {
    if (JSON.stringify(saved_movies[i]) == JSON.stringify(movie)) {
      saved_movies.splice(i, 1);
      return saved_movies;
    }
  }
}