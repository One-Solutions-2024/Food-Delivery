import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { useEffect } from 'react';

export const useNotifications = () => {
  useEffect(() => {
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
      console.log(token); // Send this token to your backend for pushing notifications
    };

    registerForPushNotifications();
  }, []);
};
