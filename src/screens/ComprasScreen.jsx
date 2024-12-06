import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../utils/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const ComprasScreen = ({ route }) => {
  const { userId } = route.params; 
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        if (!userId) return;

        const purchasesSnap = await getDocs(
          query(collection(db, "compras"), where("userId", "==", userId))
        );

        const purchasesData = purchasesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPurchases(purchasesData);
      } catch (error) {
        console.error("Error al cargar las compras:", error);
      }
    };

    fetchPurchases();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Compras</Text>
      <FlatList
        data={purchases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>Total: ${item.total}</Text>
            <Text style={styles.text}>Tipo de Tarjeta: {item.cardType}</Text>
            <Text style={styles.text}>Fecha: {new Date(item.date).toLocaleString()}</Text>
          </View>
        )}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
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
});

export default ComprasScreen;
