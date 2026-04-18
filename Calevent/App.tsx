import React from 'react';
import { Text, View, StyleSheet, StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 1. Define your three pages
function HomeScreen() {
  return (
    <View style={styles.center}><Text>🏠 Home Page</Text></View>
  );
}

function SearchScreen() {
  return (
    <View style={styles.center}><Text>🔍 Search Page</Text></View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.center}><Text>⚙️ Settings Page</Text></View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Tab.Navigator 
          screenOptions={{ 
            tabBarActiveTintColor: '#007AFF', 
            tabBarInactiveTintColor: 'gray',
            headerShown: true // This adds the title at the top of each page
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff' 
  },
});

