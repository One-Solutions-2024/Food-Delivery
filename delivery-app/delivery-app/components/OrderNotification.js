import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { io } from 'socket.io-client';

const OrderNotification = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState(null);

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io('http://localhost:5000'); // Replace with your server URL

    // Listen for 'newOrder' event from server
    socket.on('newOrder', (order) => {
      setNewOrder(order);
    });

    // Handle connection errors
    socket.on('connect_error', (err) => {
      Alert.alert('Connection Error', 'Unable to connect to the server. Please try again later.');
    });

    // Cleanup the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to handle accepting the order
  const handleAcceptOrder = () => {
    if (newOrder) {
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      setNewOrder(null); // Clear the notification
    }
  };

  // Function to handle dismissing the order
  const handleDismissOrder = () => {
    setNewOrder(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incoming Orders</Text>
      
      {newOrder ? (
        <View style={styles.orderNotification}>
          <Text style={styles.orderText}>New Order from {newOrder.restaurantName}</Text>
          <Button title="Accept Order" onPress={handleAcceptOrder} />
          <Button title="Dismiss" onPress={handleDismissOrder} color="gray" />
        </View>
      ) : (
        <Text style={styles.noOrderText}>No new orders</Text>
      )}

      {/* List of accepted orders */}
      {orders.length > 0 && (
        <View style={styles.orderList}>
          <Text style={styles.orderListTitle}>Accepted Orders:</Text>
          {orders.map((order, index) => (
            <Text key={index} style={styles.orderItem}>
              Order from {order.restaurantName} with {order.items.length} items.
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderNotification: {
    backgroundColor: '#f8d7da',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  orderText: {
    fontSize: 18,
    marginBottom: 10,
  },
  noOrderText: {
    fontSize: 18,
    color: 'gray',
  },
  orderList: {
    marginTop: 20,
  },
  orderListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  orderItem: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default OrderNotification;
