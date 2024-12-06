
import React from 'react';
import { View, Text, Button } from 'react-native';

const AdminOrdersScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Admin: Manage Orders</Text>
      <Button title="View Food Orders" onPress={() => alert('Viewing Food Orders...')} />
      <Button title="Update Order Status" onPress={() => alert('Updating Order Status...')} />
    </View>
  );
};

export default AdminOrdersScreen;
