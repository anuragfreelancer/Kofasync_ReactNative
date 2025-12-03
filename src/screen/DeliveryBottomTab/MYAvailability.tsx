import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ReviewCard from '../BottomTab/DashBoard/ReviewCard'
import CustomHeader from '../../compoent/CustomHeader';
import WeeklyScheduleItem from './AvailabilityComponent';


const MYAvailability = () => {
  const [schedule, setSchedule] = useState([
    { day: "Monday", enabled: true, start: "08:00", end: "16:00" },
    { day: "Tuesday", enabled: true, start: "08:00", end: "16:00" },
    { day: "Wednesday", enabled: true, start: "08:00", end: "16:00" },
    { day: "Thursday", enabled: true, start: "08:00", end: "16:00" },
    { day: "Friday", enabled: true, start: "08:00", end: "16:00" },
    { day: "Saturday", enabled: false, start: "08:00", end: "16:00" },
    { day: "Sunday", enabled: true, start: "08:00", end: "16:00" },
  ]);
  const updateDay = (index: number, key: string, value: any) => {
    const updated = [...schedule];
    updated[index][key] = value;
    setSchedule(updated);
  };
  const [availble, setAvailable] = useState(false)
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader label='My Reviews' />
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
          <Text style={styles.title}>Online Availability</Text>
          <Switch
            value={availble}
            onValueChange={() => setAvailable(!availble)}
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
            onSelectStart={() => console.log("Pick start time")}
            onSelectEnd={() => console.log("Pick end time")}
          />
        ))}
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