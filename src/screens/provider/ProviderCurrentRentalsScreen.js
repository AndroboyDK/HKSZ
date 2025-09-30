import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import styles from '../../styles/styles';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, where, updateDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';

export default function ProviderCurrentRentalsScreen() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'rentals'),
      where('providerUid', '==', user.uid),
      where('status', '==', 'active')
    );
    const unsub = onSnapshot(q, (snap) => {
      const out = [];
      snap.forEach((d) => out.push({ id: d.id, ...d.data() }));
      setRows(out);
    });
    return () => unsub();
  }, [user]);

  const completeRental = async (rental) => {
    try {
      setBusyId(rental.id);
      // 1) mark rental completed + timeEnd
      await updateDoc(doc(db, 'rentals', rental.id), {
        status: 'completed',
        timeEnd: serverTimestamp(),
      });
      // 2) unlock the spot (available again) if exists
      if (rental.spotId) {
        // optional: only unlock if no other active rentals exist for same spot
        await updateDoc(doc(db, 'spots', rental.spotId), { isAvailable: true });
      }
      Alert.alert('Completed', 'Rental marked as completed.');
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to complete rental');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <View style={styles.containerList}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.h1}>Current Rentals</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.cardSubtitle}>No active rentals.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.spotTitle || 'Parking spot'}</Text>
            <Text style={styles.cardSubtitle}>Customer: {item.customerUid}</Text>
            <Text style={styles.cardSubtitle}>Since: (started)</Text>
            <Text style={styles.cardSubtitle}>Status: {item.status}</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.primaryButtonSmall}
                onPress={() => completeRental(item)}
                disabled={busyId === item.id || item.status !== 'active'}
              >
                <Text style={styles.primaryButtonText}>
                  {busyId === item.id ? 'Completing…' : 'Complete'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
