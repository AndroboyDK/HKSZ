// src/screens/auth/SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../../styles/styles';
import { useAuth } from '../../context/AuthContext';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSignUp = async () => {
    try {
      setBusy(true);
      await signUp(email.trim(), password, displayName.trim());
      // on success, AuthContext will take you into the app
    } catch (e) {
      Alert.alert('Sign up failed', e.message || 'Unknown error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Opret konto</Text>

      <Text style={styles.inputLabel}>Navn</Text>
      <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} />

      <Text style={styles.inputLabel}>Email</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.inputLabel}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp} disabled={busy}>
        <Text style={styles.primaryButtonText}>{busy ? 'Opretter…' : 'Opret konto'}</Text>
      </TouchableOpacity>
    </View>
  );
}
