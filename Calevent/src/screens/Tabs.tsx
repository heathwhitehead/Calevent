import React from 'react';
import { Text, View, StyleSheet, StatusBar, useColorScheme, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import UploadScreen from './Upload';

// Import screens
import HomeScreen from './Home'
import CalendarScreen from './Calendar'
import ProfileScreen from './Profile'


const Tab = createBottomTabNavigator();

// Navigation Bar
export function TabNavigation() {
  // We need this here to use it in the style logic
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#5D4037', 
        tabBarStyle: {
          backgroundColor: '#F5F5F5',
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
          elevation: 0,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Upload" 
        component={UploadScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
