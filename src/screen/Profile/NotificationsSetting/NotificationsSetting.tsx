import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import { color } from '../../../constant';
import font from '../../../theme/font'; 
import { useSelector } from 'react-redux';
import { GET_API, POST_API } from '../../../Api/apiRequest';

const NotificationsSetting = () => {
  const { token, userData } = useSelector((state: any) => state.auth);
  console.log(userData,'userData')

  // State for toggles
  const [loading, setLoading] = useState(false);
  const [bookingUpdates, setBookingUpdates] = useState(false);
  const [reviews, setReviews] = useState(false);
  const [activitiesAttractions, setActivitiesAttractions] = useState(false);
  const [inApp, setInApp] = useState(true);
  const [bookingUpdatesLoading, setBookingUpdatesLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [inAppLoading, setInAppLoading] = useState(false);

  // Fetch initial preferences
  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    const endpoint = `notifications/preferences`;
    const result = await GET_API(endpoint, token, "GET", setLoading);

    const preferences = result?.data?.preferences || result?.preferences;
    const notificationChannels = result?.data?.notificationChannels || result?.notificationChannels;

    if (preferences) {
      setBookingUpdates(!!preferences.bookingUpdates);
      setReviews(!!preferences.reviews);
      setActivitiesAttractions(!!preferences.activitiesAttractions);
    }

    if (notificationChannels) {
      setInApp(!!notificationChannels.inApp);
    }
  };

  const togglePreference = async (
    type: string,
    currentValue: boolean,
    setter: (val: boolean) => void,
    loadingSetter: (val: boolean) => void,
  ) => {
    const newValue = !currentValue;
    loadingSetter(true);

    const body = {
      preferenceType: type,
      value: newValue,
    };

    const result = await POST_API(token, body, "notifications/toggle", setLoading, 'PUT');
    loadingSetter(false);

    if (!result || result.success === false) {
      console.error("Failed to update preference");
      return;
    }

    await fetchPreferences();
  };

  const toggleInAppChannel = async () => {
    const newValue = !inApp;
    setInAppLoading(true);

    const body = {
      preferences: {
        bookingUpdates,
        reviews,
        activitiesAttractions,
      },
      notificationChannels: {
        inApp: newValue,
      },
    };

    const result = await POST_API(token, body, "notifications/preferences", setLoading, 'PUT');
    setInAppLoading(false);

    if (!result || result.success === false) {
      console.error("Failed to update notification channel");
      return;
    }

    await fetchPreferences();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      <View>
        <CustomHeader label="Notifications" />

        {loading && <ActivityIndicator color={color.primary} style={{ marginTop: 20 }} />}

        <View style={{ marginTop: 40, marginHorizontal: 15 }}>
          
          {/* Booking Updates */}
          <View style={styles.notificationOption}>
            <View>
              <Text style={[styles.optionText, { fontWeight: 'bold' }]}>Booking updates</Text>
              <Text style={styles.optionText}>We'll remind you about all upcoming trips, payments, and cancellations.</Text>
            </View>
            {bookingUpdatesLoading ? (
              <ActivityIndicator color={color.primary} />
            ) : (
              <Switch
                value={bookingUpdates}
                onValueChange={() => togglePreference("bookingUpdates", bookingUpdates, setBookingUpdates, setBookingUpdatesLoading)}
                trackColor={{ false: '#767577', true: color.primary }}
                thumbColor={'#fff'}
              />
            )}
          </View>

          {/* Reviews */}
          <View style={styles.notificationOption}>
            <View>
              <Text style={[styles.optionText, { fontWeight: 'bold' }]}>Reviews</Text>
              <Text style={styles.optionText}>Receive reminders to leave a review to help other travellers</Text>
            </View>
            {reviewsLoading ? (
              <ActivityIndicator color={color.primary} />
            ) : (
              <Switch
                value={reviews}
                onValueChange={() => togglePreference("reviews", reviews, setReviews, setReviewsLoading)}
                trackColor={{ false: '#767577', true: color.primary }}
                thumbColor={'#fff'}
              />
            )}
          </View>

          {/* Activities & Attractions */}
          <View style={styles.notificationOption}>
            <View>
              <Text style={[styles.optionText, { fontWeight: 'bold' }]}>Activities & Attractions</Text>
              <Text style={styles.optionText}>Receive important messages and updates from your tour operator</Text>
            </View>
            {activitiesLoading ? (
              <ActivityIndicator color={color.primary} />
            ) : (
              <Switch
                value={activitiesAttractions}
                onValueChange={() => togglePreference("activitiesAttractions", activitiesAttractions, setActivitiesAttractions, setActivitiesLoading)}
                trackColor={{ false: '#767577', true: color.primary }}
                thumbColor={'#fff'}
              />
            )}
          </View>

          {/* In-App Notifications */}
          <View style={styles.notificationOption}>
            <View>
              <Text style={[styles.optionText, { fontWeight: 'bold' }]}>In-App Notifications</Text>
              <Text style={styles.optionText}>Enable or disable in-app notification delivery.</Text>
            </View>
            {inAppLoading ? (
              <ActivityIndicator color={color.primary} />
            ) : (
              <Switch
                value={inApp}
                onValueChange={toggleInAppChannel}
                trackColor={{ false: '#767577', true: color.primary }}
                thumbColor={'#fff'}
              />
            )}
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
};

export default NotificationsSetting;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  hamburger: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  notificationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#1D3A70",
    fontFamily:font.MonolithRegular,
    // flex:1,
    maxWidth:'80%'
    // lineHeight:15,

  },
});