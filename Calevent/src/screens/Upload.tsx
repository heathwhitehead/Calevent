import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  Image, ScrollView, Alert, ActivityIndicator, ImageBackground 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';

export default function UploadScreen({ navigation }: any) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    timeOfEvent: '',
    dateOfEvent: '', // Expected format: YYYY-MM-DD
    location: ''
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!image || !form.title || !form.dateOfEvent) {
      Alert.alert("Missing Fields", "Please provide a flyer image, title, and date.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    
    // Metadata
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('timeOfEvent', form.timeOfEvent);
    formData.append('dateOfEvent', form.dateOfEvent);
    formData.append('city', user?.city || ''); // Auto-fills from user's current city
    formData.append('location', form.location);

    // Image handling
    const filename = image.split('/').pop() || 'flyer.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    formData.append('flyerImage', {
      uri: image,
      name: filename,
      type,
    } as any);

    try {
      const response = await fetch('https://calevent-db-mkxw5.ondigitalocean.app/api/flyers', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        Alert.alert("Pinned!", "Your flyer is now on the board.");
        navigation.navigate('Home'); // Return to Home to see the new flyer
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not upload the flyer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../assets/corktexture.png')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.formCard}>
            <View style={styles.tack} />
            <Text style={styles.header}>Pin a Flyer</Text>

            <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <Text style={styles.imagePlaceholderText}>Tap to Select Flyer Image</Text>
              )}
            </TouchableOpacity>

            <TextInput 
              style={styles.input} 
              placeholder="Event Title" 
              value={form.title}
              onChangeText={(val) => setForm({...form, title: val})}
            />
            
            <TextInput 
              style={[styles.input, { height: 80 }]} 
              placeholder="Description" 
              multiline
              value={form.description}
              onChangeText={(val) => setForm({...form, description: val})}
            />

            <TextInput 
              style={styles.input} 
              placeholder="Date (e.g., 2024-05-25)" 
              value={form.dateOfEvent}
              onChangeText={(val) => setForm({...form, dateOfEvent: val})}
            />

            <TextInput 
              style={styles.input} 
              placeholder="Time (e.g., 8:00 PM)" 
              value={form.timeOfEvent}
              onChangeText={(val) => setForm({...form, timeOfEvent: val})}
            />

            <TextInput 
              style={styles.input} 
              placeholder="Specific Location/Venue" 
              value={form.location}
              onChangeText={(val) => setForm({...form, location: val})}
            />

            <TouchableOpacity 
              style={[styles.submitButton, loading && { opacity: 0.7 }]} 
              onPress={handleUpload}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Pin to {user?.city} Board</Text>
              )}
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { padding: 20, alignItems: 'center' },
  formCard: {
    backgroundColor: '#fffef0',
    width: '100%',
    padding: 20,
    marginTop: 20,
    borderRadius: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    transform: [{ rotate: '0.5deg' }],
  },
  tack: {
    position: 'absolute',
    top: -10,
    left: '50%',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#DA2C38',
    marginLeft: -9,
    zIndex: 10,
  },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, fontFamily: 'serif' },
  imageBox: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    overflow: 'hidden'
  },
  previewImage: { width: '100%', height: '100%' },
  imagePlaceholderText: { color: '#888', fontWeight: '600' },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#DA2C38',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});