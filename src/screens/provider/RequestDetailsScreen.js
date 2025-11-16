// src/screens/provider/RequestDetailsScreen.js
// Dansk – detaljer for en bookinganmodning

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../lib/firebase';
import {
  doc,
  onSnapshot,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import styles from '../../styles/styles';

export default function RequestDetailsScreen({ route, navigation }) {
  const { requestId } = route.params || {};
  const [request, setRequest] = useState(null);
  const [busy, setBusy] = useState(false);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [customerReviews, setCustomerReviews] = useState([]); // 🔹 NY

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

  // 🔹 Hent kundens profil (inkl. rating)
  useEffect(() => {
    const loadCustomer = async () => {
      try {
        if (!request?.customerUid) return;
        const ref = doc(db, 'users', request.customerUid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setCustomerProfile(snap.data());
        }
      } catch (e) {
        console.log('Kunne ikke hente kundens profil:', e);
      }
    };
    loadCustomer();
  }, [request?.customerUid]);

  // 🔹 Hent kundens seneste anmeldelser
  useEffect(() => {
    let live = true;
    const loadReviews = async () => {
      try {
        if (!request?.customerUid) return;
        const q = query(
          collection(db, 'reviews'),
          where('toUid', '==', request.customerUid),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const snap = await getDocs(q);
        if (!live) return;
        const out = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCustomerReviews(out);
      } catch (e) {
        console.log('Kunne ikke hente kundens anmeldelser:', e);
      }
    };
    loadReviews();
    return () => {
      live = false;
    };
  }, [request?.customerUid]);

  // ✅ Accepter anmodning og opret komplet leje
  const handleAccept = async () => {
    if (!request) return;
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

      Alert.alert('Accepteret', `Lejeaftale oprettet for ${request?.customer || 'kunden'}.`);
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
    if (!request) return;
    try {
      setBusy(true);
      await updateDoc(doc(db, 'requests', requestId), { status: 'declined' });
      Alert.alert('Afvist', `Du har afvist ${request?.customer || 'kundens'} anmodning.`);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Fejl', e.message || 'Kunne ikke afvise anmodningen.');
    } finally {
      setBusy(false);
    }
  };

  const confirmAccept = () => {
    if (!request || request.status !== 'pending' || busy) return;
    Alert.alert(
      'Accepter anmodning',
      'Når du accepterer, oprettes en aktiv leje, og pladsen markeres som optaget.',
      [
        { text: 'Annuller', style: 'cancel' },
        { text: 'Ja, accepter', onPress: handleAccept },
      ]
    );
  };

  const confirmDecline = () => {
    if (!request || request.status !== 'pending' || busy) return;
    Alert.alert(
      'Afvis anmodning',
      'Er du sikker på, at du vil afvise denne anmodning?',
      [
        { text: 'Annuller', style: 'cancel' },
        { text: 'Ja, afvis', style: 'destructive', onPress: handleDecline },
      ]
    );
  };

  // 🔹 Loading / fejl states
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
        <ActivityIndicator size="large" color="#1F4E46" />
        <Text style={[styles.cardSubtitle, { marginTop: 12 }]}>Indlæser anmodning…</Text>
      </View>
    );
  }

  const isPending = request.status === 'pending';
  const price = request.price ?? request.quotedPrice ?? null;
  const ratingData = customerProfile?.rating;
  const avgRating = typeof ratingData?.avg === 'number' ? ratingData.avg : null;
  const ratingCount = ratingData?.count || 0;

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 24 }]}>
      {/* Header */}
      <Text style={styles.h1}>Anmodning</Text>
      <Text style={[styles.cardSubtitle, { marginTop: 4 }]}>
        Gennemgå detaljerne og vælg, om du vil acceptere eller afvise.
      </Text>

      {/* Kort med detaljer */}
      <View style={[styles.card, { marginTop: 16, padding: 16 }]}>
        {/* Kunde */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons
            name="person-circle-outline"
            size={26}
            color="#1F4E46"
            style={{ marginRight: 8 }}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>
              {request.customer || 'Ukendt kunde'}
            </Text>
            <Text style={[styles.cardSubtitle, { fontSize: 12 }]}>
              Booking forespørgsel
            </Text>
          </View>
        </View>

        {/* ⭐ Kundens rating */}
        {avgRating != null && ratingCount > 0 ? (
          <>
            <Text style={[styles.cardSubtitle, { marginTop: 4 }]}>
              Kundens rating: {avgRating.toFixed(1)} ⭐ ({ratingCount} anmeldelser)
            </Text>

            {/* 🔹 Seneste anmeldelser af kunden */}
            {customerReviews.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <Text style={[styles.cardSubtitle, { fontWeight: '600', marginBottom: 4 }]}>
                  Seneste anmeldelser af denne kunde
                </Text>
                {customerReviews.map((r) => (
                  <View key={r.id} style={{ marginTop: 4 }}>
                    <Text style={styles.cardSubtitle}>⭐ {r.stars}</Text>
                    {!!r.comment && (
                      <Text
                        style={[
                          styles.cardSubtitle,
                          { fontSize: 12, color: '#3d6a61' },
                        ]}
                      >
                        {r.comment}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

          </>
        ) : (
          <Text style={[styles.cardSubtitle, { marginTop: 4 }]}>
            Kunden er endnu ikke blevet bedømt.
          </Text>
        )}

        {/* Plads */}
        <View style={{ marginTop: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="pin-outline" size={18} color="#555" style={{ marginRight: 6 }} />
            <Text style={[styles.cardSubtitle, { fontWeight: '600' }]}>
              {request.spotTitle || 'Ukendt parkeringsplads'}
            </Text>
          </View>
        </View>

        {/* Tid */}
        {request.time && (
          <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'flex-start' }}>
            <Ionicons
              name="time-outline"
              size={18}
              color="#555"
              style={{ marginRight: 6, marginTop: 2 }}
            />
            <Text style={[styles.cardSubtitle, { flex: 1 }]}>{request.time}</Text>
          </View>
        )}

        {/* Pris */}
        {price != null && (
          <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="wallet-outline" size={18} color="#555" style={{ marginRight: 6 }} />
            <Text style={[styles.cardSubtitle, { fontWeight: '600' }]}>
              Samlet pris: {price} kr
            </Text>
          </View>
        )}

        {/* Køretøj */}
        {request.vehicle && (
          <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="car-outline" size={18} color="#555" style={{ marginRight: 6 }} />
            <Text style={styles.cardSubtitle}>Køretøj: {request.vehicle}</Text>
          </View>
        )}

        {/* Noter */}
        {request.notes && (
          <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'flex-start' }}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color="#555"
              style={{ marginRight: 6, marginTop: 2 }}
            />
            <Text style={[styles.cardSubtitle, { flex: 1 }]}>{request.notes}</Text>
          </View>
        )}

        {/* Status */}
        <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons
            name={
              request.status === 'pending'
                ? 'help-circle-outline'
                : request.status === 'accepted'
                  ? 'checkmark-circle-outline'
                  : 'close-circle-outline'
            }
            size={18}
            color={
              request.status === 'pending'
                ? '#E6A700'
                : request.status === 'accepted'
                  ? '#1F4E46'
                  : '#C62828'
            }
            style={{ marginRight: 6 }}
          />
          <Text style={styles.cardSubtitle}>Status: {request.status}</Text>
        </View>
      </View>

      {/* Info-tekst */}
      <View style={{ marginTop: 12 }}>
        <Text style={[styles.cardSubtitle, { fontSize: 12, color: '#3d6a61' }]}>
          Ved accept oprettes automatisk en aktiv leje, og parkeringspladsen markeres som optaget.
          Ved afvisning får kunden besked om, at deres forespørgsel ikke er godkendt.
        </Text>
      </View>

      {/* Knapper */}
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { opacity: !isPending || busy ? 0.7 : 1 },
          ]}
          disabled={!isPending || busy}
          onPress={confirmAccept}
        >
          <Text style={styles.primaryButtonText}>
            {busy ? 'Behandler…' : 'Accepter anmodning'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryButton,
            { marginTop: 12, opacity: !isPending || busy ? 0.7 : 1 },
          ]}
          disabled={!isPending || busy}
          onPress={confirmDecline}
        >
          <Text style={styles.secondaryButtonText}>Afvis anmodning</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
