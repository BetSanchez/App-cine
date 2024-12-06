const API_KEY = '4287ad07'

export const searchMovies = async ({ title }) => { 
    if (title === '') return null;
  
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${title}`);
      const json = await response.json();
  
      const movies = json.Search;
  
      return movies?.map(movie => ({
        id: movie.imdbID,
        title: movie.Title,
        year: movie.Year,
        image: movie.Poster,
      }));
    } catch (e) {
      throw new Error('Error searching movies');
    }
  };
  