import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // <--- 1. Importiamo lo Stack
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Importazione schermate
import CalendarScreen from '../screens/CalendarScreen';
import RequestsScreen from '../screens/RequestsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddRequestScreen from '../screens/AddRequestScreen'; // <--- 2. Importiamo la nuova schermata

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator(); // <--- 3. Creiamo l'oggetto Stack

// 4. Questa funzione contiene il tuo VECCHIO codice (il menu in basso)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#F59F28',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help'; // Valore di default

          if (route.name === 'Calendario') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Richieste') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profilo') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Richieste" component={RequestsScreen} />
      <Tab.Screen name="Profilo" component={ProfileScreen} />
      <Tab.Screen name="Calendario" component={CalendarScreen} />
    </Tab.Navigator>
  );
}

// 5. Questa è la nuova struttura principale
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        {/* Livello Base: Il Menu con le Tab */}
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
          options={{ headerShown: false }} 
        />

        {/* Livello Superiore: La schermata "Nuova Richiesta" che copre tutto */}
        <Stack.Screen 
          name="AddRequest" 
          component={AddRequestScreen} 
          options={{ 
            presentation: 'modal', // Questo fa l'effetto "foglio che sale dal basso"
            title: 'Nuova Richiesta',
            headerTintColor: '#F59F28', // Freccia arancione
          }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}