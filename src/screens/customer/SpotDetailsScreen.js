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

  const createRequest = async () => {
    if (!user || !spot) return;
    try {
      setBusy(true);
      await addDoc(collection(db, 'requests'), {
        spotId: spot.id,
        spotTitle: spot.title,
        providerUid: spot.providerUid,
        customerUid: user.uid,
        customer: user.displayName || 'Customer',
        time: 'Today 14:00-16:00', // MVP placeholder
        price: spot.pricePerHour,   // MVP: base price
        vehicle: 'N/A',
        notes: '',
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      Alert.alert('Request sent', 'Provider will review your request.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to create request');
    } finally {
      setBusy(false);
    }
  };

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
          onPress={createRequest}
          disabled={busy || !spot.isAvailable}
        >
          <Text style={styles.primaryButtonText}>
            {busy ? 'Sending…' : 'Request booking'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
