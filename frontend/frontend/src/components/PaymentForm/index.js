// frontend/src/components/PaymentForm.js

import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const PaymentForm = ({ orderId }) => {
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        // Convert amount to number for validation
        const numericAmount = Number(amount);

        if (isNaN(numericAmount) || numericAmount <= 0) {
            setErrorMessage('Amount must be a valid number greater than 0.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/payments', {
                orderId,
                amount: numericAmount, // Send numeric amount
                paymentMethod,
            });

            if (response.data.success) {
                setSuccessMessage('Payment successful! Thank you for your order.');
                setAmount('');  // Reset amount field
                setPaymentMethod('Credit Card'); // Reset payment method
            } else {
                setErrorMessage('Payment failed. Please try again.');
            }
        } catch (err) {
            // Handle error based on response
            if (err.response) {
                setErrorMessage(`Error: ${err.response.data.message || 'Error processing payment.'}`);
            } else {
                setErrorMessage('Error processing payment. Please check your details and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Payment Form</h2>
            <form onSubmit={handlePayment}>
                <div>
                    <label>
                        Amount:
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            disabled={loading} // Disable input while loading
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Payment Method:
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            disabled={loading} // Disable input while loading
                        >
                            <option value="Credit Card">Credit Card</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Debit Card">Debit Card</option>
                        </select>
                    </label>
                </div>
                <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </form>

            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

PaymentForm.propTypes = {
    orderId: PropTypes.string.isRequired,
};

export default PaymentForm;
