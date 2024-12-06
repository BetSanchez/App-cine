import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import { db } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore'; 
import { Picker } from '@react-native-picker/picker'; 
import { collection, query, where, getDocs, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth } from '../utils/firebase'; 

const MovieDetailsScreen = ({ route, navigation }) => {
  const { movieId } = route.params; 
  const [movieDetails, setMovieDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [ticketCount, setTicketCount] = useState(1); 
  const [availableDates, setAvailableDates] = useState([]); 
const [idmov, setIdmove] = useState([]);
  
  const generateDates = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    
    while (currentDate <= end) {
      dates.push(currentDate.toLocaleDateString()); 
      currentDate.setDate(currentDate.getDate() + 1); 
    }

    return dates;
  };

  
  const fetchMovieDetails = async () => {
    const docRef = doc(db, "cartelera", movieId);  
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const movieData = docSnap.data();
      setMovieDetails(movieData);   
      setIdmove: movieId;
      
      if (movieData.startDate && movieData.endDate) {
        const dates = generateDates(movieData.startDate, movieData.endDate);
        setAvailableDates(dates);
      }
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  
  if (!movieDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const timeSlot = movieDetails.timeSlot || "Not available"; 
  const hall = movieDetails.hall || "Unknown Hall"; 

  const handleBuyTickets = async () => {
    if (!selectedDate) {
      Alert.alert("Selecciona una fecha", "Por favor selecciona una fecha para continuar.");
      return;
    }
  
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Inicia sesión", "Debes iniciar sesión para comprar boletos.");
      return;
    }
  
    try {
      const carritosRef = collection(db, "carritos");
      const q = query(carritosRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
  
      let carritoId;
      if (!querySnapshot.empty) {
        carritoId = querySnapshot.docs[0].id;
      } else {
        const newCarrito = await addDoc(carritosRef, { userId: user.uid, items: [] });
        carritoId = newCarrito.id;
      }
  
      const carritoDocRef = doc(db, "carritos", carritoId);
  
      if (!movieId || !movieDetails?.title || !selectedDate || !movieDetails?.timeSlot || !movieDetails?.hall || !ticketCount) {
        Alert.alert(
          "Error",
          `Faltan datos: 
          movieId: ${movieId}, 
          movieTitle: ${movieDetails?.title}, 
          selectedDate: ${selectedDate}, 
          timeSlot: ${movieDetails?.timeSlot}, 
          hall: ${movieDetails?.hall}, 
          ticketCount: ${ticketCount}`
        );
        return;
      }
      
  
      const item = {
        movieId,
        movieTitle: movieDetails.title,
        date: selectedDate,
        timeSlot: movieDetails.timeSlot,
        hall: movieDetails.hall,
        ticketCount: ticketCount
      };
  
      await updateDoc(carritoDocRef, { items: arrayUnion(item) });
  
      Alert.alert("Compra realizada", "Los boletos han sido añadidos al carrito.");
      navigation.navigate("Cart", { carritoId });
    } catch (error) {
      console.error("Error al añadir boletos al carrito:", error);
      Alert.alert("Error", "No se pudieron añadir los boletos al carrito.");
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.movieTitle}>{movieDetails.title}</Text>
      <Image source={{ uri: movieDetails.image }} style={styles.poster} />
      
      <Text style={styles.sectionTitle}>Select Date</Text>
      <Picker
        selectedValue={selectedDate}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedDate(itemValue)}
      >
        {availableDates.length > 0 ? (
          availableDates.map((date, index) => (
            <Picker.Item key={index} label={date} value={date} />
          ))
        ) : (
          <Picker.Item label="No dates available" value="" />
        )}
      </Picker>

      {selectedDate ? (
        <>
          <Text style={styles.sectionTitle}>Time Slot</Text>
          <Text style={styles.detailsText}>{timeSlot}</Text>

          <Text style={styles.sectionTitle}>Hall</Text>
          <Text style={styles.detailsText}>{hall}</Text>

          <Text style={styles.sectionTitle}>Ticket Quantity</Text>
          <Picker
            selectedValue={ticketCount}
            style={styles.picker}
            onValueChange={(itemValue) => setTicketCount(itemValue)}
          >
            {[...Array(10).keys()].map((num) => (
              <Picker.Item key={num} label={`${num + 1}`} value={num + 1} />
            ))}
          </Picker>

          <Button
            title="Buy Tickets"
            color="#6A1B9A"
            onPress={handleBuyTickets}
          />
        </>
      ) : (
        <Text style={styles.noDataText}>No dates available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    padding: 20,
    alignItems: 'center',
  },
  movieTitle: {
    fontSize: 24,
    marginTop: 50,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  poster: {
    width: 180,
    height: 270,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#6A1B9A',
    marginBottom: 10,
    textAlign: 'center',
  },
  detailsText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  noDataText: {
    fontSize: 16,
    color: '#FF0000', 
    marginBottom: 5,
    textAlign: 'center',
  },
  picker: {
    width: '70%',
    height: 50,
    color: '#FFFFFF',
    backgroundColor: '#522b6b',
    borderRadius: 5,
    marginBottom: 15,
    alignSelf: 'center',
  },
});

export default MovieDetailsScreen;
