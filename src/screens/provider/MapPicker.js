// src/screens/provider/MapPicker.js

import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/styles';

export default function MapPicker({ value, onChange }) {
  const [region, setRegion] = useState({
    latitude: value?.lat || 55.6761,
    longitude: value?.lng || 12.5683,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [marker, setMarker] = useState({
    latitude: value?.lat || 55.6761,
    longitude: value?.lng || 12.5683,
  });

  const [address, setAddress] = useState(value?.address || '');
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);

  // Forespørg om adgang til placering
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Ingen adgang til placering',
          'Du kan stadig søge eller flytte markøren manuelt på kortet.'
        );
      }
    })();
  }, []);

  // Hjælper: byg en "bedre" søgestreng
  const buildQuery = () => {
    let q = search.trim();

    if (!q) return null;

    // Hvis der ikke står noget om by/land, så hjælp brugeren
    const lower = q.toLowerCase();
    const hasLocationHint =
      lower.includes('kbh') ||
      lower.includes('københavn') ||
      lower.includes('copenhagen') ||
      lower.includes('denmark') ||
      lower.includes('danmark');

    if (!hasLocationHint) {
      q = `${q}, Danmark`;
    }

    return q;
  };

  // Søgefunktion
  const searchAddress = async () => {
    const query = buildQuery();
    if (!query) {
      Alert.alert('Tom søgning', 'Skriv en adresse, f.eks. "Dalslandsgade 8, København".');
      return;
    }

    try {
      setSearching(true);

      const results = await Location.geocodeAsync(query);

      if (!results || results.length === 0) {
        Alert.alert(
          'Ikke fundet',
          'Kunne ikke finde adressen. Prøv med fuld adresse inkl. by (fx "Kastrup, Danmark").'
        );
        return;
      }

      const loc = results[0];
      const coords = {
        latitude: loc.latitude,
        longitude: loc.longitude,
      };

      setRegion((prev) => ({
        ...prev,
        ...coords,
      }));
      setMarker(coords);
      await reverseGeocode(coords);
    } catch (e) {
      console.log('Geocode error', e);
      Alert.alert('Fejl', 'Der opstod en fejl under søgning. Prøv igen.');
    } finally {
      setSearching(false);
    }
  };

  // Brugers nuværende position
  const useCurrentLocation = async () => {
    try {
      setSearching(true);
      const pos = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
      setRegion((prev) => ({ ...prev, ...coords }));
      setMarker(coords);
      await reverseGeocode(coords);
    } catch (err) {
      console.log('Location error', err);
      Alert.alert('Fejl', 'Kunne ikke hente din nuværende placering.');
    } finally {
      setSearching(false);
    }
  };

  // Reverse geocode (finder adresse fra koordinater)
  const reverseGeocode = async (coords) => {
    try {
      const result = await Location.reverseGeocodeAsync(coords);
      if (result.length > 0) {
        const r = result[0];
        const addr = `${r.street || ''} ${r.name || ''}, ${r.postalCode || ''} ${r.city || ''
          }`.trim();

        setAddress(addr);
        onChange?.({ lat: coords.latitude, lng: coords.longitude, address: addr });
      } else {
        onChange?.({ lat: coords.latitude, lng: coords.longitude, address: '' });
      }
    } catch (e) {
      console.log('Reverse geocode error', e);
      Alert.alert('Fejl', 'Kunne ikke hente adresse for den valgte placering.');
    }
  };

  return (
    <View style={{ marginTop: 12 }}>
      <Text style={styles.inputLabel}>Placering</Text>

      {/* Søg + knapper */}
      <TextInput
        placeholder="F.eks. Dalslandsgade 8, København"
        value={search}
        onChangeText={setSearch}
        style={[styles.input, { marginBottom: 6 }]}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <TouchableOpacity
          style={[
            styles.secondaryButtonSmall,
            { flexDirection: 'row', alignItems: 'center', opacity: searching ? 0.7 : 1 },
          ]}
          onPress={searchAddress}
          disabled={searching}
        >
          {searching ? (
            <ActivityIndicator size="small" color="#1F4E46" style={{ marginRight: 6 }} />
          ) : (
            <Ionicons
              name="search-outline"
              size={16}
              color="#1F4E46"
              style={{ marginRight: 4 }}
            />
          )}
          <Text style={styles.secondaryButtonText}>Søg</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryButtonSmall,
            { flexDirection: 'row', alignItems: 'center', opacity: searching ? 0.7 : 1 },
          ]}
          onPress={useCurrentLocation}
          disabled={searching}
        >
          <Ionicons
            name="locate-outline"
            size={16}
            color="#1F4E46"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.secondaryButtonText}>Min placering</Text>
        </TouchableOpacity>
      </View>

      {/* Kort */}
      <MapView
        style={{ height: 260, borderRadius: 12, overflow: 'hidden' }}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        <Marker
          coordinate={marker}
          draggable
          onDragEnd={(e) => {
            const coords = e.nativeEvent.coordinate;
            setMarker(coords);
            reverseGeocode(coords);
          }}
        />
      </MapView>

      {/* Valgt adresse */}
      <Text style={[styles.cardSubtitle, { marginTop: 8 }]}>
        Valgt adresse: {address || 'Ingen adresse valgt endnu'}
      </Text>
    </View>
  );
}
