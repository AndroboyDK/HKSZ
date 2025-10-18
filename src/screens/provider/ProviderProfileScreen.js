// src/screens/provider/ProviderProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import styles from '../../styles/styles';
import { useRole } from '../../context/RoleContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function ProviderProfileScreen() {
  const { toggleRole } = useRole();
  const { signOut, user } = useAuth();
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ spots: 0, rentals: 0, earnings: 0 });
  const [loading, setLoading] = useState(true);

  // 🔹 Load profile and provider stats
  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) setProfile(snap.data());

        // Fetch provider spots
        const spotsSnap = await getDocs(
          query(collection(db, 'spots'), where('providerUid', '==', user.uid))
        );
        const spotsCount = spotsSnap.size;

        // Fetch completed rentals
        const rentalsSnap = await getDocs(
          query(collection(db, 'rentals'), where('providerUid', '==', user.uid), where('status', '==', 'completed'))
        );
        const rentalsCount = rentalsSnap.size;
        const totalEarnings = rentalsSnap.docs.reduce(
          (sum, doc) => sum + (Number(doc.data().totalPrice) || 0),
          0
        );

        setStats({
          spots: spotsCount,
          rentals: rentalsCount,
          earnings: totalEarnings,
        });
      } catch (error) {
        console.log('Fejl ved hentning af profil/statistik:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1F4E46" />
        <Text style={styles.cardSubtitle}>Indlæser data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 32 }]}>
      <Text style={[styles.h1, { marginBottom: 16 }]}>Min udlejerprofil</Text>

      {/* 🔹 Provider Info Card */}
      {profile ? (
        <View style={styles.card}>
          <Text style={[styles.cardSubtitle, { fontWeight: '600', fontSize: 16 }]}>
            {profile.displayName || 'Udlejer'}
          </Text>
          <Text style={styles.cardSubtitle}>Email: {profile.email || '-'}</Text>
          <Text style={styles.cardSubtitle}>Telefon: {profile.phone || '-'}</Text>
        </View>
      ) : (
        <Text style={styles.cardSubtitle}>Ingen profil fundet.</Text>
      )}

      {/* 🔹 Stats Card */}
      <View style={[styles.card, { marginTop: 12 }]}>
        <Text style={[styles.cardTitle, { marginBottom: 8 }]}>Statistik</Text>
        <Text style={styles.cardSubtitle}>Antal pladser: {stats.spots}</Text>
        <Text style={styles.cardSubtitle}>Afsluttede udlejninger: {stats.rentals}</Text>
        <Text style={[styles.cardSubtitle, { fontWeight: '600' }]}>
          Samlet indtjening: {stats.earnings} kr
        </Text>
      </View>

      {/* 🔹 Action Buttons */}
      <View style={{ marginTop: 24 }}>

        <TouchableOpacity
          style={[styles.secondaryButton, { marginTop: 12 }]}
          onPress={() => navigation.navigate('ProviderPayout')}
        >
          <Ionicons name="card-outline" size={18} color="#1F4E46" style={{ marginRight: 8 }} />
          <Text style={styles.secondaryButtonText}>Udbetalingsoplysninger</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, { marginTop: 12 }]}
          onPress={() => navigation.navigate('ProviderMySpots')}
        >
          <Ionicons name="pin-outline" size={18} color="#1F4E46" style={{ marginRight: 8 }} />
          <Text style={styles.secondaryButtonText}>Administrér mine parkeringspladser</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('ProviderRentals')}
        >
          <Ionicons name="time-outline" size={18} color="#1F4E46" style={{ marginRight: 8 }} />
          <Text style={styles.secondaryButtonText}>Se tidligere udlejninger</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, { marginTop: 12 }]}
          onPress={toggleRole}
        >
          <Ionicons name="swap-horizontal" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.primaryButtonText}>Skift til kundevisning</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { marginTop: 12 }]}
          onPress={signOut}
        >
          <Ionicons name="log-out-outline" size={18} color="#1F4E46" style={{ marginRight: 8 }} />

          <Text style={styles.secondaryButtonText}>Log ud</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
