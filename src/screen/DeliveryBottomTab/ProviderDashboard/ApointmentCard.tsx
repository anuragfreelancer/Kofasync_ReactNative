import React from 'react';
import moment from 'moment';

import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import CustomButton from '../../../compoent/CustomButton';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { useNavigation } from '@react-navigation/native';
import { color, image_url } from '../../../constant';


import { useSelector } from 'react-redux';
import { updateBookingStatus } from '../../../Api/bookingApi';
import { successToast, errorToast } from '../../../utils/customToast';
import { ActivityIndicator } from 'react-native';

const ApointMentCard = ({ item, onRefresh }: any) => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = React.useState(false);
  const { token } = useSelector((state: any) => state.auth);

  const customer = item?.userId;
  const customerName = customer?.username || customer?.name || customer?.email?.split('@')[0] || "Customer";
  const customerImage = customer?.profileImage;
  const serviceName = item?.subServiceId?.name || "Service";

  const handleStatusUpdate = async (status: string) => {
    try {
      setLoading(true);
      const res = await updateBookingStatus(item._id, status, token);
      if (res?.success) {
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
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(ScreenNameEnum.BookingDetail, { item: item, onRefresh })}>
      {/* Header with profile and status */}
      <View style={styles.header}>
        <Image 
          source={customerImage ? { uri: image_url + customerImage } : { uri: "https://ui-avatars.com/api/?background=00C5D7&color=fff&name=" + encodeURIComponent(customerName) }} 
          style={{ height: 70, width: 70, borderRadius: 35 }} 
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.name}>{customerName}</Text>
          <Text style={{ fontSize: 13, fontWeight: '500', color: '#333', marginTop: 2 }}>{serviceName}</Text>
          <Text style={{ fontSize: 12, color: color.primary, marginTop: 2 }}>{item?.status}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: item?.status === 'COMPLETED' ? '#4CAF50' : item?.status === 'CANCELLED' ? '#F44336' : '#007AFF' }]}>
        </View>
      </View>

      {/* Info rows */}
      <View style={styles.rowC}>
        <View style={styles.row1}>
          <Image style={{ height: 17, width: 17 }} source={imageIndex.calendar} />
          <Text style={styles.infoText}>{item?.bookingDate ? moment(item.bookingDate).format("dddd, DD MMMM") : "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <Image style={{ height: 17, width: 17 }} source={imageIndex.clock} />
          <Text style={styles.infoText}>{item?.startTime} - {item?.endTime}</Text>
        </View>
      </View>
      <View style={[styles.row1, { marginBottom: 10 }]}>
        <Image style={{ height: 17, width: 17 }} source={imageIndex.info} />
        <Text style={styles.infoText} numberOfLines={2}>
          {item?.notes || item?.description || "No additional information provided."}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 10 }}>
        {loading ? (
          <ActivityIndicator size="small" color={color.primary} style={{ flex: 1 }} />
        ) : (
          <>
            {item?.status === 'PENDING' && (
              <>
                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: '#FF3B301A', borderColor: '#FF3B30' }]} 
                  onPress={() => handleStatusUpdate('CANCELLED')}
                >
                  <Text style={[styles.actionBtnText, { color: '#FF3B30' }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: '#4CD9641A', borderColor: '#4CD964' }]} 
                  onPress={() => handleStatusUpdate('CONFIRMED')}
                >
                  <Text style={[styles.actionBtnText, { color: '#4CD964' }]}>Accept</Text>
                </TouchableOpacity>
              </>
            )}
            {item?.status === 'CONFIRMED' && (
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: '#007AFF1A', borderColor: '#007AFF', flex: 1 }]} 
                onPress={() => handleStatusUpdate('COMPLETED')}
              >
                <Text style={[styles.actionBtnText, { color: '#007AFF' }]}>Complete</Text>
              </TouchableOpacity>
            )}
            {item?.status !== 'PENDING' && (
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: '#38CEFF1A', borderColor: color.primary, flex: 1 }]} 
                onPress={() => navigation.navigate(ScreenNameEnum.BookingDetail, { item: item, onRefresh })}
              >
                <Text style={[styles.actionBtnText, { color: color.primary }]}>Detail</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};
export default ApointMentCard;
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // elevation: 3,
    borderWidth: 1,
    borderColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  badge: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
    flex: 0.40

  },
  row1: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
    flex: 0.62

  },
  rowC: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 12,
    color: 'grey',
    flex: 1,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#38CEFF1A'
  },
  buttonText: {
    color: color.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
  }
});
