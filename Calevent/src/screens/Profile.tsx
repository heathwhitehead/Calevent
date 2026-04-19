import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, updateUser } = useAuth();
  
  // Local state for the text input
  const [cityInput, setCityInput] = useState(user?.city || '');

  const handleUpdateLocation = () => {
    if (cityInput.trim() === "") return;
    
    // This triggers the global state change
    updateUser({ city: cityInput.trim() });
    alert(`Location pinned to ${cityInput}!`);
  };

  return (
    <ImageBackground 
      source={require('../assets/corktexture.png')} 
      style={StyleSheet.absoluteFillObject}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          {/* --- Simple Rectangular Paper Slip --- */}
          <View style={styles.profileSlip}>
            <View style={styles.tack} />
            <Text style={styles.labelSmall}>User:</Text>
            <Text style={styles.userName}>{"anikavydier"}</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.labelSmall}>Current Feed:</Text>
            <Text style={styles.currentCity}>{user?.city || 'Not Set'}</Text>
          </View>

          {/* --- Location Update Card --- */}
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>Change Location</Text>
            
            <TextInput
              style={styles.input}
              value={cityInput}
              onChangeText={setCityInput}
              placeholder="Enter City, State"
              placeholderTextColor="#888"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateLocation}>
              <Text style={styles.saveButtonText}>Update Board</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 100,
  },
  profileSlip: {
    backgroundColor: '#fffef0', 
    width: width * 0.85,
    padding: 20,
    marginTop: 30,
    marginBottom: 40,
    borderRadius: 2, // Sharp rectangular edges
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
    transform: [{ rotate: '-0.5deg' }],
  },
  noteCard: {
    backgroundColor: '#F4F0BB', 
    width: width * 0.85,
    padding: 20,
    paddingTop: 30,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    transform: [{ rotate: '1deg' }],
  },
  tack: {
    position: 'absolute',
    top: -8,
    left: '50%',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#DA2C38',
    marginLeft: -9,
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'serif',
  },
  currentCity: {
    fontSize: 18,
    color: '#DA2C38', // Red color to highlight the active location
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#5D4037',
    paddingVertical: 8,
    fontSize: 18,
    color: '#333',
    marginBottom: 25,
  },
  saveButton: {
    backgroundColor: '#DA2C38',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});