import React from 'react';
import { AuthProvider } from './src/context/AuthContext'; // Double check this path!
import { TabNavigation } from './src/screens/Tabs'; // Or wherever your Tabs are
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* The Provider MUST wrap the Navigation */}
        <AuthProvider>
          <TabNavigation />
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}