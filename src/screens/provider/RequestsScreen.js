// src/screens/provider/RequestsScreen.js
// Dansk version – viser alle ventende anmodninger til udlejeren

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from '../../styles/styles';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

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
            where('status', '==', 'pending'),
            orderBy('createdAt', 'desc')
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
                ListHeaderComponent={<Text style={styles.h1}>Afventende anmodninger</Text>}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.cardSubtitle}>
                        {loading ? 'Indlæser…' : 'Der er ingen nye anmodninger lige nu.'}
                    </Text>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('RequestDetails', { requestId: item.id })}
                    >
                        <Text style={styles.cardTitle}>{item.customer || 'Ukendt kunde'}</Text>
                        <Text style={styles.cardSubtitle}>
                            {item.spotTitle || 'Ukendt parkeringsplads'}
                        </Text>
                        <Text style={styles.cardSubtitle}>
                            {item.time || 'Ingen tidsangivelse'}
                        </Text>
                        {item.price && (
                            <Text style={[styles.cardSubtitle, { marginTop: 2 }]}>
                                Pris: {item.price} kr
                            </Text>
                        )}
                        <Text style={[styles.cardSubtitle, { marginTop: 8, color: '#1F4E46' }]}>
                            Tryk for at se detaljer →
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
