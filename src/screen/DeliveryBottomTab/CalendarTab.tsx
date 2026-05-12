import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import CustomButton from '../../compoent/CustomButton';
import { color } from '../../constant';
import BlockTimeModal from './BlockModal';
import WeeklyScheduleModal from './WeeklyScheduleModal';
import { useSelector } from 'react-redux';
import { GET_API, POST_API, } from '../../Api/apiRequest';
import { ENDPOINT } from '../../Api/endpoints';
import moment from 'moment';
import { errorToast } from '../../utils/customToast';

export default function CalendarTabScreen() {
  const { token, userData } = useSelector((state: any) => state.auth);
  const pId = userData?.providerId || userData?._id;

  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState<any[]>([]);
  const [blockTimes, setBlockTimes] = useState<any[]>([]);

  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [editingBlockTime, setEditingBlockTime] = useState<any>(null);

  useEffect(() => {
    fetchAvailability();
    fetchBlockTimes(selectedDate);
  }, [selectedDate]);

  const fetchAvailability = async () => {
    const endpoint = `availability/${pId}`;
    console.log("Calling Availability API URL:", endpoint);
    const res = await GET_API(endpoint, token, "GET", setLoading);
    console.log("Availability Result:", JSON.stringify(res, null, 2));
    if (res?.success) {
      setWeeklySchedule(res.data.weeklySchedule);
    }
  };

  const fetchBlockTimes = async (date: string) => {
    try {
      console.log("Fetching Block Times for date:", date);
      const endpoint = `${ENDPOINT.GET_BLOCK_TIMES_BY_DATE(pId)}?date=${date}`;
      console.log("Calling Block Times API URL:", endpoint);
      const res = await GET_API(endpoint, token, "GET", setLoading);
      console.log("Block Times Result:", JSON.stringify(res, null, 2));

      if (res?.success) {
        setBlockTimes(res.data || []);
      } else if (Array.isArray(res)) {
        setBlockTimes(res);
      } else {
        setBlockTimes([]);
      }
    } catch (error) {
      console.error("fetchBlockTimes error:", error);
      setBlockTimes([]);
    }
  };

  const handleSaveBlockTime = async (data: any) => {
    const payload = {
      // isRecurring: false,
      ...data
    };
    console.log("Saving Block Time Data:", JSON.stringify(payload, null, 2));
    let res;
    if (editingBlockTime) {
      console.log("Updating Block Time ID:", editingBlockTime._id);
      res = await POST_API(token, payload, ENDPOINT.UPDATE_BLOCK_TIME(pId, editingBlockTime._id), setLoading, "PUT");
    } else {
      console.log("Creating New Block Time");
      res = await POST_API(token, payload, ENDPOINT.BLOCK_TIME(pId), setLoading, "POST");
    }
    if (res?.success) {
      setVisible(false);
      setEditingBlockTime(null);
      fetchBlockTimes(selectedDate);
    } else {
      errorToast(res?.message || "Failed to save block time");
    }
  };

  const handleDeleteBlockTime = async (item?: any) => {
    const target = item || editingBlockTime;
    if (!target) return;
    Alert.alert(
      "Delete Blocked Time",
      "Are you sure you want to delete this blocked time?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            console.log("Deleting Block Time ID:", target);
            const res = await POST_API(token, {}, ENDPOINT.DELETE_BLOCK_TIME(pId, target), setLoading, "DELETE");
            console.log("Delete Result:", JSON.stringify(res, null, 2));
            if (res?.success) {
              setVisible(false);
              setEditingBlockTime(null);
              fetchBlockTimes(selectedDate);
            }
          }
        }
      ]
    );
  };

  const getDayDisplayName = (dateStr: string) => {
    return moment(dateStr).format('LL');
  };

  const selectedDaySchedule = (() => {
    const dayOfWeek = moment(selectedDate).format('dddd');
    return weeklySchedule.find(s => s.day === dayOfWeek);
  })();

  const handleSaveWeekly = () => {
    setVisible1(false);
    fetchAvailability();
  };

  const openEditModal = (item: any) => {
    setEditingBlockTime(item);
    setVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBarComponent />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text style={styles.title}>My Calendar</Text>

        {/* 📅 Calendar */}
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: color.primary,
              selectedTextColor: '#fff',
            },
          }}
          theme={{
            textSectionTitleColor: '#999',
            todayTextColor: color.primary,
            arrowColor: color.primary,
            monthTextColor: '#000',
          }}
          style={styles.calendar}
        />

        {/* 🕒 Working Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Working Hours for {getDayDisplayName(selectedDate)}</Text>
          {selectedDaySchedule ? (
            selectedDaySchedule.enabled ? (
              <View style={styles.timeRow}>
                <View style={[styles.timeTag, { backgroundColor: color.primary }]}>
                  <Text style={styles.timeTagText}>{selectedDaySchedule.start} - {selectedDaySchedule.end}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.offDayText}>Not Available (Off Day)</Text>
            )
          ) : (
            <ActivityIndicator color={color.primary} size="small" />
          )}
        </View>

        {/* 🚫 Blocked Times */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.sectionHeader}>Break / Blocked Times</Text>
            <TouchableOpacity onPress={() => { setEditingBlockTime(null); setVisible(true); }} style={styles.addButton}>
              {/* <Icon name="add-circle-outline" size={24} color={color.primary} /> */}
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>

          {blockTimes.length > 0 ? (
            blockTimes.map((item, index) => (
              <View key={index} style={styles.blockItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.blockTimeText}>
                    {moment(item.startTime, "HH:mm").format("hh:mm A")} - {moment(item.endTime, "HH:mm").format("hh:mm A")}
                  </Text>
                  {item.reason && <Text style={styles.blockReasonText}>{item.reason}</Text>}

                  {item.isRecurring && (
                    <Text style={styles.recurringLabel}>
                      Recurring: {item.recurringPattern?.type ? item.recurringPattern.type.charAt(0).toUpperCase() + item.recurringPattern.type.slice(1) : "Daily"}
                    </Text>
                  )}
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity onPress={() => openEditModal(item)} style={styles.iconBtn}>
                    {/* <Icon name="edit" size={20} color={color.primary} /> */}
                    <Text style={{ color: color.primary }}>Edit</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={() => handleDeleteBlockTime(item)} style={[styles.iconBtn, { marginLeft: 10 }]}>
                      <Icon name="delete-outline" size={20} color="#FF4D4D" />
                   </TouchableOpacity> */}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.offDayText}>No blocked times for this day.</Text>
          )}
        </View>

        <View style={{ marginTop: 30, marginBottom: 50 }}>
          <CustomButton
            title='Set Weekly Schedule'
            onPress={() => setVisible1(true)}
            style={{
              backgroundColor: '#fff',
              borderColor: color.primary,
              borderWidth: 1.5,
              borderRadius: 14,
              height: 56
            }}
            textStyle={{ color: color?.primary, fontWeight: '700' }}
          />
        </View>
      </ScrollView>

      <BlockTimeModal
        visible={visible}
        onClose={() => { setVisible(false); setEditingBlockTime(null); }}
        onSave={handleSaveBlockTime}
        onDelete={handleDeleteBlockTime}
        initialData={editingBlockTime}
        selectedDate={selectedDate}
      />

      <WeeklyScheduleModal
        visible={visible1}
        onClose={() => setVisible1(false)}
        onSave={handleSaveWeekly}
      />
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      )}
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
    fontSize: 28,
    fontWeight: '700',
    marginVertical: 15,
    color: '#1D1617',
  },
  calendar: {
    borderRadius: 20,
    elevation: 4,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 10
  },
  section: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#F7F8F8',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D1617',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeTag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  timeTagText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  offDayText: {
    color: '#ADA4A5',
    fontStyle: 'italic',
    fontSize: 14,
  },
  addText: {
    color: color.primary,
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 2,
  },
  blockItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F1F1',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  blockTimeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D1617',
  },
  blockReasonText: {
    fontSize: 14,
    color: '#7B6F72',
    marginTop: 4,
    fontWeight: '500'
  },
  recurringLabel: {
    fontSize: 12,
    color: color.primary,
    marginTop: 6,
    fontWeight: '600',
    backgroundColor: '#E8F8FA',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 8,
    backgroundColor: '#F7F8F8',
    borderRadius: 10,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  }
});
