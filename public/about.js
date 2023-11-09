function displayPicture() {
    const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=200';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDI5MzFkZmZiNzJhNTU0Y2RhZmU1ODM0NTY5NmQwMCIsInN1YiI6IjY1NGM0YmY3ZDQ2NTM3MDBlMWE2NzcwMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.K8uZP4e99qMSl-5Dig92mdqlwl6Swf1W7lQmlcYAO30'
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then(json => {
            console.log(json)
            const containerEl = document.querySelector('#picture');
            const filepath = json['poster_path'];

            const img_url = `https://image.tmdb.org/t/p/original/${filepath}`
            const imgEl = document.createElement('img');
            imgEl.setAttribute('src', img_url);
            containerEl.appendChild(imgEl);
        })
        .catch(err => console.error('error:' + err));
  }
  
  function displayQuote(data) {
    fetch('https://api.quotable.io/random')
      .then((response) => response.json())
      .then((data) => {
        const containerEl = document.querySelector('#quote');
  
        const quoteEl = document.createElement('p');
        quoteEl.classList.add('quote');
        const authorEl = document.createElement('p');
        authorEl.classList.add('author');
  
        quoteEl.textContent = data.content;
        authorEl.textContent = data.author;
  
        containerEl.appendChild(quoteEl);
        containerEl.appendChild(authorEl);
      });
  }
  
  displayPicture();
  displayQuote();
  