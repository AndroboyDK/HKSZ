import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomerTabs from './CustomerTabs';
import ProviderTabs from './ProviderTabs';
import { useRole } from '../context/RoleContext';
import RequestDetailsScreen from '../screens/provider/RequestDetailsScreen';


const Stack = createNativeStackNavigator();
const navTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: '#ffffff' },
};
export default function AppNavigator() {
    const { role } = useRole();
    return (
        <NavigationContainer theme={navTheme}>

            <Stack.Navigator>
                {role === 'customer' ? (
                    <Stack.Screen name="Customer" component={CustomerTabs} options={{ headerShown: false }} />
                ) : (
                    <Stack.Screen name="Provider" component={ProviderTabs} options={{ headerShown: false }} />
                )}
                {/* Provider-only details screen; safe to keep registered all the time */}
                <Stack.Screen
                    name="RequestDetails"
                    component={RequestDetailsScreen}
                    options={{ title: 'Request Details' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}