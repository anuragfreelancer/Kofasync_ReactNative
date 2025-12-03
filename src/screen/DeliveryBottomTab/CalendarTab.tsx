import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import CustomHeader from '../../compoent/CustomHeader';
import CustomButton from '../../compoent/CustomButton';
import ScreenNameEnum from '../../routes/screenName.enum';
import { color } from '../../constant';
import BlockTimeModal from './BlockModal';
import WeeklyScheduleItem from './AvailabilityComponent';
import WeeklyScheduleModal from './WeeklyScheduleModal';

export default function CalendarTabScreen() {
  const [selectedDate, setSelectedDate] = useState('');

   const [visible, setVisible] = useState(false);
 const [visible1, setVisible1] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");

  const handleSave = () => {
    console.log({
      date,
      startTime,
      endTime,
      reason,
    });

    setVisible(false);
  };
   const handleSaveWeekly = () => {
    // console.log({
    //   date,
    //   startTime,
    //   endTime,
    //   reason,
    // });

    setVisible1(false);
  };

  const navigation = useNavigation()

  return (
    <SafeAreaView style={{
      flex:1  ,
      backgroundColor:"white"
    }}>
       <StatusBarComponent/>  
     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
     <Text style={styles.title}>My Calendar</Text>

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

      
     

      {/* Continue Button */} 
      <View style={{
        marginTop:50
      }}>
 <CustomButton title='Add Break / Block Time' onPress={() => setVisible(true)}/>
 
      </View>
<CustomButton title='Set Weekly Schedule' 
 onPress={() => setVisible1(true)} style={{marginTop:50, backgroundColor:'#fff', borderColor:color.primary, borderWidth:1}} textStyle={{color:color?.primary}}/>
 

    </ScrollView>
     <BlockTimeModal
        visible={visible}
        onClose={() => setVisible(false)}
        onSave={handleSave}
        date={date}
        startTime={startTime}
        endTime={endTime}
        reason={reason}
        onChangeDate={setDate}
        onChangeStart={setStartTime}
        onChangeEnd={setEndTime}
        onChangeReason={setReason}
      />


        <WeeklyScheduleModal
        visible={visible1}
        onClose={() => setVisible1(false)}
        onSave={handleSaveWeekly}
        date={date}
        startTime={startTime}
        endTime={endTime}
        reason={reason}
        onChangeDate={setDate}
        onChangeStart={setStartTime}
        onChangeEnd={setEndTime}
        onChangeReason={setReason}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 30,
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
