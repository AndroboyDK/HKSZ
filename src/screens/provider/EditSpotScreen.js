// src/screens/provider/EditSpotScreen.js
// Dansk version – redigér eksisterende parkeringsplads med billede

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/styles';
import { db, storage } from '../../lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { isNonEmpty, isAddress, toNumberSafe, isLat, isLng, isPrice } from '../../utils/validate';
import MapPicker from './MapPicker';

export default function EditSpotScreen({ route, navigation }) {
  const { spotId } = route.params || {};
  const [spot, setSpot] = useState(null);
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [price, setPrice] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [image, setImage] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, 'spots', spotId));
      if (snap.exists()) {
        const s = { id: snap.id, ...snap.data() };
        setSpot(s);
        setTitle(s.title);
        setAddress(s.address);
        setLat(String(s.lat));
        setLng(String(s.lng));
        setPrice(String(s.pricePerHour));
        setIsAvailable(!!s.isAvailable);
        setImage(s.imageUrl || null);
      }
    };
    if (spotId) load();
  }, [spotId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submit = async () => {
    const nLat = toNumberSafe(lat);
    const nLng = toNumberSafe(lng);
    const nPrice = toNumberSafe(price);

    if (!isNonEmpty(title)) return Alert.alert('Fejl', 'Titel skal udfyldes.');
    if (!isAddress(address)) return Alert.alert('Fejl', 'Indtast en gyldig adresse.');
    if (!isLat(nLat) || !isLng(nLng)) return Alert.alert('Fejl', 'Ugyldige koordinater.');
    if (!isPrice(nPrice)) return Alert.alert('Fejl', 'Pris skal være et gyldigt tal større end 0.');

    try {
      setBusy(true);
      const refDoc = doc(db, 'spots', spotId);
      let imageUrl = spot.imageUrl || '';

      // 🚀 Upload nyt billede hvis ændret
      if (image && image !== spot.imageUrl) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `spots/${spotId}_${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      await updateDoc(refDoc, {
        title: title.trim(),
        address: address.trim(),
        lat: nLat,
        lng: nLng,
        pricePerHour: nPrice,
        isAvailable,
        imageUrl,
        updatedAt: serverTimestamp(),
      });

      Alert.alert('Gemt', 'Parkeringspladsen er opdateret.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Fejl', e.message || 'Kunne ikke gemme ændringer.');
    } finally {
      setBusy(false);
    }
  };

  if (!spot) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator />
        <Text style={[styles.cardSubtitle, { marginTop: 8 }]}>
          Indlæser spot...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 40 }]}>
      <Text style={styles.h1}>Redigér spot</Text>

      {/* Titel */}
      <Text style={styles.inputLabel}>Titel</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      {/* Adresse */}
      <Text style={styles.inputLabel}>Adresse</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />

      {/* Kort / lokation */}
      <MapPicker
        value={{ lat: parseFloat(lat) || 55.6761, lng: parseFloat(lng) || 12.5683, address }}
        onChange={({ lat, lng, address }) => {
          setLat(lat.toString());
          setLng(lng.toString());
          setAddress(address);
        }}
      />

      {/* Pris */}
      <Text style={styles.inputLabel}>Pris pr. time (kr)</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      {/* Tilgængelig */}
      <View style={[styles.row, { alignItems: 'center', marginTop: 12 }]}>
        <Text style={{ marginRight: 12 }}>Aktiv nu</Text>
        <Switch value={isAvailable} onValueChange={setIsAvailable} />
      </View>

      {/* Billede-sektion */}
      <View style={{ marginTop: 20 }}>
        <Text style={styles.inputLabel}>Billede</Text>
        <Text style={[styles.cardSubtitle, { fontSize: 12, marginBottom: 6 }]}>
          Billedet vises for bilister, når de vælger din spot.
        </Text>

        <TouchableOpacity
          style={[styles.secondaryButton, { flexDirection: 'row', alignItems: 'center' }]}
          onPress={pickImage}
        >
          <Ionicons
            name={image ? 'image-outline' : 'add-circle-outline'}
            size={18}
            color="#1F4E46"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.secondaryButtonText}>
            {image ? 'Skift billede' : 'Tilføj billede'}
          </Text>
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: '100%',
              height: 200,
              borderRadius: 10,
              marginTop: 12,
            }}
          />
        )}
      </View>

      {/* Gem-knap */}
      <TouchableOpacity
        style={[styles.primaryButton, { marginTop: 24 }]}
        onPress={submit}
        disabled={busy}
      >
        <Text style={styles.primaryButtonText}>
          {busy ? 'Gemmer…' : 'Gem ændringer'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
