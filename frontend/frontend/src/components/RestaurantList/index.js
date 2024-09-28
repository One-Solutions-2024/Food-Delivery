import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import api from '../../services/api'; 
import { useNavigation } from '@react-navigation/native';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true); // Tracks data loading
  const [error, setError] = useState(null); // Tracks errors
  const [refreshing, setRefreshing] = useState(false); // Tracks pull-to-refresh state
  const [page, setPage] = useState(1); // For pagination
  const [hasMore, setHasMore] = useState(true); // If there are more pages to load

  const navigation = useNavigation();

  // Fetch restaurants with pagination support
  const fetchRestaurants = async (pageNumber = 1, isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get(`/restaurants?page=${pageNumber}&limit=10`); // Fetch restaurants with pagination

      if (response.data.length > 0) {
        setRestaurants(prev => isRefreshing ? response.data : [...prev, ...response.data]); // Append new data if not refreshing
        setPage(pageNumber);
      } else {
        setHasMore(false); // No more data to load
      }

      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      setError('Failed to fetch restaurants.');
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(); // Fetch initial data
  }, []);

  const navigateToMenu = (restaurantId) => {
    navigation.navigate('Order', { restaurantId }); // Navigate to the Order screen with restaurant ID
  };

  // Handle loading more restaurants when the user reaches the end of the list
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchRestaurants(page + 1); // Fetch next page
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = () => {
    setHasMore(true); // Reset pagination and fetch the first page
    fetchRestaurants(1, true);
  };

  // Render a loading spinner at the bottom of the list
  const renderFooter = () => {
    return loading && !refreshing ? (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ) : null;
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => fetchRestaurants(1, true)}>
          <Text style={styles.retryText}>Tap to retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        ListFooterComponent={renderFooter} // Show loading indicator at the end of the list
        onEndReachedThreshold={0.5} // Trigger fetching more when 50% from the bottom
        refreshing={refreshing} // Pull-to-refresh state
        handleLoadMore={handleLoadMore}
        onRefresh={handleRefresh} // Pull-to-refresh callback
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
  footer: {
    paddingVertical: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 10,
  },
  retryText: {
    fontSize: 16,
    color: '#0000ff',
  },
});

export default RestaurantList;
