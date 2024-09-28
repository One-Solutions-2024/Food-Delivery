// src/firebase.js
import firebase from 'firebase/app';
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Request permission and get token
export const requestForToken = async () => {
  try {
    const token = await messaging.getToken({ vapidKey: 'YOUR_VAPID_KEY' });
    if (token) {
      console.log('Firebase Token:', token);
      // Send token to your backend or save it
    }
  } catch (error) {
    console.error('An error occurred while retrieving token.', error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
