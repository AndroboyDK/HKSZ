// src/screens/shared/RateUserScreen.js
// Fælles skærm til at rate kunde/udlejer efter afsluttet leje

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  runTransaction,
} from 'firebase/firestore';
import styles from '../../styles/styles';

export default function RateUserScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();

  // Kommer fra navigationen
  // role = 'provider'  → du bedømmer udlejer
  // role = 'customer'  → du bedømmer kunde
  const {
    rentalId,
    toUid,
    toName = 'Bruger',
    role = 'provider',
  } = route.params || {};

  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  if (!rentalId || !toUid || !user) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={styles.cardSubtitle}>
          Kan ikke vise bedømmelse – mangler data.
        </Text>
      </View>
    );
  }

  const title =
    role === 'provider'
      ? `Bedøm udlejer`
      : `Bedøm lejer`;

  const subtitle =
    role === 'provider'
      ? `Hvordan var din oplevelse med ${toName} som udlejer?`
      : `Hvordan var din oplevelse med ${toName} som lejer?`;

  const handleSubmit = async () => {
    if (!stars) {
      Alert.alert('Fejl', 'Vælg antal stjerner først.');
      return;
    }

    try {
      setBusy(true);

      // 1️⃣ Opret rating-dokument
      await addDoc(collection(db, 'ratings'), {
        rentalId,
        fromUid: user.uid,
        toUid,
        role,
        stars,
        comment: comment.trim(),
        createdAt: serverTimestamp(),
      });

      // 2️⃣ Opdater aggregeret rating på bruger
      const ratedUserRef = doc(db, 'users', toUid);
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ratedUserRef);
        const data = snap.exists() ? snap.data() : {};

        const current = data.rating || {};
        const count = Number(current.count || 0);
        const sum = Number(current.sum || 0);

        const newCount = count + 1;
        const newSum = sum + stars;
        const newAvg = newSum / newCount;

        tx.set(
          ratedUserRef,
          {
            rating: {
              count: newCount,
              sum: newSum,
              avg: newAvg,
            },
          },
          { merge: true }
        );
      });

      Alert.alert('Tak!', 'Din bedømmelse er gemt.', [
        {
          text: 'OK',
          onPress: () => navigation.popToTop(),
        },
      ]);
    } catch (e) {
      console.log('Rating fejl:', e);
      Alert.alert('Fejl', 'Kunne ikke gemme bedømmelsen. Prøv igen.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 24 }]}>
      <Text style={styles.h1}>{title}</Text>
      <Text style={[styles.cardSubtitle, { marginBottom: 16 }]}>{subtitle}</Text>

      {/* ⭐ Stjerner */}
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        {[1, 2, 3, 4, 5].map((v) => (
          <TouchableOpacity
            key={v}
            onPress={() => setStars(v)}
            style={{ marginRight: 4 }}
          >
            <Ionicons
              name={v <= stars ? 'star' : 'star-outline'}
              size={32}
              color="#F5A623"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* 💬 Kort kommentar */}
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        placeholder="Kort feedback (valgfrit)"
        value={comment}
        onChangeText={setComment}
        multiline
        maxLength={300}
      />

      <TouchableOpacity
        style={[styles.primaryButton, { marginTop: 16 }]}
        onPress={handleSubmit}
        disabled={busy}
      >
        <Text style={styles.primaryButtonText}>
          {busy ? 'Gemmer…' : 'Gem bedømmelse'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
