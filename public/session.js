// Event messages
const MovieLikeEvent = 'movieDislike';
const MovieDislikeEvent = 'movieLike';
const MovieSaveEvent = 'movieSave';

class Session {
    constructor() {
        // userNameEl.textContent = this.getUserName();
        this.configureWebSocket()
    }

    async loadImages(container_id, images, is_save_page) {
        let container = document.querySelector(container_id);
        let movie_section = new MovieSection(images, is_save_page);
        if (container.lastChild.id == 'movie') {
            this.removeMovieChildren(container);
        }
        for (let i = 0; i < movie_section.movies.length; i++) {
            container.appendChild(movie_section.movies[i].container);
        }
        ;
    }
    
    async loadMainPageDetails() {
        this.loadTopMovies();
        this.loadRandomMovies();
    }
    
    async loadTopMovies() {
        let top_movies = [];
        try {
            const response = await fetch('api/top-movies');
            top_movies = await response.json()
            localStorage.setItem('top-movies', JSON.stringify(top_movies));
    
        } catch {
            const moviesText = localStorage.getItem('top-movies');
            if (moviesText) {
                top_movies = JSON.parse(moviesText);
            }
        }
        this.loadImages('#top-movies', top_movies, false);
    }
    
    async loadRandomMovies() {
        let random_movies = [];
        try {
            const response = await fetch('api/random-movies');
            random_movies = await response.json()
    
            localStorage.setItem('random-movies', JSON.stringify(top_movies));
    
        } catch {
            const moviesText = localStorage.getItem('random-movies');
            if (moviesText) {
                random_movies = JSON.parse(moviesText);
            }
        }
    
        this.loadImages('#random-movies', random_movies, false);
    }
    
    async loadSavedMovies() {
        let saved_movies = [];
        const user_name = this.getUserName();
        try {
            const response = await fetch('api/saved-movies/' + user_name);
            saved_movies = await response.json()
    
            localStorage.setItem('saved-movies', JSON.stringify(saved_movies));
    
        } catch {
            const moviesText = localStorage.getItem('saved-movies');
            if (moviesText) {
                saved_movies = JSON.parse(moviesText);
            }
        }
    
        this.loadImages('#saved-movies', saved_movies, true);
    }
    
    getUserName() {
        return localStorage.getItem('userName');
    }
    
    async getMoviesByID(id_list) {
        let movie;
        let movies = [];
        let stored_movies = [];
        const response = await fetch('api/movies');
        stored_movies = await response.json();
        stored_movies = [... new Set(stored_movies)];
        for (let i = 0; i < id_list.length; i++) {
            movies.push(stored_movies.filter(movie => movie['id'] == id_list[i])[0]);
        }
        return movies
    }
    
    removeMovieChildren(container) {
        let children = container.children;
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i].id == 'movie') {
                container.removeChild(children[i])
            }
        }
    }

    configureWebSocket() {
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
        this.socket.onopen = (event) => {
          this.displayMsg('system', 'session', 'connected');
        };
        this.socket.onclose = (event) => {
          this.displayMsg('system', 'session', 'disconnected');
        };
        this.socket.onmessage = async (event) => {
          const msg = JSON.parse(await event.data.text());
          console.log(msg.from)
          if (msg.type === MovieLikeEvent) {
            this.displayMsg('user', msg.from, `liked ${msg.value}`);
          } else if (msg.type === MovieDislikeEvent) {
            this.displayMsg('user', msg.from, `disliked ${msg.value}`);
          } else if (msg.type === MovieSaveEvent) {
            this.displayMsg('user', msg.from, `saved ${msg.value}`);
          }
        };
      }
    
    displayMsg(cls, from, msg) {
        const chatText = document.querySelector('#user-messages');
        chatText.innerHTML =
          `<div class="event"><span class="${cls}-event">${from}</span> ${msg}</div>` + chatText.innerHTML;
    }
    
    broadcastEvent(from, type, value) {
        const event = {
          from: from,
          type: type,
          value: value,
        };
        console.log(event)
        this.socket.send(JSON.stringify(event));
    }
}

let session = new Session()




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
    constructor(image, is_save_page) {
        this.image = image
        this.is_save_page = is_save_page
        this.buttons = new ButtonContainer(image, this.is_save_page)
        this.container = this.createContainer();
    }

    createImage(image) {
        let movie_image = document.createElement('img');
        movie_image.src = this.image['src'];
        movie_image.className = 'movie-img';

        return movie_image;
    }

    createContainer() {
        const poster = this.createImage(this.image);
        let container = document.createElement('div');
        container.className = 'movie-container';
        container.id = 'movie';

        container.appendChild(poster);
        container.appendChild(this.buttons.container);
        

        return container;
    }
}

class ButtonContainer {
    constructor(image, is_save_page) {
        this.is_save_page = is_save_page;
        this.like_button = new LikeButton(image);
        this.dislike_button = new DislikeButton(image);
        this.save_button = new SaveButton(image, is_save_page);
        this.container = this.createContainer();
    }

