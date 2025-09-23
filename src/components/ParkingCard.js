import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';


export default function ParkingCard({ item, onPress }) {
return (
<TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
<View style={styles.cardHeaderRow}>
<Text style={styles.cardTitle}>{item.title}</Text>
<Text style={styles.badge}>{item.pricePerHour} kr/t</Text>
</View>
<Text style={styles.cardSubtitle}>{item.address}</Text>
</TouchableOpacity>
);
}