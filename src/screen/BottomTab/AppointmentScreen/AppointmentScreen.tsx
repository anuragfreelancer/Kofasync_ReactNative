import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, } from 'react-native';
import { Calendar } from 'react-native-calendars';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../compoent/CustomButton';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../../routes/screenName.enum';

export default function AppointmentScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '01:00', '02:00', '03:00', '04:00',
    '05:00', '06:00'
  ];
  const navigation = useNavigation()

  return (
    <SafeAreaView style={{
      flex:1  ,
      backgroundColor:"white"
    }}>
       <StatusBarComponent/>  
      <CustomHeader label='Book Appointments'/>
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom:50}} showsVerticalScrollIndicator={false}>
     
      <Text style={styles.title}>Select Date</Text>
 
      {/* 📅 Calendar */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#0cc4d4',
            selectedTextColor: '#fff',
          },
        }}
        theme={{
          textSectionTitleColor: '#999',
          todayTextColor: '#0cc4d4',
          arrowColor: '#0cc4d4',
          monthTextColor: '#000',
        }}
        style={styles.calendar}
      />

      <Text style={styles.title}>Select Time Slot</Text>

      {/* 🕒 Time Slots */}
      <View style={styles.slotContainer}>
        {timeSlots.map((slot) => (
          <TouchableOpacity
            key={slot}
            onPress={() => setSelectedSlot(slot)}
            style={[
              styles.slot,
              selectedSlot === slot && styles.selectedSlot
            ]}
          >
            <Text
              style={[
                styles.slotText,
                selectedSlot === slot && styles.selectedSlotText
              ]}
            >
              {slot}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */} 
      <View style={{
        marginTop:50
      }}>
 <CustomButton title='Continue' onPress={()=>{navigation?.navigate(ScreenNameEnum.BookingSuccess)}}/>
      </View>


    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F8F8',
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#000',
    marginTop:10
  },

  calendar: {
    borderRadius: 12,
    elevation: 5,
    backgroundColor: '#fff',
    padding: 10,
  },

  slotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
  },

  slot: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#09BFCD',
    margin: 6,
   },

  selectedSlot: {
    backgroundColor: '#09BFCD',
  },

  slotText: {
    color: '#0cc4d4',
    fontWeight: '500',
  },

  selectedSlotText: {
    color: '#fff',
  },

  button: {
    marginTop: 25,
    backgroundColor: '#0cc4d4',
    paddingVertical: 16,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
