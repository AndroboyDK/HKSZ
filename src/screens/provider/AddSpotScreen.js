// src/screens/provider/AddSpotScreen.js
// Dansk version – opret ny parkeringsplads

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Switch, ScrollView } from 'react-native';
import styles from '../../styles/styles';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { isNonEmpty, isAddress, toNumberSafe, isLat, isLng, isPrice } from '../../utils/validate';
import K_MapPicker from './K_MapPicker';

export default function AddSpotScreen({ navigation }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [price, setPrice] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const nLat = toNumberSafe(lat);
    const nLng = toNumberSafe(lng);
    const nPrice = toNumberSafe(price);

    if (!isNonEmpty(title)) return Alert.alert('Fejl', 'Titel skal udfyldes.');
    if (!isAddress(address)) return Alert.alert('Fejl', 'Indtast en gyldig adresse (mindst 5 tegn).');
    if (!isLat(nLat) || !isLng(nLng)) return Alert.alert('Fejl', 'Ugyldige koordinater.');
    if (!isPrice(nPrice)) return Alert.alert('Fejl', 'Pris skal være et gyldigt tal større end 0.');

    try {
      setBusy(true);
      await addDoc(collection(db, 'spots'), {
        providerUid: user.uid,
        providerName: user.displayName || user.email || 'Ukendt udlejer',
        title: title.trim(),
        address: address.trim(),
        lat: nLat,
        lng: nLng,
        pricePerHour: nPrice,
        isAvailable,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      Alert.alert('Oprettet', 'Parkeringspladsen er nu gemt.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Fejl', e.message || 'Kunne ikke oprette parkeringspladsen.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Tilføj parkeringsplads</Text>

      <Text style={styles.inputLabel}>Titel</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="F.eks. Indkørsel på Amager" />

      <Text style={styles.inputLabel}>Adresse</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="F.eks. Dalslandsgade 8F, 2300 København S" />

      <K_MapPicker
        value={{ lat: parseFloat(lat) || 55.6761, lng: parseFloat(lng) || 12.5683, address }}
        onChange={({ lat, lng, address }) => {
          setLat(lat.toString());
          setLng(lng.toString());
          setAddress(address);
        }}
      />

      <Text style={styles.inputLabel}>Pris pr. time (kr)</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="F.eks. 25"
      />

      <View style={[styles.row, { alignItems: 'center', marginTop: 12 }]}>
        <Text style={{ marginRight: 12 }}>Tilgængelig</Text>
        <Switch value={isAvailable} onValueChange={setIsAvailable} />
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={submit} disabled={busy}>
        <Text style={styles.primaryButtonText}>{busy ? 'Gemmer…' : 'Gem parkeringsplads'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
