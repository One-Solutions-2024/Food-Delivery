import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { getDeliveryDetails } from '../services/api'; // Assuming you have an API service to get the delivery details

const DeliveryTracking = ({ deliveryId }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocationAndDeliveryDetails = async () => {
      // Request permissions for location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      // Get current location
      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
      } catch (error) {
        setErrorMsg('Error getting location');
      }

      // Fetch delivery details from API
      try {
        const details = await getDeliveryDetails(deliveryId);
        setDeliveryDetails(details);
      } catch (error) {
        setErrorMsg('Error fetching delivery details');
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndDeliveryDetails();
  }, [deliveryId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return <Text style={styles.errorText}>{errorMsg}</Text>;
  }

  if (!location || !deliveryDetails) {
    return <Text>No location or delivery details found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Delivery Tracking</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Restaurant Location Marker */}
        <Marker
          coordinate={{
            latitude: deliveryDetails.restaurantLocation.lat,
            longitude: deliveryDetails.restaurantLocation.lng,
          }}
          title="Restaurant"
          description={deliveryDetails.restaurantName}
        />
        {/* Customer Location Marker */}
        <Marker
          coordinate={{
            latitude: deliveryDetails.customerLocation.lat,
            longitude: deliveryDetails.customerLocation.lng,
          }}
          title="Customer"
          description="Delivery Destination"
          pinColor="green"
        />
        {/* Delivery Person's Current Location Marker */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You"
          description="Your current location"
          pinColor="blue"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default DeliveryTracking;
