// Lavet komplet om af Kenneth – med forbedringer til data og UX (Zedan 2025)
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { collection, onSnapshot, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import styles from '../../styles/styles';
import ParkingCard from '../../components/ParkingCard';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


export default function FindParkingScreen() {
  const navigation = useNavigation();
  const [spots, setSpots] = useState([]);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Hent brugerens placering (med fallback til København)
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Placering nægtet', 'Kortet viser nu København som udgangspunkt.');
          setRegion({
            latitude: 55.6761,
            longitude: 12.5683,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          setLoading(false);
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
        setRegion({
          latitude: 55.6761,
          longitude: 12.5683,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } finally {
        setLoading(false);
      }
    };
    getLocation();
  }, []);

  // 🔹 Hent ledige pladser inkl. udlejers navn
  useEffect(() => {
    const q = query(collection(db, 'spots'), where('isAvailable', '==', true));
    const unsub = onSnapshot(q, async (snap) => {
      const list = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();
          let providerName = data.providerName || '';
          if (!providerName && data.providerUid) {
            try {
              const providerSnap = await getDoc(doc(db, 'users', data.providerUid));
              if (providerSnap.exists()) {
                providerName = providerSnap.data().displayName || '';
              }
            } catch {
              providerName = '';
            }
          }
          return { id: d.id, ...data, providerName };
        })
      );
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4FAF6', paddingTop: -50 }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.secondaryButton, { marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
          onPress={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
        >
          <Ionicons
            name={viewMode === 'map' ? 'list-outline' : 'map-outline'}
            size={18}
            color="#1F4E46"
            style={{ marginRight: 8 }}
          />
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
                coordinate={{
                  latitude: parseFloat(spot.lat),
                  longitude: parseFloat(spot.lng),
                }}
                title={spot.title}
                description={
                  `${spot.pricePerHour} kr/time` +
                  (spot.providerName ? ` • Udlejet af ${spot.providerName}` : '')
                }
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
    </SafeAreaView>
  );
}
