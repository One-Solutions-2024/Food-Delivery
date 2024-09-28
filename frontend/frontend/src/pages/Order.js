// frontend/src/pages/Order.js


import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';

const Order = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const restaurantId = route.params.restaurantId;

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get(`/restaurants/${restaurantId}`); // Fetch the menu for the selected restaurant
        setMenuItems(response.data.menu);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchMenuItems();
  }, [restaurantId]);

  const toggleSelectItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const placeOrder = async () => {
    try {
      const orderData = {
        restaurantId,
        items: selectedItems,
        status: 'pending',
      };
      await api.post('/order', orderData); // Send order data to the backend
      alert('Order placed successfully!');
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Menu</Text>
      <FlatList
        data={menuItems}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.menuItem, selectedItems.includes(item) && styles.selectedItem]} 
            onPress={() => toggleSelectItem(item)}
          >
            <Text style={styles.menuItemName}>{item.name}</Text>
            <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.name}
      />
      <Button title="Place Order" onPress={placeOrder} disabled={selectedItems.length === 0} />
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
    textAlign: 'center',
  },
  menuItem: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: '#e0f7fa', // Highlight color for selected items
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItemPrice: {
    fontSize: 14,
    color: '#666',
  },
});

export default Order;
