import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import imageIndex from '../../assets/imageIndex';
import CustomHeader from '../../compoent/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import moment from 'moment';
import { image_url } from '../../constant';

import { useSelector } from 'react-redux';
import { updateBookingStatus } from '../../Api/bookingApi';
import { successToast, errorToast } from '../../utils/customToast';
import { ActivityIndicator } from 'react-native';

const BookingDetailScreen = () => {
  const route = useRoute<any>();
  const [loading, setLoading] = React.useState(false);
  const [bookingItem, setBookingItem] = React.useState(route.params?.item);
  const { token } = useSelector((state: any) => state.auth);
  const onRefresh = route.params?.onRefresh;

  const customer = bookingItem?.userId;
  const customerName = customer?.username || customer?.name || customer?.email?.split('@')[0] || "Customer";
  const customerImage = customer?.profileImage;

  const handleStatusUpdate = async (status: string) => {
    try {
      setLoading(true);
      const res = await updateBookingStatus(bookingItem._id, status, token);
      if (res?.success) {
        const updatedBooking = res.data || { ...bookingItem, status };
        setBookingItem(updatedBooking);
        successToast(`Booking ${status.toLowerCase()}ed successfully`);
        onRefresh?.();
      } else {
        errorToast(res?.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      errorToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader label=' Appointments Details' />

      <ScrollView style={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={customerImage ? { uri: image_url + customerImage } : { uri: "https://ui-avatars.com/api/?background=09BFCD&color=fff&name=" + encodeURIComponent(customerName) }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{customerName}</Text>
          <Text style={{ fontSize: 16, color: '#09BFCD', fontWeight: '600', marginTop: 5 }}>{bookingItem?.status}</Text>
        </View>

        {/* Date */}
        <View style={styles.row}>
          <Image source={imageIndex.calendar} style={styles.icon} />
          <Text style={styles.rowText}>{bookingItem?.bookingDate ? moment(bookingItem.bookingDate).format("dddd, DD MMMM YYYY") : "N/A"}</Text>
        </View>

        {/* Time */}
        <View style={styles.row}>
          <Image source={imageIndex.clock} style={styles.icon} />
          <Text style={styles.rowText}>{bookingItem?.startTime} - {bookingItem?.endTime}</Text>
        </View>

        {/* Note */}
        <View style={styles.row}>
          <Image source={imageIndex.info} style={styles.icon} />
          <Text style={styles.rowText}>{bookingItem?.notes || bookingItem?.description || "No additional notes provided."}</Text>
        </View>

        {/* Details */}
        <View style={styles.detailBlock}>
          <View style={styles.row1}>
            <Text style={styles.label}>Service Name</Text>
            <Text style={styles.value}>{bookingItem?.subServiceId?.name || "N/A"}</Text>
          </View>
          <View style={styles.row1}>
            <Text style={styles.label}>Price</Text>
            <Text style={styles.value}>${bookingItem?.subServiceId?.price || "0"}</Text>
          </View>
          <View style={styles.row1}>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.value}>{customer?.phoneNumber || "N/A"}</Text>
          </View>
          <View style={styles.row1}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{customer?.email || "N/A"}</Text>
          </View>
          <View style={styles.row1}>
            <Text style={styles.label}>New Customer</Text>
            <Text style={styles.value}>{bookingItem?.isNewCustomerBooking ? "Yes" : "No"}</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={{ marginTop: 40, marginBottom: 50 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#09BFCD" />
          ) : (
            <>
              {bookingItem?.status === 'PENDING' && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.declineBtn} onPress={() => handleStatusUpdate('CANCELLED')}>
                    <Text style={styles.btnText}>Decline</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.confirmBtn} onPress={() => handleStatusUpdate('CONFIRMED')}>
                    <Text style={styles.btnText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              )}
              {bookingItem?.status === 'CONFIRMED' && (
                <TouchableOpacity style={[styles.confirmBtn, { width: '100%' }]} onPress={() => handleStatusUpdate('COMPLETED')}>
                  <Text style={styles.btnText}>Mark as Completed</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  rowText: {
    fontSize: 15,
    color: '#8696BB',
  },
  detailBlock: {
    marginTop: 25,
  },
  label: {

    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginTop: 3,
  },
  value: {
    
    fontSize: 14,
    // color: '#767676',
    marginTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 30,
  },
  declineBtn: {
    width: '45%',
    backgroundColor: '#FF3B30',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  confirmBtn: {
    width: '45%',
    backgroundColor: '#09BFCD',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  row1:{
    flexDirection:'row', 
    justifyContent:'space-between',
    marginBottom:10
}
});

export default BookingDetailScreen;
