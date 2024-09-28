import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';

const PaymentScreen = () => {
  const { confirmPayment } = useStripe();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      // Make a request to your backend to create a payment intent
      const { data } = await axios.post('http://localhost:5000/create-payment-intent', {
        amount: 5000, // Amount in cents ($50.00)
        currency: 'usd',
      });

      // Confirm the payment with the client secret returned from the backend
      const { error } = await confirmPayment(data.clientSecret, {
        type: 'Card',
      });

      if (error) {
        setErrorMessage(`Payment failed: ${error.message}`);
      } else {
        console.log('Payment successful');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setErrorMessage('Error processing payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>
      <CardField
        postalCodeEnabled={true}
        placeholder={{ number: '4242 4242 4242 4242' }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button title="Pay" onPress={handlePayment} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default PaymentScreen;
