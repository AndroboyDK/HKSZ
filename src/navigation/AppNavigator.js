// AppNavigator.js
// Forbedret udgave med professionel styling og konsistent design

//her finder man skærme som ikke umiddelbart hører til en bestemt stack eller tab navigator - altså nogen man kommer ind på via skærme som er synlige i f.eks. tab navigators. 

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
import CustomerRentalsScreen from '../screens/customer/CustomerRentalsScreen';
import ProviderRentalsScreen from '../screens/provider/ProviderRentalsScreen';
import ProviderMySpotsScreen from '../screens/provider/ProviderMySpotsScreen';



// 🎨 Eget brandet tema
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#E9F5EC', // blød grøn baggrund
    primary: '#1F4E46', // hovedfarve
    text: '#102420', // mørk læsbar tekst
    card: '#FFFFFF', // header-baggrund
    border: '#DCEFE2', // diskret kant
  },
};

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { role } = useRole();
  const { user, initializing } = useAuth();

  if (initializing) {
    return null; // Valgfrit: tilføj splash-screen senere
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
          headerBackTitle: 'Tilbage',
          contentStyle: {
            backgroundColor: '#E9F5EC',
          },
          animation: 'fade', // glattere overgange
        }}
      >
        {!user ? (
          <Stack.Screen
            name="Auth"
            component={AuthStack}
            options={{ headerShown: false, title: 'Log ind / Opret konto' }}
          />
        ) : role === 'customer' ? (
          <Stack.Screen
            name="Customer"
            component={CustomerTabs}
            options={{ headerShown: false, title: 'Kunde' }}
          />
        ) : (
          <Stack.Screen
            name="Provider"
            component={ProviderTabs}
            options={{ headerShown: false, title: 'Udbyder' }}
          />
        )}

        {/* Generelle detaljesider */}
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

        <Stack.Screen
          name="CustomerRentals"
          component={CustomerRentalsScreen}
          options={{ title: 'Tidligere parkeringer' }}
        />
        <Stack.Screen
          name="ProviderRentals"
          component={ProviderRentalsScreen}
          options={{ title: 'Tidligere udlejninger' }}
        />
        <Stack.Screen
          name="ProviderMySpots"
          component={ProviderMySpotsScreen}
          options={{ title: 'Mine parkeringspladser' }}
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
