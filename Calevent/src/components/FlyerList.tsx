import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

// 1. Individual Flyer Component
const PinnedFlyer = React.memo(({ item, index }) => {
  const pinColors = ['#DA2C38', '#226CE0', '#32CD32', '#541388', '#F9E900', '#F18F01'];
  
  const layout = useMemo(() => {
    const isLeft = index % 2 === 0;
    const seed = item._id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    return {
      rotation: isLeft ? -((seed % 10) + 5) : ((seed % 10) + 5),
      yOffset: (seed % 30),
      xOffset: isLeft ? (seed % 15) : -(seed % 15),
      pinColor: pinColors[seed % pinColors.length],
      pinLeft: 40 + (seed % 20),
      pinRotate: (seed % 60) - 30,
    };
  }, [item._id]);

  return (
    <View 
      style={[
        styles.flyerCard, 
        {
          transform: [{ rotate: `${layout.rotation}deg` }],
          marginTop: layout.yOffset,
          marginLeft: layout.xOffset,
          zIndex: index,
        }
      ]}
    >
      <Image source={{ uri: item.image_url }} style={styles.flyerImage} />
      <View 
        style={[
          styles.pin, 
          { 
            backgroundColor: layout.pinColor,
            left: `${layout.pinLeft}%`,
            transform: [{ rotate: `${layout.pinRotate}deg` }] 
          }
        ]} 
      />
    </View>
  );
});

const FlyerList = () => {
  const [flyers, setFlyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlyer, setSelectedFlyer] = useState(null);

  useEffect(() => {
    const fetchFlyers = async () => {
      try {
        const response = await fetch('https://calevent-db-mkxw5.ondigitalocean.app/api/flyers');
        const data = await response.json();
        setFlyers(data); 
      } catch (error) {
        console.error("Error fetching flyers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlyers();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, marginTop: 50 }} />;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={flyers}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={() => setSelectedFlyer(item)}
          >
            <PinnedFlyer item={item} index={index} />
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={!!selectedFlyer}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedFlyer(null)}
      >
        <View style={styles.modalOverlay}>
          {selectedFlyer && (
            <View style={styles.modalContainer}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setSelectedFlyer(null)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>

              <View>
                <Image 
                  source={{ uri: selectedFlyer.image_url }} 
                  style={styles.modalImage} 
                  resizeMode="contain"
                />
                <View style={styles.infoSection}>
                  <Text style={styles.modalTitle}>{selectedFlyer.title}</Text>
                  <Text style={styles.modalDescription}>{selectedFlyer.description}</Text>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailText}>{selectedFlyer.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailText}>{selectedFlyer.dateOfEvent}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-around',
    marginBottom: -50, 
  },
  flyerCard: {
    width: (screenWidth - 60) / 2,
    backgroundColor: '#fff',
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 12,
  },
  flyerImage: {
    width: '100%',
    aspectRatio: 0.75,
    borderRadius: 1,
  },
  pin: {
    position: 'absolute',
    top: -12,
    width: 22,
    height: 22,
    borderRadius: 11,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#F4F0BB',
    borderRadius: 15,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: '#DA2C38',
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  modalImage: { width: '100%', height: 350, backgroundColor: 'rgba(0,0,0,0.85)' },
  infoSection: { padding: 20 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  modalDescription: { fontSize: 16, color: '#555', marginBottom: 20 },
  detailRow: { flexDirection: 'row', marginBottom: 8 },
  detailLabel: { fontWeight: 'bold', width: 100, color: '#5D4037' },
  detailText: { flex: 1, color: '#333' }
});

export default FlyerList;
