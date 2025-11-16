// src/screens/customer/RequestTimeScreen.js

import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, Platform, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/styles';
import { useNavigation, useRoute } from '@react-navigation/native';

// Snap a Date to the next 15-minute mark
function roundToNextQuarter(d = new Date()) {
  const date = new Date(d);
  const mins = date.getMinutes();
  const add = (15 - (mins % 15)) % 15;
  if (add > 0) date.setMinutes(mins + add, 0, 0);
  else date.setSeconds(0, 0);
  if (date.getTime() < Date.now()) {
    // if rounding landed in the past because seconds, push 15 more
    date.setMinutes(date.getMinutes() + 15);
  }
  return date;
}

function formatDateTime(date) {
  return date.toLocaleString('da-DK', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const PRESETS = [
  { label: '1t', hours: 1 },
  { label: '2t', hours: 2 },
  { label: '4t', hours: 4 },
  { label: '8t', hours: 8 },
  { label: 'Vælg selv', hours: null }, // triggers end-picker
];

export default function RequestTimeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { spot } = route.params;

  // Start now = snap to next 15-min slot
  const [startNow, setStartNow] = useState(true);
  const initialStart = useMemo(() => roundToNextQuarter(new Date()), []);
  const [timeStart, setTimeStart] = useState(initialStart);

  // Duration preset (in hours). null = Custom (show end picker)
  const [durationHrs, setDurationHrs] = useState(2); // sensible default: 2h
  const [timeEnd, setTimeEnd] = useState(() => {
    const d = new Date(initialStart);
    d.setHours(d.getHours() + 2);
    return d;
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // When "start now" toggled, snap/unlock the start field
  const onToggleStartNow = (val) => {
    setStartNow(val);
    if (val) {
      const snapped = roundToNextQuarter(new Date());
      setTimeStart(snapped);
      if (durationHrs) {
        const d = new Date(snapped);
        d.setHours(d.getHours() + durationHrs);
        setTimeEnd(d);
      } else {
        // custom: keep end at least +30min
        const d = new Date(snapped);
        if (d >= timeEnd) {
          d.setMinutes(d.getMinutes() + 30);
          setTimeEnd(d);
        }
      }
    }
  };

  // Whenever start or duration changes (and not custom), recompute end
  const onPickPreset = (hrs) => {
    setDurationHrs(hrs);
    if (hrs) {
      const d = new Date(timeStart);
      d.setHours(d.getHours() + hrs);
      setTimeEnd(d);
      setShowEndPicker(false);
    } else {
      // Custom => open end picker
      setShowEndPicker(true);
    }
  };

  const hoursSelected = useMemo(() => {
    const ms = timeEnd - timeStart;
    return Math.ceil(ms / (1000 * 60 * 60));
  }, [timeStart, timeEnd]);

  const quotedPrice = useMemo(() => {
    return Math.max(1, hoursSelected) * (Number(spot?.pricePerHour) || 0);
  }, [hoursSelected, spot?.pricePerHour]);

  const handleNext = () => {
    // Guard rails
    if (timeStart < new Date(Date.now() - 60 * 1000)) {
      Alert.alert('Fejl', 'Starttid kan ikke være i fortiden.');
      return;
    }
    if (timeEnd <= timeStart) {
      Alert.alert('Fejl', 'Sluttid skal være efter starttid.');
      return;
    }
    const minMs = 30 * 60 * 1000;
    if (timeEnd - timeStart < minMs) {
      Alert.alert('Fejl', 'Minimum varighed er 30 minutter.');
      return;
    }

    navigation.navigate('RequestSummary', {
      spot,
      timeStart: timeStart.toISOString(),
      timeEnd: timeEnd.toISOString(),
      hours: hoursSelected,
      quotedPrice,
    });
  };

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: -65 }}>
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 40 }]}>
        <Text style={styles.header}>Vælg tidspunkt</Text>
        <Text style={styles.cardSubtitle}>{spot.title}</Text>

        {/* Start now toggle */}
        <View style={[styles.card, { marginTop: 12 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="flash-outline" size={18} color="#1F4E46" style={{ marginRight: 8 }} />
            <Text style={[styles.cardSubtitle, { flex: 1 }]}>Start nu (næste 15-min slot)</Text>
            <Switch value={startNow} onValueChange={onToggleStartNow} />
          </View>
        </View>

        {/* Start time */}
        <View style={{ marginTop: 16 }}>
          <Text style={styles.inputLabel}>Starttid</Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: '#E8F0FE' }]}
            onPress={() => !startNow && setShowStartPicker(true)}
            disabled={startNow}
          >
            <Text style={[styles.primaryButtonText, { color: '#000' }]}>
              {formatDateTime(timeStart)}
            </Text>
          </TouchableOpacity>

          {showStartPicker && (
            <DateTimePicker
              value={timeStart}
              mode="datetime"
              is24Hour
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={roundToNextQuarter(new Date())}
              onChange={(event, selectedDate) => {
                setShowStartPicker(false);
                if (!selectedDate) return;
                // Snap chosen time to next :00/:15/:30/:45 for clean pricing windows
                const snapped = roundToNextQuarter(selectedDate);
                setTimeStart(snapped);

                // Keep end consistent based on current preset choice
                if (durationHrs) {
                  const d = new Date(snapped);
                  d.setHours(d.getHours() + durationHrs);
                  setTimeEnd(d);
                } else {
                  if (timeEnd <= snapped) {
                    const d = new Date(snapped);
                    d.setMinutes(d.getMinutes() + 30);
                    setTimeEnd(d);
                  }
                }
              }}
            />
          )}
        </View>

        {/* Duration presets */}
        <View style={{ marginTop: 18 }}>
          <Text style={styles.inputLabel}>Varighed</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {PRESETS.map((p) => {
              const active = durationHrs === p.hours;
              return (
                <TouchableOpacity
                  key={p.label}
                  onPress={() => onPickPreset(p.hours)}
                  style={[
                    styles.chipButton,
                    active ? { backgroundColor: '#1F4E46' } : { backgroundColor: '#E9F5EC' },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipButtonText,
                      active ? { color: '#fff' } : { color: '#1F4E46' },
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Custom end time (only when Custom is active) */}
        {durationHrs === null && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.inputLabel}>Sluttid</Text>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: '#E8F0FE' }]}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={[styles.primaryButtonText, { color: '#000' }]}>
                {formatDateTime(timeEnd)}
              </Text>
            </TouchableOpacity>

            {showEndPicker && (
              <DateTimePicker
                value={timeEnd}
                mode="datetime"
                is24Hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={new Date(timeStart.getTime() + 30 * 60 * 1000)} // min +30min
                onChange={(event, selectedDate) => {
                  setShowEndPicker(false);
                  if (!selectedDate) return;
                  const chosen = roundToNextQuarter(selectedDate);
                  if (chosen <= timeStart) {
                    Alert.alert('Fejl', 'Sluttid skal være efter starttid.');
                    return;
                  }
                  setTimeEnd(chosen);
                }}
              />
            )}
          </View>
        )}

        {/* Live price summary */}
        <View style={[styles.card, { marginTop: 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="receipt-outline" size={18} color="#1F4E46" style={{ marginRight: 8 }} />
            <Text style={[styles.cardSubtitle, { flex: 1 }]}>
              {hoursSelected} {hoursSelected === 1 ? 'time' : 'timer'} × {spot.pricePerHour} kr/t
            </Text>
            <Text style={[styles.cardTitle]}>{quotedPrice} kr</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <Ionicons name="calendar-outline" size={16} color="#345a52" style={{ marginRight: 6 }} />
            <Text style={styles.cardSubtitle}>
              {formatDateTime(timeStart)} → {formatDateTime(timeEnd)}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.primaryButton, { marginTop: 16 }]} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>Bekræft og fortsæt</Text>
        </TouchableOpacity>
      </ScrollView>
    // </SafeAreaView>
  );
}
