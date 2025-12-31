import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Libreria icone standard di Expo

// Importazione schermate
import CalendarScreen from '../screens/CalendarScreen';
import RequestsScreen from '../screens/RequestsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // Nascondiamo l'intestazione standard brutta
          tabBarActiveTintColor: '#F59F28', // Colore icona attiva (arancione standard)
          tabBarInactiveTintColor: 'gray',  // Colore icona inattiva
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            // Logica per scegliere l'icona in base al nome della schermata
            if (route.name === 'Calendario') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Richieste') {
              iconName = focused ? 'list' : 'list-outline';
            } else {
              iconName = focused ? 'person' : 'person-outline';
            }

            // Restituisce l'icona
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        {/* Ordine delle icone nel menu */}
        <Tab.Screen name="Richieste" component={RequestsScreen} />
        <Tab.Screen name="Profilo" component={ProfileScreen} />
        <Tab.Screen name="Calendario" component={CalendarScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}