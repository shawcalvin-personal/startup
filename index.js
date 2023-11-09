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