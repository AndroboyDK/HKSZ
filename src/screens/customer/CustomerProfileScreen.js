import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../../styles/styles';
import { useRole } from '../../context/RoleContext';
import { Ionicons } from '@expo/vector-icons';


export default function CustomerProfileScreen() {
    const { toggleRole } = useRole();


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.h1}>Profil</Text>


            <View style={styles.section}>
                <Text style={styles.h2}>Valgmuligheder</Text>
                <View style={styles.list}>
                    <Text style={styles.listItem}>• Profiloplysninger</Text>
                    <Text style={styles.listItem}>• Biloplysninger</Text>
                    <Text style={styles.listItem}>• Betalingsoplysninger</Text>
                </View>
            </View>


            <TouchableOpacity style={styles.primaryButton} onPress={toggleRole}>
                <Ionicons name="swap-horizontal" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.primaryButtonText}>Skift til Provider View</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}