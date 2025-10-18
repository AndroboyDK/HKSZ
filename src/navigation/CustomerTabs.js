// CustomerTabs.js
// Redesignet navigationslinje med brandede farver og moderne ikonlogik

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';


// Skærme
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';
import CustomerRentalsScreen from '../screens/customer/CustomerRentalsScreen';
import FindParkingScreen from '../screens/customer/FindParkingScreen';
import CustomerActiveRentalScreen from '../screens/customer/CustomerActiveRentalScreen';

const Tab = createBottomTabNavigator();

export default function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#DCEFE2',
        },
        headerTitleAlign: 'center',
        headerTintColor: '#1F4E46',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#DCEFE2',
          height: 80, // ⬅️ slightly shorter
          paddingBottom: Platform.OS === 'ios' ? 10 : 6, // dynamic for notch/home indicator
          paddingTop: 4,
        },
        tabBarActiveTintColor: '#1F4E46', // 🌿 Deep brand green
        tabBarInactiveTintColor: '#9EB7AA', // Muted soft green
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },

        // Dynamisk ikonvalg baseret på route
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Find Parking':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Active Rental':
              iconName = focused ? 'car' : 'car-outline';
              break;
            case 'Previous Rentals':
              iconName = focused ? 'time' : 'time-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size + 2} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Find Parking"
        component={FindParkingScreen}
        options={{ title: 'Find Plads' }}
      />
      <Tab.Screen
        name="Active Rental"
        component={CustomerActiveRentalScreen}
        options={{ title: 'Aktiv Leje' }}
      />
      <Tab.Screen
        name="Previous Rentals"
        component={CustomerRentalsScreen}
        options={{ title: 'Tidligere Lejemål' }}
      />
      <Tab.Screen
        name="Profile"
        component={CustomerProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
}
