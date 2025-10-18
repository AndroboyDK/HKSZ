// H_ProviderPayoutScreen.js

// Oprettet af H
// Opgave: Lav en skærm hvor udlejeren kan indtaste sine udbetalingsoplysninger.

import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import styles from '../../styles/styles';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function H_ProviderPayoutScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [iban, setIban] = useState('');
  const [name, setName] = useState('');

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
        Alert.alert('Fejl', 'Kunne ikke hente data.');
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
        { text: 'OK', onPress: () => navigation.goBack() }, // 👈 Redirect tilbage
      ]);
    } catch {
      Alert.alert('Fejl', 'Kunne ikke gemme data.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Udbetalingsoplysninger</Text>

      <TextInput
        placeholder="Kontonavn"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="IBAN"
        autoCapitalize="characters"
        value={iban}
        onChangeText={setIban}
        style={styles.input}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={saveData}>
        <Text style={styles.primaryButtonText}>Gem udbetalingsoplysninger</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
