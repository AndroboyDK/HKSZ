// ProviderTabs.js
// Redesignet navigationslinje med brandede farver og moderne ikonlogik

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Skærme
import ProviderProfileScreen from '../screens/provider/ProviderProfileScreen';
import ProviderRentalsScreen from '../screens/provider/ProviderRentalsScreen';
import RequestsScreen from '../screens/provider/RequestsScreen';
import ProviderCurrentRentalsScreen from '../screens/provider/ProviderCurrentRentalsScreen';
import ProviderMySpotsScreen from '../screens/provider/ProviderMySpotsScreen';

const Tab = createBottomTabNavigator();

export default function ProviderTabs() {
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
          height: 70,
          paddingBottom: Platform.OS === 'ios' ? 10 : 6,
          paddingTop: 4,
        },
        tabBarActiveTintColor: '#1F4E46', // 🌿 Deep brand green
        tabBarInactiveTintColor: '#9EB7AA', // Muted soft green
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Requests':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'My Spots':
              iconName = focused ? 'pin' : 'pin-outline';
              break;
            case 'Current Rentals':
              iconName = focused ? 'car' : 'car-outline';
              break;
            case 'Previous Rentals':
              iconName = focused ? 'time' : 'time-outline';
              break;
            case 'Profile':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size + 2} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Requests"
        component={RequestsScreen}
        options={{ title: 'Forespørgsler' }}
      />
      <Tab.Screen
        name="My Spots"
        component={ProviderMySpotsScreen}
        options={{ title: 'Mine Pladser' }}
      />
      <Tab.Screen
        name="Current Rentals"
        component={ProviderCurrentRentalsScreen}
        options={{ title: 'Aktive Lejemål' }}
      />
      <Tab.Screen
        name="Previous Rentals"
        component={ProviderRentalsScreen}
        options={{ title: 'Tidligere Lejemål' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProviderProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
}
