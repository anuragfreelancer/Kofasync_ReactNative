import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, Image } from "react-native";
import imageIndex from "../../assets/imageIndex";

interface Props {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
  onToggle: () => void;
  onSelectStart: () => void;
  onSelectEnd: () => void;
}

const WeeklyScheduleItem: React.FC<Props> = ({
  day,
  enabled,
  start,
  end,
  onToggle,
  onSelectStart,
  onSelectEnd,
}) => {
  return (
    <View style={styles.row}>
      {/* Day */}
      <View style={{flex:0.3}}>
      <Text style={styles.day}>{day}</Text>
</View>
      {/* S witch */}
      <View style={{flexDirection:'row', justifyContent:'space-between', flex:0.7}}>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        thumbColor={"#fff"}
        trackColor={{ false: "#d9d9d9", true: "#00C6CE" }}
      />

      {/* Start Time */}
      <TouchableOpacity
        style={styles.timeBox}
        onPress={enabled ? onSelectStart : undefined}
        activeOpacity={0.7}
      >
        <Text style={styles.timeText}>{start}</Text>
        <Image source={imageIndex.dounArroww}  style={{height:15, width:15}}/>
      </TouchableOpacity>

      {/* End Time */}
      <TouchableOpacity
        style={styles.timeBox}
        onPress={enabled ? onSelectEnd : undefined}
        activeOpacity={0.7}
      >
        <Text style={styles.timeText}>{end}</Text>
        <Image source={imageIndex.dounArroww} style={{height:15, width:15}}/>
        
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  day: {
    // width: 75,
    fontSize: 15,
    color: "#333",
// flex:0.1
  },
  timeBox: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#F3F3F3",
    paddingHorizontal: 3,
    height: 36,
    borderRadius: 8,
    marginLeft: 7,
  },
  timeText: {
    marginRight: 6,
    fontSize: 14,
    color: "#333",
  },
});

export default WeeklyScheduleItem;
