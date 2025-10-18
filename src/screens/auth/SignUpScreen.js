// Redesigned signup screen using same brand layout as LoginScreen

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import styles from '../../styles/styles';
import { useAuth } from '../../context/AuthContext';
import AuthContainer from '../../components/AuthContainer';

export default function SignUpScreen({ navigation }) {
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [carModel, setCarModel] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSignUp = async () => {
    if (!displayName || !email || !password) {
      Alert.alert('Udfyld alle obligatoriske felter', 'Navn, email og adgangskode skal udfyldes.');
      return;
    }

    try {
      setBusy(true);
      await signUp(email.trim(), password, displayName.trim(), {
        phone: phone.trim(),
        carModel: carModel.trim(),
        licensePlate: licensePlate.trim(),
      });
    } catch (e) {
      Alert.alert('Fejl ved oprettelse', e.message || 'Der opstod en ukendt fejl.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ width: '100%' }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.authHeader}>Opret konto</Text>

          {/* Full name */}
          <Text style={styles.inputLabel}>Fulde navn</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="F.eks. Anna Jensen"
            placeholderTextColor="#9EB7AA"
          />

          {/* Email */}
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="anna@email.com"
            placeholderTextColor="#9EB7AA"
          />

          {/* Password */}
          <Text style={styles.inputLabel}>Adgangskode</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#9EB7AA"
          />

          {/* Phone */}
          <Text style={styles.inputLabel}>Telefonnummer</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            placeholder="F.eks. 12345678"
            placeholderTextColor="#9EB7AA"
          />

          {/* Car model */}
          <Text style={styles.inputLabel}>Bilmodel</Text>
          <TextInput
            style={styles.input}
            value={carModel}
            onChangeText={setCarModel}
            placeholder="F.eks. Tesla Model 3"
            placeholderTextColor="#9EB7AA"
          />

          {/* License plate */}
          <Text style={styles.inputLabel}>Nummerplade</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="characters"
            value={licensePlate}
            onChangeText={setLicensePlate}
            placeholder="F.eks. AB12345"
            placeholderTextColor="#9EB7AA"
          />

          {/* Submit */}
          <TouchableOpacity
            style={[styles.primaryButton, { marginTop: 24 }]}
            onPress={handleSignUp}
            disabled={busy}
          >
            <Text style={styles.primaryButtonText}>
              {busy ? 'Opretter…' : 'Opret konto'}
            </Text>
          </TouchableOpacity>

          {/* Link to Login */}
          <TouchableOpacity
            style={[styles.linkButton, { marginTop: 16 }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.linkText, { color: '#1F4E46' }]}>
              Har du allerede en konto? Log ind
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthContainer>
  );
}
