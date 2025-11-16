import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import styles from '../../styles/styles';
import { useRole } from '../../context/RoleContext';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../lib/firebase';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

export default function CustomerProfileScreen() {
  const { toggleRole } = useRole();
  const { signOut, user } = useAuth();
  const navigation = useNavigation();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ rentals: 0, spent: 0 });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // 🔹 Profil
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setProfile(snap.data());

        // 🔹 Stats (afsluttede lejemål som kunde)
        const rentalsSnap = await getDocs(
          query(
            collection(db, 'rentals'),
            where('customerUid', '==', user.uid),
            where('status', '==', 'completed')
          )
        );

        const rentalsCount = rentalsSnap.size;
        const totalSpent = rentalsSnap.docs.reduce(
          (sum, d) => sum + (Number(d.data().totalPrice) || 0),
          0
        );

        setStats({
          rentals: rentalsCount,
          spent: totalSpent,
        });

        // 🔹 Seneste anmeldelser af kunden
        const reviewsSnap = await getDocs(
          query(
            collection(db, 'reviews'),
            where('toUid', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(3)
          )
        );

        const revs = reviewsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setReviews(revs);
      } catch (error) {
        console.log('Fejl ved hentning af kundedata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1F4E46" />
        <Text style={styles.cardSubtitle}>Indlæser profil...</Text>
      </View>
    );
  }

  const displayName =
    profile?.displayName || user?.displayName || user?.email || 'Bilist';
  const firstName = displayName.split(' ')[0];
  const ratingData = profile?.rating;
  const avgRating = typeof ratingData?.avg === 'number' ? ratingData.avg : null;
  const ratingCount = ratingData?.count || 0;

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 32 }]}>
      {/* 🔹 Header med avatar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#DCEFE2',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Ionicons name="car-outline" size={28} color="#1F4E46" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.h1, { marginBottom: 4 }]}>Hej {firstName}</Text>
          <Text style={[styles.cardSubtitle, { color: '#3d6a61' }]}>
            Lejerprofil
          </Text>
        </View>
      </View>

      {/* 🔹 Profilkort med “redigér” */}
      {profile ? (
        <View style={[styles.card, { marginBottom: 12 }]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <Text style={[styles.cardSubtitle, { fontWeight: '600', fontSize: 16 }]}>
              {displayName}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('CustomerProfileDetails')}
            >
              <Ionicons name="create-outline" size={22} color="#1F4E46" />
            </TouchableOpacity>
          </View>

          {profile.email ? (
            <Text style={styles.cardSubtitle}>Email: {profile.email}</Text>
          ) : null}
          {profile.phone ? (
            <Text style={styles.cardSubtitle}>Telefon: {profile.phone}</Text>
          ) : null}
          {profile.carModel ? (
            <Text style={styles.cardSubtitle}>Bil: {profile.carModel}</Text>
          ) : null}
          {profile.licensePlate ? (
            <Text style={styles.cardSubtitle}>Nummerplade: {profile.licensePlate}</Text>
          ) : null}

          {avgRating != null && ratingCount > 0 && (
            <Text style={[styles.cardSubtitle, { marginTop: 6 }]}>
              Rating: {avgRating.toFixed(1)} ⭐ ({ratingCount} anmeldelser)
            </Text>
          )}
        </View>
      ) : (
        <Text style={styles.cardSubtitle}>Ingen profil fundet.</Text>
      )}

      {/* 🔹 Stats – små kort */}
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#E9F5EC',
            borderRadius: 14,
            paddingVertical: 10,
            paddingHorizontal: 12,
          }}
        >
          <Text style={[styles.cardSubtitle, { fontSize: 12 }]}>Parkeringer</Text>
          <Text style={{ fontWeight: '700', fontSize: 18 }}>{stats.rentals}</Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: '#E9F5EC',
            borderRadius: 14,
            paddingVertical: 10,
            paddingHorizontal: 12,
          }}
        >
          <Text style={[styles.cardSubtitle, { fontSize: 12 }]}>Forbrug</Text>
          <Text style={{ fontWeight: '700', fontSize: 18 }}>{stats.spent} kr</Text>
        </View>
      </View>

      {/* 🔹 Seneste anmeldelser */}
      {ratingCount > 0 && reviews.length > 0 && (
        <View style={[styles.card, { marginBottom: 16 }]}>
          <Text style={[styles.cardTitle, { marginBottom: 4 }]}>Seneste anmeldelser</Text>
          {reviews.map((r) => (
            <View key={r.id} style={{ marginTop: 6 }}>
              {/* ⬇️ BRUGER stars I STEDET FOR rating */}
              <Text style={styles.cardSubtitle}>⭐ {r.stars}</Text>
              {!!r.comment && (
                <Text style={[styles.cardSubtitle, { fontSize: 12, color: '#3d6a61' }]}>
                  {r.comment}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* 🔹 Handlinger */}
      <Text
        style={[
          styles.cardSubtitle,
          { fontWeight: '600', marginBottom: 8, marginTop: 4 },
        ]}
      >
        Handlinger
      </Text>

      {/* Historik */}
      <TouchableOpacity
        style={[styles.secondaryButton, { marginTop: 8 }]}
        onPress={() => navigation.navigate('CustomerRentals')}
      >
        <Ionicons
          name="time-outline"
          size={22}
          color="#1F4E46"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.secondaryButtonText}>Tidligere parkeringer</Text>
      </TouchableOpacity>

      {/* Skift rolle */}
      <TouchableOpacity
        style={[styles.primaryButton, { marginTop: 16 }]}
        onPress={toggleRole}
      >
        <Ionicons
          name="swap-horizontal"
          size={22}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.primaryButtonText}>Skift til udlejer</Text>
      </TouchableOpacity>

      {/* Log ud */}
      <TouchableOpacity
        style={[styles.secondaryButton, { marginTop: 12 }]}
        onPress={signOut}
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color="#1F4E46"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.secondaryButtonText}>Log ud</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
