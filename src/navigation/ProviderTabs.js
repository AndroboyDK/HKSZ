import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProviderProfileScreen from '../screens/provider/ProviderProfileScreen';
import ProviderRentalsScreen from '../screens/provider/ProviderRentalsScreen';
import RequestsScreen from '../screens/provider/RequestsScreen';
import ProviderCurrentRentalsScreen from '../screens/provider/ProviderCurrentRentalsScreen';
import ProviderMySpotsScreen from '../screens/provider/ProviderMySpotsScreen';
import { Ionicons } from '@expo/vector-icons';



const Tab = createBottomTabNavigator();


export default function ProviderTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                tabBarIcon: ({ focused, color, size }) => {
                    let icon = 'ellipse';
                    if (route.name === 'Requests') icon = focused ? 'list' : 'list-outline';
                    if (route.name === 'My Spots') icon = focused ? 'pin' : 'pin-outline';
                    if (route.name === 'Current Rentals') icon = focused ? 'car' : 'car-outline';
                    if (route.name === 'Previous Rentals') icon = focused ? 'time' : 'time-outline';
                    if (route.name === 'Profile') icon = focused ? 'settings' : 'settings-outline';
                    return <Ionicons name={icon} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2f6fed',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Requests" component={RequestsScreen} />
            <Tab.Screen name="My Spots" component={ProviderMySpotsScreen} />
            <Tab.Screen name="Current Rentals" component={ProviderCurrentRentalsScreen} />
            <Tab.Screen name="Previous Rentals" component={ProviderRentalsScreen} />
            <Tab.Screen name="Profile" component={ProviderProfileScreen} />
        </Tab.Navigator >

    );
}