//Lavet af Suzan
//Dette er skærmen hvor kunden vælger start- og sluttidspunkt for booking.

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import styles from '../../styles/styles';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function S_RequestTimeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { spot } = route.params;

  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');

  const handleNext = () => {
    if (!timeStart || !timeEnd) {
      Alert.alert('Fejl', 'Udfyld både start- og sluttid.');
      return;
    }
    const start = new Date(timeStart);
    const end = new Date(timeEnd);
    if (end <= start) {
      Alert.alert('Fejl', 'Sluttid skal være efter starttid.');
      return;
    }

    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    const quotedPrice = hours * spot.pricePerHour;

    navigation.navigate('RequestSummary', {
      spot,
      timeStart: start.toISOString(),
      timeEnd: end.toISOString(),
      hours,
      quotedPrice,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Vælg tidspunkt</Text>
      <Text style={styles.cardSubtitle}>{spot.title}</Text>

      <TextInput
        placeholder="Starttid (YYYY-MM-DD HH:MM)"
        value={timeStart}
        onChangeText={setTimeStart}
        style={styles.input}
      />
      <TextInput
        placeholder="Sluttid (YYYY-MM-DD HH:MM)"
        value={timeEnd}
        onChangeText={setTimeEnd}
        style={styles.input}
      />
      <Text>Vi ved det er upraktisk med tekst input, men det er midlertidigt for at få det til at virke.</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
        <Text style={styles.primaryButtonText}>Næste</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
