// src/screens/auth/LoginScreen.js
// Redesignet login-skærm med centreret layout og brandede farver

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import styles from '../../styles/styles';
import { useAuth } from '../../context/AuthContext';
import AuthContainer from '../../components/AuthContainer';


export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    try {
      setBusy(true);
      await signIn(email.trim(), password);
    } catch (e) {
      Alert.alert('Login mislykkedes', e.message || 'Ukendt fejl');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthContainer>
      <Text style={styles.authHeader}>Log ind</Text>

      <Text style={styles.inputLabel}>Email</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="din@email.dk"
        placeholderTextColor="#9EB7AA"
      />

      <Text style={styles.inputLabel}>Adgangskode</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        placeholderTextColor="#9EB7AA"
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={busy}>
        <Text style={styles.primaryButtonText}>{busy ? 'Logger ind…' : 'Log ind'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.linkButton, { marginTop: 16 }]}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={[styles.linkText, { color: '#1F4E46' }]}>Har du ikke en konto? Opret her</Text>
      </TouchableOpacity>
    </AuthContainer>

  );
}
