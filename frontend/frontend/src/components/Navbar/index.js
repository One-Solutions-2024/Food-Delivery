// frontend/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/order">Order</Link></li>
        <li><Link to="/tracking">Tracking</Link></li>
        {/* Add more links as needed */}
      </ul>
    </nav>
  );
};

export default Navbar;
