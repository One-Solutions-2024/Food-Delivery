import React from 'react';
import { View, Text } from 'react-native';
import { useNotifications } from '../hooks/useNotifications';

const OrderStatusScreen = () => {
  useNotifications(); // Hook for push notifications

  return (
    <View>
      <Text>Order Status Screen</Text>
    </View>
  );
};

export default OrderStatusScreen;
