import React from 'react';
import { Text, View, StyleSheet, StatusBar, useColorScheme, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Navigator
import { TabNavigation } from './src/screens/Tabs'; 



export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <TabNavigation />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
