import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const socket = io('http://localhost:5000'); // Replace with your server URL

const RealTimeUpdates = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    socket.on('newOrder', (order) => {
      setOrders((prevOrders) => [...prevOrders, order]);
    });

    return () => {
      socket.off('newOrder');
    };
  }, []);

  return (
    <View>
      {orders.map((order, index) => (
        <Text key={index}>Order from {order.restaurantName}</Text>
      ))}
    </View>
  );
};

export default RealTimeUpdates;