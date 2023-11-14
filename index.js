const express = require('express');
const app = express();
const DB = require('./database.js');
const movie_config = require('./movieConfig.json');

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.get('/top-movies', async (_req, res) => {
  const movies = await DB.getTopMovies();
  res.send(movies);
});

apiRouter.get('/random-movies', async (_req, res) => {
  const movies = await DB.getRandomMovies();
  res.send(movies);
});

// Get saved movies
apiRouter.get('/saved-movies/:user_name', async (_req, res) => {
  const saved = await DB.getSavedMovies(_req.params.user_name);
  res.send(saved);
});

apiRouter.put('/movies', async (_req, res) => {
  const result = await DB.updateLikeCount(_req.body);
  res.send(result);
});

// Add movie to saved movies
apiRouter.post('/save-movie', async (req, res) => {
    DB.addSavedMovie(req.body);
    const saved = await DB.getSavedMovies(req.body.name);
    res.send(saved);

});

apiRouter.delete('/save-movie', async (req, res) => {
  await DB.deleteSavedMovie(req.body);
  const saved = await DB.getSavedMovies(req.body.name);
  res.send(saved);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});