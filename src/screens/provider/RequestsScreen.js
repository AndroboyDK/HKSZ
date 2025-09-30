import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from '../../styles/styles';
// import { mockRequests } from '../../data/mock';
import { useNavigation } from '@react-navigation/native';
// Firestore live data

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';





export default function RequestsScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'requests'),
            where('providerUid', '==', user.uid),
            where('status', '==', 'pending')
        );
        const unsub = onSnapshot(q, (snap) => {
            const rows = [];
            snap.forEach((doc) => rows.push({ id: doc.id, ...doc.data() }));
            setRequests(rows);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    return (
        <View style={styles.containerList}>
            <FlatList
                data={requests}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={<Text style={styles.h1}>Requests</Text>}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.cardSubtitle}>
                        {loading ? 'Loading…' : 'No pending requests.'}
                    </Text>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('RequestDetails', { requestId: item.id })}
                    >
                        <Text style={styles.cardTitle}>{item.customer}</Text>
                        <Text style={styles.cardSubtitle}>{item.spot}</Text>
                        <Text style={styles.cardSubtitle}>{item.time}</Text>
                        <Text style={[styles.cardSubtitle, { marginTop: 6 }]}>Tap to view details →</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}