import React, { useState, useEffect, useMemo } from 'react';
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';

// 1. Define the shape of your flyer data
interface Flyer {
  _id: string;
  title: string;
  dateOfEvent: string; // Expected format: YYYY-MM-DD
  location: string;
}

export default function CalendarScreen() {
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  
  // 2. Explicitly type the state as an array of Flyer objects
  const [flyers, setFlyers] = useState<Flyer[]>([]);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch('https://calevent-db-mkxw5.ondigitalocean.app/api/flyers');
        // 3. Explicitly type the incoming JSON
        const data: Flyer[] = await response.json();
        setFlyers(data);
      } catch (e) {
        console.error("Error fetching flyers:", e);
      }
    };
    fetchDates();
  }, []);

  // 4. Use derived state for markedDates (Removes need for separate state)
  const markedDates = useMemo(() => {
    const marks: Record<string, { marked: boolean; dotColor: string }> = {};
    flyers.forEach((flyer) => {
      if (flyer.dateOfEvent) {
        marks[flyer.dateOfEvent] = { marked: true, dotColor: '#3F84E5' };
      }
    });
    return marks;
  }, [flyers]);

  // 5. Logic fix: Use dateOfEvent consistently
  const weeklyFlyers = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return flyers.filter((flyer) => {
      const eventDate = new Date(flyer.dateOfEvent);
      return eventDate >= today && eventDate <= nextWeek;
    });
  }, [flyers]);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/corktexture.png')} style={styles.backgroundImage}>
        <SafeAreaView style={styles.topLeftContainer}>
          
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>
              {viewMode === 'month' ? "📅 Month View" : "🗓️ Week View"}
            </Text>
            <TouchableOpacity 
              style={styles.toggleButton} 
              onPress={() => setViewMode(viewMode === 'month' ? 'week' : 'month')}
            >
              <Text style={styles.toggleText}>{viewMode === 'month' ? 'Show Week' : 'Show Month'}</Text>
            </TouchableOpacity>
          </View>

          {viewMode === 'month' ? (
            <View style={[styles.calendarWrapper, styles.calendarShadow]}>
              <Calendar 
                markedDates={markedDates}
                markingType={'dot'}
                theme={{
                  dotColor: '#38369A',
                  selectedDotColor: '#fff',
                  textDayFontSize: 20,
                  textMonthFontSize: 22,
                  todayTextColor: '#DA2C38',
                  calendarBackground: '#F4F0BB', 
                }}
                style={{ borderRadius: 10 }}
              />
            </View>
          ) : (
            <View style={styles.weekContainer}>
              <FlatList
                data={weeklyFlyers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.weekItem}>
                    <View style={styles.dateTab}>
                      <Text style={styles.dayName}>
                        {new Date(item.dateOfEvent).toLocaleDateString('en-US', { weekday: 'short' })}
                      </Text>
                      {/* Using slice to get the DD part of YYYY-MM-DD */}
                      <Text style={styles.dayNum}>{item.dateOfEvent.split('-')[2]}</Text>
                    </View>
                    <View style={styles.eventInfo}>
                      <Text style={styles.eventTitle}>{item.title}</Text>
                      <Text style={styles.eventLocation}>📍 {item.location}</Text>
                    </View>
                  </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No events this week!</Text>}
              />
            </View>
          )}
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
  calendarWrapper: {
    width: '100%',     // Forces the wrapper to fill the whole width
    height: 500,       // Set the exact height you want here
    marginTop: 20,
    paddingHorizontal: 5, // Small gap so it doesn't touch the literal glass edge
  },
  calendarShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8, // For Android
  },
  // weekly calendar!
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  toggleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  toggleText: { color: '#fff', fontWeight: '600' },
  weekContainer: {
    flex: 1,
    width: '100%',
    marginTop: 10,
  },
  weekItem: {
    flexDirection: 'row',
    backgroundColor: '#F4F0BB', // Paper yellow
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    // Shadow for "pinned" effect
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  dateTab: {
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.1)',
    paddingRight: 15,
    width: 60,
  },
  dayName: { fontSize: 12, fontWeight: 'bold', color: '#DA2C38' },
  dayNum: { fontSize: 20, fontWeight: 'bold' },
  eventInfo: { paddingLeft: 15, flex: 1 },
  eventTitle: { fontSize: 16, fontWeight: 'bold' },
  eventLocation: { fontSize: 12, color: '#555' },
  emptyText: { color: '#fff', textAlign: 'center', marginTop: 50, fontSize: 16 },

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
