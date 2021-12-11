const fs = require('fs');
const axios = require('axios');

async function getMovies(page = 1, movies = []) {
  const { data } = await axios.get(`https://api.themoviedb.org/3/discover/tv?with_networks=213&api_key=ed3bf860adef0537783e4abee86d65af&append_to_response=images&page=${page}`);
  movies = movies.concat(data.results);
  if (page < data.total_pages) {
    return getMovies(page + 1, movies);
  }
  return movies;
}

getMovies()
  .then(async (movies) => {
    await fs.promises.writeFile('movies.json', JSON.stringify(movies, null, 2), 'utf-8');
    console.log('DONE!');
  });
