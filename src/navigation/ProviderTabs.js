// src/navigation/ProviderTabs.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Skærme
import ProviderProfileScreen from '../screens/provider/ProviderProfileScreen';
import RequestsScreen from '../screens/provider/RequestsScreen';
import ProviderCurrentRentalsScreen from '../screens/provider/ProviderCurrentRentalsScreen';
import ProviderMySpotsScreen from '../screens/provider/ProviderMySpotsScreen';

const Tab = createBottomTabNavigator();

export default function ProviderTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#DCEFE2' },
        headerTitleAlign: 'center',
        headerTintColor: '#1F4E46',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#DCEFE2',
          paddingBottom: 4,
          height: 80,
        },
        tabBarActiveTintColor: '#1F4E46',
        tabBarInactiveTintColor: '#9EB7AA',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          switch (route.name) {
            case 'Foresp.': iconName = focused ? 'chatbubbles' : 'chatbubbles-outline'; break;
            case 'Aktiv': iconName = focused ? 'car' : 'car-outline'; break;
            case 'Profil': iconName = focused ? 'person' : 'person-outline'; break;
            default: iconName = 'ellipse';
          }
          return <Ionicons name={iconName} size={30} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Foresp." component={RequestsScreen} options={{ title: 'Foresp.' }} />
      <Tab.Screen name="Aktiv" component={ProviderCurrentRentalsScreen} options={{ title: 'Aktiv' }} />
      <Tab.Screen name="Profil" component={ProviderProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>

    // <Tab.Navigator
    //   screenOptions={({ route }) => ({
    //     headerShown: true,
    //     headerStyle: {
    //       backgroundColor: '#FFFFFF',
    //       borderBottomWidth: 1,
    //       borderBottomColor: '#DCEFE2',
    //     },
    //     headerTitleAlign: 'center',
    //     headerTintColor: '#1F4E46',
    //     headerTitleStyle: { fontWeight: '700', fontSize: 18 },
    //     tabBarStyle: {
    //       backgroundColor: '#FFFFFF',
    //       borderTopWidth: 1,
    //       borderTopColor: '#DCEFE2',
    //       height: 70,
    //       paddingBottom: Platform.OS === 'ios' ? 10 : 6,
    //       paddingTop: 4,
    //     },
    //     tabBarActiveTintColor: '#1F4E46',
    //     tabBarInactiveTintColor: '#9EB7AA',
    //     tabBarLabelStyle: {
    //       fontSize: 12,
    //       fontWeight: '600',
    //       marginBottom: 4,
    //     },
    //     tabBarIcon: ({ focused, color, size }) => {
    //       let iconName;
    //       switch (route.name) {
    //         case 'Requests':
    //           iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
    //           break;
    //         case 'Current Rentals':
    //           iconName = focused ? 'car' : 'car-outline';
    //           break;
    //         case 'Profile':
    //           iconName = focused ? 'person' : 'person-outline';
    //           break;
    //         default:
    //           iconName = 'ellipse';
    //       }
    //       return <Ionicons name={iconName} size={size + 2} color={color} />;
    //     },
    //   })}
    // >
    //   <Tab.Screen
    //     name="Requests"
    //     component={RequestsScreen}
    //     options={{ title: 'Forespørgsler' }}
    //   />
    //   <Tab.Screen
    //     name="Current Rentals"
    //     component={ProviderCurrentRentalsScreen}
    //     options={{ title: 'Aktive udlejning' }}
    //   />
    //   <Tab.Screen
    //     name="Profile"
    //     component={ProviderProfileScreen}
    //     options={{ title: 'Profil' }}
    //   />
    // </Tab.Navigator>
  );
}
