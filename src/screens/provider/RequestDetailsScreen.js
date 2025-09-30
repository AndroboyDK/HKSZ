import React from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, onSnapshot, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import styles from '../../styles/styles';



export default function RequestDetailsScreen({ route, navigation }) {
    const { requestId } = route.params || {};
    const [request, setRequest] = useState(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (!requestId) return;
        const ref = doc(db, 'requests', requestId);
        const unsub = onSnapshot(ref, (snap) => {
            if (snap.exists()) {
                setRequest({ id: snap.id, ...snap.data() });
            } else {
                setRequest(null);
            }
        });
        return () => unsub();
    }, [requestId]);

    const handleAccept = async () => {
        try {
            setBusy(true);
            // 1) mark request as accepted (and stamp timeStart)
            await updateDoc(doc(db, 'requests', requestId), { status: 'accepted' });
            // 2) create rental document (now include timeStart)
            await addDoc(collection(db, 'rentals'), {
                requestId,
                providerUid: request.providerUid,
                customerUid: request.customerUid || null,
                spotId: request.spotId || null,
                spotTitle: request.spot || '',
                time: request.time || '',
                totalPrice: typeof request.price === 'number' ? request.price : 0,
                status: 'active',
                timeStart: serverTimestamp(),
                timeEnd: null,
                createdAt: serverTimestamp(),
            });
            // 3) lock the spot (set unavailable) if we have spotId
            if (request.spotId) {
                await updateDoc(doc(db, 'spots', request.spotId), { isAvailable: false });
            }
            Alert.alert('Accepted', `Rental created for ${request?.customer}.`);
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', e.message || 'Failed to accept');
        } finally {
            setBusy(false);
        }
    };

    const handleDecline = async () => {
        try {
            setBusy(true);
            await updateDoc(doc(db, 'requests', requestId), { status: 'declined' });
            Alert.alert('Declined', `You declined ${request?.customer}'s request.`);
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', e.message || 'Failed to decline');
        } finally {
            setBusy(false);
        }
    };

    if (!requestId) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.h2}>No request id provided.</Text>
            </View>
        );
    }
    if (!request) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator />
                <Text style={[styles.cardSubtitle, { marginTop: 12 }]}>Loading…</Text>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Text style={styles.h1}>Request Details</Text>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{request.customer}</Text>
                <Text style={styles.cardSubtitle}>{request.spot}</Text>
                <Text style={styles.cardSubtitle}>{request.time}</Text>
                {request.price ? <Text style={styles.cardSubtitle}>Price: {request.price} kr</Text> : null}
                {request.vehicle ? <Text style={styles.cardSubtitle}>Vehicle: {request.vehicle}</Text> : null}
                {request.notes ? <Text style={styles.cardSubtitle}>Notes: {request.notes}</Text> : null}
                <Text style={[styles.cardSubtitle, { marginTop: 8 }]}>Status: {request.status}</Text>
            </View>
            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.primaryButtonSmall}
                    onPress={handleAccept}
                    disabled={busy || request.status !== 'pending'}
                >
                    <Text style={styles.primaryButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.secondaryButtonSmall}
                    onPress={handleDecline}
                    disabled={busy || request.status !== 'pending'}
                >
                    <Text style={styles.secondaryButtonText}>Decline</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}