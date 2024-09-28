// frontend/src/pages/Restaurant.js


import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get('/restaurants'); // Fetch the list of restaurants
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  const navigateToMenu = (restaurantId) => {
    navigation.navigate('Order', { restaurantId }); // Navigate to the Order screen with restaurant ID
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurants</Text>
      <FlatList
        data={restaurants}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.restaurantItem} onPress={() => navigateToMenu(item._id)}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text style={styles.restaurantAddress}>{item.address}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id} // Assuming _id is the unique identifier
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
  restaurantItem: {
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

export default RestaurantList;
