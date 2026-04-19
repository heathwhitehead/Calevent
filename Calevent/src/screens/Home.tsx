import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ImageBackground, 
  ActivityIndicator, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FlyerList from '../components/FlyerList';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, loading: authLoading } = useAuth(); 
  const [localFlyers, setLocalFlyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlyers = async () => {
      // 1. Wait until AuthContext finishes reading the saved city from disk
      if (authLoading) return;

      // 2. If after loading there is no city, stop the spinner and exit
      if (!user?.city) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const cityQuery = encodeURIComponent(user.city);
        
        // 3. FIX: Replaced your placeholder 'https://...' with your real API URL
        const response = await fetch(
          `https://calevent-db-mkxw5.ondigitalocean.app/api/flyers?city=${cityQuery}`
        );
        
        const data = await response.json();
        setLocalFlyers(data);
      } catch (error) {
        console.error("Fetch error on Home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlyers();
  }, [user?.city, authLoading]); // Re-run when city is updated or auth finishes loading

  return (
    <ImageBackground 
      source={require('../assets/corktexture.png')} 
      style={StyleSheet.absoluteFillObject}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        
        <View style={styles.headerSlip}>
          <View style={styles.headerTack} />
          <Text style={styles.headerText}>
            {user?.city ? `Events in ${user.city}` : "Set Location in Profile"}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color="#DA2C38" style={{ marginTop: 50 }} />
        ) : localFlyers.length > 0 ? (
          <FlyerList flyers={localFlyers} />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {!user?.city 
                ? "Go to Profile to choose a city!" 
                : `No pins on the ${user.city} board yet.`}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  headerSlip: {
    backgroundColor: '#fffef0',
    width: width * 0.85,
    alignSelf: 'center',
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 8,
    transform: [{ rotate: '-1.5deg' }],
    position: 'relative',
  },
  headerTack: {
    position: 'absolute',
    top: -8,
    left: '50%',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#DA2C38',
    marginLeft: -7,
  },
  headerText: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'serif',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 5
  }
});