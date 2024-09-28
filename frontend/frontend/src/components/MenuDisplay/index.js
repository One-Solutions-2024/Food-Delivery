// frontend/src/components/MenuDisplay.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const MenuDisplay = ({ restaurantId }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/restaurants/${restaurantId}`);
                setMenuItems(response.data.menu);
            } catch (err) {
                setError(err.response?.data.message || 'Failed to load menu.');
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, [restaurantId]);

    if (loading) return <p>Loading menu...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Menu</h2>
            <ul>
                {menuItems.map((item, index) => (
                    <li key={index}>
                        {item.name} - ${item.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

MenuDisplay.propTypes = {
    restaurantId: PropTypes.string.isRequired,
};

export default MenuDisplay;
