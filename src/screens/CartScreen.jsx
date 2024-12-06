import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../utils/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [cartInfo, setCartInfo] = useState(null);

  useEffect(() => {
    const fetchCartForUser = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setUserId(user.uid);

          const carritosRef = collection(db, 'carritos');
          const q = query(carritosRef, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const carritoDoc = querySnapshot.docs[0];
            const carritoData = carritoDoc.data();
            setCartInfo({ id: carritoDoc.id, ...carritoData });
            setCartItems(carritoData.items || []);
          }
        }
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
      }
    };

    fetchCartForUser();
  }, []);

  const updateCartItems = async (updatedItems) => {
    if (cartInfo?.id) {
      try {
        const cartRef = doc(db, 'carritos', cartInfo.id);
        await updateDoc(cartRef, { items: updatedItems });
        setCartItems(updatedItems);
      } catch (error) {
        console.error('Error al actualizar el carrito:', error);
      }
    }
  };

  const handleIncreaseTickets = (index) => {
    const updatedItems = [...cartItems];
    updatedItems[index].ticketCount += 1;
    updateCartItems(updatedItems);
  };

  const handleDecreaseTickets = (index) => {
    const updatedItems = [...cartItems];
    if (updatedItems[index].ticketCount > 1) {
      updatedItems[index].ticketCount -= 1;
      updateCartItems(updatedItems);
    }
  };

  const handleDeleteMovie = (index) => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que deseas eliminar esta película del carrito?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            const updatedItems = [...cartItems];
            updatedItems.splice(index, 1);
            updateCartItems(updatedItems);
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Películas en el Carrito</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.text}>Título: {item.movieTitle}</Text>
            <Text style={styles.text}>Fecha: {item.date}</Text>
            <Text style={styles.text}>Horario: {item.timeSlot}</Text>
            <Text style={styles.text}>Boletos: {item.ticketCount}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => handleIncreaseTickets(index)}>
                <Icon name="plus" size={25} color="#FFF" style={styles.icon} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDecreaseTickets(index)}>
                <Icon name="minus" size={25} color="#FFF" style={styles.icon} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDeleteMovie(index)}>
                <Icon name="trash" size={25} color="red" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Button  
        title="Finalizar Compra"
        onPress={() => {
          if (cartInfo?.id) {
            navigation.navigate('PaymentScreen', { cartId: cartInfo?.id, userId });
          }
        }}
        disabled={!cartInfo?.id}
      />
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
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    marginTop:30,
  },
  item: {
    backgroundColor: '#333',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  text: {
    color: '#FFF',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default CartScreen;


