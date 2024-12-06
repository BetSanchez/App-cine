
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import MovieCatalogScreen from '../screens/MovieCatalogScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminMovieScreen from '../screens/AdminMovieScreen';
import AdminRoomScreen from '../screens/AdminRoomScreen';
import AdminOrdersScreen from '../screens/AdminOrdersScreen';
import RegisterForm from '../screens/RegisterForm';
import CartScreen from '../screens/CartScreen';
import AddMovieDetails from '../screens/AddMovieDetails';
import PaymentScreen from '../screens/PaymentScreen';
import ComprasScreen from '../screens/ComprasScreen';
 
const Stack = createStackNavigator();
 
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MovieCatalog">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="MovieCatalog" component={MovieCatalogScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdminMovie" component={AdminMovieScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdminRoom" component={AdminRoomScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AdminOrders" component={AdminOrdersScreen}options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterForm} options={{ headerShown: false }} />
        <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AddMovieDetails" component={AddMovieDetails} options={{ headerShown: false }}/>
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ComprasScreen" component={ComprasScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
 
export default Navigation;