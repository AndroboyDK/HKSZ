import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import styles from '../../styles/styles';
import ParkingCard from '../../components/ParkingCard';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

export default function FindParkingScreen() {
    const navigation = useNavigation();
    const [spots, setSpots] = useState([]);
    const [selected, setSelected] = useState(null);

    const initialRegion = {
        latitude: 55.6761,
        longitude: 12.5683,
        latitudeDelta: 0.09,
        longitudeDelta: 0.06,
    };

    useEffect(() => {
        const q = query(collection(db, 'spots'), where('isAvailable', '==', true));
        const unsub = onSnapshot(q, (snap) => {
            const out = [];
            snap.forEach((d) => out.push({ id: d.id, ...d.data() }));
            setSpots(out);
        });
        return () => unsub();
    }, []);

    const goToDetails = (spotId) => {
        navigation.navigate('SpotDetails', { spotId });
    };

    return (
        <View style={styles.container}>
            <MapView
                style={{ width: '100%', height: Dimensions.get('window').height * 0.45 }}
                initialRegion={initialRegion}
            >
                {spots.map((p) => (
                    <Marker
                        key={p.id}
                        coordinate={{ latitude: p.lat, longitude: p.lng }}
                        title={p.title}
                        description={`${p.pricePerHour} kr/t`}
                        onPress={() => {
                            setSelected(p.id);
                            goToDetails(p.id);
                        }}
                    />
                ))}
            </MapView>

            <View style={styles.section}>
                <Text style={styles.h2}>Tilgængelige pladser</Text>
                <FlatList
                    data={spots}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ParkingCard
                            item={{ ...item, address: item.address, pricePerHour: item.pricePerHour, title: item.title }}
                            onPress={() => goToDetails(item.id)}
                        />
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    contentContainerStyle={styles.listContent}
                    extraData={selected}
                    ListEmptyComponent={<Text style={styles.cardSubtitle}>Ingen pladser endnu.</Text>}
                />
            </View>
        </View>
    );
}