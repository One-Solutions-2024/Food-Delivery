import React, { useState } from 'react';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { View, Button } from 'react-native';
import axios from 'axios';

const PaymentScreen = () => {
  const { confirmPayment } = useStripe();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/payments/create-payment-intent', {
        amount: 5000, // $50 in cents
        currency: 'usd',
      });

      const { error } = await confirmPayment(data.clientSecret, {
        type: 'Card',
      });

      if (error) {
        console.log('Payment failed:', error.message);
      } else {
        console.log('Payment successful');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
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
      <Button title="Pay" onPress={handlePayment} disabled={loading} />
    </View>
  );
};

export default PaymentScreen;
