import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Restaurant from './pages/Restaurant';
import Order from './pages/Order';
import Tracking from './pages/Tracking';
import NotFound from './pages/NotFound'; // Create a NotFound component for 404 errors
import Navbar from './components/Navbar'; // Create a Navbar component
import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentScreen from './screens/PaymentScreen'; // Import the PaymentScreen component
import NotificationsComponent from './components/Notifications';
import OrderScreen from './screens/OrderScreen'; // Order management screen
import DeliveryTracking from './screens/DeliveryTracking'; // Tracking screen
import OrderDetails from './components/OrderDetails'; // Order details component
import AdminDashboard from './screens/AdminDashboard';
import Notifications from './components/Notifications';
import RealTimeUpdates from './components/RealTimeUpdates';
import Sidebar from './components/Sidebar'; // Optional sidebar for admin/dashboard navigation



import './styles/App.css'; // Import any global styles

const App = () => {
  return (
    <Router>
      <div className="App">
      <Sidebar />

        <header>
          <h1>Food Delivery App</h1>
          <Navbar /> {/* Add your navbar component here */}
          <NotificationsComponent />
        </header>

        <main>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/restaurant/:id" component={Restaurant} />
            <Route path="/order" component={Order} />
            <Route path="/order" component={OrderScreen} />
            <Route path="/order/:orderId" component={OrderDetails} /> {/* Dynamic route for order details */}
            <Route path="/tracking" component={Tracking} />
            <Route path="/admin-dashboard" component={AdminDashboard} />
            <Route path="/track-delivery" component={DeliveryTracking} />
            <Route path="/payment" component={PaymentScreen} />
            <Route path="/realtime-updates" component={RealTimeUpdates} />
            <Route path="/notifications" component={Notifications} />

            <Route component={NotFound} /> {/* Catch-all for undefined routes */}
          </Switch>
        </main>
        <StripeProvider publishableKey="YOUR_PUBLISHABLE_KEY">
          <PaymentScreen />
        </StripeProvider>

        <footer>
          <p>© 2024 Food Delivery App</p>
          {/* Add your footer components here */}
        </footer>
      </div>
    </Router>
  );
};

export default App;
