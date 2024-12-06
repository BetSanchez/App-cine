import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db, collection, addDoc } from '../utils/firebase';

const AddMovieDetails = ({ route, navigation }) => {
  const { movie } = route.params;
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [timeSlot, setTimeSlot] = useState('');
  const [hall, setHall] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleSave = async () => {
    if (!timeSlot || !hall) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    try {
      const movieRef = collection(db, 'cartelera');
      await addDoc(movieRef, {
        title: movie.title,
        image: movie.image,
        year: movie.year,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        days,
        timeSlot,
        hall,
      });
      Alert.alert('Éxito', 'Detalles de la película guardados correctamente.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      Alert.alert('Error', 'No se pudieron guardar los detalles de la película.');
    }
  };

  const timeSlots = [
    '07:00 AM - 09:00 AM',
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM',
    '05:00 PM - 07:00 PM',
    '07:00 PM - 09:00 PM',
    '09:00 PM - 11:00 PM',
  ];

  const halls = ['Sala 1', 'Sala 2', 'Sala 3', 'Sala 4','Sala 5','Sala 6','Sala 7'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{movie.title}</Text>
      <Image source={{ uri: movie.image }} style={styles.poster} />
      <Text style={styles.movieYear}>Year: {movie.year}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Fecha de Inicio:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text style={styles.dateText}>{startDate.toDateString()}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowStartDatePicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Fecha de Fin:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text style={styles.dateText}>{endDate.toDateString()}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowEndDatePicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Horario:</Text>
        <Picker
          selectedValue={timeSlot}
          onValueChange={(itemValue) => setTimeSlot(itemValue)}
          style={styles.picker}
        >
          {timeSlots.map((slot) => (
            <Picker.Item key={slot} label={slot} value={slot} />
          ))}
        </Picker>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Sala:</Text>
        <Picker
          selectedValue={hall}
          onValueChange={(itemValue) => setHall(itemValue)}
          style={styles.picker}
        >
          {halls.map((h) => (
            <Picker.Item key={h} label={h} value={h} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Agregar Pelicula</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#1A1A2E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    marginTop:30,
  },
  poster: {
    width: 150,
    height: 220,
    marginBottom: 15,
    alignSelf: 'center',
    borderRadius: 10,
  },
  movieYear: {
    fontSize: 16,
    color: '#BDBDBD',
    textAlign: 'center',
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    color: '#FFFFFF',
    backgroundColor: '#3E3E5E',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dateButton: {
    backgroundColor: '#3E3E5E',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop:10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddMovieDetails;
