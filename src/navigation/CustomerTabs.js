import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';
import CustomerRentalsScreen from '../screens/customer/CustomerRentalsScreen';
import FindParkingScreen from '../screens/customer/FindParkingScreen';
import CustomerActiveRentalScreen from '../screens/customer/CustomerActiveRentalScreen';
import { Ionicons } from '@expo/vector-icons';



const Tab = createBottomTabNavigator();


export default function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {
          let icon = 'ellipse';
          if (route.name === 'Find Parking') icon = focused ? 'map' : 'map-outline';
          if (route.name === 'Active Rental') icon = focused ? 'car' : 'car-outline';
          if (route.name === 'Previous Rentals') icon = focused ? 'time' : 'time-outline';
          if (route.name === 'Profile') icon = focused ? 'person' : 'person-outline';
          return <Ionicons name={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2f6fed',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Find Parking" component={FindParkingScreen} />
      <Tab.Screen name="Active Rental" component={CustomerActiveRentalScreen} />
      <Tab.Screen name="Previous Rentals" component={CustomerRentalsScreen} />
      <Tab.Screen name="Profile" component={CustomerProfileScreen} />
    </Tab.Navigator>

  );
}