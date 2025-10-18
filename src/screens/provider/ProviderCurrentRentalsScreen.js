// src/screens/provider/ProviderCurrentRentalsScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import styles from '../../styles/styles';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
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
    } catch (e) {
      Alert.alert('Fejl', e.message || 'Kunne ikke afslutte lejeaftalen.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <View style={styles.containerList}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.h1}>Aktive udlejninger</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.cardSubtitle}>Ingen aktive udlejninger lige nu.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.spotTitle}</Text>
            <Text style={styles.cardSubtitle}>{item.address}</Text>
            <Text style={styles.cardSubtitle}>Kunde: {item.customerName || 'Ukendt'}</Text>
            <Text style={styles.cardSubtitle}>Start: {item.time?.split('-')[0]?.trim() || 'Ukendt'}</Text>
            <Text style={styles.cardSubtitle}>Status: {item.status}</Text>

            <View style={[styles.row, { marginTop: 12 }]}>
              <TouchableOpacity
                style={styles.primaryButtonSmall}
                onPress={() => completeRental(item)}
                disabled={busyId === item.id || item.status !== 'active'}
              >
                <Text style={styles.primaryButtonText}>
                  {busyId === item.id ? 'Afslutter…' : 'Afslut leje'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
