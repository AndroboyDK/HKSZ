import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { RoleProvider } from './src/context/RoleContext';
import { AuthProvider } from './src/context/AuthContext';



export default function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </RoleProvider>
    </AuthProvider>
  );
}