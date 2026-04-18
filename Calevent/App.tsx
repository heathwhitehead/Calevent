import React from 'react';
import { Text, View, StyleSheet, StatusBar, useColorScheme, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// 1. Define your three pages
function HomeScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('./assets/corktexture.png')} 
        resizeMode="cover" 
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.topLeftContainer}>
          <Text style={styles.homeText}>Events Near Me</Text>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}


function SearchScreen() {
  return (
    <SafeAreaView style={styles.center}>
      <Text>🔍 Search Page</Text>
    </SafeAreaView>
  );
}

function SettingsScreen() {
  return (
    <SafeAreaView style={styles.center}>
      <Text>⚙️ Settings Page</Text>
    </SafeAreaView>
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
              headerShown: false,
              tabBarActiveTintColor: '#5D4037', 
              // Add the style block here:
              tabBarStyle: {
                backgroundColor: '#F5F5F5',
                borderTopWidth: 0, // Removes the thin line usually at the top
                height: 70,        // Makes the bar a bit taller
                paddingBottom: 10,

                // shadow for iOS
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.5,
                shadowRadius: 4,

                // elevation for Android
                elevation: 5,
              }
            }}
          >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Search" 
            component={SearchScreen} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="search" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  topLeftContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Vertical: Top
    alignItems: 'flex-start',    // Horizontal: Left
    paddingHorizontal: 20,       // Gap from the left/right edges
    paddingTop: 10,              // Gap from the top
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  center: { 
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center',
    backgroundColor: '#fff', 
    paddingTop: 30,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  homeText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
});
