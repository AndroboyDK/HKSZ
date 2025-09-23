import React from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from '../../styles/styles';
import { mockRentals } from '../../data/mock';


export default function CustomerRentalsScreen() {
return (
<View style={styles.containerList}>
<FlatList
data={mockRentals}
keyExtractor={(item) => item.id}
renderItem={({ item }) => (
<View style={styles.card}>
<Text style={styles.cardTitle}>{item.place}</Text>
<Text style={styles.cardSubtitle}>{item.date} • {item.durationHours} t</Text>
<Text style={styles.cardValue}>{item.totalPrice} kr</Text>
</View>
)}
ItemSeparatorComponent={() => <View style={styles.separator} />}
ListHeaderComponent={<Text style={styles.h1}>Tidligere lejringer</Text>}
contentContainerStyle={styles.listContent}
/>
</View>
);
}