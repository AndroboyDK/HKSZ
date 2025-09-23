import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import styles from '../../styles/styles';


export default function RequestDetailsScreen({ route, navigation }) {
    const { request } = route.params || {};


    if (!request) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.h2}>No request data provided.</Text>
            </View>
        );
    }


    const handleAccept = () => {
        Alert.alert('Accepted', `You accepted ${request.customer}'s request for ${request.spot}.`);
        navigation.goBack();
    };


    const handleDecline = () => {
        Alert.alert('Declined', `You declined ${request.customer}'s request.`);
        navigation.goBack();
    };


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

            </View>


            <View style={styles.row}>
                <TouchableOpacity style={styles.primaryButtonSmall} onPress={handleAccept}>
                    <Text style={styles.primaryButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButtonSmall} onPress={handleDecline}>
                    <Text style={styles.secondaryButtonText}>Decline</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}