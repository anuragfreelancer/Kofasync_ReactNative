import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../compoent/CustomButton';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { GET_API, POST_API } from '../../../Api/apiRequest';
import LoadingModal from '../../../utils/Loader';

export default function AppointmentScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { providerId, subServiceId, shopId } = route.params || {};
  const { token, userData } = useSelector((state: any) => state.auth);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);

  useEffect(() => {
    if (selectedDate && providerId && subServiceId) {
      fetchSlots();
    }
  }, [selectedDate, providerId, subServiceId]);

  const fetchSlots = async () => {
    const res = await GET_API(
      `customer/slots?providerId=${providerId}&date=${selectedDate}&subServiceId=${subServiceId}`,
      token,
      "GET",
      setLoading
    );
    console.log("Slots API Response:", res);
    if (res?.success) {
      setSlots(res.data || []);
    } else {
      setSlots([]);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot) {
      Alert.alert("Error", "Please select both date and time slot");
      return;
    }

    const raw = {
      shopId: shopId,
      userId: userData?._id,
      subServiceId: subServiceId,
      bookingDate: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime
    };

    const res = await POST_API(token, raw, "customer/createBooking", setLoading, "POST");
    console.log("Create Booking Response:", res);
    if (res?.success) {
      navigation?.navigate(ScreenNameEnum.BookingSuccess);
    } else {
      Alert.alert("Error", res?.message || "Failed to create booking");
    }
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: "white"
    }}>
      <StatusBarComponent />
      <LoadingModal visible={loading} />
      <CustomHeader label='Book Appointments' />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Select Date</Text>

        {/* 📅 Calendar */}
        <Calendar
          minDate={new Date().toISOString().split('T')[0]}
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
          {slots.length > 0 ? (
            slots.map((item: any, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedSlot(item)}
                style={[
                  styles.slot,
                  selectedSlot?.startTime === item.startTime && styles.selectedSlot
                ]}
              >
                <Text
                  style={[
                    styles.slotText,
                    selectedSlot?.startTime === item.startTime && styles.selectedSlotText
                  ]}
                >
                  {item.startTime}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>
              <Text style={{ color: '#999' }}>
                {selectedDate ? "No slots available for this date" : "Please select a date to see slots"}
              </Text>
            </View>
          )}
        </View>

        {/* Continue Button */}
        <View style={{
          marginTop: 50
        }}>
          <CustomButton
            title='Continue'
            onPress={handleBooking}
          />
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
    marginTop: 10
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
