// Right now your AppNavigator switches by role (customer/provider). With auth, we add a top-level decision:

// If no user → show AuthStack (Login / Sign Up).

// If user → show AppStack (your existing Customer/Provider tabs + details screens).

// So:

// Create src/navigation/AuthStack.js with two screens: LoginScreen, SignUpScreen.

// Update src/navigation/AppNavigator.js to check user from AuthContext.
// If !user, return <AuthStack />; else return the existing role-based stacks.

// (We’ll keep the role toggle exactly as-is for now; we’ll persist role later.)


// src/navigation/AuthStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Log ind' }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Opret konto' }} />
    </Stack.Navigator>
  );
}
