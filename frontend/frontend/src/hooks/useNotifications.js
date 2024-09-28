import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export const useNotifications = () => {
  useEffect(() => {
    const registerForPushNotifications = async () => {
      // Request permissions for notifications
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Failed to get push token for push notifications!');
        return;
      }

      // Get the push notification token
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token); // Send this token to your backend for pushing notifications

      // Handle iOS-specific notification settings (optional)
      if (Platform.OS === 'ios') {
        await Notifications.setNotificationCategoryAsync('default', [
          {
            identifier: 'YES',
            buttonTitle: 'Yes',
          },
        ]);
      }
    };

    registerForPushNotifications();
  }, []);
};
