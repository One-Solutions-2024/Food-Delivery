import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <ul>
        <li><Link to="/orders">Order Management</Link></li>
        <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
        <li><Link to="/track-delivery">Track Delivery</Link></li>
        <li><Link to="/payment">Payment</Link></li>
        <li><Link to="/realtime-updates">Real-time Updates</Link></li>
        <li><Link to="/notifications">Notifications</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
