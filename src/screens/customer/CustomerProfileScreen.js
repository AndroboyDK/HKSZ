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

  // 🔹 Hent data fra Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setProfile(snap.data());
      } catch {
        console.log('Fejl ved hentning af profil');
      }
    };
    if (user) fetchProfile();
  }, [user]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Profil</Text>

      {/* 🔹 Viser brugerdata hvis de findes */}
      {profile && (
        <View style={styles.card}>
          <Text style={styles.cardSubtitle}>Navn: {profile.displayName || '-'}</Text>
          <Text style={styles.cardSubtitle}>Telefon: {profile.phone || '-'}</Text>
          <Text style={styles.cardSubtitle}>Bil: {profile.vehicleReg || '-'}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.h2}>Valgmuligheder</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Profiloplysninger</Text>
          <Text style={styles.listItem}>• Biloplysninger</Text>
          <Text style={styles.listItem}>• Betalingsoplysninger</Text>
        </View>
      </View>

      {/* 🔹 Knap til at redigere oplysninger */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('CustomerProfileDetails')}
      >
        <Text style={styles.secondaryButtonText}>Rediger profiloplysninger</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryButton} onPress={toggleRole}>
        <Ionicons name="swap-horizontal" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.primaryButtonText}>Skift til Provider View</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={signOut}>
        <Text style={styles.secondaryButtonText}>Log ud</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
