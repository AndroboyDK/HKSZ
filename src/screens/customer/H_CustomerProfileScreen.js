// src/screens/customer/H_CustomerProfileScreen.js
// Dansk version – kundens profil med redigering

import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import styles from '../../styles/styles';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function H_CustomerProfileScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();

  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [carModel, setCarModel] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const d = snap.data();
          setDisplayName(d.displayName || '');
          setPhone(d.phone || '');
          setCarModel(d.carModel || '');
          setLicensePlate(d.licensePlate || '');
        }
      } catch {
        Alert.alert('Fejl', 'Kunne ikke hente profiloplysninger.');
      }
    })();
  }, [user]);

  const saveProfile = async () => {
    if (!displayName.trim()) {
      Alert.alert('Fejl', 'Navn skal udfyldes.');
      return;
    }
    try {
      setBusy(true);
      const ref = doc(db, 'users', user.uid);
      await setDoc(
        ref,
        {
          displayName: displayName.trim(),
          phone: phone.trim(),
          carModel: carModel.trim(),
          licensePlate: licensePlate.trim().toUpperCase(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      Alert.alert('Gemt', 'Dine oplysninger er gemt.');
    } catch (e) {
      Alert.alert('Fejl', e.message || 'Kunne ikke gemme profil.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Min profil</Text>

      <Text style={styles.inputLabel}>Navn</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="F.eks. Zedan Hejaz"
      />

      <Text style={styles.inputLabel}>Telefonnummer</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="F.eks. 42224506"
      />

      <Text style={styles.inputLabel}>Bilmodel</Text>
      <TextInput
        style={styles.input}
        value={carModel}
        onChangeText={setCarModel}
        placeholder="F.eks. Tesla Model 3"
      />

      <Text style={styles.inputLabel}>Nummerplade</Text>
      <TextInput
        style={styles.input}
        value={licensePlate}
        onChangeText={setLicensePlate}
        autoCapitalize="characters"
        placeholder="F.eks. AB12345"
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={saveProfile}
        disabled={busy}
      >
        <Text style={styles.primaryButtonText}>{busy ? 'Gemmer…' : 'Gem ændringer'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
