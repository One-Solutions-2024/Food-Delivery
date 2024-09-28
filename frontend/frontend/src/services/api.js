// frontend/src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this to your backend server URL
});

// Set up request interceptors (optional)
api.interceptors.request.use(
  (config) => {
    // Add any required headers here (like authentication tokens)
     const token = localStorage.getItem('token'); // Example of retrieving a token
     if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
     }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Set up response interceptors (optional)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    console.error('API Error:', error);
    // Optionally display a user-friendly error message
    alert('An error occurred while communicating with the server.');
    return Promise.reject(error);
  }
);

// Helper function for error handling
const handleApiError = (error) => {
  console.error('API Error:', error);
  alert('An error occurred. Please try again later.');
};

// Fetch all restaurants
export const fetchRestaurants = async () => {
  try {
    const response = await api.get('/restaurants');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error; // Rethrow if you want to handle it later in the calling function
  }
};

// Fetch a specific restaurant by ID
export const fetchRestaurantById = async (id) => {
  try {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Fetch all orders for a delivery boy
export const fetchOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Fetch a specific order by ID
export const fetchOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.put(`/order/${id}/status`, { status });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Restaurant registration
export const registerRestaurant = async (restaurantData) => {
  try {
    const response = await api.post('/restaurants/register', restaurantData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Place an order
export const placeOrder = async (orderData) => {
  try {
    const response = await api.post('/order', orderData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const updateDeliveryLocation = async (location) => {
  try {
    const response = await axios.put('http://localhost:5000/api/delivery-boys/location', {
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

// Exporting the API functions for direct use
export {
  fetchRestaurants,
  fetchRestaurantById,
  fetchOrders,
  fetchOrderById,
  updateOrderStatus,
  registerRestaurant,
  placeOrder,
  updateDeliveryLocation,
};

// Exporting the api instance for direct use
export default api;
