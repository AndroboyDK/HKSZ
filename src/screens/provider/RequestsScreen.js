// src/screens/provider/RequestsScreen.js
// Dansk – oversigt over ventende bookinganmodninger til udlejeren

import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles/styles';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

export default function RequestsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'requests'),
      where('providerUid', '==', user.uid),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      const rows = [];
      snap.forEach((docSnap) => rows.push({ id: docSnap.id, ...docSnap.data() }));
      setRequests(rows);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const headerSubtitle = useMemo(() => {
    if (loading) return 'Indlæser anmodninger...';
    if (requests.length === 0) return '';
    if (requests.length === 1) return 'Du har 1 ventende anmodning.';
    return `Du har ${requests.length} ventende anmodninger.`;
  }, [loading, requests]);

  const renderItem = ({ item }) => {
    const customerName = item.customer || 'Ukendt kunde';
    const spotTitle = item.spotTitle || 'Ukendt parkeringsplads';
    const timeRange = item.time || 'Ingen tidsangivelse';
    const price = item.price ?? item.quotedPrice ?? null;

    return (
      <TouchableOpacity
        style={[styles.card, { padding: 16 }]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('RequestDetails', { requestId: item.id })}
      >
        {/* Øverste række: kunde + pris */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Ionicons name="person-circle-outline" size={22} color="#1F4E46" style={{ marginRight: 6 }} />
            <Text style={[styles.cardTitle, { flex: 1, flexWrap: 'wrap' }]} numberOfLines={1}>
              {customerName}
            </Text>
          </View>
          {price != null && (
            <Text style={{ fontWeight: '700', color: '#1F4E46', marginLeft: 8 }}>
              {price} kr
            </Text>
          )}
        </View>

        {/* Pladsnavn */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Ionicons name="pin-outline" size={16} color="#555" style={{ marginRight: 4 }} />
          <Text style={[styles.cardSubtitle, { flex: 1 }]} numberOfLines={1}>
            {spotTitle}
          </Text>
        </View>

        {/* Tidsrum */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons name="time-outline" size={16} color="#555" style={{ marginRight: 4 }} />
          <Text style={[styles.cardSubtitle, { flex: 1 }]} numberOfLines={2}>
            {timeRange}
          </Text>
        </View>

        {/* Call to action nederst */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
            justifyContent: 'flex-end',
          }}
        >
          <Text style={{ fontSize: 12, color: '#1F4E46', marginRight: 4 }}>
            Se detaljer
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#1F4E46" />
        </View>
      </TouchableOpacity>
    );
  };

  // Hvis vi virkelig loader og ikke har data endnu, vis fuldskærms loader
  if (loading && requests.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1F4E46" />
        <Text style={{ marginTop: 10, color: '#1F4E46' }}>Indlæser anmodninger...</Text>
      </View>
    );
  }

  return (
    <View style={styles.containerList}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[styles.listContent, { paddingBottom: 24 }]}
        ListHeaderComponent={
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.h1}>Anmodninger</Text>
            <Text style={[styles.cardSubtitle, { marginTop: 4 }]}>{headerSubtitle}</Text>
          </View>
        }
        ListEmptyComponent={
          !loading && (
            <View
              style={{
                marginTop: 32,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="checkmark-done-circle-outline" size={40} color="#9EB7AA" />
              <Text
                style={[
                  styles.cardSubtitle,
                  { textAlign: 'center', marginTop: 8, maxWidth: 260 },
                ]}
              >
                Der er ingen nye anmodninger lige nu. Vi giver besked, når der tikker en ind.
              </Text>
            </View>
          )
        }
        renderItem={renderItem}
      />
    </View>
  );
}
