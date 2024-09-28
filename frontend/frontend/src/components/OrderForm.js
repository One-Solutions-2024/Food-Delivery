// frontend/src/components/OrderForm.js

import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const OrderForm = ({ restaurantId }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddItem = (itemName, itemPrice) => {
        setItems((prevItems) => [...prevItems, { name: itemName, price: itemPrice }]);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await axios.post('/api/orders', {
                restaurantId,
                items,
            });

            if (response.status === 201) {
                setSuccessMessage('Order placed successfully!');
                setItems([]); // Reset items after successful order
            }
        } catch (error) {
            setErrorMessage(error.response?.data.message || 'Error placing order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Order Form</h2>
            <form onSubmit={handlePlaceOrder}>
                <h3>Selected Items</h3>
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>{item.name} - ${item.price}</li>
                    ))}
                </ul>
                <button type="submit" className="btn btn-success" disabled={loading || items.length === 0}>
                    {loading ? 'Placing Order...' : 'Place Order'}
                </button>
            </form>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

OrderForm.propTypes = {
    restaurantId: PropTypes.string.isRequired,
};

export default OrderForm;
