import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Dimensions,
  ScrollView
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

// 1. TypeScript Interfaces
interface Flyer {
  _id: string;
  title: string;
  image_url: string;
  description?: string;
  location: string;
  dateOfEvent: string;
}

interface FlyerListProps {
  flyers: Flyer[];
}

// 2. The Individual Flyer (Handles "Messy" Logic)
const PinnedFlyer = React.memo(({ item, index }: { item: Flyer, index: number }) => {
  const pinColors = ['#DA2C38', '#226CE0', '#32CD32', '#541388', '#F9E900', '#F18F01'];
  
  const layout = useMemo(() => {
    const isLeft = index % 2 === 0;
    // Uses the ID string to generate consistent "randomness"
    const seed = item._id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    return {
      rotation: isLeft ? -((seed % 8) + 3) : ((seed % 8) + 3),
      yOffset: (seed % 25),
      // Slight overlap by shifting X-axis
      xOffset: isLeft ? (seed % 10) : -(seed % 10),
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
      
      {/* Pushpin Graphic */}
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

// 3. Main List Component
const FlyerList: React.FC<FlyerListProps> = ({ flyers }) => {
  const [selectedFlyer, setSelectedFlyer] = useState<Flyer | null>(null);

  return (
    <View style={styles.container}>
      <FlatList
        data={flyers}
        keyExtractor={(item) => item._id}
        numColumns={2}
        // Removed margins to allow flyers to reach the screen edge
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={() => setSelectedFlyer(item)}
          >
            <PinnedFlyer item={item} index={index} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No flyers pinned in this city yet!</Text>
          </View>
        }
      />

      {/* Detail Modal */}
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

              <ScrollView bounces={false}>
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
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 40, // Reduced from 100 to pull content closer to bottom
    paddingHorizontal: 0, 
  },
  columnWrapper: {
    // Space-between combined with full width pushes flyers to the edges
    justifyContent: 'space-between',
    marginBottom: -30, // Overlap effect
    paddingHorizontal: 5, 
  },
  flyerCard: {
    // Calculated to sit right against the edge with a tiny 5px buffer
    width: (screenWidth / 2) - 8,
    backgroundColor: '#fff',
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  flyerImage: {
    width: '100%',
    aspectRatio: 0.75,
  },
  pin: {
    position: 'absolute',
    top: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    zIndex: 30,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.4,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#F4F0BB', // Consistent Paper Yellow
    borderRadius: 2, // Sharp edges for "paper" feel
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 50,
    backgroundColor: '#DA2C38',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 20 },
  modalImage: { width: '100%', height: 450, backgroundColor: '#1a1a1a' },
  infoSection: { padding: 20 },
  modalTitle: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  modalDescription: { fontSize: 16, color: '#444', marginBottom: 20, lineHeight: 22 },
  detailRow: { flexDirection: 'row', marginBottom: 8 },
  detailLabel: { fontWeight: 'bold', width: 90, color: '#5D4037' },
  detailText: { flex: 1, color: '#333' },
  emptyContainer: { 
    flex: 1, 
    marginTop: 100, 
    alignItems: 'center' 
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowRadius: 4,
  }
});

export default FlyerList;