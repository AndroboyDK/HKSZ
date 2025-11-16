// src/screens/provider/ProviderRentalsScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#1F4E46" />
                <Text style={{ marginTop: 10, color: '#1F4E46' }}>
                    Indlæser tidligere udlejninger...
                </Text>
            </View>
        );
    }

    const renderItem = ({ item }) => {
        const priceText =
            typeof item.totalPrice === 'number' ? `${item.totalPrice} kr` : '0 kr';

        return (
            <View style={[styles.card, { padding: 18 }]}>
                {/* Header – titel + indtægt */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[styles.cardTitle, { flex: 1, flexWrap: 'wrap', paddingRight: 8 }]}>
                        {item.spotTitle || 'Parkeringsplads'}
                    </Text>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.cardValue, { color: '#1F4E46', fontWeight: '700' }]}>
                            {priceText}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#56766C' }}>Samlet indtægt</Text>
                    </View>
                </View>

                {/* Adresse */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                    <Ionicons
                        name="location-outline"
                        size={16}
                        color="#555"
                        style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.cardSubtitle, { flex: 1 }]}>
                        {item.address || 'Ukendt adresse'}
                    </Text>
                </View>

                {/* Lejer */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Ionicons
                        name="person-outline"
                        size={16}
                        color="#555"
                        style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.cardSubtitle, { flex: 1 }]}>
                        Lejer: {item.customerName || 'Ukendt'}
                    </Text>
                </View>

                {/* Periode / tid */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Ionicons
                        name="time-outline"
                        size={16}
                        color="#555"
                        style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.cardSubtitle, { flex: 1 }]}>
                        {item.time || 'Periode ikke angivet'}
                    </Text>
                </View>

                {/* Status-pill (selv om de er completed, ser det rart ud) */}
                <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <View
                        style={{
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 999,
                            backgroundColor: '#E5F3EB',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 11,
                                fontWeight: '600',
                                color: '#1F4E46',
                                textTransform: 'capitalize',
                            }}
                        >
                            {item.status || 'Afsluttet'}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.containerList}>
            <FlatList
                data={rows}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <Text style={styles.h1}>Tidligere udlejninger</Text>
                }
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={[styles.cardSubtitle, { textAlign: 'center', marginTop: 16 }]}>
                        Ingen tidligere udlejninger endnu.
                    </Text>
                }
                renderItem={renderItem}
            />
        </View>
    );
}
