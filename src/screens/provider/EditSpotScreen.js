import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Switch, ScrollView } from 'react-native';
import styles from '../../styles/styles';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { isNonEmpty, isAddress, toNumberSafe, isLat, isLng, isPrice } from '../../utils/validate';

export default function EditSpotScreen({ route, navigation }) {
  const { spotId } = route.params || {};
  const [spot, setSpot] = useState(null);
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [price, setPrice] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const snap = await getDoc(doc(db, 'spots', spotId));
      if (mounted && snap.exists()) {
        const s = { id: snap.id, ...snap.data() };
        setSpot(s);
        setTitle(s.title);
        setAddress(s.address);
        setLat(String(s.lat));
        setLng(String(s.lng));
        setPrice(String(s.pricePerHour));
        setIsAvailable(!!s.isAvailable);
      }
    };
    if (spotId) load();
    return () => { mounted = false; };
  }, [spotId]);

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
      await updateDoc(doc(db, 'spots', spotId), {
        title: title.trim(),
        address: address.trim(),
        lat: nLat,
        lng: nLng,
        pricePerHour: nPrice,
        isAvailable,
        updatedAt: serverTimestamp(),
      });
      Alert.alert('Saved', 'Spot updated.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to update spot');
    } finally {
      setBusy(false);
    }
  };

  if (!spot) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.cardSubtitle}>Loading…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Edit Spot</Text>

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
        <Text style={styles.primaryButtonText}>{busy ? 'Saving…' : 'Save Changes'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
