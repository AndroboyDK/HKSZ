import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';
import CustomerRentalsScreen from '../screens/customer/CustomerRentalsScreen';
import FindParkingScreen from '../screens/customer/FindParkingScreen';
import { Ionicons } from '@expo/vector-icons';



const Tab = createBottomTabNavigator();


export default function CustomerTabs() {
return (
<Tab.Navigator
  screenOptions={({ route }) => ({
    headerShown: true,
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'Find Parking') {
        iconName = focused ? 'car' : 'car-outline';
      } else if (route.name === 'Previous Rentals') {
        iconName = focused ? 'time' : 'time-outline';
      } else if (route.name === 'Profile') {
        iconName = focused ? 'person' : 'person-outline';
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#2f6fed',
    tabBarInactiveTintColor: 'gray',
  })}
>
  <Tab.Screen name="Find Parking" component={FindParkingScreen} />
  <Tab.Screen name="Previous Rentals" component={CustomerRentalsScreen} />
  <Tab.Screen name="Profile" component={CustomerProfileScreen} />
</Tab.Navigator>

);
}