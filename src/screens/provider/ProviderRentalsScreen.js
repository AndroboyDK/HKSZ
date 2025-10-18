// src/screens/provider/ProviderRentalsScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from '../../styles/styles';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export default function ProviderRentalsScreen() {
    const { user } = useAuth();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'rentals'),
            where('providerUid', '==', user.uid),
            where('status', '==', 'completed'),
            orderBy('createdAt', 'desc')
        );

        const unsub = onSnapshot(q, (snap) => {
            const out = [];
            snap.forEach((d) => out.push({ id: d.id, ...d.data() }));
            setRows(out);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    return (
        <View style={styles.containerList}>
            <FlatList
                data={rows}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={<Text style={styles.h1}>Tidligere udlejninger</Text>}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.cardSubtitle}>
                        {loading ? 'Indlæser…' : 'Ingen tidligere udlejninger endnu.'}
                    </Text>
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item.spotTitle}</Text>
                        <Text style={styles.cardSubtitle}>{item.address}</Text>
                        <Text style={styles.cardSubtitle}>Lejer: {item.customerName || 'Ukendt'}</Text>
                        <Text style={styles.cardSubtitle}>Periode: {item.time}</Text>
                        <Text style={styles.cardSubtitle}>Status: {item.status}</Text>
                        <Text style={[styles.cardValue, { marginTop: 6 }]}>
                            {item.totalPrice ?? 0} kr (indtægt)
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}
