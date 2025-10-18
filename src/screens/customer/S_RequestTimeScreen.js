// Lavet af Suzan
// Opdateret: forbedret UX, tidsformat og notch-safe layout

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../styles/styles';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function S_RequestTimeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { spot } = route.params;

  const [timeStart, setTimeStart] = useState(new Date());
  const [timeEnd, setTimeEnd] = useState(new Date(Date.now() + 60 * 60 * 1000)); // default +1 hour

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDateTime = (date) => {
    return date.toLocaleString('da-DK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleNext = () => {
    if (timeEnd <= timeStart) {
      Alert.alert('Fejl', 'Sluttid skal være efter starttid.');
      return;
    }

    const hours = Math.ceil((timeEnd - timeStart) / (1000 * 60 * 60));
    const quotedPrice = hours * spot.pricePerHour;

    navigation.navigate('RequestSummary', {
      spot,
      timeStart: timeStart.toISOString(),
      timeEnd: timeEnd.toISOString(),
      hours,
      quotedPrice,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 40 }]}>
        <Text style={styles.header}>Vælg tidspunkt</Text>
        <Text style={styles.cardSubtitle}>{spot.title}</Text>

        <View style={{ marginVertical: 24 }}>
          {/* Start time button */}
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: '#E8F0FE' }]}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={[styles.primaryButtonText, { color: '#000' }]}>
              Starttid: {formatDateTime(timeStart)}
            </Text>
          </TouchableOpacity>

          {showStartPicker && (
            <DateTimePicker
              value={timeStart}
              mode="datetime"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowStartPicker(false);
                if (selectedDate) setTimeStart(selectedDate);
              }}
            />
          )}

          {/* End time button */}
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: '#E8F0FE', marginTop: 16 }]}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={[styles.primaryButtonText, { color: '#000' }]}>
              Sluttid: {formatDateTime(timeEnd)}
            </Text>
          </TouchableOpacity>

          {showEndPicker && (
            <DateTimePicker
              value={timeEnd}
              mode="datetime"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) setTimeEnd(selectedDate);
              }}
            />
          )}
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>Bekræft og fortsæt</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
