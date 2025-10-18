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
          onPress={() => navigation.navigate('CustomerProfileDetails')}
        >
          <Text style={styles.secondaryButtonText}>Rediger profiloplysninger</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.primaryButton, { marginTop: 12 }]} onPress={toggleRole}>
          <Ionicons name="swap-horizontal" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.primaryButtonText}>Skift til Provider View</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.secondaryButton, { marginTop: 12 }]} onPress={signOut}>
          <Text style={styles.secondaryButtonText}>Log ud</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
