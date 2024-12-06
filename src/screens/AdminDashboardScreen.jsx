import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

const AdminDashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('AdminMovie')}
        >
          <Icon name="movie-open" size={50} color="#FFFFFF" style={styles.cardIcon} />
          <Text style={styles.cardText}>Agregar Peliculas</Text>
        </TouchableOpacity>

      </View>
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
  title: {
  
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 60,
    marginBottom: 20,
    textAlign: 'center',
  },
  cardContainer: {
    marginTop:20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#6A1B9A', 
    width: 130,
    height: 150,
    borderRadius: 15,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cardIcon: {
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    padding:2,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default AdminDashboardScreen;
