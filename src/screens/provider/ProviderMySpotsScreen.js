import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
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
    Alert.alert('Delete spot', `Delete "${spot.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteSpot(spot) },
    ]);
  };

  const deleteSpot = async (spot) => {
    try {
      // Guard: block delete if there is an active rental for this spot
      const act = await getDocs(query(collection(db, 'rentals'), where('spotId', '==', spot.id), where('status', '==', 'active')));
      if (!act.empty) {
        Alert.alert('Blocked', 'Cannot delete: spot has an active rental.');
        return;
      }
      await deleteDoc(doc(db, 'spots', spot.id));
      Alert.alert('Deleted', 'Spot removed.');
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to delete');
    }
  };

  return (
    <View style={styles.containerList}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <Text style={styles.h1}>My Spots</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('AddSpot')}
            >
              <Text style={styles.primaryButtonText}>Add Spot</Text>
            </TouchableOpacity>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.cardSubtitle}>No spots yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.address}</Text>
            <Text style={styles.cardSubtitle}>
              {item.isAvailable ? 'Available' : 'Unavailable'} • {item.pricePerHour} kr/t
            </Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.primaryButtonSmall}
                onPress={() => navigation.navigate('EditSpot', { spotId: item.id })}
              >
                <Text style={styles.primaryButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButtonSmall}
                onPress={() => confirmDelete(item)}
              >
                <Text style={styles.secondaryButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
