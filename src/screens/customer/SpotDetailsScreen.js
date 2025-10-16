import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import styles from '../../styles/styles';
import { db } from '../../lib/firebase';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export default function SpotDetailsScreen({ route, navigation }) {
  const { spotId } = route.params || {};
  const [spot, setSpot] = useState(null);
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const snap = await getDoc(doc(db, 'spots', spotId));
      if (mounted) setSpot(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    };
    if (spotId) load();
    return () => { mounted = false; };
  }, [spotId]);

  if (!spotId) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.h2}>No spot selected.</Text>
      </View>
    );
  }

  if (!spot) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator />
        <Text style={[styles.cardSubtitle, { marginTop: 12 }]}>Loading…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>{spot.title}</Text>
      <View style={styles.card}>
        <Text style={styles.cardSubtitle}>{spot.address}</Text>
        <Text style={styles.cardSubtitle}>Price per hour: {spot.pricePerHour} kr</Text>
        <Text style={styles.cardSubtitle}>Available: {spot.isAvailable ? 'Yes' : 'No'}</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('RequestTime', { spot })}
          disabled={!spot.isAvailable}
        >
          <Text style={styles.primaryButtonText}>Vælg tid</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
