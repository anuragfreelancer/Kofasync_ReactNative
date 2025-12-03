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
 // your button component

interface BlockTimeModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  onChangeDate: (v: string) => void;
  onChangeStart: (v: string) => void;
  onChangeEnd: (v: string) => void;
  onChangeReason: (v: string) => void;
}

const WeeklyScheduleModal: React.FC<BlockTimeModalProps> = ({
  visible,
  onClose,
  onSave,
  date,
  startTime,
  endTime,
  reason,
  onChangeDate,
  onChangeStart,
  onChangeEnd,
  onChangeReason,
}) => {
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
          onSelectStart={() => console.log("Pick start time")}
          onSelectEnd={() => console.log("Pick end time")}
        />
      ))}
       

          {/* Save Button */}
          <CustomButton
            title="Save Weekly Schedule"
            height={50}
            bgColor="#02C6CE"
            style={{ marginTop: 15 }}
            onPress={onSave}
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
