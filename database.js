const { MongoClient, MongoServerError } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const saved_collection = db.collection('saved');
const movie_collection = db.collection('movies');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

function getUser(email) {
    return userCollection.findOne({ email: email });
  }
  
function getUserByToken(token) {
return userCollection.findOne({ token: token });
}
  
async function createUser(email, password) {
// Hash the password before we insert it into the database
const passwordHash = await bcrypt.hash(password, 10);

const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
};
await userCollection.insertOne(user);

return user;
}

async function updateLikeCount(req_body) {
    const query = {_id: req_body.id};
    let options;
    if (req_body.type=='like-count') {
        options = { $inc: {like_count: 1}};
    } else {
        options = { $inc: {dislike_count: 1}};
    }
    const result = await movie_collection.updateOne(query, options);
    return result;
}

function getSavedMovies(user_name) {
    const query = { name: user_name };
    const cursor = saved_collection.find(query);
    return cursor.toArray();
}

async function addSavedMovie(movie) {
    try {
        const result = await saved_collection.insertOne(movie);
        return result;
    } catch (error) {
        if (error instanceof MongoServerError && error.code === 11000) {
            return { acknowledged: true, insertedId: null};
        } else {
            console.error(error);
        }
    }
}

async function deleteSavedMovie(movie) {
    try {
        const query = {_id: movie._id};
        const result = await saved_collection.deleteOne(query);
        return result;
    } catch (error) {
        if (error instanceof MongoServerError && error.code === 11000) {
            return { acknowledged: true, insertedId: null};
        } else {
            console.error(error);
        }
    }
}

function getTopMovies() {
    const options = {
        sort: { like_count: -1 },
        limit: 3
    };
    const cursor = movie_collection.find({}, options);
    return cursor.toArray();
}

function getRandomMovies() {
    const cursor = movie_collection.aggregate(
        [ { $sample: { size: 3 } } ]
    );
    return cursor.toArray();
}

module.exports = { 
    getUser, 
    getUserByToken,
    createUser,
    updateLikeCount, 
    addSavedMovie, 
    deleteSavedMovie, 
    getSavedMovies, 
    getTopMovies, 
    getRandomMovies };
