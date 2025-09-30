import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Switch, ScrollView } from 'react-native';
import styles from '../../styles/styles';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { isNonEmpty, isAddress, toNumberSafe, isLat, isLng, isPrice } from '../../utils/validate';

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

    if (!isNonEmpty(title)) return Alert.alert('Validation', 'Title must be at least 2 chars.');
    if (!isAddress(address)) return Alert.alert('Validation', 'Address must be 5–120 chars.');
    if (!isLat(nLat) || !isLng(nLng)) return Alert.alert('Validation', 'Invalid coordinates.');
    if (!isPrice(nPrice)) return Alert.alert('Validation', 'Price must be a number ≥ 0.');

    try {
      setBusy(true);
      await addDoc(collection(db, 'spots'), {
        providerUid: user.uid,
        title: title.trim(),
        address: address.trim(),
        lat: nLat,
        lng: nLng,
        pricePerHour: nPrice,
        isAvailable,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      Alert.alert('Saved', 'Spot created.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to create spot');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Add Spot</Text>

      <Text style={styles.inputLabel}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.inputLabel}>Address</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />

      <Text style={styles.inputLabel}>Latitude</Text>
      <TextInput style={styles.input} value={lat} onChangeText={setLat} keyboardType="numeric" />

      <Text style={styles.inputLabel}>Longitude</Text>
      <TextInput style={styles.input} value={lng} onChangeText={setLng} keyboardType="numeric" />

      <Text style={styles.inputLabel}>Price per hour (kr)</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

      <View style={[styles.row, { alignItems: 'center', marginTop: 12 }]}>
        <Text style={{ marginRight: 12 }}>Available</Text>
        <Switch value={isAvailable} onValueChange={setIsAvailable} />
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={submit} disabled={busy}>
        <Text style={styles.primaryButtonText}>{busy ? 'Saving…' : 'Save Spot'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
