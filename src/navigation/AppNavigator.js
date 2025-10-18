// AppNavigator.js
// Forbedret udgave med professionel styling og konsistent design
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRole } from '../context/RoleContext';
import { useAuth } from '../context/AuthContext';

// Navigationsstakke
import AuthStack from './AuthStack';
import CustomerTabs from './CustomerTabs';
import ProviderTabs from './ProviderTabs';

// Skærme
import RequestDetailsScreen from '../screens/provider/RequestDetailsScreen';
import SpotDetailsScreen from '../screens/customer/SpotDetailsScreen';
import AddSpotScreen from '../screens/provider/AddSpotScreen';
import EditSpotScreen from '../screens/provider/EditSpotScreen';
import S_RequestTimeScreen from '../screens/customer/S_RequestTimeScreen';
import S_RequestSummaryScreen from '../screens/customer/S_RequestSummaryScreen';
import H_CustomerProfileScreen from '../screens/customer/H_CustomerProfileScreen';
import H_ProviderPayoutScreen from '../screens/provider/H_ProviderPayoutScreen';

// 🎨 Eget brandet tema
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#E9F5EC', // soft green background
    primary: '#1F4E46', // main brand color
    text: '#102420', // deep readable text
    card: '#FFFFFF', // header background
    border: '#DCEFE2', // subtle border
  },
};

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { role } = useRole();
  const { user, initializing } = useAuth();

  if (initializing) {
    return null; // Optional: add splash screen later
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTintColor: '#1F4E46',
          headerStyle: {
            backgroundColor: '#FFFFFF',
            shadowColor: 'transparent',
            borderBottomColor: '#DCEFE2',
            borderBottomWidth: 1,
          },
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          contentStyle: {
            backgroundColor: '#E9F5EC',
          },
          animation: 'fade', // smoother transitions
        }}
      >
        {!user ? (
          <Stack.Screen
            name="Auth"
            component={AuthStack}
            options={{ headerShown: false }}
          />
        ) : role === 'customer' ? (
          <Stack.Screen
            name="Customer"
            component={CustomerTabs}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Provider"
            component={ProviderTabs}
            options={{ headerShown: false }}
          />
        )}

        {/* Generelle detaljer-sider */}
        <Stack.Screen
          name="RequestDetails"
          component={RequestDetailsScreen}
          options={{ title: 'Forespørgsel' }}
        />
        <Stack.Screen
          name="SpotDetails"
          component={SpotDetailsScreen}
          options={{ title: 'Parkeringsplads' }}
        />
        <Stack.Screen
          name="AddSpot"
          component={AddSpotScreen}
          options={{ title: 'Opret parkeringsplads' }}
        />
        <Stack.Screen
          name="EditSpot"
          component={EditSpotScreen}
          options={{ title: 'Rediger parkeringsplads' }}
        />
        <Stack.Screen
          name="RequestTime"
          component={S_RequestTimeScreen}
          options={{ title: 'Vælg tidspunkt' }}
        />
        <Stack.Screen
          name="RequestSummary"
          component={S_RequestSummaryScreen}
          options={{ title: 'Opsummering' }}
        />

        {/* H-skærme */}
        <Stack.Screen
          name="CustomerProfileDetails"
          component={H_CustomerProfileScreen}
          options={{ title: 'Profiloplysninger' }}
        />
        <Stack.Screen
          name="ProviderPayout"
          component={H_ProviderPayoutScreen}
          options={{ title: 'Udbetalingsoplysninger' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
