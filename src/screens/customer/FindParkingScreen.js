import React, { useState } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import styles from '../../styles/styles';
import { mockParkings } from '../../data/mock';
import ParkingCard from '../../components/ParkingCard';


export default function FindParkingScreen() {
const [selected, setSelected] = useState(null);


const initialRegion = {
latitude: 55.6761,
longitude: 12.5683,
latitudeDelta: 0.09,
longitudeDelta: 0.06,
};


return (
<View style={styles.container}>
<MapView style={{ width: '100%', height: Dimensions.get('window').height * 0.45 }} initialRegion={initialRegion}>
{mockParkings.map(p => (
<Marker
key={p.id}
coordinate={p.coords}
title={p.title}
description={`${p.pricePerHour} kr/t`}
onPress={() => setSelected(p.id)}
/>
))}
</MapView>


<View style={styles.section}>
<Text style={styles.h2}>Tilgængelige pladser</Text>
<FlatList
data={mockParkings}
keyExtractor={(item) => item.id}
renderItem={({ item }) => (
<ParkingCard item={item} onPress={() => setSelected(item.id)} />
)}
ItemSeparatorComponent={() => <View style={styles.separator} />}
contentContainerStyle={styles.listContent}
extraData={selected}
/>
</View>
</View>
);
}