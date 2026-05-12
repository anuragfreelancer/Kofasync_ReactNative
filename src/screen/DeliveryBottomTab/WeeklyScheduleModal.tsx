import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import CustomButton from "../../compoent/CustomButton";
import WeeklyScheduleItem from "./AvailabilityComponent";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import { GET_API, POST_API } from "../../Api/apiRequest";
import { Platform } from "react-native";

interface WeeklyScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

const WeeklyScheduleModal: React.FC<WeeklyScheduleModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const { token, userData } = useSelector((state: any) => state.auth);
  const [loading, setLoading] = useState(false);
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

  const pId = userData?.providerId || userData?._id;

  React.useEffect(() => {
    if (visible) {
      fetchAvailability();
    }
  }, [visible]);

  const fetchAvailability = async () => {
    const res = await GET_API(`availability/${pId}`, token, "GET", setLoading);
    if (res?.success) {
      setSchedule(res.data.weeklySchedule);
    }
  };

  const updateDay = (index: number, key: string, value: any) => {
    const updated = [...schedule];
    updated[index][key] = value;
    setSchedule(updated);
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (event.type === 'set' && selectedDate && pickerMode) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      updateDay(pickerMode.index, pickerMode.type, timeString);
    }
  };

  const handleSaveInternal = async () => {
    const body = {
      weeklySchedule: schedule,
      isOnlineAvailable: true // Keep it true or fetch current status
    };
    const res = await POST_API(token, body, `availability/${pId}`, setLoading, "PUT");
    if (res?.success) {
      onSave();
    }
  };



  return (
    <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Weekly Schedule</Text>
          <Text style={styles.desc}>
            Set your recurring working hours for each day of the week
          </Text>

          {/* Input Fields */}
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
       

          {/* Save Button */}
          <CustomButton
            title="Save Weekly Schedule"
            height={50}
            bgColor="#02C6CE"
            style={{ marginTop: 15 }}
            onPress={handleSaveInternal}
            loading={loading}
          />

          {/* Close (optional) */}
          {/* <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity> */}
        </View>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "95%",
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },
  desc: {
    fontSize: 16,
    textAlign: "center",
    color: "#9DB2BF",
    marginTop: 5,
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#F7F8F8",
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 10,
    fontSize: 16,
    color: "#000",
    height:55
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  half: {
    flex: 1,
  },
  closeBtn: {
    marginTop: 10,
    alignSelf: "center",
    padding: 5,
  },
  closeText: {
    fontSize: 14,
    color: "#777",
  },
});

export default WeeklyScheduleModal;
