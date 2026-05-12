import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import imageIndex from '../../../assets/imageIndex';
import { color, image_url } from '../../../constant';
import { useSelector } from 'react-redux';
import { GET_API, POST_API } from '../../../Api/apiRequest';
import LoadingModal from '../../../utils/Loader';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import ScreenNameEnum from '../../../routes/screenName.enum';
import ReviewModal from '../../../compoent/ReviewModal';
import { errorToast, successToast } from '../../../utils/customToast';

const TABS = ['Completed', 'Upcoming', 'Cancelled'];

const BookingsScreen = () => {
  const isFocused = useIsFocused();
  const { token } = useSelector((state: any) => state.auth);
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    if (isFocused) {
      fetchBookings();
    }
  }, [isFocused]);

  const fetchBookings = async () => {
    const res = await GET_API("customer/userBookings", token, "GET", setLoading);
    console.log("User Bookings Response:", res);
    if (res?.success) {
      setBookings(res.data || []);
    }
  };

  const handleReviewSubmit = async (rating: number, review: string) => {
    const body = {
      bookingId: selectedBooking?._id,
      rating,
      review
    };

    const res = await POST_API(token, body, "customer/createReview", setLoading, "POST");
    if (res?.success) {
      setReviewModalVisible(false);
      successToast("Review added successfully!");
      fetchBookings();
    } else {
      errorToast(res?.message || "Failed to add review");
    }
  };

  const filteredData = bookings.filter(item => {
    // Map API status to tabs
    const status = item.status?.toUpperCase();
    if (activeTab === 'Upcoming') {
      return status === 'UPCOMING' || status === 'PENDING' || status === 'CONFIRMED';
    } else if (activeTab === 'Completed') {
      return status === 'COMPLETED';
    } else if (activeTab === 'Cancelled') {
      return status === 'CANCELLED';
    }
    return false;
  });

  const handleCancel = async (id: string) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            const res = await POST_API(token, {}, `customer/cancelBooking/${id}`, setLoading, "PUT");
            if (res?.success) {
              successToast("Booking cancelled successfully!");
              fetchBookings();
            } else {
              errorToast(res?.message || "Failed to cancel booking");
            }
          }
        }
      ]
    );
  };

  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
      <LoadingModal visible={loading} />
      {/* Header */}
      <Text style={styles.header}>Bookings</Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>

            <View style={{
              borderWidth: 1,
              borderColor:
                activeTab === tab ? "#09BFCD" : "white",

              marginTop: 5
            }} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Filters */}


      {/* List */}
      <FlatList
        style={{
          marginTop: 20
        }}
        showsVerticalScrollIndicator={false}
        data={filteredData}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate(ScreenNameEnum.BookingDetails, { item })}
          >
            <BookingCard
              item={item}
              activeTab={activeTab}
              onCancel={() => handleCancel(item._id)}
              onAddReview={() => {
                setSelectedBooking(item);
                setReviewModalVisible(true);
              }}
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          !loading ? (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ color: '#999' }}>No {activeTab.toLowerCase()} bookings found</Text>
            </View>
          ) : null
        }
      />

      <ReviewModal
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={handleReviewSubmit}
        bookingData={selectedBooking}
      />
    </SafeAreaView>
  );
};

// ----------------- Card Component -----------------

const BookingCard = ({ item, activeTab, onCancel, onAddReview }) => {
  const shopName = item.partnerId?.companyName || "Unknown Shop";
  const serviceName = item.subServiceId?.name || "Unknown Service";
  const date = item.bookingDate ? new Date(item.bookingDate).toDateString() : "N/A";
  const time = `${item.startTime || ""} - ${item.endTime || ""}`;
  const providerName = item.providerId?.name || "N/A";
  const status = item.status?.toUpperCase();
  const isPending = status === 'PENDING';
  const isConfirmed = status === 'CONFIRMED';

  return (
    <View style={{
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      borderColor: "#D9D9D9",
      marginBottom: 15,
      // ANDROID shadow
      borderWidth: 0.4,
      // IOS shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    }}>
      <View style={styles.card}>

        {/* Image */}
        <Image
          source={item.subServiceId?.image ? { uri: image_url + item.subServiceId.image } : imageIndex.salone}
          style={styles.image}
        />

        {/* Info */}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{serviceName}</Text>
              <Text style={[styles.meta, { marginLeft: 0, marginBottom: 4, color: '#09BFCD' }]}>{shopName}</Text>
            </View>
            {isPending && (
              <TouchableOpacity
                onPress={onCancel}
                style={{
                  backgroundColor: '#FFEDED',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: '#FF5252'
                }}
              >
                <Text style={{ color: '#FF5252', fontSize: 12, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.row}>
            <Image source={imageIndex.calneder}
              style={{
                height: 18,
                width: 18,
                resizeMode: "contain"
              }}
            />
            <Text style={styles.meta}>{date}</Text>
          </View>

          <View style={styles.row}>
            <Image style={{
              height: 18,
              width: 18,
              resizeMode: "contain"
            }} source={imageIndex.time2} />
            <Text style={styles.meta}>{time}</Text>
          </View>

          <View style={styles.row}>
            <Image
              style={{
                height: 18,
                width: 18,
                resizeMode: "contain"
              }}
              tintColor={color.primary}
              source={imageIndex.profile2} />
            <Text style={styles.meta}>Provider: {providerName}</Text>

          </View>

        </View>
      </View>
      <View style={{
        borderWidth: 0.5,
        borderColor: "#E3E3E3",
        marginTop: 12,
        marginBottom: 8
      }} />
      <View style={[
        styles.successBox,
        (activeTab === 'Cancelled' || status === 'CANCELLED') && { backgroundColor: '#FFEDED' },
        (activeTab === 'Upcoming' || isPending || isConfirmed) && { backgroundColor: '#E3F2FD' }
      ]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[
            styles.successText,
            (activeTab === 'Cancelled' || status === 'CANCELLED') && { color: '#FF5252' },
            (activeTab === 'Upcoming' || isPending || isConfirmed) && { color: '#2196F3' }
          ]}>
            {status === 'COMPLETED' ? "✔ Hey, you have completed it!" :
              (activeTab === 'Cancelled' || status === 'CANCELLED') ? "✘ This booking was cancelled" :
                isPending ? "⏳ Your appointment is pending" :
                  isConfirmed ? "✅ Your appointment is confirmed" :
                    "⏰ Your appointment is upcoming"}
          </Text>
          {status === 'COMPLETED' && (
            <TouchableOpacity
              onPress={onAddReview}
              style={{
                backgroundColor: '#09BFCD',
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 4
              }}
            >
              <Text style={{ color: 'white', fontSize: 11, fontWeight: '600' }}>Add Review</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

// ----------------- Styles -----------------

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 10,
  },
  activeTab: {
    // backgroundColor: '#09BFCD',
  },
  tabText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 17
  },
  tabTextActive: {
    color: '#09BFCD',
    fontWeight: '500',
    fontSize: 17


  },
  input: {
    backgroundColor: '#F3F3F3',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: "row",
    marginBottom: 4,
    // Android Shadow
    // elevation: 8,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: 95,
    height: 95,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  meta: {
    color: '#555',
    marginLeft: 4,
    fontWeight: "500"
  },
  icon: {
    marginRight: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  successBox: {
    marginTop: 8,
    backgroundColor: '#00C36633',
    padding: 12,
    borderRadius: 8,
  },
  successText: {
    color: '#00C366',
    fontWeight: '500',
    fontSize: 13,
  },
});

export default BookingsScreen;
