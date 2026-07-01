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
import { useNavigation, useRoute } from "@react-navigation/native";
import ScreenNameEnum from "../../../routes/screenName.enum";
import { useSelector } from "react-redux";
import { GET_API, POST_API } from "../../../Api/apiRequest";
import { image_url } from "../../../constant";
import { wp, hp } from "../../../utils/Constant";
import LoadingModal from "../../../utils/Loader";

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
      const result = await POST_API(token, { shopId }, "customer/wishlist", () => { });

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
const CompanyCard = ({ item }: any) => {
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
          <LikeButton shopId={item._id} isWishlisted={item.isWishlisted} />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={styles.providerName}>By: {item.providerId?.name}</Text>
          <Text style={styles.viewServices}>View Services</Text>
        </View>
      </View>
    </View>
  );
};

export default function ProviderList() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const categoryTitle = route.params?.categoryTitle || "Providers";
  const categoryId = route.params?.categoryId;
  const { token } = useSelector((state: any) => state.auth);

  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<any[]>([]);
  useEffect(() => {
    if (categoryId) {
      fetchProviders();
      // fetchSubCategories();
    }
  }, [categoryId]);

  // const fetchSubCategories = async () => {
  //   const res = await GET_API(`categories/${categoryId}/services`, token, "GET", setLoading);
  //   console.log("SubCategories response:", res);
  //   if (res?.success) {
  //     setSubCatData([{ _id: "0", name: "All" }, ...res.services]);
  //   }
  // };

  const fetchProviders = async () => {
    const res = await GET_API(`shops/category/${categoryId}`, token, "GET", setLoading);
    if (res?.success) {
      setProviders(res.shops);
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#09BFCD" }}>
      <View style={styles.container}>
        <StatusBarComponent backgroundColor="#09BFCD" barStyle="light-content" />
        <LoadingModal visible={loading} />
        <CustomHeader
          label={categoryTitle}
          backgroundColor="#09BFCD"
          textColor="white"
        />

        {/* <View style={styles.subCatContainer}>
          <FlatList
            data={subCatData}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.subCatItem,
                  selectedSubCat === item._id && styles.subCatSelected
                ]}
                onPress={() => setSelectedSubCat(item._id)}
              >
                <Text style={[
                  styles.subCatText,
                  selectedSubCat === item._id && styles.subCatTextSelected
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.subCatList}
          />
        </View> */}

        <FlatList
          data={providers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate(ScreenNameEnum.DetailScreen, { providerData: item })}>
              <CompanyCard item={item} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
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
  }
});
