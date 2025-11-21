import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import styles from '../../styles/styles';
import { useRole } from '../../context/RoleContext';
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
import { Ionicons } from '@expo/vector-icons';

export default function ProviderProfileScreen() {
  const { toggleRole } = useRole();
  const { signOut, user } = useAuth();
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ spots: 0, rentals: 0, earnings: 0 });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Load profile, stats og anmeldelser
  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) setProfile(snap.data());

        // Pladser
        const spotsSnap = await getDocs(
          query(collection(db, 'spots'), where('providerUid', '==', user.uid))
        );
        const spotsCount = spotsSnap.size;

        // Afsluttede udlejninger
        const rentalsSnap = await getDocs(
          query(
            collection(db, 'rentals'),
            where('providerUid', '==', user.uid),
            where('status', '==', 'completed')
          )
        );
        const rentalsCount = rentalsSnap.size;
        const totalEarnings = rentalsSnap.docs.reduce(
          (sum, d) => sum + (Number(d.data().totalPrice) || 0),
          0
        );

        setStats({
          spots: spotsCount,
          rentals: rentalsCount,
          earnings: totalEarnings,
        });

        // Seneste anmeldelser af udlejer
        const reviewsSnap = await getDocs(
          query(
            collection(db, 'ratings'),
            where('toUid', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(3)
          )
        );
        const revs = reviewsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setReviews(revs);
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

  const displayName =
    profile?.displayName || user?.displayName || user?.email || 'Udlejer';
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
          <Ionicons name="person-outline" size={28} color="#1F4E46" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.h1, { marginBottom: 4 }]}>Hej {firstName}</Text>
          <Text style={[styles.cardSubtitle, { color: '#3d6a61' }]}>
            Udlejerprofil
          </Text>
        </View>
      </View>

      {/* 🔹 Profilinfo-kort (kompakt) */}
      {profile ? (
        <View style={[styles.card, { marginBottom: 12 }]}>
          <Text style={[styles.cardSubtitle, { fontWeight: '600', fontSize: 16 }]}>
            {displayName}
          </Text>
          {profile.email && (
            <Text style={styles.cardSubtitle}>{profile.email}</Text>
          )}
          {profile.phone ? (
            <Text style={styles.cardSubtitle}>Tlf: {profile.phone}</Text>
          ) : null}

          {/* ⭐ Udlejer-rating */}
          {avgRating != null && ratingCount > 0 && (
            <Text style={[styles.cardSubtitle, { marginTop: 6 }]}>
              Rating: {avgRating.toFixed(1)} ⭐ ({ratingCount} anmeldelser)
            </Text>
          )}
        </View>
      ) : (
        <Text style={styles.cardSubtitle}>Ingen profil fundet.</Text>
      )}

      {/* 🔹 Stats – små dashboard-kort */}
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
          <Text style={[styles.cardSubtitle, { fontSize: 12 }]}>Pladser</Text>
          <Text style={{ fontWeight: '700', fontSize: 18 }}>{stats.spots}</Text>
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
          <Text style={[styles.cardSubtitle, { fontSize: 12 }]}>Udlejninger</Text>
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
          <Text style={[styles.cardSubtitle, { fontSize: 12 }]}>Indtjening</Text>
          <Text style={{ fontWeight: '700', fontSize: 18 }}>{stats.earnings} kr</Text>
        </View>
      </View>

      {/* 🔹 Seneste anmeldelser af udlejer */}
      {ratingCount > 0 && reviews.length > 0 && (
        <View style={[styles.card, { marginBottom: 16 }]}>
          <Text style={[styles.cardTitle, { marginBottom: 4 }]}>Seneste anmeldelser</Text>
          {reviews.map((r) => (
            <View key={r.id} style={{ marginTop: 6 }}>
              {/* ⬇️ BRUGER stars I STEDET FOR rating */}
              <Text style={styles.cardSubtitle}>⭐ {r.stars} from a {r.role}</Text> 
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

      {/* Udbetaling */}
      <TouchableOpacity
        style={[styles.secondaryButton, { marginTop: 8 }]}
        onPress={() => navigation.navigate('ProviderPayout')}
      >
        <Ionicons
          name="card-outline"
          size={24}
          color="#1F4E46"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.secondaryButtonText}>Udbetalingsoplysninger</Text>
      </TouchableOpacity>

      {/* Mine pladser */}
      <TouchableOpacity
        style={[styles.secondaryButton, { marginTop: 8 }]}
        onPress={() => navigation.navigate('ProviderMySpots')}
      >
        <Ionicons
          name="pin-outline"
          size={24}
          color="#1F4E46"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.secondaryButtonText}>Mine parkeringspladser</Text>
      </TouchableOpacity>

      {/* Historik */}
      <TouchableOpacity
        style={[styles.secondaryButton, { marginTop: 8 }]}
        onPress={() => navigation.navigate('ProviderRentals')}
      >
        <Ionicons
          name="time-outline"
          size={24}
          color="#1F4E46"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.secondaryButtonText}>Udlejningshistorik</Text>
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
        <Text style={styles.primaryButtonText}>Skift til lejer</Text>
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
