// RequestSummaryScreen.js
// Visuel opsummering af booking + opret forespørgsel i Firestore

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../lib/firebase';
import styles from '../../styles/styles';

function formatDateTime(date) {
  return new Date(date).toLocaleString('da-DK', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function RequestSummaryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { spot, timeStart, timeEnd, quotedPrice, hours } = route.params || {};
  const auth = getAuth();
  const user = auth.currentUser;

  // Fallback hvis hours ikke er sendt (bagud-kompatibilitet)
  const derivedHours = useMemo(() => {
    if (typeof hours === 'number' && !Number.isNaN(hours)) return hours;
    if (!timeStart || !timeEnd) return 1;
    const ms = new Date(timeEnd) - new Date(timeStart);
    return Math.max(1, Math.ceil(ms / (1000 * 60 * 60)));
  }, [hours, timeStart, timeEnd]);

  const hourlyPrice = Number(spot?.pricePerHour) || 0;
  const totalPrice = quotedPrice ?? derivedHours * hourlyPrice;

  const handleConfirm = async () => {
    if (!user) {
      Alert.alert('Fejl', 'Du skal være logget ind for at booke.');
      return;
    }

    try {
      await addDoc(collection(db, 'requests'), {
        spotId: spot.id,
        spotTitle: spot.title,
        providerUid: spot.providerUid,
        customerUid: user.uid,
        customer: user.displayName || user.email || 'Kunde',
        timeStart,
        timeEnd,
        time: `${new Date(timeStart).toLocaleString()} - ${new Date(timeEnd).toLocaleString()}`, // gammel streng beholdes
        quotedPrice: totalPrice,
        price: totalPrice,
        vehicle: 'N/A',
        notes: '',
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        'Forespørgsel sendt',
        'Din bookingforespørgsel er sendt til udlejeren. Du får besked, når den er accepteret.'
      );
      navigation.popToTop();
    } catch (error) {
      console.error('Error creating request', error);
      Alert.alert('Fejl', 'Kunne ikke sende forespørgslen. Prøv igen om lidt.');
    }
  };

  if (!spot || !timeStart || !timeEnd) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.cardSubtitle}>Der mangler information om booking.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 32 }]}>
      {/* Titel */}
      <Text style={styles.header}>Opsummering</Text>

      {/* Spot-card */}
      <View style={[styles.card, { marginTop: 8 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Ionicons name="car-outline" size={20} color="#1F4E46" style={{ marginRight: 8 }} />
          <Text style={styles.cardTitle}>{spot.title}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons name="location-outline" size={16} color="#555" style={{ marginRight: 6 }} />
          <Text style={[styles.cardSubtitle, { flex: 1 }]}>{spot.address}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Ionicons name="pricetag-outline" size={16} color="#555" style={{ marginRight: 6 }} />
          <Text style={styles.cardSubtitle}>{hourlyPrice} kr / time</Text>
        </View>
      </View>

      {/* Tids-card */}
      <View style={[styles.card, { marginTop: 12 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Ionicons name="time-outline" size={20} color="#1F4E46" style={{ marginRight: 8 }} />
          <Text style={styles.cardTitle}>Tidspunkt</Text>
        </View>

        <View style={{ marginTop: 4 }}>
          <Text style={styles.cardSubtitle}>Start</Text>
          <Text style={{ color: '#102420', marginTop: 2 }}>
            {formatDateTime(timeStart)}
          </Text>
        </View>

        <View style={{ marginTop: 8 }}>
          <Text style={styles.cardSubtitle}>Slut</Text>
          <Text style={{ color: '#102420', marginTop: 2 }}>
            {formatDateTime(timeEnd)}
          </Text>
        </View>

        <View style={{ marginTop: 8 }}>
          <Text style={styles.cardSubtitle}>Varighed</Text>
          <Text style={{ color: '#102420', marginTop: 2 }}>
            {derivedHours} {derivedHours === 1 ? 'time' : 'timer'}
          </Text>
        </View>
      </View>

      {/* Pris-card */}
      <View style={[styles.card, { marginTop: 12 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Ionicons name="receipt-outline" size={20} color="#1F4E46" style={{ marginRight: 8 }} />
          <Text style={styles.cardTitle}>Pris</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
          <Text style={styles.cardSubtitle}>
            {derivedHours} × {hourlyPrice} kr
          </Text>
          <Text style={[styles.cardTitle, { color: '#1F4E46' }]}>{totalPrice} kr</Text>
        </View>

        <Text style={{ fontSize: 12, color: '#3d6a61', marginTop: 8 }}>
          Beløbet trækkes først, når udlejeren har accepteret din forespørgsel (MVP-tekst – kan justeres).
        </Text>
      </View>

      {/* Info note */}
      <Text
        style={{
          fontSize: 12,
          color: '#3d6a61',
          marginTop: 10,
          textAlign: 'center',
        }}
      >
        Tjek tider og pris én gang til, før du bekræfter. Du kan altid se status under dine aktive parkeringer.
      </Text>

      {/* CTA-knap */}
      <TouchableOpacity style={[styles.primaryButton, { marginTop: 16 }]} onPress={handleConfirm}>
        <Text style={styles.primaryButtonText}>Send bookingforespørgsel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
