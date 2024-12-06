import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../utils/firebase'; 

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

     
      const carritosRef = collection(db, "carritos");
      const q = query(carritosRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      let carritoId;
      if (querySnapshot.empty) {
        
        const newCarrito = await addDoc(carritosRef, { userId: user.uid, items: [] });
        carritoId = newCarrito.id;
      } else {
        carritoId = querySnapshot.docs[0].id; 
      }

      
      Alert.alert('Bienvenido', 'Inicio de sesión exitoso.');
      navigation.navigate('MovieCatalog', { carritoId }); 
    } catch (error) {
      Alert.alert('Error', 'Credenciales incorrectas o problema al iniciar sesión.');
      console.error(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#AAA"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#AAA"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.secondaryButtonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1A1A2E', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', 
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#6A1B9A', 
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#212A3E', 
    color: '#FFF', 
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#6A1B9A',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent', 
    borderWidth: 1,
    borderColor: '#6A1B9A',
  },
  secondaryButtonText: {
    color: '#6A1B9A', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});

