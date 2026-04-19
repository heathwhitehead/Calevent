import React from 'react';
import { useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import existing screens
import HomeScreen from './Home';
import CalendarScreen from './Calendar';
import ProfileScreen from './Profile';
// Import the new Upload screen
import UploadScreen from './Upload'; 

const Tab = createBottomTabNavigator();

export function TabNavigation() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#DA2C38', // Changed to your signature red for better visibility
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#F5F5F5',
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
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

      {/* NEW UPLOAD TAB */}
      <Tab.Screen 
        name="Upload" 
        component={UploadScreen} 
        options={{
          tabBarLabel: 'Pin Flyer',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size + 4} color={color} />,
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
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}