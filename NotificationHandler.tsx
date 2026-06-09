import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationHandler = () => {

  useEffect(() => {
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('✅ Notification permission granted');

        // iOS: Register + foreground banner settings
        if (Platform.OS === 'ios') {
          await messaging().registerDeviceForRemoteMessages();
          await messaging().setAutoInitEnabled(true);

          await messaging().setForegroundNotificationPresentationOptions({
            alert: true,
            badge: true,
            sound: true,
          });

          const apnsToken = await messaging().getAPNSToken();
          if (apnsToken) {
            console.log('🍏 APNs Token:', apnsToken);
          }
        }

        // Common: Get FCM Token
        const fcmToken = await messaging().getToken();
        console.log('📲 FCM Token:', fcmToken);
        if (fcmToken) {
          await AsyncStorage.setItem('fcmToken', fcmToken);
        }
      }
    };

    requestPermission();
  }, []);

  // Android channel
  useEffect(() => {
    if (Platform.OS === 'android') {
      notifee.createChannel({
        id: 'Kofasync.channel',
        name: 'Kofasync Channel',
        importance: AndroidImportance.HIGH,
      }).then(() => {
        console.log('✅ Notifee channel created');
      });
    }
  }, []);

  // Foreground FCM messages
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('📩 Foreground FCM Message:', remoteMessage);

      await notifee.displayNotification({
        title: remoteMessage?.notification?.title || 'New Notification',
        body: remoteMessage?.notification?.body || 'You have a new message',
        android: {
          channelId: 'Kofasync.channel',
          importance: AndroidImportance.HIGH,
          pressAction: { id: 'default' },
        },
      });
    });

    return unsubscribe;
  }, []);

  // Background & quit state handlers
  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('📲 Opened from quit state:', remoteMessage);
          navigateToNotification(remoteMessage);
        }
      });

    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage) {
        console.log('📲 Opened from background:', remoteMessage);
        navigateToNotification(remoteMessage);
      }
    });

    return unsubscribe;
  }, []);

  const navigateToNotification = (remoteMessage) => {
    console.log('➡️ Navigate to notification screen', remoteMessage);
    // TODO: add navigation logic here if needed
  };

  return null;
};

export default NotificationHandler;