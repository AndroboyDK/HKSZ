import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import styles from '../../styles/styles';
import { useRole } from '../../context/RoleContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { seedRequestsForProvider, seedSpotsForProvider } from '../../data/seed';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function ProviderProfileScreen() {
  const { toggleRole } = useRole();
  const { signOut, user } = useAuth();
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);

  // 🔹 Hent data fra Firestore
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

  const handleSeed = async () => {
    try {
      await seedRequestsForProvider({ providerUid: user.uid });
      Alert.alert('Demo data', 'Eksempel-forespørgsler oprettet.');
    } catch (e) {
      Alert.alert('Fejl', e.message || 'Kunne ikke oprette demo requests.');
    }
  };

  const handleSeedSpots = async () => {
    try {
      await seedSpotsForProvider({ providerUid: user.uid });
      Alert.alert('Demo data', 'Eksempel-parkeringspladser oprettet.');
    } catch (e) {
      Alert.alert('Fejl', e.message || 'Kunne ikke oprette demo spots.');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 32 }]}>
      <Text style={[styles.h1, { marginBottom: 16 }]}>Min udlejerprofil</Text>

      {/* 🔹 Profilkort */}
      {profile ? (
        <View style={styles.card}>
          <Text style={styles.cardSubtitle}>Navn: {profile.displayName || '-'}</Text>
          <Text style={styles.cardSubtitle}>Email: {profile.email || '-'}</Text>
          <Text style={styles.cardSubtitle}>Telefon: {profile.phone || '-'}</Text>
          <Text style={styles.cardSubtitle}>Bilmodel: {profile.carModel || '-'}</Text>
          <Text style={styles.cardSubtitle}>Nummerplade: {profile.licensePlate || '-'}</Text>
        </View>
      ) : (
        <Text style={styles.cardSubtitle}>Indlæser profil...</Text>
      )}

      {/* 🔹 Knapper */}
      <View style={{ marginTop: 24 }}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('ProviderPayout')}
        >
          <Ionicons name="card-outline" size={18} color="#1F4E46" style={{ marginRight: 8 }} />
          <Text style={styles.secondaryButtonText}>Udbetalingsoplysninger</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.primaryButton, { marginTop: 12 }]} onPress={toggleRole}>
          <Ionicons name="swap-horizontal" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.primaryButtonText}>Skift til Customer View</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.secondaryButton, { marginTop: 12 }]} onPress={handleSeed}>
          <Text style={styles.secondaryButtonText}>Opret demo requests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.secondaryButton, { marginTop: 12 }]} onPress={handleSeedSpots}>
          <Text style={styles.secondaryButtonText}>Opret demo spots</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.secondaryButton, { marginTop: 12 }]} onPress={signOut}>
          <Text style={styles.secondaryButtonText}>Log ud</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
