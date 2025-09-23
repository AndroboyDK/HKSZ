import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProviderProfileScreen from '../screens/provider/ProviderProfileScreen';
import ProviderRentalsScreen from '../screens/provider/ProviderRentalsScreen';
import RequestsScreen from '../screens/provider/RequestsScreen';
import { Ionicons } from '@expo/vector-icons';



const Tab = createBottomTabNavigator();


export default function ProviderTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Requests') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'Previous Rentals') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2f6fed',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Requests" component={RequestsScreen} />
            <Tab.Screen name="Previous Rentals" component={ProviderRentalsScreen} />
            <Tab.Screen name="Profile" component={ProviderProfileScreen} />
        </Tab.Navigator>

    );
}