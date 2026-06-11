import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
  Alert,
  Platform,
} from "react-native";
import imageIndex from "../../../assets/imageIndex";
import AboutSection from "./DetailsAbout";
import ReviewCard from "./ReviewCard";
import CustomLoader from "../../../compoent/CustomLoader";
import { useSelector } from "react-redux";
import { GET_API } from "../../../Api/apiRequest";
import { useNavigation, useRoute } from "@react-navigation/native";
import ScreenNameEnum from "../../../routes/screenName.enum";
import { image_url } from "../../../constant";
import { useSafeAreaInsets } from "react-native-safe-area-context";



const images = [
  imageIndex.banner1,
  imageIndex.banner1,
  imageIndex.banner1,
];

export default function DetailScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();
  const providerData = route.params?.providerData;
  const { token } = useSelector((state: any) => state.auth);

  const [activeTab, setActiveTab] = useState("Services");
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [shopData, setShopData] = useState<any>(null);
  const [reviewsData, setReviewsData] = useState<any[]>([]);

  useEffect(() => {
    if (providerData?._id) {
      fetchShopDetails();
      fetchReviews();
    }
  }, [providerData?._id]);

  const fetchReviews = async () => {
    const res = await GET_API(`shops/${providerData._id}/reviews`, token, "GET", setLoading);

    if (res?.success) {
      const reviewList = res.reviews || res.data;
      if (Array.isArray(reviewList)) {
        const formattedReviews = reviewList.map((r: any) => ({
          id: r._id || Math.random().toString(),
          name: r.user?.username || r.user?.name || "User",
          image: r.user?.profileImage ? image_url + r.user.profileImage : "https://randomuser.me/api/portraits/men/11.jpg",
          rating: r.rating || 5,
          review: r.review || r.comment || "No review text provided"
        }));
        setReviewsData(formattedReviews);
      }
    }
  };

  const fetchShopDetails = async () => {
    const res = await GET_API(`shops/${providerData._id}`, token, "GET", setLoading);
    console.log("Shop Details API Response:", res);
    if (res?.success) {
      setShopData(res.shop);
      setServicesData(res.shop.serviceIds || []);
    }
  };

  //   const renderService = ({ item }) => (
  //     <View style={styles.serviceCard}>
  //       <Text style={styles.serviceName}>{item.name}</Text>
  //       <Text style={styles.serviceTypes}>{item.types} types</Text>
  //       {/* <Ionicons name="chevron-forward" size={20} color="#09BFCD" /> */}

  //     </View>
  //   );

  const navigation = useNavigation<any>()

  if (loading && !shopData) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <CustomLoader />
      </View>
    );
  }

  const handleCall = () => {
    const phone = shopData?.partnerId?.phone || providerData?.phone;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert("Error", "Phone number not available for this shop");
    }
  };

  const handleDirection = () => {
    const lat = shopData?.latitude || providerData?.latitude || 19.136308;
    const lng = shopData?.longitude || providerData?.longitude || 72.826697;
    const label = shopData?.shopName || providerData?.shopName || "Shop Location";

    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${label})`,
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
      });
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <Image
            source={shopData?.shopImage ? { uri: image_url + shopData.shopImage } : providerData?.shopImage ? { uri: image_url + providerData.shopImage } : providerData?.profileImage ? { uri: image_url + providerData.profileImage } : images[activeImage]}
            style={styles.carouselImage}
            resizeMode="cover"
          />
          <View style={styles.imageIndicator}>
            {/* {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { opacity: activeImage === index ? 1 : 0.3 },
                ]}
              />
            ))} */}
          </View>
          <TouchableOpacity
            style={[styles.carouselArrowLeft, { top: insets.top + 10 }]}
            onPress={() => navigation.goBack()}
          >
            <Image source={imageIndex.back} style={{ height: 40, width: 40, }} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.carouselArrowRight} onPress={() => setActiveImage((prev) => (prev + 1) % images.length)}>

          </TouchableOpacity>
        </View>

        {/* Barber Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.barberName}>{shopData?.shopName || providerData?.shopName || providerData?.name || "Glamour Studio"}</Text>
          <View style={styles.ratingRow}>

            <Image source={imageIndex.location} style={{ height: 18, width: 18 }} />

            <Text style={styles.barberLocation}>
              {shopData?.address || providerData?.address || providerData?.specialization || "Location not available"}</Text>
          </View>
          <View style={styles.ratingRow}>
            <Image source={imageIndex.star} style={{ height: 18, width: 18 }} />

            <Text style={styles.ratingText}>
              {shopData?.providerId?.averageRating || providerData?.providerId?.averageRating || providerData?.averageRating || providerData?.rating || "0.0"}
              ({shopData?.providerId?.totalReviews || providerData?.providerId?.totalReviews || providerData?.totalReviews || 0} reviews)
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => {
            console.log("providerData", providerData)
            navigation.navigate(ScreenNameEnum.ChatScreen, { providerData })
          }}>
            <Image source={imageIndex.msg} style={{ height: 40, width: 40 }} />

            {/* <FontAwesome name="comment-o" size={20} color="#09BFCD" /> */}
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleCall}>
            <Image source={imageIndex.call} style={{ height: 40, width: 40 }} />

            {/* <Ionicons name="call-outline" size={20} color="#09BFCD" /> */}
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleDirection}>
            <Image source={imageIndex.locationCircle} style={{ height: 40, width: 40 }} />

            {/* <Ionicons name="location-outline" size={20} color="#09BFCD" /> */}
            <Text style={styles.actionText}>Direction</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Image source={imageIndex.share} style={{ height: 40, width: 40 }} />

            {/* <Ionicons name="share-social-outline" size={20} color="#09BFCD" /> */}
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {["About", "Services", "Review"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabBtn,
                activeTab === tab && styles.activeTabBtn,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flex: 1 }}>
          {activeTab === "About" && (
            <AboutSection key="about-section" shopData={shopData} />
          )}

          <View style={{ display: activeTab === "Services" ? "flex" : "none" }}>
            <View
              style={[styles.card, {
                padding: 17,
                justifyContent: "space-between",
                marginTop: 20,
                marginHorizontal: 18
              }]}
            >
              <Text>Our Services</Text>
              <View style={{
                flexDirection: "row",
                alignItems: "center"
              }}>
                <Text onPress={() => navigation.navigate(ScreenNameEnum.BookServies, { servicesData })} style={{
                  color: "#09BFCD",
                  fontSize: 16,
                  fontWeight: 'bold'
                }}>See All</Text>
              </View>
            </View>
            <View style={{ marginTop: 10, paddingHorizontal: 18 }}>
              {servicesData?.map((item) => (
                <TouchableOpacity
                  key={`service-${item._id}`}
                  style={[styles.card, {
                    padding: 17,
                    justifyContent: "space-between"
                  }]}
                  onPress={() => navigation.navigate(ScreenNameEnum.OurServices, {
                    serviceId: item._id,
                    providerId: shopData?.providerId?._id || providerData?.providerId?._id,
                    shopId: shopData?._id
                  })}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={item.image ? { uri: image_url + item.image } : imageIndex.category1} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
                    <Text>{item.name}</Text>
                  </View>

                  <View style={{
                    flexDirection: "row",
                    alignItems: "center"
                  }}>
                    <Text style={{
                      color: "#09BFCD",
                      fontSize: 16
                    }}>${item.price}</Text>
                    <Image
                      style={{
                        height: 22,
                        width: 22
                      }}
                      source={imageIndex.arrowright1} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ display: activeTab === "Review" ? "flex" : "none", paddingHorizontal: 18, paddingTop: 10 }}>
            {reviewsData.length > 0 ? reviewsData.map((item) => (
              <ReviewCard key={`review-${item.id}`} item={item} />
            )) : <Text style={{ textAlign: 'center', marginTop: 20 }}>No reviews yet.</Text>}
          </View>
        </View>
        <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
          {/* <CustomButton title="Book Now" /> */}
        </View>
      </ScrollView>
      {/* 
Mobile App

  Customer side 

--- get notification list
--- get unread notification
--- mark as read notification
--- short chat list according to recent chat
--- pull to refresh in chat list
--- pagination in chat list
--- search in chat list
--- get last message in chat list
--- get last message time in chat list
--- show online status in chat list
--- add notification prefrence
--- update notification prefrence
--- get notification prefrence
 
Note - To integrate the payment system in your app, we need to know which payment gateway you would like to use.
apk - https://we.tl/t-HytwxuvDTY72feqY
video - https://we.tl/t-wXXskn2hECgSWj4u
*/}
      {/* Book Button */}
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  carouselContainer: {
    height: 240,
    position: "relative",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  imageIndicator: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginHorizontal: 4,
  },
  carouselArrowLeft: {
    position: "absolute",
    top: 30,
    left: 10,
    // backgroundColor: "#0005",
    // padding: 8,
    borderRadius: 25,
    zIndex: 10,
    elevation: 8,
  },
  carouselArrowRight: {
    position: "absolute",
    top: "45%",
    right: 10,
    backgroundColor: "#0005",
    padding: 8,
    borderRadius: 25,
    zIndex: 10,
    elevation: 8,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  barberName: { fontSize: 20, fontWeight: "bold", color: "#1A1A1A" },
  barberLocation: { color: "#666", marginTop: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  ratingText: { marginLeft: 4, color: "#666" },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 25,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 15,

  },
  actionBtn: { alignItems: "center" },
  actionText: { fontSize: 12, color: "#09BFCD", marginTop: 4 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    //  borderWidth:0.2,
    borderColor: "#181C2E",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  tabRow: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: "#eee",
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#09BFCD",
    borderRadius: 25,
    marginHorizontal: 5
  },
  activeTabBtn: {
    borderWidth: 2,
    backgroundColor: "#09BFCD",
    borderRadius: 25
  },
  tabText: { fontWeight: "600", color: "#09BFCD" },
  activeTabText: { color: "#fff", fontWeight: "700" },

  serviceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  serviceName: { fontSize: 16, fontWeight: "600", color: "#1A1A1A" },
  serviceTypes: { fontSize: 14, color: "#666" },

  bookBtn: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#09BFCD",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  bookText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
