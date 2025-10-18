// src/components/AuthContainer.js
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, Image } from 'react-native';
import styles from '../styles/styles';

export default function AuthContainer({ children }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#F4FAF6' }} 
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../../assets/icon.png')}
          style={styles.authLogo}
        />
        <View style={styles.authCard}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
