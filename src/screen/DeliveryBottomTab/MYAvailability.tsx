import { View, Text, ScrollView, StyleSheet, Switch, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomHeader from '../../compoent/CustomHeader';
import WeeklyScheduleItem from './AvailabilityComponent';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { useSelector } from 'react-redux';
import { GET_API, POST_API } from '../../Api/apiRequest';

const MYAvailability = () => {
  const { token, userData } = useSelector((state: any) => state.auth);
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(false);
  const [schedule, setSchedule] = useState([
    { day: "Monday", enabled: true, start: "08:00", end: "16:00" },
    { day: "Tuesday", enabled: true, start: "08:00", end: "16:00" },
    { day: "Wednesday", enabled: true, start: "08:00", end: "16:00" },
    { day: "Thursday", enabled: true, start: "08:00", end: "16:00" },
    { day: "Friday", enabled: true, start: "08:00", end: "16:00" },
    { day: "Saturday", enabled: false, start: "08:00", end: "16:00" },
    { day: "Sunday", enabled: true, start: "08:00", end: "16:00" },
  ]);

  // Picker State
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<{ index: number, type: 'start' | 'end' } | null>(null);

  // 1. Fetch initial availability from API
  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    const res = await GET_API(`availability/${userData?._id}`, token, "GET", setLoading);
    if (res?.success) {
      console.log(res?.data)
      setSchedule(res.data.weeklySchedule);
      setAvailable(res.data.isOnlineAvailable);
    }
  };

  // 2. Handle Time Selection
  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (event.type === 'set' && selectedDate && pickerMode) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      
      updateDay(pickerMode.index, pickerMode.type, timeString);
    }
  };

  const updateDay = (index: number, key: string, value: any) => {
    const updated = [...schedule];
    updated[index][key] = value;
    setSchedule(updated);
    // Ideally, call API here or have a "Save" button
    saveAvailability(updated, available);
  };

  const saveAvailability = async (updatedSchedule: any, onlineStatus: boolean) => {
    const body = {
      // userId: userData?._id,
      weeklySchedule: updatedSchedule,
      isOnlineAvailable: onlineStatus
    };
    console.log(body)
    await POST_API(token, body, `availability/${userData?._id}`, setLoading, "PUT");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader label='My Availability' />
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Online Availability</Text>
          <Switch
            value={available}
            onValueChange={(val) => {
              setAvailable(val);
              saveAvailability(schedule, val);
            }}
            thumbColor={"#fff"}
            trackColor={{ false: "#d9d9d9", true: "#00C6CE" }}
          />
        </View>

        {schedule.map((item, index) => (
          <WeeklyScheduleItem
            key={index}
            day={item.day}
            enabled={item.enabled}
            start={item.start}
            end={item.end}
            onToggle={() => updateDay(index, "enabled", !item.enabled)}
            onSelectStart={() => {
              setPickerMode({ index, type: 'start' });
              setShowPicker(true);
            }}
            onSelectEnd={() => {
              setPickerMode({ index, type: 'end' });
              setShowPicker(true);
            }}
          />
        ))}

        {showPicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onTimeChange}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
export default MYAvailability


const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 22
  }
})