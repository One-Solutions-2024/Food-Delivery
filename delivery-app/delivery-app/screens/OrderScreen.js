import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { getAssignedOrders, updateOrderStatus } from '../services/api';

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const assignedOrders = await getAssignedOrders();
        setOrders(assignedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        Alert.alert('Error', 'Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleMarkDelivered = async (orderId) => {
    // Confirmation dialog
    Alert.alert(
      'Confirm Delivery',
      'Are you sure you want to mark this order as delivered?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await updateOrderStatus(orderId, 'delivered');
              setOrders((prevOrders) =>
                prevOrders.map((order) =>
                  order._id === orderId ? { ...order, status: 'delivered' } : order
                )
              );
              Alert.alert('Success', 'Order marked as delivered.');
            } catch (error) {
              console.error('Error updating order status:', error);
              Alert.alert('Error', 'Failed to update order status. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.orderText}>Restaurant: {item.restaurantName}</Text>
      <Text style={styles.orderText}>Items: {item.items.map((i) => i.name).join(', ')}</Text>
      <Text style={styles.orderText}>Status: {item.status}</Text>
      {item.status !== 'delivered' && (
        <Button title="Mark as Delivered" onPress={() => handleMarkDelivered(item._id)} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigned Orders</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : orders.length === 0 ? (
        <Text>No orders assigned</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrder}
        />
      )}
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
  orderContainer: {
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    marginBottom: 15,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default OrderScreen;
