import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import CustomHeader from '../../../compoent/CustomHeader';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import imageIndex from '../../../assets/imageIndex';
import { color, image_url } from '../../../constant';
import { useSelector } from 'react-redux';
import { POST_API } from '../../../Api/apiRequest';
import LoadingModal from '../../../utils/Loader';
import ReviewModal from '../../../compoent/ReviewModal';
import { Alert, TouchableOpacity } from 'react-native';
import { errorToast, successToast } from '../../../utils/customToast';

const BookingDetails = () => {
  const route = useRoute<any>();
  const { item: initialItem } = route.params || {};
  const [item, setItem] = React.useState(initialItem);
  const { token } = useSelector((state: any) => state.auth);
  const [loading, setLoading] = React.useState(false);
  const [reviewModalVisible, setReviewModalVisible] = React.useState(false);

  const shopName = item?.partnerId?.companyName || "Unknown Shop";
  const serviceName = item?.subServiceId?.name || "Unknown Service";
  const date = item?.bookingDate ? new Date(item.bookingDate).toDateString() : "N/A";
  const time = `${item?.startTime || ""} - ${item?.endTime || ""}`;
  const providerName = item?.providerId?.name || "N/A";
  const status = item?.status?.toUpperCase() || "N/A";
  const price = item?.subServiceId?.price || 0;

  const handleReviewSubmit = async (rating: number, review: string) => {
    const body = {
      bookingId: item?._id,
      rating,
      review
    };

    const res = await POST_API(token, body, "customer/createReview", setLoading, "POST");
    if (res?.success) {
      setReviewModalVisible(false);
      successToast("Review added successfully!");
    } else {
      errorToast(res?.message || "Failed to add review");
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'COMPLETED': return '#00C366';
      case 'CANCELLED': return '#FF5252';
      case 'PENDING': return '#2196F3';
      default: return '#09BFCD';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      <LoadingModal visible={loading} />
      <CustomHeader label="Booking Details" />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Service Image */}
        <Image 
          source={item?.subServiceId?.image ? { uri: image_url + item.subServiceId.image } : imageIndex.salone} 
          style={styles.mainImage} 
        />

        <View style={styles.infoSection}>
          <Text style={styles.serviceTitle}>{serviceName}</Text>
          <Text style={styles.shopName}>{shopName}</Text>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '22' }]}>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>{status}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Details List */}
        <View style={styles.detailsContainer}>
          <DetailItem 
            icon={imageIndex.calneder} 
            label="Date" 
            value={date} 
          />
          <DetailItem 
            icon={imageIndex.time2} 
            label="Time" 
            value={time} 
          />
          <DetailItem 
            icon={imageIndex.profile2} 
            label="Provider" 
            value={providerName} 
            tint={color.primary}
          />
          <DetailItem 
            icon={imageIndex.locationCircle} 
            label="Price" 
            value={`$${price}`} 
          />
        </View>

        <View style={styles.divider} />

        {/* Notes or Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <Text style={styles.summaryText}>
            Your appointment for {serviceName} is scheduled with {providerName} at {shopName}. 
            Please arrive 10 minutes before your scheduled time.
          </Text>
        </View>

        {status === 'COMPLETED' && !item?.isReviewed && (
          <TouchableOpacity 
            style={styles.reviewBtn}
            onPress={() => setReviewModalVisible(true)}
          >
            <Text style={styles.reviewBtnText}>Write a Review</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <ReviewModal 
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={handleReviewSubmit}
        bookingData={item}
      />
    </SafeAreaView>
  );
};

const DetailItem = ({ icon, label, value, tint }: any) => (
  <View style={styles.detailRow}>
    <View style={styles.iconBox}>
      <Image source={icon} style={styles.detailIcon} tintColor={tint} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  shopName: {
    fontSize: 16,
    color: '#09BFCD',
    fontWeight: '500',
    marginTop: 4,
  },
  statusBadge: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 20,
  },
  detailsContainer: {
    gap: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconBox: {
    width: 45,
    height: 45,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  detailLabel: {
    fontSize: 12,
    color: '#9E9FA5',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  summarySection: {
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#777',
    lineHeight: 22,
  },
  reviewBtn: {
    backgroundColor: '#09BFCD',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  reviewBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default BookingDetails;
