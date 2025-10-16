//Lavet komplet om af Kenneth - skærm 2.... 

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import styles from '../../styles/styles';
import ParkingCard from '../../components/ParkingCard';
import { useNavigation } from '@react-navigation/native';

export default function FindParkingScreen() {
  const navigation = useNavigation();
  const [spots, setSpots] = useState([]);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hent brugerens placering
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Placering nægtet', 'Kan ikke vise kort uden adgang til placering.');
          return;
        }
        const pos = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (err) {
        Alert.alert('Fejl', 'Kunne ikke hente din placering.');
      } finally {
        setLoading(false);
      }
    };
    getLocation();
  }, []);

  // Hent ledige pladser
  useEffect(() => {
    const q = query(collection(db, 'spots'), where('isAvailable', '==', true));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSpots(list);
    });
    return () => unsub();
  }, []);

  const goToDetails = (spotId) => navigation.navigate('SpotDetails', { spotId });

  if (loading || !region) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
        <Text style={styles.cardSubtitle}>Indlæser kort...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
      >
        <Text style={styles.secondaryButtonText}>
          Skift til {viewMode === 'map' ? 'listevisning' : 'kortvisning'}
        </Text>
      </TouchableOpacity>

      {viewMode === 'map' ? (
        <MapView
          style={{ width: '100%', height: Dimensions.get('window').height * 0.7 }}
          region={region}
          showsUserLocation
          onRegionChangeComplete={setRegion}
        >
          {spots.map((spot) => (
            <Marker
              key={spot.id}
              coordinate={{ latitude: parseFloat(spot.lat), longitude: parseFloat(spot.lng) }}
              title={spot.title}
              description={`${spot.pricePerHour} kr/time`}
              onPress={() => goToDetails(spot.id)}
            />
          ))}
        </MapView>
      ) : (
        <FlatList
          data={spots}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ParkingCard
              item={item}
              onPress={() => goToDetails(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.cardSubtitle}>Ingen pladser fundet.</Text>}
        />
      )}
    </View>
  );
}
