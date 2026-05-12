import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import CustomButton from "../../compoent/CustomButton";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import { color } from "../../constant";

interface BlockTimeModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: (id: string) => void;
  selectedDate?: string;
  initialData?: {
    _id?: string;
    date: string;
    startTime: string;
    endTime: string;
    reason: string;
    isRecurring: boolean;
    recurringPattern: {
      type: "daily" | "weekly" | "monthly" | null;
    } | null;
  };
}

const PATTERNS = ["daily", "weekly", "monthly"];

const BlockTimeModal: React.FC<BlockTimeModalProps> = ({
  visible,
  onClose,
  onSave,
  onDelete,
  selectedDate,
  initialData,
}) => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [reason, setReason] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState<string | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      console.log("BlockModal visible, initialData:", JSON.stringify(initialData, null, 2));
      if (initialData) {
        setDate(moment(initialData.date).toDate());
        const dateStr = moment(initialData.date).format("YYYY-MM-DD");
        setStartTime(moment(`${dateStr} ${initialData.startTime}`, "YYYY-MM-DD HH:mm").toDate());
        setEndTime(moment(`${dateStr} ${initialData.endTime}`, "YYYY-MM-DD HH:mm").toDate());
        setReason(initialData.reason || "");
        setIsRecurring(initialData.isRecurring || false);
        setRecurringPattern(initialData.recurringPattern?.type || null);
      } else {
        const defaultDate = selectedDate ? moment(selectedDate).toDate() : new Date();
        setDate(defaultDate);
        setStartTime(new Date());
        setEndTime(moment().add(1, 'hour').toDate());
        setReason("");
        setIsRecurring(false);
        setRecurringPattern(null);
      }
    }
  }, [visible, initialData, selectedDate]);

  const handleSave = () => {
    if (moment(endTime).isSameOrBefore(moment(startTime))) {
        Alert.alert("Invalid Time", "End time must be after start time");
        return;
    }
    const data = {
      date: moment(date).format("YYYY-MM-DD"),
      startTime: moment(startTime).format("HH:mm"),
      endTime: moment(endTime).format("HH:mm"),
      reason,
      isRecurring,
      recurringPattern: isRecurring ? { type: recurringPattern || "daily" } : null,
    };
    console.log("BlockModal handleSave payload:", JSON.stringify(data, null, 2));
    onSave(data);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalBox}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{initialData ? "Edit Block Time" : "Block Time"}</Text>
                <Text style={styles.desc}>
                  Block time on your calendar when you're unavailable
                </Text>

                {/* Date Picker Trigger */}
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <Text style={styles.inputText}>{moment(date).format("LL")}</Text>
                </TouchableOpacity>

                <View style={styles.row}>
                  {/* Start Time Trigger */}
                  <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={[styles.inputContainer, styles.half]}>
                    <Text style={styles.inputLabel}>Start Time</Text>
                    <Text style={styles.inputText}>{moment(startTime).format("hh:mm A")}</Text>
                  </TouchableOpacity>

                  {/* End Time Trigger */}
                  <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={[styles.inputContainer, styles.half, { marginLeft: 10 }]}>
                    <Text style={styles.inputLabel}>End Time</Text>
                    <Text style={styles.inputText}>{moment(endTime).format("hh:mm A")}</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  placeholder="Reason (Optional)"
                  value={reason}
                  onChangeText={setReason}
                  style={styles.textInput}
                  placeholderTextColor="#ADA4A5"
                />

                {/* <TouchableOpacity 
                  onPress={() => setIsRecurring(!isRecurring)} 
                  style={styles.recurringToggle}
                >
                  <View style={[styles.checkbox, isRecurring && styles.checkboxActive]} />
                  <Text style={styles.recurringText}>Is this a recurring event?</Text>
                </TouchableOpacity> */}

                {isRecurring && (
                  <View style={styles.patternsContainer}>
                    {PATTERNS.map(pattern => (
                      <TouchableOpacity
                        key={pattern}
                        onPress={() => setRecurringPattern(pattern)}
                        style={[styles.patternChip, recurringPattern === pattern && styles.patternChipActive]}
                      >
                        <Text style={[styles.patternText, recurringPattern === pattern && styles.patternTextActive]}>
                          {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Pickers */}
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setDate(selectedDate);
                    }}
                  />
                )}
                {showStartTimePicker && (
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowStartTimePicker(false);
                      if (selectedDate) setStartTime(selectedDate);
                    }}
                  />
                )}
                {showEndTimePicker && (
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowEndTimePicker(false);
                      if (selectedDate) setEndTime(selectedDate);
                    }}
                  />
                )}

                <CustomButton
                  title={initialData ? "Update Blocked Time" : "Save Blocked Time"}
                  height={50}
                  bgColor="#02C6CE"
                  style={{ marginTop: 25 }}
                  onPress={handleSave}
                />

                {initialData && onDelete && (
                  <TouchableOpacity onPress={() => onDelete(initialData._id)} style={styles.deleteBtn}>
                    <Text style={styles.deleteText}>Delete Blocked Time</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalBox: {
    width: "100%",
    maxHeight: "90%",
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1D1617",
    textAlign: 'center'
  },
  desc: {
    fontSize: 14,
    textAlign: "center",
    color: "#7B6F72",
    marginTop: 8,
    marginBottom: 24,
  },
  inputContainer: {
    backgroundColor: "#F7F8F8",
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F7F8F8",
  },
  inputLabel: {
    fontSize: 12,
    color: "#ADA4A5",
    marginBottom: 4,
  },
  inputText: {
    fontSize: 16,
    color: "#1D1617",
    fontWeight: '500'
  },
  textInput: {
    backgroundColor: "#F7F8F8",
    paddingHorizontal: 16,
    borderRadius: 14,
    fontSize: 16,
    color: "#1D1617",
    height: 56,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  half: {
    flex: 1,
  },
  recurringToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#02C6CE",
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: "#02C6CE",
  },
  recurringText: {
    fontSize: 14,
    color: "#1D1617",
  },
  patternsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between'
  },
  patternChip: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: '#F7F8F8',
    marginBottom: 10,
    minWidth: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F7F8F8',
  },
  patternChipActive: {
    backgroundColor: '#02C6CE',
    borderColor: '#02C6CE',
  },
  patternText: {
    fontSize: 14,
    color: "#7B6F72",
    fontWeight: '500'
  },
  patternTextActive: {
    color: "#FFF",
    fontWeight: '700'
  },
  deleteBtn: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center'
  },
  deleteText: {
    color: "#FF4D4D",
    fontSize: 14,
    fontWeight: '600'
  }
});

export default BlockTimeModal;

