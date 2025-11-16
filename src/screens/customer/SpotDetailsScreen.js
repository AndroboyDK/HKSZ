// src/screens/customer/SpotDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import styles from '../../styles/styles';
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
import { useAuth } from '../../context/AuthContext';
import FallbackSpotImage from '../../components/FallbackSpotImage';
import { Ionicons } from '@expo/vector-icons';

export default function SpotDetailsScreen({ route, navigation }) {
  const { spotId } = route.params || {};
  const [spot, setSpot] = useState(null);
  const [providerProfile, setProviderProfile] = useState(null);
  const [providerReviews, setProviderReviews] = useState([]); // 🔹 NY
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // 🔹 Hent spot
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'spots', spotId));
        if (!mounted) return;
        setSpot(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      } catch (e) {
        Alert.alert('Fejl', 'Kunne ikke hente parkeringspladsen.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (spotId) load();
    return () => {
      mounted = false;
    };
  }, [spotId]);

  // 🔹 Hent udlejers profil
  useEffect(() => {
    let active = true;
    const loadProvider = async () => {
      try {
        if (!spot?.providerUid) return;
        const ref = doc(db, 'users', spot.providerUid);
        const snap = await getDoc(ref);
        if (active && snap.exists()) {
          setProviderProfile(snap.data());
        }
      } catch (e) {
        console.log('Kunne ikke hente udlejers profil:', e);
      }
    };
    loadProvider();
    return () => {
      active = false;
    };
  }, [spot?.providerUid]);

  // 🔹 Hent udlejers seneste anmeldelser (med tekst)
  useEffect(() => {
    let live = true;
    const loadReviews = async () => {
      try {
        if (!spot?.providerUid) return;
        const q = query(
          collection(db, 'reviews'),
          where('toUid', '==', spot.providerUid),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const snap = await getDocs(q);
        if (!live) return;
        const out = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProviderReviews(out);
      } catch (e) {
        console.log('Kunne ikke hente udlejers anmeldelser:', e);
      }
    };
    loadReviews();
    return () => {
      live = false;
    };
  }, [spot?.providerUid]);

  if (!spotId) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.h2}>Ingen parkeringsplads valgt.</Text>
      </View>
    );
  }

  if (loading || !spot) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator />
        <Text style={[styles.cardSubtitle, { marginTop: 12 }]}>Indlæser…</Text>
      </View>
    );
  }

  const mainImage = spot.imageUrl || null;
  const ratingData = providerProfile?.rating;
  const avgRating = typeof ratingData?.avg === 'number' ? ratingData.avg : null;
  const ratingCount = ratingData?.count || 0;
  const isOwnSpot = user && spot.providerUid === user.uid;

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>{spot.title}</Text>

      {/* Billede */}
      <FallbackSpotImage
        uri={mainImage}
        style={{ height: 200, borderRadius: 16, marginBottom: 12 }}
      />

      {/* Info card */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Ionicons name="location-outline" size={18} color="#345a52" style={{ marginRight: 6 }} />
          <Text style={styles.cardSubtitle}>{spot.address}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Ionicons name="pricetag-outline" size={18} color="#345a52" style={{ marginRight: 6 }} />
          <Text style={styles.cardSubtitle}>Pris pr. time: {spot.pricePerHour} kr</Text>
        </View>

        {/* ⭐ Udlejers rating */}
        {avgRating != null && ratingCount > 0 ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Ionicons name="star-outline" size={18} color="#345a52" style={{ marginRight: 6 }} />
            <Text style={styles.cardSubtitle}>
              Udlejers rating: {avgRating.toFixed(1)} ⭐ ({ratingCount} anmeldelser)
            </Text>
          </View>
        ) : (
          <Text style={[styles.cardSubtitle, { marginBottom: 6 }]}>
            Udlejeren har endnu ingen anmeldelser.
          </Text>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons
            name={
              spot.isAvailable ? 'checkmark-circle-outline' : 'close-circle-outline'
            }
            size={18}
            color={spot.isAvailable ? '#2E7D32' : '#B3261E'}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.cardSubtitle}>
            Tilgængelig: {spot.isAvailable ? 'Ja' : 'Nej'}
          </Text>
        </View>

        {isOwnSpot && (
          <Text style={[styles.cardSubtitle, { marginTop: 8, color: '#C62828' }]}>
            Du kan ikke booke din egen parkeringsplads.
          </Text>
        )}
      </View>

      {/* 🔹 Seneste anmeldelser af udlejer */}
      {providerReviews.map((r) => (
        <View key={r.id} style={{ marginTop: 6 }}>
          <Text style={styles.cardSubtitle}>⭐ {r.stars}</Text>
          {!!r.comment && (
            <Text style={[styles.cardSubtitle, { fontSize: 12, color: '#3d6a61' }]}>
              {r.comment}
            </Text>
          )}
        </View>
      ))}


      {/* Actions */}
      <View style={[styles.row, { marginTop: 12 }]}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { flex: 1, opacity: spot.isAvailable && !isOwnSpot ? 1 : 0.5 },
          ]}
          onPress={() => navigation.navigate('RequestTime', { spot })}
          disabled={!spot.isAvailable || isOwnSpot}
        >
          <Text style={styles.primaryButtonText}>Vælg tid</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
