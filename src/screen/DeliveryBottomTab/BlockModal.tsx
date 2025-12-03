import React from "react";
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

const BlockTimeModal: React.FC<BlockTimeModalProps> = ({
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
  return (
    <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Block Time</Text>
          <Text style={styles.desc}>
            Block time on your calendar when you're unavailable
          </Text>

          {/* Input Fields */}
          <TextInput
            placeholder="dd/mm/yyyy"
            value={date}
            onChangeText={onChangeDate}
            style={styles.input}
            placeholderTextColor="#ADA4A5"
          />

          <View style={styles.row}>
            <TextInput
              placeholder="Start Time"
              value={startTime}
              onChangeText={onChangeStart}
              style={[styles.input, styles.half]}
              placeholderTextColor="#ADA4A5"
            />
            <TextInput
              placeholder="End Time"
              value={endTime}
              onChangeText={onChangeEnd}
              style={[styles.input, styles.half, { marginLeft: 10 }]}
              placeholderTextColor="#ADA4A5"
            />
          </View>

          <TextInput
            placeholder="Reason (Optional)"
            value={reason}
            onChangeText={onChangeReason}
            style={styles.input}
            placeholderTextColor="#ADA4A5"
          />

          {/* Save Button */}
          <CustomButton
            title="Save Blocked Time"
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
    width: "88%",
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

export default BlockTimeModal;
