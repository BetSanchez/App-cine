import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from '../utils/firebase';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';

const PaymentScreen = ({ route, navigation }) => {
  const { cartId, userId } = route.params; 
  const [cartItems, setCartItems] = useState([]);
  const [cardNumber, setCardNumber] = useState('');
  const [total, setTotal] = useState(0);
  const [cardType, setCardType] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartDoc = doc(db, "carritos", cartId);
        const cartSnap = await getDoc(cartDoc);

        if (cartSnap.exists()) {
          const items = cartSnap.data().items || [];
          setCartItems(items);

      
          const totalAmount = items.reduce((sum, item) => sum + item.ticketCount * 50, 0);
          setTotal(totalAmount);
        } else {
          console.log("No se encontró el carrito.");
        }
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
      }
    };

    if (cartId) {
      fetchCart();
    } else {
      console.log("No se recibió un cartId válido.");
    }
  }, [cartId]);

  const detectCardType = (number) => {
    if (/^4/.test(number)) return "Visa";
    if (/^5[1-5]/.test(number)) return "MasterCard";
    if (/^3[47]/.test(number)) return "American Express";
    return "Desconocido";
  };

  const handlePayment = async () => {
    if (!cardNumber) {
      Alert.alert("Error", "Por favor ingresa un número de tarjeta.");
      return;
    }

    const detectedCardType = detectCardType(cardNumber);
    setCardType(detectedCardType);

    if (detectedCardType === "Desconocido") {
      Alert.alert("Error", "El número de tarjeta no es válido.");
      return;
    }

    try {
      const purchaseDoc = await addDoc(collection(db, "compras"), {
        userId,
        items: cartItems,
        total,
        cardType: detectedCardType,
        date: new Date().toISOString(),
      });

      
      await updateDoc(doc(db, "carritos", cartId), { items: [] });

      Alert.alert(
        "Compra Exitosa",
        `¡Gracias por tu compra!\nDetalles:\nTotal: $${total}\nTarjeta: ${detectedCardType}`,
        [
          {
            text: "OK",
          },
        ]
      );
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      Alert.alert("Error", "No se pudo procesar la compra. Inténtalo nuevamente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pago</Text>
      <Text style={styles.text}>Total: ${total}</Text>
      <View style={styles.card}>
        <Text style={styles.text}>Número de Tarjeta</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={(text) => {
            setCardNumber(text);
            setCardType(detectCardType(text));
          }}
        />
        {cardType && <Text style={styles.cardType}>Tipo de Tarjeta: {cardType}</Text>}
      </View>
      <Button title="Finalizar Compra" onPress={handlePayment} />
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: 18,
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginTop: 10,
  },
  cardType: {
    color: '#FFD700',
    fontSize: 16,
    marginTop: 10,
  },
});

export default PaymentScreen;
