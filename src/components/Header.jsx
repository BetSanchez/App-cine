import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../utils/firebase'; 
import { collection, query, where, getDocs } from 'firebase/firestore';

const Header = ({ navigation, user, cartId }) => {
  const [cartIdState, setCartIdState] = useState(cartId);
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchCartId = async () => {
      if (user) {
        setUserId(user.uid); // Guardar el ID del usuario
        setIsAuthenticated(true); // Usuario está autenticado

        const carritosRef = collection(db, "carritos");
        const q = query(carritosRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const carrito = querySnapshot.docs[0];
          setCartIdState(carrito.id); // Guarda el id del carrito en el estado
        }
      } else {
        setIsAuthenticated(false); // Usuario no autenticado
      }
    };

    fetchCartId();
  }, [user]); // Ejecuta cada vez que cambia el usuario

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Raven Studios</Text>
      </View>

      
      <View style={styles.rightSection}>
        {user ? (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('UserProfile')}
            >
              <Icon name="account" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Cart', { cartId: cartIdState })}
            >
              <Icon name="cart" size={30} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Login</Text>
            <Icon name="account" size={30} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#212A3E',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    color: '#fff',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 5,
  },
  button: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    marginRight: 5,
  },
});

export default Header;
