import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import imageIndex from "../../../assets/imageIndex";
import ApointMentCard from "./ApointmentCard";
import { useSelector } from "react-redux";
import { image_url } from "../../../constant";
import ScreenNameEnum from "../../../routes/screenName.enum";
import { useNavigation } from "@react-navigation/native";
import { GET_API } from "../../../Api/apiRequest";

const AppointmentScreen = () => {
    const [selectedTab, setSelectedTab] = useState("Pending");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const { userData, token } = useSelector((state: any) => state.auth);
    const navigation = useNavigation<any>();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await GET_API("providers/getAllBookings", token);
            console.log("res", res);
            if (res?.success || Array.isArray(res)) {
                const data = Array.isArray(res) ? res : res.data || res.bookings || [];
                setBookings(data);
            }
        } catch (error) {
            console.error("Fetch bookings error:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter((item: any) => {
        if (selectedTab === "Pending") return item.status === "PENDING";
        if (selectedTab === "Confirmed") return item.status === "CONFIRMED" || item.status === "UPCOMING";
        if (selectedTab === "Completed") return item.status === "COMPLETED";
        if (selectedTab === "Cancelled") return item.status === "CANCELLED";
        return true;
    });

    const tabs = ["Pending", "Confirmed", "Completed", "Cancelled"];

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView 
                style={styles.container} 
                contentContainerStyle={{ paddingBottom: 100 }} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchBookings} colors={["#00C5D7"]} />
                }
            >
                {/* HEADER */}
                <View style={styles.headerRow}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image source={userData?.profileImage ? { uri: image_url + userData?.profileImage } : imageIndex.profile} style={styles.avatar} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.welcome}>Hello, Welcome 🎉</Text>
                            <Text style={styles.name}>{userData?.name || userData?.username}</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate(ScreenNameEnum.NotificationsScreen)}>
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
                        <Text style={styles.statsValue}>{bookings.length}</Text>
                    </View>

                    <View style={styles.statsCard}>
                        <Text style={styles.statsTitle}>Next{"\n"}Appointment</Text>
                        <Text style={[styles.statsValue, { color: "#00BCD4" }]}>11:30 AM</Text>
                    </View>
                </View>

                {/* TABS */}
                <View style={styles.tabRow}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    styles.tabBtn,
                                    selectedTab === tab && styles.activeTab,
                                    { width: 100 }
                                ]}
                                onPress={() => setSelectedTab(tab)}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        selectedTab === tab && styles.activeTabText,
                                    ]}
                                >
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* ONGOING TITLE */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{selectedTab} Appointments</Text>
                </View>

                {loading && bookings.length === 0 ? (
                    <ActivityIndicator size="large" color="#00C5D7" style={{ marginTop: 20 }} />
                ) : filteredBookings.length === 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 40 }}>
                        <Text style={{ color: '#666' }}>No {selectedTab.toLowerCase()} bookings found</Text>
                    </View>
                ) : (
                    filteredBookings.map((item: any, index: number) => (
                        <ApointMentCard key={item._id || index} item={item} onRefresh={fetchBookings} />
                    ))
                )}
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
    },
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
});
