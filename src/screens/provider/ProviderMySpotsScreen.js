// src/screens/provider/ProviderMySpotsScreen.js
// Dansk version – oversigt over udlejerens parkeringspladser

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/styles';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, where, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function ProviderMySpotsScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'spots'), where('providerUid', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const out = [];
      snap.forEach((d) => out.push({ id: d.id, ...d.data() }));
      setRows(out);
    });
    return () => unsub();
  }, [user]);

  const confirmDelete = (spot) => {
    Alert.alert(
      'Slet parkeringsplads',
      `Er du sikker på, at du vil slette "${spot.title}"?`,
      [
        { text: 'Annuller', style: 'cancel' },
        { text: 'Slet', style: 'destructive', onPress: () => deleteSpot(spot) },
      ]
    );
  };

  const deleteSpot = async (spot) => {
    try {
      // 🚫 Bloker sletning, hvis aktiv leje eksisterer
      const act = await getDocs(
        query(
          collection(db, 'rentals'),
          where('spotId', '==', spot.id),
          where('status', '==', 'active')
        )
      );
      if (!act.empty) {
        Alert.alert('Blokeret', 'Du kan ikke slette denne plads, da den er i brug.');
        return;
      }

      await deleteDoc(doc(db, 'spots', spot.id));
      Alert.alert('Slettet', 'Parkeringspladsen er fjernet.');
    } catch (e) {
      Alert.alert('Fejl', e.message || 'Kunne ikke slette parkeringspladsen.');
    }
  };

  const renderItem = ({ item }) => {
    const available = !!item.isAvailable;
    const priceText =
      typeof item.pricePerHour === 'number' ? `${item.pricePerHour} kr/t` : '- kr/t';

    return (
      <View style={[styles.card, { padding: 16 }]}>
        {/* Billede */}
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={{
              width: '100%',
              height: 160,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: 160,
              borderRadius: 10,
              backgroundColor: '#DCEFE2',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}
          >
            <Ionicons name="image-outline" size={28} color="#1F4E46" />
            <Text style={{ color: '#1F4E46', fontWeight: '500', marginTop: 4 }}>
              Intet billede
            </Text>
          </View>
        )}

        {/* Titel + status-pill */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[styles.cardTitle, { flex: 1, flexWrap: 'wrap', paddingRight: 8 }]}>
            {item.title || 'Parkeringsplads'}
          </Text>

          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
              backgroundColor: available ? '#D9F2E4' : '#F5D8D8',
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                color: available ? '#1F4E46' : '#8A1F1F',
              }}
            >
              {available ? 'Tilgængelig' : 'Ikke tilgængelig'}
            </Text>
          </View>
        </View>

        {/* Adresse */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Ionicons
            name="location-outline"
            size={16}
            color="#555"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.cardSubtitle, { flex: 1 }]}>
            {item.address || 'Adresse ikke angivet'}
          </Text>
        </View>

        {/* Pris */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons
            name="pricetag-outline"
            size={16}
            color="#555"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.cardSubtitle, { fontWeight: '600' }]}>
            {priceText}
          </Text>
        </View>

        {/* Knapper */}
        <View style={[styles.row, { marginTop: 12 }]}>
          <TouchableOpacity
            style={styles.primaryButtonSmall}
            onPress={() => navigation.navigate('EditSpot', { spotId: item.id })}
          >
            <Text style={styles.primaryButtonText}>Redigér</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButtonSmall}
            onPress={() => confirmDelete(item)}
          >
            <Text style={styles.secondaryButtonText}>Slet</Text>
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
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.h1}>Mine spots</Text>
            <TouchableOpacity
              style={[styles.primaryButton, { flexDirection: 'row', alignItems: 'center', marginTop: 4 }]}
              onPress={() => navigation.navigate('AddSpot')}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.primaryButtonText}>Tilføj</Text>
            </TouchableOpacity>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.cardSubtitle, { textAlign: 'center', marginTop: 16 }]}>
            Ingen parkeringspladser endnu.
          </Text>
        }
        renderItem={renderItem}
      />
    </View>
  );
}
