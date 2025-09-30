import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../../styles/styles';
import { useRole } from '../../context/RoleContext';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';



export default function CustomerProfileScreen() {
    const { toggleRole } = useRole();
    const { signOut } = useAuth();



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
            <TouchableOpacity style={styles.secondaryButton} onPress={signOut}>
                <Text style={styles.secondaryButtonText}>Log ud</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}