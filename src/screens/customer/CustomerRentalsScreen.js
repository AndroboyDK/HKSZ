// src/screens/customer/CustomerRentalsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/styles';
import { db } from '../../lib/firebase';
import { collection, doc, getDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import FallbackSpotImage from '../../components/FallbackSpotImage';

export default function CustomerRentalsScreen({ navigation }) {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'rentals'),
      where('customerUid', '==', user.uid),
      where('status', '==', 'completed'),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, async (snap) => {
      const rentals = [];
      for (const docSnap of snap.docs) {
        const data = docSnap.data();

        const [spotSnap, providerSnap] = await Promise.all([
          data.spotId ? getDoc(doc(db, 'spots', data.spotId)) : null,
          data.providerUid ? getDoc(doc(db, 'users', data.providerUid)) : null,
        ]);

        const spotData = spotSnap?.exists() ? spotSnap.data() : {};
        const providerData = providerSnap?.exists() ? providerSnap.data() : {};

        rentals.push({
          id: docSnap.id,
          ...data,
          spotTitle: data.spotTitle || spotData.title || 'Ukendt parkeringsplads',
          address: spotData.address || 'Ukendt adresse',
          providerName: providerData.displayName || 'Ukendt udlejer',
          spotAvailableNow: !!spotData.isAvailable,
          spotImage: spotData.images?.[0] || null,
          spotRef: spotSnap?.exists() ? { id: spotSnap.id, ...spotData } : null,
        });
      }

      setRows(rentals);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1F4E46" />
        <Text style={{ marginTop: 10, color: '#1F4E46' }}>Indlæser tidligere parkeringer...</Text>
      </View>
    );
  }

  return (
    <View style={styles.containerList}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.h1}>Historik</Text>}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={[styles.card, { alignItems: 'center' }]}>
            <Ionicons name="car-outline" size={28} color="#9EB7AA" />
            <Text style={[styles.cardSubtitle, { textAlign: 'center', marginTop: 6 }]}>
              Ingen parkeringer afsluttet endnu.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { padding: 0, overflow: 'hidden' }]}>
            {/* Image */}
            <FallbackSpotImage uri={item.imageUrl} style={{ height: 140, borderRadius: 0 }} />

            {/* Content */}
            <View style={{ padding: 14 }}>
              {/* Title + price */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[styles.cardTitle, { flex: 1, flexWrap: 'wrap', marginRight: 10 }]}>
                  {item.spotTitle}
                </Text>
                <Text style={[styles.badge]}>{item.totalPrice ?? 0} kr</Text>
              </View>

              {/* Address */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Ionicons name="location-outline" size={16} color="#555" style={{ marginRight: 4 }} />
                <Text style={[styles.cardSubtitle, { flex: 1 }]}>{item.address}</Text>
              </View>

              {/* Provider */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Ionicons name="person-outline" size={16} color="#555" style={{ marginRight: 4 }} />
                <Text style={[styles.cardSubtitle, { flex: 1 }]}>{item.providerName}</Text>
              </View>

              {/* Time */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <Ionicons name="time-outline" size={16} color="#555" style={{ marginRight: 4 }} />
                <Text style={[styles.cardSubtitle, { flex: 1 }]}>{item.time}</Text>
              </View>

              {/* Chips & actions */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <Text style={styles.chip}>
                  {item.spotAvailableNow ? '🟢 Kan bookes igen' : '🔴 Ikke ledig'}
                </Text>
                {/* Spacer */}
                <View style={{ flex: 1 }} />
                {item.spotRef ? (
                  <TouchableOpacity
                    style={styles.secondaryButtonSmall}
                    onPress={() => navigation.navigate('SpotDetails', { spotId: item.spotRef.id })}
                  >
                    <Text style={styles.secondaryButtonText}>Book igen</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
