//frontend/src/components/OrderDetails.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import api from '../../services/api'; 
import { useNavigation } from '@react-navigation/native';

const OrderDetails = ({ route }) => {
  const navigation = useNavigation(); // Get the navigation object

  const { orderId } = route.params; // Get order ID from route parameters
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await api.orderId;
        setOrderDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!orderDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No order details found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>
      <Text style={styles.label}>Order ID:</Text>
      <Text style={styles.value}>{orderDetails.id}</Text>
      <Text style={styles.label}>Customer Name:</Text>
      <Text style={styles.value}>{orderDetails.customerName}</Text>
      <Text style={styles.label}>Delivery Address:</Text>
      <Text style={styles.value}>{orderDetails.deliveryAddress}</Text>
      <Text style={styles.label}>Items:</Text>
      {orderDetails.items.map((item, index) => (
        <Text key={index} style={styles.value}>
          - {item.name} (x{item.quantity})
        </Text>
      ))}
      <Text style={styles.label}>Total Price:</Text>
      <Text style={styles.value}>${orderDetails.totalPrice.toFixed(2)}</Text>
      <Button title="Back to Orders" onPress={() => navigation.goBack()} />
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
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 5,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default OrderDetails;
