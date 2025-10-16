// Oprettet af K
// Denne komponent bruges i AddSpotScreen og EditSpotScreen til at vælge adresse på kort.
// Den viser et MapView med en marker, som kan trækkes rundt, og et søgefelt til adresser.
// Når brugeren vælger en adresse eller flytter markøren, kaldes onChange med {lat, lng, address}.

import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import styles from '../../styles/styles';

export default function K_MapPicker({ value, onChange }) {
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

    // Forespørg om adgang til placering
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Placering nægtet', 'Appen har brug for adgang til din placering for at vælge parkeringsplads.');
            }
        })();
    }, []);

    // Brugers nuværende position
    const useCurrentLocation = async () => {
        try {
            const pos = await Location.getCurrentPositionAsync({});
            const coords = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
            };
            setRegion({ ...region, ...coords });
            setMarker(coords);
            reverseGeocode(coords);
        } catch (err) {
            Alert.alert('Fejl', 'Kunne ikke hente din nuværende placering.');
        }
    };

    // Geocode søgning
    const searchAddress = async () => {
        try {
            const results = await Location.geocodeAsync(search);
            if (results.length > 0) {
                const loc = results[0];
                const coords = { latitude: loc.latitude, longitude: loc.longitude };
                setRegion({ ...region, ...coords });
                setMarker(coords);
                reverseGeocode(coords);
            } else {
                Alert.alert('Ikke fundet', 'Kunne ikke finde adressen.');
            }
        } catch (e) {
            Alert.alert('Fejl', 'Der opstod en fejl ved søgning.');
        }
    };

    // Reverse geocode (finder adresse fra koordinater)
    const reverseGeocode = async (coords) => {
        try {
            const result = await Location.reverseGeocodeAsync(coords);
            if (result.length > 0) {
                const addr = `${result[0].street || ''} ${result[0].name || ''}, ${result[0].postalCode || ''} ${result[0].city || ''}`;
                setAddress(addr.trim());
                onChange?.({ lat: coords.latitude, lng: coords.longitude, address: addr.trim() });
            }
        } catch {
            Alert.alert('Fejl', 'Kunne ikke hente adresse.');
        }
    };

    return (
        <View style={{ flex: 1, height: 400 }}>
            <TextInput
                placeholder="Søg adresse"
                value={search}
                onChangeText={setSearch}
                style={[styles.input, { marginBottom: 6 }]}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.secondaryButtonSmall} onPress={searchAddress}>
                    <Text style={styles.secondaryButtonText}>Søg adresse</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButtonSmall} onPress={useCurrentLocation}>
                    <Text style={styles.secondaryButtonText}>Brug min placering</Text>
                </TouchableOpacity>
            </View>

            <MapView
                style={{ flex: 1, marginTop: 10 }}
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

            <Text style={[styles.cardSubtitle, { marginTop: 8 }]}>
                Valgt adresse: {address || 'Ingen adresse valgt'}
            </Text>
        </View>
    );
}
