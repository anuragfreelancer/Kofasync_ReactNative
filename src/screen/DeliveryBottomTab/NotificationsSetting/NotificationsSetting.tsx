import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import { color } from '../../../constant';
import font from '../../../theme/font';
 
// If you want icons, install react-native-vector-icons, or use any icon library you prefer
// import Icon from 'react-native-vector-icons/Ionicons';

const NotificationsSetting = () => {
  // State for toggles
  const [generalNotification, setGeneralNotification] = useState(true);
  const [sound, setSound] = useState(false);
  const [vibrate, setVibrate] = useState(false);
  const [appUpdates, setAppUpdates] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      <View   >
        <CustomHeader
        
          label="Notifications" />

        {/* Body */}
        <View style={{ marginTop: 40,marginHorizontal:15 }}>

          <View style={styles.notificationOption}>
            <View>
            <Text style={[styles.optionText, {fontWeight:'bold'}]}>Booking updates</Text>
            <Text style={styles.optionText}>We'll remind you about all upcoming trips, payments, and cancellations.</Text>
           </View>
            <Switch
              value={generalNotification}
              onValueChange={val => setGeneralNotification(val)}
              trackColor={{ false: '#767577', true: color.primary }}
              thumbColor={generalNotification ? '#fff' : '#fff'}
            />
          </View>
          <View style={styles.notificationOption}>
            <View>
            <Text style={[styles.optionText, {fontWeight:'bold'}]}>Reviews</Text>
            <Text style={styles.optionText}>Receive reminders to leave a review to help other travellers</Text>
           </View>  <Switch
              value={sound}
              onValueChange={val => setSound(val)}
              trackColor={{ false: '#767577', true: color.primary }}
              thumbColor={sound ? '#fff' : '#fff'}
            />
          </View>

          <View style={styles.notificationOption}>
            <View>
            <Text style={[styles.optionText, {fontWeight:'bold'}]}>Activities & Attractions</Text>
            <Text style={styles.optionText}>Receive important messages and updates from your tour operator</Text>
           </View>
             <Switch
              value={vibrate}
              onValueChange={val => setVibrate(val)}
              trackColor={{ false: '#767577', true: color.primary }}
              thumbColor={vibrate ? '#fff' : '#fff'}
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
