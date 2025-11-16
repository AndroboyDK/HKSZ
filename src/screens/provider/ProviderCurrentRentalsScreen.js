// src/screens/provider/ProviderCurrentRentalsScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/styles';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { useNavigation } from '@react-navigation/native';

import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

export default function ProviderCurrentRentalsScreen() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const navigation = useNavigation();


  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'rentals'),
      where('providerUid', '==', user.uid),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      const out = [];
      snap.forEach((d) => out.push({ id: d.id, ...d.data() }));
      setRows(out);
    });
    return () => unsub();
  }, [user]);

  // ✅ Markér leje som afsluttet (logik som før)
  // ✅ Markér leje som afsluttet
  const completeRental = async (rental) => {
    try {
      setBusyId(rental.id);
      await updateDoc(doc(db, 'rentals', rental.id), {
        status: 'completed',
        timeEnd: serverTimestamp(),
      });

      if (rental.spotId) {
        await updateDoc(doc(db, 'spots', rental.spotId), { isAvailable: true });
      }

      Alert.alert('Afsluttet', 'Lejeaftalen er markeret som afsluttet.');

      // 👉 Send udlejer videre til rating af lejer
      navigation.navigate('RateUser', {
        rentalId: rental.id,
        toUid: rental.customerUid,
        toName: rental.customerName || 'Lejer',
        role: 'customer', // du bedømmer kunden
      });
    } catch (e) {
      Alert.alert('Fejl', e.message || 'Kunne ikke afslutte lejeaftalen.');
    } finally {
      setBusyId(null);
    }
  };


  const confirmComplete = (rental) => {
    if (!rental || rental.status !== 'active' || busyId === rental.id) return;
    Alert.alert(
      'Afslut leje',
      'Er du sikker på, at du vil afslutte denne leje? Pladsen bliver derefter tilgængelig igen.',
      [
        { text: 'Annuller', style: 'cancel' },
        { text: 'Ja, afslut', style: 'destructive', onPress: () => completeRental(rental) },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const [start] = (item.time || '').split(' - ');
    const priceText =
      typeof item.totalPrice === 'number' ? `${item.totalPrice} kr` : null;

    return (
      <View style={[styles.card, { padding: 16 }]}>
        {/* Header: titel + status */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={[styles.cardTitle, { flexWrap: 'wrap' }]}>
              {item.spotTitle || 'Parkeringsplads'}
            </Text>
            <Text style={[styles.cardSubtitle, { fontSize: 12 }]}>
              Kunde: {item.customerName || 'Ukendt'}
            </Text>
          </View>

          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
              backgroundColor: '#D9F2E4',
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#1F4E46' }}>Aktiv</Text>
          </View>
        </View>

        {/* Adresse */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Ionicons
            name="location-outline"
            size={16}
            color="#555"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.cardSubtitle, { flex: 1 }]}>
            {item.address || 'Ukendt adresse'}
          </Text>
        </View>

        {/* Starttid */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons
            name="time-outline"
            size={16}
            color="#555"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.cardSubtitle, { flex: 1 }]}>
            Start: {start || 'Ukendt'}
          </Text>
        </View>

        {/* Pris (hvis vi har én) */}
        {priceText && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons
              name="wallet-outline"
              size={16}
              color="#555"
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.cardSubtitle, { fontWeight: '600' }]}>
              Samlet pris: {priceText}
            </Text>
          </View>
        )}

        {/* Knap */}
        <View style={{ marginTop: 14, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={[
              styles.primaryButtonSmall,
              { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
            ]}
            onPress={() => confirmComplete(item)}
            disabled={busyId === item.id || item.status !== 'active'}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.primaryButtonText}>
              {busyId === item.id ? 'Afslutter…' : 'Afslut leje'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.containerList}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text style={styles.h1}>Aktive udlejninger</Text>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View
            style={{
              marginTop: 32,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="close-circle-outline" size={40} color="#9EB7AA" />
            <Text
              style={[
                styles.cardSubtitle,
                { textAlign: 'center', marginTop: 8, maxWidth: 260 },
              ]}
            >
              Du har ingen aktive udlejninger lige nu.
            </Text>
          </View>
        }
        renderItem={renderItem}
      />
    </View>
  );
}
