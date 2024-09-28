import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { updateDeliveryLocation } from '../services/api'; // Import your API function

const TrackingScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  const startTracking = async () => {
    setTracking(true);
    const id = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10, // Or every 10 meters
      },
      async (newLocation) => {
        setLocation(newLocation.coords);
        try {
          await updateDeliveryLocation(newLocation.coords); // Call the API to update location
        } catch (error) {
          console.error('Error updating location:', error);
          alert('Failed to update location.');
        }
      }
    );
    setWatchId(id); // Store the watch ID for stopping tracking later
  };

  const stopTracking = async () => {
    if (watchId) {
      await watchId.remove(); // Stop watching the position
      setWatchId(null);
      setTracking(false);
    }
  };

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Tracking</Text>
      <Text style={styles.text}>{text}</Text>
      {tracking ? (
        <>
          <Text style={styles.trackingText}>Tracking active...</Text>
          <Button title="Stop Tracking" onPress={stopTracking} />
        </>
      ) : (
        <Button title="Start Tracking" onPress={startTracking} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  trackingText: {
    fontSize: 16,
    color: 'green',
    marginBottom: 10,
  },
});

export default TrackingScreen;
