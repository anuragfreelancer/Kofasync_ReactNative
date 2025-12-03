import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import imageIndex from "../../../assets/imageIndex";
import SearchBar from "../../../compoent/SearchBar";
import StatusBarComponent from "../../../compoent/StatusBarCompoent";
import { useNavigation } from "@react-navigation/native";
import ScreenNameEnum from "../../../routes/screenName.enum";

// ---------------------- HEADER -------------------------
const Header = () => (
  <View style={styles.header}>
    <View style={{ flexDirection: "row" }}>
      <Image source={imageIndex.prfile} style={styles.profileImg} />
      <View style={{ marginLeft: 5 }}>
        <Text style={styles.welcome}>Hello, Welcome 🎉</Text>
        <Text style={styles.name}>Savannah Nguyen</Text>
      </View>
    </View>

    <TouchableOpacity style={{ flexDirection: "row" }}>
      <Image source={imageIndex.notification} style={styles.profileImg} />
    </TouchableOpacity>
  </View>
);

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
const LikeButton = () => {
  const [liked, setLiked] = useState(false);

  return (
    <TouchableOpacity
      style={styles.likeBtn}
      onPress={() => setLiked(!liked)}
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
const CompanyCard = ({ item }) => (
  <View style={styles.companyCard}>
    <Image source={item.image} style={styles.companyImg} />


    <View style={styles.companyContent}>
      <Text style={styles.companyName}>{item.name}</Text>

      <View style={styles.locationRow}>
        <View style={{
          flexDirection: "row"
        }}>
          <Image source={imageIndex.location} style={styles.locationIcon} />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <LikeButton />

      </View>

      <TouchableOpacity>
        <Text style={styles.viewServices}>View Services</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.ratingRow}>
      <Image source={imageIndex.star} style={styles.starIcon} />
      <Text style={styles.ratingText}>{item.rating}</Text>
    </View>
  </View>
);

// ====================== MAIN APP ======================
export default function App() {
  const categories = [
    { id: "1", title: "Wellness", icon: imageIndex.category1 },
    { id: "2", title: "Beauty", icon: imageIndex.category2 },
    { id: "3", title: "Health", icon: imageIndex.category3 },
    { id: "4", title: "Consulting", icon: imageIndex.category4 },
    { id: "5", title: "Services", icon: imageIndex.category5 },
  ];

  const companies = [
    {
      id: "1",
      name: "Glow Spa & Beauty",
      location: "Grand Park, New York",
      rating: "5.0",
      image: imageIndex.girlImg,
    },
    {
      id: "2",
      name: "Glow Spa & Beauty",
      location: "Grand Park, New York",
      rating: "5.0",
      image: imageIndex.officeImg,
    },

  ];
  const navigation = useNavigation()

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBarComponent backgroundColor="#09BFCD" barStyle="dark-content" />
      <ScrollView style={{ paddingBottom: 100, }}>
        <View style={{ backgroundColor: "#09BFCD", paddingBottom: 15 }}>
          <View style={{ marginHorizontal: 10, marginTop: 15 }}>
            <Header />
          </View>

          <View style={{ marginHorizontal: 10 }}>
            <SearchBar placeholder="Search Services or Companies" />
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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryCard}>
              <View style={styles.catCircle}>
                <Image source={item.icon} style={styles.catIcon} />
              </View>
              <Text style={styles.catTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoryList}
        />

        {/* Popular Companies */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Popular Companies</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>

        <FlatList
          data={companies}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          horizontal
          ListHeaderComponent={
            <>
              {/* HEADER BG */}
            </>
          }
          renderItem={({ item }) => <TouchableOpacity  onPress={()=>navigation.navigate(ScreenNameEnum.DetailScreen)}>
          <CompanyCard item={item} />
          </TouchableOpacity>
          }
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      </ScrollView>
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

    justifyContent: "center",
    alignItems: "center",
  },
  catIcon: { width: 70, height: 70 },
  catTitle: { marginTop: 6, fontSize: 13, fontWeight: "700", color: "black" },

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
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4
  },
  locationIcon: { width: 14, height: 14, tintColor: "#09BFCD" },
  locationText: { marginLeft: 4, fontSize: 12, color: "#666" },

  viewServices: { color: "#09BFCD", fontWeight: "600" },

  ratingRow: {
    position: "absolute",
    left: 12,
    top: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: { width: 16, height: 16, tintColor: "#FFB400" },
  ratingText: { marginLeft: 4, color: "#fff", fontWeight: "600" },
});
