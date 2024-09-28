// frontend/src/components/OrderTracking.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const OrderTracking = ({ orderId }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/api/orders/${orderId}`);
                setOrder(response.data);
            } catch (err) {
                setError(err.response?.data.message || 'Failed to load order details.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) return <p>Loading order details...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Order Tracking</h2>
            <p>Order ID: {order._id}</p>
            <p>Status: {order.status}</p>
            <h3>Items:</h3>
            <ul>
                {order.items.map((item, index) => (
                    <li key={index}>{item.name} - ${item.price}</li>
                ))}
            </ul>
        </div>
    );
};

OrderTracking.propTypes = {
    orderId: PropTypes.string.isRequired,
};

export default OrderTracking;
