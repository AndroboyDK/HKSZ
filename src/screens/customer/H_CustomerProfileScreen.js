// Oprettet af H
// Opgave: Lav en skærm hvor kunden kan redigere sine personlige oplysninger (navn, telefonnummer, bilens registreringsnummer).
// TODO:
// 1. Opret en Firestore collection 'users' hvor hver bruger har et dokument med id = auth.currentUser.uid.
// 2. Hent eksisterende brugerdata ved komponentstart og vis det i tekstfelter.
// 3. Hvis brugeren ikke findes i databasen, skal der oprettes et dokument med tomme felter.
// 4. Felter: displayName, phone, vehicleReg (bilens nummerplade).
// 5. Tilføj en knap "Gem oplysninger" der opdaterer dokumentet i Firestore.
// 6. Tilføj simpel validering (felter må ikke være tomme).
// 7. Giv feedback med en alert når data er gemt.

import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import styles from '../../styles/styles';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function H_CustomerProfileScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleReg, setVehicleReg] = useState('');

  // Hent brugerdata ved første load
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
          setVehicleReg(d.vehicleReg || '');
        } else {
          await setDoc(
            ref,
            {
              email: user.email || '',
              displayName: '',
              phone: '',
              vehicleReg: '',
              role: 'customer',
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
      } catch {
        Alert.alert('Fejl', 'Kunne ikke hente brugerdata.');
      }
    })();
  }, [user]);

  // Gem data i Firestore
  const saveData = async () => {
    if (!displayName || !phone || !vehicleReg) {
      Alert.alert('Udfyld alle felter', 'Alle felter skal udfyldes.');
      return;
    }

    try {
      const ref = doc(db, 'users', user.uid);
      await setDoc(
        ref,
        {
          displayName: displayName.trim(),
          phone: phone.trim(),
          vehicleReg: vehicleReg.trim().toUpperCase(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      Alert.alert('Gemt', 'Dine oplysninger er gemt.', [
        { text: 'OK', onPress: () => navigation.goBack() }, // 👈 Redirect efter gem
      ]);
    } catch {
      Alert.alert('Fejl', 'Kunne ikke gemme data.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Mine oplysninger</Text>

      <TextInput
        placeholder="Fulde navn"
        value={displayName}
        onChangeText={setDisplayName}
        style={styles.input}
      />
      <TextInput
        placeholder="Telefonnummer"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />
      <TextInput
        placeholder="Bilens registreringsnummer"
        autoCapitalize="characters"
        value={vehicleReg}
        onChangeText={setVehicleReg}
        style={styles.input}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={saveData}>
        <Text style={styles.primaryButtonText}>Gem oplysninger</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
