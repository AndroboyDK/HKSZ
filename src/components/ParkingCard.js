// src/components/ParkingCard.js

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/styles';

export default function ParkingCard({ item, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, { paddingBottom: 12 }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* 🔹 Image Preview */}
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={{
            width: '100%',
            height: 160,
            borderRadius: 10,
            marginBottom: 10,
          }}
        />
      ) : (
        <View
          style={{
            width: '100%',
            height: 160,
            borderRadius: 10,
            backgroundColor: '#DCEFE2',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}
        >
          <Text style={{ color: '#1F4E46', fontWeight: '500' }}>Intet billede</Text>
        </View>
      )}

      {/* 🔹 Text content */}
      <View style={styles.cardHeaderRow}>
        <Text
          style={[styles.cardTitle, { flex: 1 }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.title || 'Parkeringsplads'}
        </Text>
        <View
          style={{
            backgroundColor: '#1F4E46',
            borderRadius: 6,
            paddingVertical: 2,
            paddingHorizontal: 8,
            marginLeft: 6,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            {item.pricePerHour ?? '-'} kr/t
          </Text>
        </View>
      </View>

      <Text
        style={[styles.cardSubtitle, { marginTop: 4 }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {item.address || 'Adresse ikke angivet'}
      </Text>
    </TouchableOpacity>
  );
}
