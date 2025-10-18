// src/screens/provider/RequestDetailsScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { db } from '../../lib/firebase';
import {
    doc,
    onSnapshot,
    updateDoc,
    addDoc,
    collection,
    serverTimestamp,
    getDoc,
} from 'firebase/firestore';
import styles from '../../styles/styles';

export default function RequestDetailsScreen({ route, navigation }) {
    const { requestId } = route.params || {};
    const [request, setRequest] = useState(null);
    const [busy, setBusy] = useState(false);

    // 🔹 Hent den aktuelle anmodning live
    useEffect(() => {
        if (!requestId) return;
        const ref = doc(db, 'requests', requestId);
        const unsub = onSnapshot(ref, (snap) => {
            if (snap.exists()) setRequest({ id: snap.id, ...snap.data() });
            else setRequest(null);
        });
        return () => unsub();
    }, [requestId]);

    // ✅ Accepter anmodning og opret komplet leje
    const handleAccept = async () => {
        try {
            setBusy(true);

            // 1️⃣ Marker anmodningen som accepteret
            await updateDoc(doc(db, 'requests', requestId), { status: 'accepted' });

            // 2️⃣ Hent tilknyttede data
            const [spotSnap, providerSnap, customerSnap] = await Promise.all([
                request.spotId ? getDoc(doc(db, 'spots', request.spotId)) : null,
                request.providerUid ? getDoc(doc(db, 'users', request.providerUid)) : null,
                request.customerUid ? getDoc(doc(db, 'users', request.customerUid)) : null,
            ]);

            const spotData = spotSnap?.exists() ? spotSnap.data() : {};
            const providerData = providerSnap?.exists() ? providerSnap.data() : {};
            const customerData = customerSnap?.exists() ? customerSnap.data() : {};

            // 3️⃣ Opret ny leje med fulde oplysninger
            const rentalRef = await addDoc(collection(db, 'rentals'), {
                requestId,
                providerUid: request.providerUid,
                customerUid: request.customerUid || null,
                spotId: request.spotId || null,
                spotTitle: spotData.title || request.spotTitle || 'Ukendt parkeringsplads',
                address: spotData.address || 'Ukendt adresse',
                providerName: providerData.displayName || 'Ukendt udlejer',
                customerName: customerData.displayName || request.customer || 'Ukendt kunde',
                time: request.time || '',
                timeStart: serverTimestamp(),
                timeEnd: null,
                totalPrice: typeof request.price === 'number' ? request.price : 0,
                status: 'active',
                createdAt: serverTimestamp(),
            });

            // 4️⃣ Gør parkeringspladsen utilgængelig
            if (request.spotId) {
                await updateDoc(doc(db, 'spots', request.spotId), { isAvailable: false });
            }

            Alert.alert('Accepteret', `Lejeaftale oprettet for ${request?.customer}.`);
            console.log('✅ Rental created:', rentalRef.id);
            navigation.goBack();
        } catch (e) {
            Alert.alert('Fejl', e.message || 'Kunne ikke acceptere anmodningen.');
        } finally {
            setBusy(false);
        }
    };

    // ❌ Afvis anmodning
    const handleDecline = async () => {
        try {
            setBusy(true);
            await updateDoc(doc(db, 'requests', requestId), { status: 'declined' });
            Alert.alert('Afvist', `Du har afvist ${request?.customer}'s anmodning.`);
            navigation.goBack();
        } catch (e) {
            Alert.alert('Fejl', e.message || 'Kunne ikke afvise anmodningen.');
        } finally {
            setBusy(false);
        }
    };

    // 🔹 UI – loading states
    if (!requestId) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.h2}>Ingen anmodning valgt.</Text>
            </View>
        );
    }
    if (!request) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator />
                <Text style={[styles.cardSubtitle, { marginTop: 12 }]}>Indlæser…</Text>
            </View>
        );
    }

    // 🔹 UI – detaljevisning
    return (
        <View style={styles.container}>
            <Text style={styles.h1}>Anmodningsdetaljer</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>{request.customer}</Text>
                <Text style={styles.cardSubtitle}>{request.spotTitle || 'Ukendt parkeringsplads'}</Text>
                <Text style={styles.cardSubtitle}>{request.time}</Text>
                {request.price ? <Text style={styles.cardSubtitle}>Pris: {request.price} kr</Text> : null}
                {request.vehicle ? <Text style={styles.cardSubtitle}>Køretøj: {request.vehicle}</Text> : null}
                {request.notes ? <Text style={styles.cardSubtitle}>Noter: {request.notes}</Text> : null}
                <Text style={[styles.cardSubtitle, { marginTop: 8 }]}>Status: {request.status}</Text>
            </View>

            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.primaryButtonSmall}
                    onPress={handleAccept}
                    disabled={busy || request.status !== 'pending'}
                >
                    <Text style={styles.primaryButtonText}>
                        {busy ? 'Accepterer…' : 'Accepter'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButtonSmall}
                    onPress={handleDecline}
                    disabled={busy || request.status !== 'pending'}
                >
                    <Text style={styles.secondaryButtonText}>Afvis</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
