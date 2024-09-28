// src/services/api.js

import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your backend server URL

// Function to update delivery boy's location in the backend
export const updateDeliveryLocation = async (location) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/delivery-boys/location`, {
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
};

// Function to get nearby orders for the delivery boy
export const getNearbyOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/nearby`);
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby orders:', error);
    throw error;
  }
};

// Function to update order status (e.g., picked up, delivered)
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Function to get order details
export const getOrderDetails = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

// Function to fetch assigned orders from the backend
export const getAssignedOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/assigned-orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assigned orders:', error);
    throw error;
  }
};
