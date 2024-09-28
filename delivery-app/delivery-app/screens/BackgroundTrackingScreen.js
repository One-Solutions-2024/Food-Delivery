import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';

const BackgroundTrackingScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    (async () => {
      // Request foreground and background location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Check if background location permissions are granted
      let bgStatus = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus.status !== 'granted') {
        Alert.alert(
          'Background Location Permission',
          'Please enable background location tracking in your settings.',
        );
        return;
      }
    })();
  }, []);

  const startTracking = async () => {
    setTracking(true);

    // Start location updates in the background
    await Location.startLocationUpdatesAsync('background-location-task', {
      accuracy: Location.Accuracy.High,
      distanceInterval: 10, // Update every 10 meters
      timeInterval: 5000, // Update every 5 seconds
      showsBackgroundLocationIndicator: true, // Show indicator in iOS
    });

    // Listen for location updates
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
      },
      (newLocation) => {
        setLocation(newLocation.coords);
        // Handle the new location here (e.g., send to your server)
        console.log('Location updated:', newLocation.coords);
      }
    );
  };

  const stopTracking = async () => {
    setTracking(false);
    await Location.stopLocationUpdatesAsync('background-location-task');
  };

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Background Location Tracking</Text>
      <Text style={styles.text}>{text}</Text>
      {tracking ? (
        <Button title="Stop Tracking" onPress={stopTracking} />
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
});

export default BackgroundTrackingScreen;
