import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import imageIndex from "../../../assets/imageIndex";
import StatusBarComponent from "../../../compoent/StatusBarCompoent";
import CustomHeader from "../../../compoent/CustomHeader";
import { useNavigation } from "@react-navigation/native";
import ScreenNameEnum from "../../../routes/screenName.enum";
import { useSelector } from "react-redux";
import { GET_API, POST_API } from "../../../Api/apiRequest";
import { image_url, BASE_URL } from "../../../constant";
import { wp, hp } from "../../../utils/Constant";
import LoadingModal from "../../../utils/Loader";

// ---------------------- LIKE BUTTON -------------------
const LikeButton = ({ shopId, isWishlisted = false, onToggle }: { shopId: string, isWishlisted?: boolean, onToggle?: () => void }) => {
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
        if (onToggle) onToggle();
      } else {
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
const CompanyCard = ({ item, onToggle }: any) => {
  return (
    <View style={styles.companyCard}>
      <Image
        source={item.shopImage ? { uri: image_url + item.shopImage } : imageIndex.girlImg}
        style={styles.companyImg}
      />

      <View style={styles.companyContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.companyName}>{item.shopName}</Text>
          <View style={styles.ratingRow}>
            <Image source={imageIndex.star} style={styles.starIcon} />
            <Text style={styles.ratingText}>{item.providerId?.averageRating || "0.0"}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <View style={styles.locationInfo}>
            <Image source={imageIndex.location} style={styles.locationIcon} />
            <Text style={[styles.locationText, { flex: 1 }]} numberOfLines={1}>{item.address}</Text>
          </View>
          <LikeButton shopId={item._id} isWishlisted={true} onToggle={onToggle} />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={styles.providerName}>By: {item.providerId?.name}</Text>
          <Text style={styles.viewServices}>View Services</Text>
        </View>
      </View>
    </View>
  );
};

export default function WishlistScreen() {
  const navigation = useNavigation<any>();
  const { token } = useSelector((state: any) => state.auth);

  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const res = await GET_API(`customer/wishlist`, token, "GET", setLoading);
    console.log("Wishlist API Response:", res);
    if (res?.success) {
      let shopsData = [];
      if (res.wishlist && Array.isArray(res.wishlist)) {
        shopsData = res.wishlist.map((item: any) => item.shopId);
      } else if (res.data && Array.isArray(res.data)) {
        shopsData = res.data.map((item: any) => item.shopId);
      } else if (res.shops && Array.isArray(res.shops)) {
        shopsData = res.shops;
      }
      setWishlist(shopsData);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#09BFCD" }}>
      <View style={styles.container}>
        <StatusBarComponent backgroundColor="#09BFCD" barStyle="light-content" />
        <LoadingModal visible={loading} />
        <CustomHeader
          label={"My Wishlist"}
          backgroundColor="#09BFCD"
          textColor="white"
        />

        {wishlist.length === 0 && !loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: "#666" }}>Your wishlist is empty.</Text>
          </View>
        ) : (
          <FlatList
            data={wishlist}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate(ScreenNameEnum.DetailScreen, { providerData: item })}>
                <CompanyCard item={item} onToggle={fetchWishlist} />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FBFD"
  },
  listContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(5),
  },
  companyCard: {
    backgroundColor: "#fff",
    borderRadius: wp(4),
    marginBottom: hp(2.5),
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  companyImg: {
    width: "100%",
    height: hp(22),
    backgroundColor: "#f5f5f5",
  },
  companyContent: {
    padding: wp(4)
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  companyName: {
    fontSize: wp(4.5),
    fontWeight: "bold",
    color: "#1A1A1A",
    flex: 1,
    marginRight: 10,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  starIcon: {
    width: wp(3.5),
    height: wp(3.5),
    tintColor: "#FFB400"
  },
  ratingText: {
    marginLeft: 4,
    color: "#000",
    fontWeight: "700",
    fontSize: wp(3.2),
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(1),
    marginBottom: hp(1.5),
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  locationIcon: {
    width: wp(3.5),
    height: wp(3.5),
    tintColor: "#09BFCD"
  },
  locationText: {
    marginLeft: 4,
    fontSize: wp(3.2),
    color: "#666",
    fontWeight: "500",
  },
  likeBtn: {
    padding: 6,
    backgroundColor: "#F0F9FA",
    borderRadius: 20,
  },
  likeIcon: {
    width: wp(5),
    height: wp(5)
  },
  viewServices: {
    color: "#09BFCD",
    fontWeight: "bold",
    fontSize: wp(3.8),
  },
  providerName: {
    fontSize: wp(3.2),
    color: "#888",
    fontStyle: "italic",
    flex: 1,
  },
});
