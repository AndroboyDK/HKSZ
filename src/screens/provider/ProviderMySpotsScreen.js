// src/screens/provider/ProviderMySpotsScreen.js
// Dansk version – oversigt over udlejerens parkeringspladser

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
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
        query(collection(db, 'rentals'), where('spotId', '==', spot.id), where('status', '==', 'active'))
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

  return (
    <View style={styles.containerList}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.h1}>Mine parkeringspladser</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('AddSpot')}
            >
              <Text style={styles.primaryButtonText}>Tilføj ny plads</Text>
            </TouchableOpacity>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.cardSubtitle}>Ingen parkeringspladser endnu.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* 🔹 Image Preview */}
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
                <Text style={{ color: '#1F4E46', fontWeight: '500' }}>Intet billede</Text>
              </View>
            )}

            {/* 🔹 Text Info */}
            <Text style={styles.cardTitle}>{item.title || 'Parkeringsplads'}</Text>
            <Text style={styles.cardSubtitle}>{item.address || 'Adresse ikke angivet'}</Text>
            <Text style={styles.cardSubtitle}>
              {item.isAvailable ? '🟢 Tilgængelig' : '🔴 Ikke tilgængelig'} •{' '}
              {item.pricePerHour ?? '-'} kr/t
            </Text>

            {/* 🔹 Action Buttons */}
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
        )}
      />
    </View>
  );
}
