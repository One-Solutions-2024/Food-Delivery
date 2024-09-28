//frontend/src/components/Notifications.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

const NotificationsComponent = () => {
  const [notification, setNotification] = useState(false);
  const [notificationData, setNotificationData] = useState(null);

  useEffect(() => {
    registerForPushNotifications();

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      setNotificationData(notification);
      setNotification(true);
    });

    return () => subscription.remove();
  }, []);

  const registerForPushNotifications = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notifications!');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push Notification Token:', token); // Send this token to your backend for pushing notifications
    // You can make an API call to save the token on your backend
  };

  const handleDismissNotification = () => {
    setNotification(false);
    setNotificationData(null);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Notifications</Text>
      <ScrollView>
        {notification && notificationData ? (
          <View style={{ marginVertical: 10, padding: 10, backgroundColor: '#e0f7fa' }}>
            <Text style={{ fontWeight: 'bold' }}>New Notification:</Text>
            <Text>{notificationData.request.content.title}</Text>
            <Text>{notificationData.request.content.body}</Text>
            <Button title="Dismiss" onPress={handleDismissNotification} />
          </View>
        ) : (
          <Text>No new notifications.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationsComponent;
