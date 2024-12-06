import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { db, auth } from '../utils/firebase'; 
import { collection, getDocs } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import Header from '../components/Header';

const MovieCatalogScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [cartId, setCartId] = useState(null);

  const fetchMovies = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "cartelera"));
      const moviesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMovies(moviesData);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch movies.");
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const unsubscribeFocus = navigation.addListener('focus', fetchMovies);

    return () => {
      unsubscribeAuth();
      unsubscribeFocus();
    };
  }, [navigation]);

  useEffect(() => {
    const fetchCartId = async () => {
      if (user) {
        const carritosRef = collection(db, "carritos");
        const q = query(carritosRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const carrito = querySnapshot.docs[0];
          setCartId(carrito.id);
        }
      }
    };

    fetchCartId();
  }, [user]);

  return (
    <View style={styles.container}>
      <Header navigation={navigation} user={user} cartId={cartId} />
      <Text style={styles.catalogTitle}>Movie Catalog</Text>
      <FlatList
        data={movies}
        numColumns={2} 
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieItem}
            onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
          >
            <Image source={{ uri: item.image }} style={styles.poster} />
            <Text style={styles.movieTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 10,
  },
  catalogTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    marginVertical: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  movieItem: {
    backgroundColor: '#212A3E',
    padding: 10,
    margin: 5,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1, 
  },
  movieTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
    textAlign: 'center',
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  flatListContent: {
    paddingBottom: 10,
  },
});

export default MovieCatalogScreen;
