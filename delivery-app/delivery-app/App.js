import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OrderScreen from './screens/OrderScreen';
import TrackingScreen from './screens/TrackingScreen';
import { StyleSheet, View } from 'react-native';
import BackgroundTrackingScreen from './src/screens/BackgroundTrackingScreen';
import './BackgroundLocationTask'; // Import your background task

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="OrderScreen">
        {/* Screen for displaying orders available for the delivery boy */}
        <Stack.Screen
          name="OrderScreen"
          component={OrderScreen}
          options={{ title: 'Available Orders' }}
        />

        <View style={styles.container}>
          <BackgroundTrackingScreen />
        </View>

        {/* Screen for tracking a specific delivery in progress */}
        <Stack.Screen
          name="TrackingScreen"
          component={TrackingScreen}
          options={{ title: 'Delivery Tracking' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});