import React from 'react';
import { Text, View, StyleSheet, StatusBar, useColorScheme, ImageBackground } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/corktexture.png')} 
        resizeMode="cover" 
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.topLeftContainer}>
          <Text style={styles.homeText}>meeee</Text>
        </SafeAreaView>
      </ImageBackground>
    </View>
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
    paddingTop: 30,
    paddingHorizontal: 10,
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
