// Oprettet af Suzan
// Dette skærm viser en opsummering af den valgte booking og opretter en request i Firestore.

import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../lib/firebase';
import styles from '../../styles/styles';

export default function S_RequestSummaryScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { spot, timeStart, timeEnd, quotedPrice } = route.params;
    const auth = getAuth();
    const user = auth.currentUser;

    const handleConfirm = async () => {
        try {
            await addDoc(collection(db, 'requests'), {
                spotId: spot.id,
                spotTitle: spot.title, // added for provider display
                providerUid: spot.providerUid,
                customerUid: user.uid,
                customer: user.displayName || 'Customer', // added
                timeStart,
                timeEnd,
                time: `${new Date(timeStart).toLocaleString()} - ${new Date(timeEnd).toLocaleString()}`, // keep old style string
                quotedPrice,
                price: quotedPrice, // added for compatibility
                vehicle: 'N/A', // keep MVP placeholders
                notes: '',
                status: 'pending',
                createdAt: serverTimestamp(),
            });

            Alert.alert('Booking sendt', 'Forespørgslen er sendt til udlejeren.');
            navigation.popToTop();
        } catch (error) {
            Alert.alert('Fejl', 'Kunne ikke sende forespørgslen.');
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Opsummering</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>{spot.title}</Text>
                <Text style={styles.cardSubtitle}>{spot.address}</Text>
                <Text>Start: {new Date(timeStart).toLocaleString()}</Text>
                <Text>Slut: {new Date(timeEnd).toLocaleString()}</Text>
                <Text style={{ marginTop: 8 }}>Samlet pris: {quotedPrice} kr.</Text>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleConfirm}>
                <Text style={styles.primaryButtonText}>Bekræft booking</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
