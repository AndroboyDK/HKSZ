// src/screens/customer/CustomerActiveRentalScreen.js

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
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

export default function CustomerActiveRentalScreen() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const navigation = useNavigation();


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

  const handleAfslutLeje = async (rental) => {
    try {
      const rentalRef = doc(db, 'rentals', rental.id);
      const spotRef = doc(db, 'spots', rental.spotId);

      // 1️⃣ Mark rental as completed
      await updateDoc(rentalRef, {
        status: 'completed',
        timeEnd: serverTimestamp(),
      });

      // 2️⃣ Make spot available again
      if (rental.spotId) {
        await updateDoc(spotRef, {
          isAvailable: true,
        });
      }

      Alert.alert('Leje afsluttet', 'Din parkering er nu afsluttet og pladsen er frigivet.', [
        {
          text: 'Bedøm udlejer',
          onPress: () =>
            navigation.navigate('RateUser', {
              rentalId: rental.id,
              toUid: rental.providerUid,
              toName: rental.providerName || 'Udlejer',
              role: 'provider', // du bedømmer udlejer
            }),
        },
        {
          text: 'Luk',
          style: 'cancel',
        },
      ]);
    } catch (error) {
      console.error('Fejl ved afslutning af leje:', error);
      Alert.alert('Fejl', 'Kunne ikke afslutte leje. Prøv igen.');
    }
  };


  const confirmAfslut = (item) => {
    if (!item || busyId === item.id) return;

    Alert.alert(
      'Afslut leje',
      'Er du sikker på, at du vil afslutte din parkering nu?',
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Ja, afslut',
          style: 'destructive',
          onPress: () => handleAfslutLeje(item.id, item.spotId),
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const [start, end] = item.time?.split(' - ') || ['', ''];
    const priceText =
      typeof item.totalPrice === 'number' ? `${item.totalPrice} kr` : null;

    return (
      <View style={[styles.card, { padding: 16 }]}>
        {/* Header – titel + status */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={[styles.cardTitle, { flexWrap: 'wrap' }]}>
              {item.spotTitle || 'Parkeringsplads'}
            </Text>
            <Text style={[styles.cardSubtitle, { fontSize: 12 }]}>
              Udlejer: {item.providerName || 'Ukendt udlejer'}
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

        {/* Tid */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons
            name="time-outline"
            size={16}
            color="#555"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.cardSubtitle, { flex: 1 }]}>
            {start ? `Start: ${start}` : 'Starttid ukendt'}
          </Text>
        </View>

        {end ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <Ionicons
              name="exit-outline"
              size={16}
              color="#555"
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.cardSubtitle, { flex: 1 }]}>
              Slut: {end}
            </Text>
          </View>
        ) : null}

        {/* Pris */}
        {priceText && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons
              name="wallet-outline"
              size={16}
              color="#555"
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.cardSubtitle, { fontWeight: '600' }]}>
              Samlet pris (estimat): {priceText}
            </Text>
          </View>
        )}

        {/* Afslut-knap */}
        <View style={{ marginTop: 14, flexDirection: 'row', justifyContent: 'flex-end' }}>
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
                    onPress: () => handleAfslutLeje(item), // 👈 send hele rental
                  },
                ]
              )
            }
          >
            <Text style={styles.primaryButtonText}>Afslut leje</Text>
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
          <Text style={styles.h1}>Aktiv parkering</Text>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.cardSubtitle, { textAlign: 'center', marginTop: 16 }]}>
            Ingen aktive lejemål lige nu.
          </Text>
        }
        renderItem={renderItem}
      />
    </View>
  );
}
