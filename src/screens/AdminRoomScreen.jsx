
import React from 'react';
import { View, Text, Button } from 'react-native';

const AdminRoomScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Admin: Manage Rooms</Text>
      <Button title="View Room Layouts" onPress={() => alert('Viewing Room Layouts...')} />
      <Button title="Update Room" onPress={() => alert('Updating Room...')} />
    </View>
  );
};

export default AdminRoomScreen;
