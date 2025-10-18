// src/screens/customer/CustomerProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../../styles/styles';
import { useRole } from '../../context/RoleContext';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function CustomerProfileScreen() {
  const { toggleRole } = useRole();
  const { signOut, user } = useAuth();
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setProfile(snap.data());
      } catch (error) {
        console.log('Fejl ved hentning af profil:', error);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 32 }]}>
      <Text style={[styles.h1, { marginBottom: 16 }]}>Min profil</Text>

      {/* 🔹 Profilkort */}
      {profile ? (
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.cardSubtitle, { fontWeight: '600', fontSize: 16 }]}>
              {profile.displayName || '-'}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('CustomerProfileDetails')}
            >
              <Ionicons name="create-outline" size={20} color="#1F4E46" />
            </TouchableOpacity>
          </View>

          <Text style={styles.cardSubtitle}>Email: {profile.email || '-'}</Text>
          <Text style={styles.cardSubtitle}>Telefon: {profile.phone || '-'}</Text>
          <Text style={styles.cardSubtitle}>Bilmodel: {profile.carModel || '-'}</Text>
          <Text style={styles.cardSubtitle}>Nummerplade: {profile.licensePlate || '-'}</Text>
        </View>
      ) : (
        <Text style={styles.cardSubtitle}>Indlæser profil...</Text>
      )}
      {/* 🔹 Historik-knap */}
      <TouchableOpacity
        style={[styles.secondaryButton, { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
        onPress={() => navigation.navigate('CustomerRentals')}
      >
        <Ionicons name="time-outline" size={18} color="#1F4E46" style={{ marginRight: 8 }} />
        <Text style={styles.secondaryButtonText}>Se tidligere udlejninger</Text>
      </TouchableOpacity>

      {/* 🔹 Skift rolle */}
      <TouchableOpacity
        style={[styles.primaryButton, { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
        onPress={toggleRole}
      >
        <Ionicons name="swap-horizontal" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.primaryButtonText}>Skift til Provider View</Text>
      </TouchableOpacity>

      {/* 🔹 Log ud */}
      <TouchableOpacity
        style={[styles.secondaryButton, { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
        onPress={signOut}
      >
        <Ionicons name="log-out-outline" size={18} color="#1F4E46" style={{ marginRight: 8 }} />
        <Text style={styles.secondaryButtonText}>Log ud</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
