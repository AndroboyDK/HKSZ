// src/screens/customer/CustomerActiveRentalScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import styles from '../../styles/styles';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function CustomerActiveRentalScreen() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'rentals'),
      where('customerUid', '==', user.uid),
      where('status', '==', 'active')
    );

    const unsub = onSnapshot(q, (snap) => {
      const out = [];
      snap.forEach((d) => out.push({ id: d.id, ...d.data() }));
      setRows(out);
    });

    return () => unsub();
  }, [user]);

  const handleAfslutLeje = async (rentalId, spotId) => {
    try {
      const rentalRef = doc(db, 'rentals', rentalId);
      const spotRef = doc(db, 'spots', spotId);

      // 1️⃣ Mark rental as completed
      await updateDoc(rentalRef, {
        status: 'completed',
        timeEnd: serverTimestamp(),
      });

      // 2️⃣ Make spot available again
      await updateDoc(spotRef, {
        isAvailable: true,
      });

      Alert.alert('Leje afsluttet', 'Din parkering er nu afsluttet og pladsen er frigivet.');
    } catch (error) {
      console.error('Fejl ved afslutning af leje:', error);
      Alert.alert('Fejl', 'Kunne ikke afslutte leje. Prøv igen.');
    }
  };


  return (
    <View style={styles.containerList}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.h1}>Aktiv parkering</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.cardSubtitle}>Ingen aktive lejemål.</Text>}
        renderItem={({ item }) => {
          const [start, end] = item.time?.split(' - ') || ['', ''];
          return (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.spotTitle || 'Parkeringsplads'}</Text>
              <Text style={styles.cardSubtitle}>Status: {item.status}</Text>
              <Text style={styles.cardSubtitle}>Start: {start}</Text>
              <Text style={styles.cardSubtitle}>Slut: {end || '-'}</Text>
              <Text style={styles.cardSubtitle}>Pris: {item.totalPrice} DKK</Text>

              {/* 🔹 Afslut knap */}
              <TouchableOpacity
                style={[styles.primaryButton, { marginTop: 12 }]}
                onPress={() =>
                  Alert.alert(
                    'Afslut leje',
                    'Er du sikker på, at du vil afslutte din parkering?',
                    [
                      { text: 'Annuller', style: 'cancel' },
                      {
                        text: 'Ja, afslut',
                        style: 'destructive',
                        onPress: () => handleAfslutLeje(item.id, item.spotId),
                      },
                    ]
                  )
                }
              >
                <Text style={styles.primaryButtonText}>Afslut leje</Text>
              </TouchableOpacity>

            </View>
          );
        }}
      />
    </View>
  );
}
