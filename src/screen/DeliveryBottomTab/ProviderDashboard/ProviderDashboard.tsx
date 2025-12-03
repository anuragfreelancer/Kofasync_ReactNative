import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import imageIndex from "../../../assets/imageIndex";
import ApointMentCard from "./ApointmentCard";

const AppointmentScreen = () => {
    const [selectedTab, setSelectedTab] = useState("Upcoming");

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.container} contentContainerStyle={{paddingBottom:100}} showsVerticalScrollIndicator={false}>
                {/* HEADER */}
                <View style={styles.headerRow}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image source={{ uri: "https://i.pravatar.cc/80" }} style={styles.avatar} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.welcome}>Hello, Welcome 🎉</Text>
                            <Text style={styles.name}>Charlie Westervelt</Text>
                        </View>
                    </View>

                    <TouchableOpacity>
                        <Image
                            source={imageIndex.notification2}
                            style={styles.bell}
                        />
                    </TouchableOpacity>
                </View>

                {/* STATS */}
                <View style={styles.statsRow}>
                    <View style={styles.statsCard}>
                        <Text style={styles.statsTitle}>Appointments{"\n"}Today</Text>
                        <Text style={styles.statsValue}>60</Text>
                    </View>

                    <View style={styles.statsCard}>
                        <Text style={styles.statsTitle}>Next{"\n"}Appointment</Text>
                        <Text style={[styles.statsValue, { color: "#00BCD4" }]}>11:30 AM</Text>
                    </View>
                </View>

                {/* TABS */}
                <View style={styles.tabRow}>
                    <TouchableOpacity
                        style={[
                            styles.tabBtn,
                            selectedTab === "Upcoming" && styles.activeTab,
                        ]}
                        onPress={() => setSelectedTab("Upcoming")}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === "Upcoming" && styles.activeTabText,
                            ]}
                        >
                            Upcoming
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tabBtn,
                            selectedTab === "Pending" && styles.activeTab,
                        ]}
                        onPress={() => setSelectedTab("Pending")}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === "Pending" && styles.activeTabText,
                            ]}
                        >
                            Pending
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* ONGOING TITLE */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Ongoing Appointments</Text>
                    <Text style={styles.seeAll}>See All</Text>
                </View>
                {[{ uri: 'https://i.pravatar.cc/81' }, { uri: 'https://i.pravatar.cc/82' }].map((item) =>
                    <ApointMentCard item={item} />
                )}
                {/* APPOINTMENT CARD */}
                {/* <View style={styles.appointmentCard}>
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=12" }}
              style={styles.userImg}
            />
            <Text style={styles.cardName}>Talan Rhiel Madsen</Text>
          </View>

          <View style={styles.dot} />
        </View>

        <View style={styles.dateRow}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/747/747310.png" }}
            style={styles.icon}
          />
          <Text style={styles.dateText}>Sunday, 12 June</Text>

          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/1827/1827272.png" }}
            style={[styles.icon, { marginLeft: 15 }]}
          />
          <Text style={styles.dateText}>11:00 - 12:00 AM</Text>
        </View>

        <Text style={styles.description}>
          I have a very high fever and a severe cold.
        </Text>

        <TouchableOpacity style={styles.detailBtn}>
          <Text style={styles.detailText}>Detail</Text>
        </TouchableOpacity>
      </View> */}
            </ScrollView>
        </SafeAreaView>
    );
};

export default AppointmentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FBFF",
        padding: 20,
        // marginBottom:70
    },

    /** HEADER **/
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    avatar: {
        width: 55,
        height: 55,
        borderRadius: 30,
    },

    welcome: {
        fontSize: 14,
        color: "#555",
    },

    name: {
        fontSize: 20,
        fontWeight: "700",
    },

    bell: {
        width: 40,
        height: 40,
    },

    /** STATS **/
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 25,
    },

    statsCard: {
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingVertical: 22,
        paddingHorizontal: 15,
        // elevation: 4,
        borderWidth: 0.4,
        borderColor: '#e5e5e5',
        alignItems: 'center'
    },

    statsTitle: {
        fontSize: 14,
        color: "#777",
        textAlign: 'center'
    },

    statsValue: {
        marginTop: 10,
        fontSize: 24,
        fontWeight: "700",
        color: "#000",
    },

    /** TABS **/
    tabRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 25,
        backgroundColor: "transparent",
        padding: 5,
        borderRadius: 30,
    },

    tabBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 30,
        alignItems: "center",
        backgroundColor: '#F5F5F5',
        marginHorizontal: 5
    },

    tabText: {
        fontSize: 16,
        color: "#666",
        fontWeight: "600",
    },

    activeTab: {
        backgroundColor: "#00C5D7",
    },

    activeTabText: {
        color: "#fff",
        fontWeight: "700",
    },

    /** SECTION HEADER **/
    sectionHeader: {
        marginTop: 25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
    },

    seeAll: {
        color: "#00C5D7",
        fontWeight: "600",
    },

    /** CARD **/
    appointmentCard: {
        marginTop: 15,
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 18,
        elevation: 4,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    userImg: {
        width: 50,
        height: 50,
        borderRadius: 30,
        marginRight: 10,
    },

    cardName: {
        fontSize: 17,
        fontWeight: "700",
    },

    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#3FA9F5",
    },

    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
    },

    icon: {
        width: 20,
        height: 20,
        tintColor: "#00C5D7",
    },

    dateText: {
        fontSize: 14,
        marginLeft: 6,
        color: "#555",
    },

    description: {
        marginTop: 15,
        fontSize: 14,
        color: "#666",
    },

    detailBtn: {
        marginTop: 18,
        backgroundColor: "#E6FCFF",
        borderRadius: 30,
        paddingVertical: 10,
        alignItems: "center",
    },

    detailText: {
        fontSize: 16,
        color: "#00C5D7",
        fontWeight: "700",
    },
});
