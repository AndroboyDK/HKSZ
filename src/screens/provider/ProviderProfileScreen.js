import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../../styles/styles';
import { useRole } from '../../context/RoleContext';


export default function ProviderProfileScreen() {
const { toggleRole } = useRole();


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


<TouchableOpacity style={styles.secondaryButton} onPress={toggleRole}>
<Text style={styles.secondaryButtonText}>Skift til Customer View</Text>
</TouchableOpacity>
</ScrollView>
);
}