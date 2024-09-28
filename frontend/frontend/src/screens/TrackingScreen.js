import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import api from '../services/api';

const TrackingScreen = ({ route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your actual API key
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const updateOrderStatus = async (status) => {
    try {
      await api.put(`/order/${orderId}/status`, { status });
      setOrder((prevOrder) => ({ ...prevOrder, status }));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading || !isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: Order not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tracking Order #{order._id}</Text>
      <Text style={styles.status}>Status: {order.status}</Text>
      <GoogleMap
        mapContainerStyle={styles.map}
        center={{
          lat: order.deliveryLocation.coordinates[1],
          lng: order.deliveryLocation.coordinates[0],
        }}
        zoom={15}
      >
        <Marker
          position={{
            lat: order.deliveryLocation.coordinates[1],
            lng: order.deliveryLocation.coordinates[0],
          }}
        />
      </GoogleMap>
      <Button title="Complete Delivery" onPress={() => updateOrderStatus('completed')} />
      <Button title="Cancel Delivery" onPress={() => updateOrderStatus('canceled')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TrackingScreen;
