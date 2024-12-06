import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { searchMovies } from '../services/movies';

const AdminMovieScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');
    setMovies([]);
    if (!search.trim()) {
      setError('Please enter a movie title');
      return;
    }
    try {
      const results = await searchMovies({ title: search });
      if (results && results.length > 0) {
        setMovies(results.slice(0, 5)); 
      } else {
        setError('No movies found');
      }
    } catch (err) {
      setError('Error fetching movie data');
    }
  };

  const handleAddMovie = (movie) => {
    navigation.navigate('AddMovieDetails', { movie }); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Peliculas</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter movie title"
        placeholderTextColor="#B8A9C9"
        value={search}
        onChangeText={setSearch}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Buscar Peliculas</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <ScrollView>
        {movies.map((movie, index) => (
          <View key={index} style={styles.movieContainer}>
            <Image source={{ uri: movie.image }} style={styles.poster} />
            <Text style={styles.movieTitle}>{movie.title}</Text>
            <Text style={styles.movieYear}>Year: {movie.year}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleAddMovie(movie)}
            >
              <Text style={styles.buttonText}>Agregar Pelicula</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1A1A2E', 
  },
  title: {
    marginTop: 60,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#6A1B9A',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#FFFFFF',
    backgroundColor: '#2C2C54',
  },
  button: {
    backgroundColor: '#6A1B9A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: '#FF6F61',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  },
  movieContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#2C2C54',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  poster: {
    width: 150,
    height: 220,
    borderRadius: 10,
    marginBottom: 10,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  movieYear: {
    fontSize: 16,
    color: '#B8A9C9',
    textAlign: 'center',
  },
});

export default AdminMovieScreen;
