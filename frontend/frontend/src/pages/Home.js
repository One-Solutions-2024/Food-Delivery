// frontend/src/pages/Home.js


import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get('/restaurants'); // Fetch the restaurant list from the backend
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };
    fetchRestaurants();
  }, []);

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('Menu', { restaurantId: restaurant._id }); // Navigate to the menu of the selected restaurant
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Our Food Delivery App</Text>
      <FlatList
        data={restaurants}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.restaurantCard} onPress={() => handleRestaurantPress(item)}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text style={styles.restaurantAddress}>{item.address}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
      />
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
  restaurantCard: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666',
  },
});

export default Home; // frontend/src/pages/Order.js