    createContainer() {
        let container = document.createElement('div');
        container.className = 'button-container';

        if (!this.is_save_page) {
            container.appendChild(this.like_button.button);
            container.appendChild(this.dislike_button.button);
        }
        container.appendChild(this.save_button.button);

        return container;
    }
}

class Button {
    constructor(image) {
        this.image = image;
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
        this.button = this.createButton();
    }

    createButton() {
        let button = document.createElement('button');
        button.className = ('btn btn-dark');
        button.name = JSON.stringify(this.image);

        let button_image = this.createButtonImage('images/thumb-up.png');
        button.onclick = this.updateLikeCount
        button.id = 'like-button-' + this.image['_id']

        let like_count = document.createElement('span');
        like_count.className = 'like-count'
        like_count.textContent = this.image['like_count'];
        like_count.id = 'like-count-' + this.image['_id']

        button.appendChild(like_count);
        button.appendChild(button_image);

        return button;
    }

    async updateLikeCount() {
        const details = JSON.parse(this.name);
        const user_name = localStorage.getItem('userName');
        const button = document.getElementById('like-button-' + details['_id']);
        const other = document.getElementById('dislike-button-' + details['_id']);
        const like_count = document.getElementById('like-count-' + details['_id']);

        button.disabled = true;
        other.disabled = true;
        like_count.textContent = parseInt(like_count.textContent) + 1;

        session.broadcastEvent(user_name, MovieLikeEvent, details['title'])

        const response = await fetch('api/movies', {
            method: 'PUT',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({ id: details['_id'],
                                    type: 'like-count'})
        });
    }
}

class DislikeButton extends Button {
    constructor(image_name) {
        super(image_name);
        this.button = this.createButton();
    }

    createButton() {
        let button = document.createElement('button');
        button.className = ('btn btn-dark');
        button.name = JSON.stringify(this.image);

        let button_image = this.createButtonImage('images/thumb-down.png');
        button.onclick = this.updateDislikeCount
        button.id = 'dislike-button-' + this.image['_id']

        let dislike_count = document.createElement('span');
        dislike_count.className = 'like-count'
        dislike_count.textContent = this.image['dislike_count'];
        dislike_count.id = 'dislike-count-' + this.image['_id']

        button.appendChild(dislike_count);
        button.appendChild(button_image);

        return button;
    }

    async updateDislikeCount() {
        const details = JSON.parse(this.name);
        const button = document.getElementById('dislike-button-' + details['_id']);
        const other = document.getElementById('like-button-' + details['_id']);
        const user_name = localStorage.getItem('userName');
        const dislike_count = document.getElementById('dislike-count-' + details['_id']);

        button.disabled = true;
        other.disabled = true;
        dislike_count.textContent = parseInt(dislike_count.textContent) + 1;

        const response = await fetch('api/movies', {
            method: 'PUT',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({ id: details['_id'],
                                    type: 'dislike-count'})
        });

        session.broadcastEvent(user_name, MovieDislikeEvent, details['title'])
    }
}

class SaveButton extends Button {
    constructor(image, is_save_page) {
        super(image);
        this.is_save_page = is_save_page;
        this.button = this.createButton();
    }

    createButton() {
        let button = document.createElement('button');
        button.className = ('save-button btn btn-dark');
        button.name = JSON.stringify(this.image);

        if (this.is_save_page) {
            button.textContent = 'Remove Movie';
            button.onclick = this.unsaveMovie
            button.id = 'unsave-button-' + this.image['_id']
        } else {
            button.textContent = 'Save Movie';
            button.onclick = this.saveMovie
            button.id = 'save-button-' + this.image['_id']
        }

        return button;
    }

    async saveMovie() {
        const details = JSON.parse(this.name);
        const button_id = 'save-button-' + details['_id'];

        document.getElementById(button_id).disabled = true;

        const user_name = localStorage.getItem('userName');
        const saved_movie = {name: user_name, _id: user_name + "-" + details['_id'], src: details['src']}
            const response = await fetch('api/save-movie', {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(saved_movie)
            });
            const saved_movies = await response.json();
            localStorage.setItem('saved-movies', saved_movies);
            session.broadcastEvent(user_name, MovieSaveEvent, details['title'])
    }

    async unsaveMovie() {
        const details = JSON.parse(this.name);
        const button_id = 'unsave-button-' + details['_id'];
        
        document.getElementById(button_id).disabled = true;

        const user_name = localStorage.getItem('userName');
        const unsaved_movie = {name: user_name, _id: details['_id'], src: details['src']}
        try {
            const response = await fetch('api/save-movie', {
                method: 'DELETE',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(unsaved_movie)
            });
            const saved_movies = await response.json();
            localStorage.setItem('saved-movies', saved_movies);
            loadImages('#saved-movies', saved_movies, true);
        } catch {
            let saved_movies = [];
            saved_movies = localStorage.getItem('saved-movies');
            for (let i = 0; i < saved_movies.length; i++) {
                if (JSON.stringify(saved_movies[i]) == JSON.stringify(movie)) {
                  saved_movies.splice(i, 1);
                  localStorage.setItem('saved-movies', saved_movies);
                  loadImages('#saved-movies', saved_movies, true);
                }
              }
        }
        
    }
}
