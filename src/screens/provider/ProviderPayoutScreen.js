// ProviderPayoutScreen.js

import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, Alert, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import styles from '../../styles/styles';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function ProviderPayoutScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [iban, setIban] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  // Hent eksisterende payout-data
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const d = snap.data();
          setIban(d?.payout?.iban || '');
          setName(d?.payout?.name || '');
        } else {
          await setDoc(
            ref,
            { payout: { iban: '', name: '' }, createdAt: serverTimestamp() },
            { merge: true }
          );
        }
      } catch {
        Alert.alert('Fejl', 'Kunne ikke hente udbetalingsdata.');
      }
    })();
  }, [user]);

  // Gem udbetalingsdata
  const saveData = async () => {
    const cleanIban = iban.replace(/\s+/g, '');
    if (cleanIban.length < 10) {
      Alert.alert('Fejl', 'IBAN skal være mindst 10 tegn.');
      return;
    }

    try {
      setBusy(true);
      const ref = doc(db, 'users', user.uid);
      await setDoc(
        ref,
        {
          payout: {
            iban: cleanIban.toUpperCase(),
            name: name.trim(),
          },
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      Alert.alert('Gemt', 'Udbetalingsoplysninger er gemt.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Fejl', 'Kunne ikke gemme data.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 40 }]}>
      <Text style={styles.h1}>Udbetaling</Text>
      <View
        style={{
          flexDirection: 'row',
          padding: 12,
          borderRadius: 12,
          backgroundColor: '#E5F3EB',
          alignItems: 'flex-start',
          marginBottom: 16,
        }}
      >
        <Ionicons
          name="shield-checkmark-outline"
          size={20}
          color="#1F4E46"
          style={{ marginRight: 8, marginTop: 2 }}
        />
        <Text style={[styles.cardSubtitle, { flex: 1 }]}>
          Vi bruger dine oplysninger til at kunne udbetale din indtjening. Du kan ændre dem når som helst.
        </Text>
      </View>

      <Text style={styles.inputLabel}>Kontonavn</Text>
      <TextInput
        placeholder="Navn på kontoindehaver"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Text style={styles.inputLabel}>IBAN</Text>
      <TextInput
        placeholder="IBAN"
        autoCapitalize="characters"
        value={iban}
        onChangeText={setIban}
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.primaryButton, { marginTop: 24 }]}
        onPress={saveData}
        disabled={busy}
      >
        <Text style={styles.primaryButtonText}>
          {busy ? 'Gemmer…' : 'Gem udbetalingsoplysninger'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
