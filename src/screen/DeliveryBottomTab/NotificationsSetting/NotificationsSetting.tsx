// import React, { useState } from 'react';
// import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import StatusBarComponent from '../../../compoent/StatusBarCompoent';
// import CustomHeader from '../../../compoent/CustomHeader';
// import { color } from '../../../constant';
// import font from '../../../theme/font';
 
// // If you want icons, install react-native-vector-icons, or use any icon library you prefer
// // import Icon from 'react-native-vector-icons/Ionicons';

// const NotificationsSetting = () => {
//   // State for toggles
//   const [generalNotification, setGeneralNotification] = useState(true);
//   const [sound, setSound] = useState(false);
//   const [vibrate, setVibrate] = useState(false);
//   const [appUpdates, setAppUpdates] = useState(true);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBarComponent />
//       <View   >
//         <CustomHeader
        
//           label="Notifications" />

//         {/* Body */}
//         <View style={{ marginTop: 40,marginHorizontal:15 }}>

//           <View style={styles.notificationOption}>
//             <View>
//             <Text style={[styles.optionText, {fontWeight:'bold'}]}>Booking updates</Text>
//             <Text style={styles.optionText}>We'll remind you about all upcoming trips, payments, and cancellations.</Text>
//            </View>
//             <Switch
//               value={generalNotification}
//               onValueChange={val => setGeneralNotification(val)}
//               trackColor={{ false: '#767577', true: color.primary }}
//               thumbColor={generalNotification ? '#fff' : '#fff'}
//             />
//           </View>
//           <View style={styles.notificationOption}>
//             <View>
//             <Text style={[styles.optionText, {fontWeight:'bold'}]}>Reviews</Text>
//             <Text style={styles.optionText}>Receive reminders to leave a review to help other travellers</Text>
//            </View>  <Switch
//               value={sound}
//               onValueChange={val => setSound(val)}
//               trackColor={{ false: '#767577', true: color.primary }}
//               thumbColor={sound ? '#fff' : '#fff'}
//             />
//           </View>

//           <View style={styles.notificationOption}>
//             <View>
//             <Text style={[styles.optionText, {fontWeight:'bold'}]}>Activities & Attractions</Text>
//             <Text style={styles.optionText}>Receive important messages and updates from your tour operator</Text>
//            </View>
//              <Switch
//               value={vibrate}
//               onValueChange={val => setVibrate(val)}
//               trackColor={{ false: '#767577', true: color.primary }}
//               thumbColor={vibrate ? '#fff' : '#fff'}
//             />
//           </View>

//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default NotificationsSetting;



import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import { color } from '../../../constant';
import font from '../../../theme/font'; 
import { useSelector } from 'react-redux'; // If using Redux
import { GET_API, POST_API } from '../../../Api/apiRequest';

const NotificationsSetting = () => {
  // Replace these with your actual auth selectors
  const { token, userData } = useSelector((state: any) => state.auth);
  const userId = userData?._id || "user_object_id_here";
console.log(userData,'userData')
  // State for toggles
  const [loading, setLoading] = useState(false);
  const [bookingUpdates, setBookingUpdates] = useState(false);
  const [reviews, setReviews] = useState(false);
  const [activitiesAttractions, setActivitiesAttractions] = useState(false);

  // Fetch initial preferences
  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    const endpoint = `notifications/preferences/${userId}`;
    const result = await GET_API(endpoint, token, "GET", setLoading);
    
    if (result && result.success) {
      console.log(result.data)
      // Mapping API response to state (ensure keys match your backend response)
      setBookingUpdates(result.data?.preferences.bookingUpdates);
      setReviews(result.data?.preferences.reviews);
      setActivitiesAttractions(result.data?.preferences.activitiesAttractions);
    }
  };

  const togglePreference = async (type: string, currentValue: boolean, setter: (val: boolean) => void) => {
    const newValue = !currentValue;
    
    // Optimistically update UI
    setter(newValue);

    const body = {
      preferenceType: type,
      value: newValue
    };

    // Using "PUT" as per your fetch example logic
    // Note: If POST_API only does POST, you might need a PUT_API helper
    const result = await POST_API(token, body, "notifications/toggle", setLoading, 'PUT');
console.log(body)
    if (!result || result.success === false) {
      // Revert UI if API fails
      setter(currentValue);
      console.error("Failed to update preference");
    }
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
            <Switch
              value={bookingUpdates}
              onValueChange={() => togglePreference("bookingUpdates", bookingUpdates, setBookingUpdates)}
              trackColor={{ false: '#767577', true: color.primary }}
              thumbColor={'#fff'}
            />
          </View>

          {/* Reviews */}
          <View style={styles.notificationOption}>
            <View>
              <Text style={[styles.optionText, { fontWeight: 'bold' }]}>Reviews</Text>
              <Text style={styles.optionText}>Receive reminders to leave a review to help other travellers</Text>
            </View>
            <Switch
              value={reviews}
              onValueChange={() => togglePreference("reviews", reviews, setReviews)}
              trackColor={{ false: '#767577', true: color.primary }}
              thumbColor={'#fff'}
            />
          </View>

          {/* Activities & Attractions */}
          <View style={styles.notificationOption}>
            <View>
              <Text style={[styles.optionText, { fontWeight: 'bold' }]}>Activities & Attractions</Text>
              <Text style={styles.optionText}>Receive important messages and updates from your tour operator</Text>
            </View>
            <Switch
              value={activitiesAttractions}
              onValueChange={() => togglePreference("activitiesAttractions", activitiesAttractions, setActivitiesAttractions)}
              trackColor={{ false: '#767577', true: color.primary }}
              thumbColor={'#fff'}
            />
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