// frontend/src/components/RestaurantList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get('/api/restaurants');
                setRestaurants(response.data);
            } catch (err) {
                setError('Failed to load restaurants.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    if (loading) return <p>Loading restaurants...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="restaurant-list">
            <h2>Restaurants</h2>
            <ul>
                {restaurants.map((restaurant) => (
                    <li key={restaurant._id} className="restaurant-item">
                        <Link to={`/restaurant/${restaurant._id}`}>
                            <h3>{restaurant.name}</h3>
                            <p>{restaurant.address}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RestaurantList;
