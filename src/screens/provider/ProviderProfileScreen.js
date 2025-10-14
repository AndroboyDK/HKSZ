import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import styles from '../../styles/styles';
import { useRole } from '../../context/RoleContext';
import { useAuth } from '../../context/AuthContext';
import { seedRequestsForProvider, seedSpotsForProvider } from '../../data/seed';
import { useNavigation } from '@react-navigation/native';

export default function ProviderProfileScreen() {
  const { toggleRole } = useRole();
  const { signOut, user } = useAuth();
  const navigation = useNavigation();

  const handleSeed = async () => {
    try {
      await seedRequestsForProvider({ providerUid: user.uid });
      Alert.alert('Seeded', 'Demo requests created.');
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to seed.');
    }
  };

  const handleSeedSpots = async () => {
    try {
      await seedSpotsForProvider({ providerUid: user.uid });
      Alert.alert('Seeded', 'Demo spots created.');
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to seed spots.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Provider Profile</Text>

      <View style={styles.section}>
        <Text style={styles.h2}>Administration</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Udbetalingsoplysninger (bank)</Text>
          <Text style={styles.listItem}>• Mine parkeringspladser (tilføj/redigér)</Text>
          <Text style={styles.listItem}>• Tilgængelighed & priser</Text>
          <Text style={styles.listItem}>• Verifikation (ID/Adresse)</Text>
        </View>
      </View>

      {/* 👇 Ny knap til H_ProviderPayoutScreen */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('ProviderPayout')}
      >
        <Text style={styles.secondaryButtonText}>Udbetalingsoplysninger</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={toggleRole}>
        <Text style={styles.secondaryButtonText}>Skift til Customer View</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleSeed}>
        <Text style={styles.secondaryButtonText}>Seed demo requests</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleSeedSpots}>
        <Text style={styles.secondaryButtonText}>Seed demo spots</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={signOut}>
        <Text style={styles.secondaryButtonText}>Log ud</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
