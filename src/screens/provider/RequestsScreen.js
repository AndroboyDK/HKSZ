import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from '../../styles/styles';
import { mockRequests } from '../../data/mock';
import { useNavigation } from '@react-navigation/native';
export default function RequestsScreen() {
    const navigation = useNavigation();
    return (
        <View style={styles.containerList}>
            <FlatList
                data={mockRequests}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('RequestDetails', { request: item })}
                    >
                        <Text style={styles.cardTitle}>{item.customer}</Text>
                        <Text style={styles.cardSubtitle}>{item.spot}</Text>
                        <Text style={styles.cardSubtitle}>{item.time}</Text>
                        <Text style={[styles.cardSubtitle, { marginTop: 6 }]}>Tap to view details →</Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListHeaderComponent={<Text style={styles.h1}>Requests</Text>}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}