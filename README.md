# Movie Finder

## Product Overview
How often do you find yourself purusing through Netflix with no clue what to watch? Movie Finder makes it easy to discover something new to watch. Request a random movie suggestion, or browse the top rated movies from other Movie Finder users. After you watch a movie, you can upvote it or downvote it to help others enjoy (or avoid) the same movies as you.

## Design
### User Login  
![login](./mock-images/login.png)  

### Movie Finder
![movie-finder](./mock-images/movie-finder.png)

### Saved Movies
![my-movies](./mock-images/my-movies.png)

## Key Features  
- Secure login over HTTPS
- Ability to upvote and downvote movies
- Today's top movies displayed in real time
- Movie upvotes and downvotes upvoted in real time
- Ability to save movies to user profile
- Ability to retrieve and display random movies from database
- User's saved movies are persistently stored in a database

## Technologies
I will use the technologies in the following ways:  

**HTML** - Uses HTML for basic structuring and organization across three HTML pages. One HTML page for user login. One page for movie suggestion generation. One page for saved movies.  
 
**CSS** - Uses CSS for basic styling and animation for all display sizes. Create accessible and appealing designs.  

**JavaScript** - Uses JavaScript for the following:
- User login and authentication.  
- Retrieving random movies.  
- Retrieving top rated movies.  
- Submitting user vote of a movie.  

**Authentication** - Users will create an account and login. Within their account, they will have access to the movies that they have reviewed. They can also get random movie suggestions and view top rated movies.  

**Database Data** - Stores a user's reviewed movies and a list of available movies.  

**WebSocket Data** - Top rated movies are broadcasted as users upvote and downvote movies. All movie upvotes and downvotes are updated in real time.  
