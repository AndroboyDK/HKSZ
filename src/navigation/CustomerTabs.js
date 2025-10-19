// src/navigation/CustomerTabs.js

import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import KundeProfilSkærm from '../screens/customer/CustomerProfileScreen';
import FindParkeringSkærm from '../screens/customer/K_FindParkingScreen';
import AktivUdlejningSkærm from '../screens/customer/CustomerActiveRentalScreen';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

export default function CustomerTabs() {
  const { user } = useAuth();
  const [harAktivUdlejning, setHarAktivUdlejning] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'rentals'),
      where('customerUid', '==', user.uid),
      where('status', '==', 'active')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHarAktivUdlejning(!snapshot.empty);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {
          let ikon = 'ellipse';
          if (route.name === 'Find parkering') ikon = focused ? 'map' : 'map-outline';
          if (route.name === 'Aktiv parkering') ikon = focused ? 'car' : 'car-outline';
          if (route.name === 'Profil') ikon = focused ? 'person' : 'person-outline';
          return <Ionicons name={ikon} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1F4E46',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 4,
          height: 60,
          backgroundColor: '#F4FAF6',
        },
        headerStyle: { backgroundColor: '#F4FAF6' },
        headerTitleStyle: { color: '#1F4E46', fontWeight: '600' },
      })}
    >
      {!harAktivUdlejning ? (
        <Tab.Screen
          name="Find parkering"
          component={FindParkeringSkærm}
          options={{ title: 'Find parkering' }}
        />
      ) : (
        <Tab.Screen
          name="Aktiv parkering"
          component={AktivUdlejningSkærm}
          options={{ title: 'Aktiv parkering' }}
        />
      )}

      <Tab.Screen
        name="Profil"
        component={KundeProfilSkærm}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
}
