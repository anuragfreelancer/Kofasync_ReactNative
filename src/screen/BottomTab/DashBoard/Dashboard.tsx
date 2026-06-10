import React, { use, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import imageIndex from "../../../assets/imageIndex";
import SearchBar from "../../../compoent/SearchBar";
import StatusBarComponent from "../../../compoent/StatusBarCompoent";
import { useNavigation } from "@react-navigation/native";
import ScreenNameEnum from "../../../routes/screenName.enum";
import { useSelector } from "react-redux";
import { image_url, BASE_URL } from "../../../constant";
import { GET_API, POST_API } from "../../../Api/apiRequest";
import { errorToast, successToast } from "../../../utils/customToast";

// ---------------------- HEADER -------------------------
const Header = () => {
  const navigation = useNavigation<any>();
  const userData: any = useSelector((state: any) => state.auth.userData);
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: "row" }}>
        <Image source={userData?.profileImage ? { uri: image_url + userData?.profileImage } : imageIndex.profile} style={styles.profileImg} />
        <View style={{ marginLeft: 5 }}>
          <Text style={styles.welcome}>Hello, Welcome 🎉</Text>
          <Text style={styles.name}>{userData?.username}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
        <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => navigation.navigate(ScreenNameEnum.WishlistScreen)}>
          <Image source={imageIndex.heart} tintColor={'white'} style={[styles.profileImg, { height: 25, width: 25, }]} />
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => navigation.navigate(ScreenNameEnum.NotificationsScreen)}>
          <Image source={imageIndex.notification} style={styles.profileImg} />

        </TouchableOpacity>
      </View>
    </View>
  );
}
// ---------------------- BANNER ------------------------
const Banner = () => (
  <View style={styles.bannerContainer}>
    <Image source={imageIndex.banner1} style={styles.bannerImg} />

    <View style={styles.bannerOverlay}>
      <Text style={styles.bannerSubtitle}>Get a discount for every service</Text>
      <Text style={styles.bannerTitle}>Today's Special</Text>

      <TouchableOpacity style={styles.shopNow}>
        <Text style={styles.shopText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ---------------------- LIKE BUTTON -------------------
const LikeButton = ({ shopId, isWishlisted = false }: { shopId: string, isWishlisted?: boolean }) => {
  const [liked, setLiked] = useState(isWishlisted);
  const { token } = useSelector((state: any) => state.auth);

  useEffect(() => {
    setLiked(isWishlisted);
  }, [isWishlisted]);

  const handleLike = async () => {
    setLiked(!liked);
    try {
      const result = await POST_API(token, { shopId }, "customer/wishlist", () => {});

      if (result?.success) {
        // optionally handle success
      } else {
        // revert optimistic update on failure
        setLiked((prev) => !prev);
      }
    } catch (error) {
      console.error("Wishlist API Error:", error);
      setLiked((prev) => !prev);
    }
  };

  return (
    <TouchableOpacity
      style={styles.likeBtn}
      onPress={handleLike}
      activeOpacity={0.7}
    >
      <Image
        source={liked ? imageIndex.heart : imageIndex.heart}
        style={[styles.likeIcon, { tintColor: !liked ? "black" : "#09BFCD" }]}
      />
    </TouchableOpacity>
  );
};

// -------------------- COMPANY CARD ----------------------
const CompanyCard = ({ item }: any) => (
  <View style={styles.companyCard}>
    <Image source={item.image} style={styles.companyImg} />


    <View style={styles.companyContent}>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}>
        <Text style={styles.companyName}>{item.name}</Text>
        <View style={styles.ratingRow}>
          <Image source={imageIndex.star} style={styles.starIcon} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      <View style={styles.locationRow}>
        <View style={{
          flexDirection: "row",
          flex: 1,
          marginRight: 10,
          alignItems: "flex-start"
        }}>
          <Image source={imageIndex.location} style={[styles.locationIcon, { marginTop: 2 }]} />
          <Text style={[styles.locationText, { flex: 1 }]} numberOfLines={2}>{item.location}</Text>
        </View>
        <LikeButton shopId={item.id} isWishlisted={item.isWishlisted} />
      </View>

      <TouchableOpacity>
        <Text style={styles.viewServices}>View Services</Text>
      </TouchableOpacity>
    </View>

  </View>
);

// ====================== MAIN APP ======================
export default function App() {
  const { token } = useSelector((state: any) => state.auth);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [topShops, setTopShops] = useState<any[]>([]);

  // Popup states
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [bookingToReview, setBookingToReview] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchUserBookings();
    fetchTopShops();
  }, []);

  const fetchTopShops = async () => {
    const res = await GET_API("shops/top-rated", token, "GET", setLoading);
    console.log("Top Shops API Response:", res);
    if (res?.success) {
      const formattedShops = res.shops.map((shop: any) => ({
        id: shop._id,
        name: shop.shopName,
        location: shop.address || "N/A",
        rating: shop.providerId?.averageRating?.toString() || "0.0",
        image: shop.shopImage ? { uri: image_url + shop.shopImage } : imageIndex.officeImg,
        isWishlisted: shop.isWishlisted,
        originalData: shop
      }));
      setTopShops(formattedShops);
    }
  };

  const fetchCategories = async () => {
    const res = await GET_API("categories", token, "GET", setLoading);
    console.log("Categories API Response:", res);
    if (res?.success) {
      setCategories(res.categories);
    }
  };

  const fetchUserBookings = async () => {
    const res = await GET_API("customer/userBookings", token, "GET", setLoading);
    console.log("User Bookings API Response:", res);

    let bookings = [];
    if (res?.data && Array.isArray(res.data)) bookings = res.data;
    else if (res?.bookings && Array.isArray(res.bookings)) bookings = res.bookings;
    else if (Array.isArray(res)) bookings = res;

    if (bookings.length > 0) {
      const firstBooking = bookings[0];
      if (firstBooking.isReviewed === false && firstBooking.isSkipped === false) {
        setBookingToReview(firstBooking);
        setReviewModalVisible(true);
      }
    }
  };

  const submitReview = async () => {
    if (!bookingToReview) return;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "bookingId": bookingToReview._id,
      "rating": rating,
      "review": reviewText
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect
    };

    try {
      const url = BASE_URL ? `${BASE_URL}customer/createReview` : "http://localhost:5000/api/customer/createReview";
      const response = await fetch(url, requestOptions);
      const text = await response.text();
      console.log("Review Submit Result:", text);

      let result;
      try { result = JSON.parse(text); } catch (e) { result = {}; }

      setReviewModalVisible(false);

      if (result?.success) {
        successToast(result.message || "Review added successfully!");
        fetchUserBookings();
      } else {
        errorToast(result?.message || "Failed to add review");
      }
    } catch (error) {
      console.error("Review Submit Error:", error);
      errorToast("Failed to add review");
    }
  };

  const skipReview = async () => {
    if (!bookingToReview) {
      setReviewModalVisible(false);
      return;
    }
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        redirect: "follow" as RequestRedirect
      };

      const url = BASE_URL ? `${BASE_URL}customer/skipReview/${bookingToReview._id}` : `http://localhost:5000/api/customer/skipReview/${bookingToReview._id}`;
      const response = await fetch(url, requestOptions);
      const text = await response.text();
      console.log("Skip Review Result:", text);
    } catch (error) {
      console.error("Skip Review Error:", error);
    } finally {
      setReviewModalVisible(false);
      fetchUserBookings();
    }
  };

  const navigation = useNavigation<any>()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#09BFCD" }}>
      <View style={{ flex: 1, backgroundColor: "#F7FBFD" }}>
        <StatusBarComponent backgroundColor="#09BFCD" barStyle="light-content" />
        <ScrollView style={{ paddingBottom: 100, }}>
          <View style={{ backgroundColor: "#09BFCD", paddingBottom: 15 }}>
            <View style={{ marginHorizontal: 10, marginTop: 15 }}>
              <Header />
            </View>

            <View style={{ marginHorizontal: 10 }}>
              <SearchBar placeholder="Search Services or Companies" searchBar1={{}} />
            </View>
          </View>

          {/* Banner */}
          <Banner />

          {/* Categories Section */}
          <Text style={styles.sectionTitle}>Categories</Text>

          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => navigation.navigate(ScreenNameEnum.ProviderList, { categoryTitle: item.name, categoryId: item._id })}
              >
                <View style={styles.catCircle}>
                  <Image source={item.icon ? { uri: image_url + item.icon } : imageIndex.category1} style={styles.catIcon} />
                </View>
                <Text style={styles.catTitle} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.categoryList}
          />

          {/* Popular Companies */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Popular Shops</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>

          <FlatList
            data={topShops}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            horizontal
            ListHeaderComponent={
              <>
              </>
            }
            renderItem={({ item }) => <TouchableOpacity
              onPress={() => navigation.navigate(ScreenNameEnum.DetailScreen, { providerData: item.originalData })}
            >
              <CompanyCard item={item} />
            </TouchableOpacity>
            }
            contentContainerStyle={{ paddingBottom: 50 }}
          />
        </ScrollView>

        {/* Review Modal */}
        <Modal visible={reviewModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>How was your service?</Text>
              <Text style={styles.modalSubtitle}>Please rate and review the service you recently received.</Text>

              {bookingToReview && (
                <View style={styles.bookingDetailsContainer}>
                  <Text style={styles.serviceName}>{bookingToReview?.subServiceId?.name}</Text>
                  <Text style={styles.providerName}>Provider: {bookingToReview?.providerId?.name}</Text>
                  <Text style={styles.companyName}>{bookingToReview?.partnerId?.companyName}</Text>
                </View>
              )}

              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Image
                      source={imageIndex.star}
                      style={[styles.starIconBig, { tintColor: star <= rating ? "#FFB400" : "#D3D3D3" }]}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.reviewInput}
                placeholder="Write your review here..."
                multiline
                value={reviewText}
                onChangeText={setReviewText}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.skipButton} onPress={skipReview}>
                  <Text style={styles.skipButtonText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

// ====================== STYLES =======================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FBFD" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcome: { fontSize: 14, color: "white" },
  name: { fontSize: 20, fontWeight: "bold", color: "white" },
  profileImg: { width: 42, height: 42, borderRadius: 21 },

  bannerContainer: {
    height: 160,
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
  },
  bannerImg: { width: "100%", height: "100%" },
  bannerOverlay: { position: "absolute", left: 15, bottom: 30 },
  bannerSubtitle: { color: "#FFF", fontSize: 19 },
  bannerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  shopNow: {
    marginTop: 15,
    backgroundColor: "#09BFCD",
    borderRadius: 5,
    paddingHorizontal: 14,
    height: 44,
    width: 100,
    justifyContent: "center",
  },
  shopText: { color: "#fff", fontWeight: "600" },

  sectionTitle: {
    marginTop: 25,
    marginLeft: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  categoryList: { paddingLeft: 20, paddingTop: 10 },
  categoryCard: { alignItems: "center", marginRight: 25 },
  catCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8F8FA",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  catIcon: {
    width: "100%",
    height: "100%"
  },
  catTitle: { marginTop: 6, fontSize: 13, fontWeight: "700", color: "black", textAlign: "center", width: 70 },

  sectionRow: {
    marginTop: 25,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  seeAll: { color: "#09BFCD", fontWeight: "600" },

  companyCard: {
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 20,
    marginTop: 10,
    marginLeft: 20,
    overflow: "hidden",
    marginBottom: 30,
  },
  companyImg: {
    width: "100%",
    height: 140,
  },

  likeBtn: {

    padding: 6,
  },
  likeIcon: { width: 28, height: 28 },

  companyContent: { padding: 12 },
  companyName: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },

  locationRow: {
    flexDirection: "row", alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 4
  },
  locationIcon: { width: 14, height: 14, tintColor: "#09BFCD" },
  locationText: { marginLeft: 4, fontSize: 12, color: "#666" },

  viewServices: { color: "#09BFCD", fontWeight: "600" },

  ratingRow: {
    // position: "absolute",
    // left: 12,
    // top: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: { width: 16, height: 16, tintColor: "#FFB400" },
  ratingText: { marginLeft: 4, color: "#000", fontWeight: "600" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "85%", backgroundColor: "#FFF", borderRadius: 12, padding: 20, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5, color: "#000" },
  modalSubtitle: { fontSize: 13, color: "#666", textAlign: "center", marginBottom: 15 },

  bookingDetailsContainer: { width: "100%", alignItems: "center", marginBottom: 15 },
  serviceName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  providerName: { fontSize: 14, color: "#666", marginTop: 2 },
  starsRow: { flexDirection: "row", marginBottom: 20 },
  starIconBig: { width: 32, height: 32, marginHorizontal: 5 },
  reviewInput: { width: "100%", height: 100, borderWidth: 1, borderColor: "#DDD", borderRadius: 8, padding: 10, textAlignVertical: "top", marginBottom: 20 },
  modalActions: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  skipButton: { flex: 1, padding: 12, alignItems: "center", backgroundColor: "#F5F5F5", borderRadius: 8, marginRight: 10 },
  skipButtonText: { color: "#666", fontWeight: "bold" },
  submitButton: { flex: 1, padding: 12, alignItems: "center", backgroundColor: "#09BFCD", borderRadius: 8 },
  submitButtonText: { color: "#FFF", fontWeight: "bold" },
});
