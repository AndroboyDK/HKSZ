import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomerTabs from './CustomerTabs';
import ProviderTabs from './ProviderTabs';
import { useRole } from '../context/RoleContext';
import RequestDetailsScreen from '../screens/provider/RequestDetailsScreen';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import SpotDetailsScreen from '../screens/customer/SpotDetailsScreen';
import AddSpotScreen from '../screens/provider/AddSpotScreen';
import EditSpotScreen from '../screens/provider/EditSpotScreen';



const Stack = createNativeStackNavigator();
const navTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: '#ffffff' },
};
export default function AppNavigator() {
    const { role } = useRole();
    const { user, initializing } = useAuth();

    if (initializing) {
        return null; // (Optional) add a splash/loading later
    }
    return (
        <NavigationContainer theme={navTheme}>

            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    <Stack.Screen name="Auth" component={AuthStack} />
                ) : role === 'customer' ? (
                    <Stack.Screen name="Customer" component={CustomerTabs} />
                ) : (
                    <Stack.Screen name="Provider" component={ProviderTabs} />
                )}
                <Stack.Screen name="RequestDetails" component={RequestDetailsScreen} options={{ headerShown: true, title: 'Request Details' }} />
                <Stack.Screen name="SpotDetails" component={SpotDetailsScreen} options={{ headerShown: true, title: 'Spot Details' }} />
                <Stack.Screen name="AddSpot" component={AddSpotScreen} options={{ title: 'Add Spot' }} />
                <Stack.Screen name="EditSpot" component={EditSpotScreen} options={{ title: 'Edit Spot' }} />

            </Stack.Navigator>

        </NavigationContainer>
    );
}