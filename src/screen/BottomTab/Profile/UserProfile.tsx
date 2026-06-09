import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenNameEnum from "../../../routes/screenName.enum";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoutModal from "../../../compoent/LogoutModal";
import { handleLogout } from "../../../Api/apiRequest";

const ProfileScreen = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const [role, setRole] = useState('user')
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    (async () => {
      const role = await AsyncStorage.getItem("selectedRole")
      setRole(role ?? 'user')

    })()
  }, [])
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Title */}
        <Text style={styles.screenTitle}>Profile</Text>

        {/* ACCOUNT SECTION */}
        <Text style={styles.sectionTitle}>Account</Text>
        <MenuItem title="Edit Profile" onPress={() => navigation.navigate(ScreenNameEnum.EditProfile)} />
        {role != 'User' &&
          <View>
            <MenuItem title="My Reviews" onPress={() => navigation.navigate(ScreenNameEnum.MyReviews)} />

            <MenuItem title="Availability" onPress={() => navigation.navigate(ScreenNameEnum.MYAvailability)} />

          </View>
        }

        <MenuItem title="Payment Method" />

        {/* SETTINGS SECTION */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <MenuItem title="Notifications" onPress={() => navigation.navigate(ScreenNameEnum.NotificationsSetting)} />

        {/* ABOUT SECTION */}
        <Text style={styles.sectionTitle}>About</Text>
        <MenuItem title="Privacy Policy" onPress={() => navigation.navigate(ScreenNameEnum.PrivacyPolicy)} />
        <MenuItem title="Terms And Conditions Of Use" onPress={() => navigation.navigate(ScreenNameEnum.TermsCondition)} />
        <MenuItem title="Help and Support" onPress={() => navigation.navigate(ScreenNameEnum.HelpSupport)} />
        {/* LOGOUT */}
        <TouchableOpacity style={{ marginTop: 25 }} onPress={async () => {
          setModalVisible(true)
          // await AsyncStorage.clear()
          // navigation.navigate(ScreenNameEnum.ChooseRole)
        }}>
          <Text style={styles.logout}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
      <LogoutModal
        visible={modalVisible}
        onLogout={async () => {
          await handleLogout(dispatch);
          setModalVisible(false);
          navigation.replace(ScreenNameEnum.ChooseRole)
        }}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const MenuItem = ({ title, onPress }: { title: string; onPress?: () => void }) => (
  <View>
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.itemText}>{title}</Text>
    </TouchableOpacity>
    <View style={styles.divider} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFF",
    paddingHorizontal: 18,
    paddingTop: 20,
  },

  screenTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 12,
    color: "#000",
  },

  item: {
    paddingVertical: 12,
  },

  itemText: {
    fontSize: 16,
    color: "#333",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
  },

  logout: {
    fontSize: 16,
    fontWeight: "600",
    color: "red",
  },
});
