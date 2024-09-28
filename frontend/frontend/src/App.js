import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Order from './pages/Order';
import NotFound from './pages/NotFound'; // Create a NotFound component for 404 errors
import Navbar from './components/Navbar'; // Create a Navbar component
import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentScreen from './screens/PaymentScreen'; // Import the PaymentScreen component
import NotificationsComponent from './components/Notifications';
import OrderStatusScreen from './screens/OrderStatusScreen'; // Order management screen
import TrackingScreen from './screens/TrackingScreen'; // Order management screen

import DeliveryScreen from './screens/DeliveryScreen'; // Tracking screen
import OrderDetails from './components/OrderDetails'; // Order details component
import AdminDashboard from './screens/AdminDashboard';
import Notifications from './components/Notifications';
import RealTimeUpdates from './components/RealTimeUpdates';
import Sidebar from './components/Sidebar'; // Optional sidebar for admin/dashboard navigation

import RestaurantList from './components/RestaurantList'


const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
      <Sidebar />

        <header>
          <h1>Food Delivery App</h1>
          <Navbar /> {/* Add your navbar component here */}
          <NotificationsComponent />
        </header>

        <main>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/restaurant/:id" element={<RestaurantList />} />
            <Route path="/order" element={<Order />} />
            <Route path="/order" element={<OrderStatusScreen />} />
            <Route path="/order/:orderId" element={<OrderDetails />} /> {/* Dynamic route for order details */}
            <Route path="/tracking" element={<TrackingScreen />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/track-delivery" element={<DeliveryScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/realtime-updates" element={<RealTimeUpdates />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" />} />
            </Routes>
        </main>
        <StripeProvider publishableKey="YOUR_PUBLISHABLE_KEY">
          <PaymentScreen />
        </StripeProvider>

        <footer>
          <p>© 2024 Food Delivery App</p>
          {/* Add your footer components here */}
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
