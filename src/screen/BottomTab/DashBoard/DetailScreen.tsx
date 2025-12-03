import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
} from "react-native";
import imageIndex from "../../../assets/imageIndex";
import CustomButton from "../../../compoent/CustomButton";
import AboutSection from "./DetailsAbout";
import ReviewCard from "./ReviewCard";
import { useNavigation } from "@react-navigation/native";
import ScreenNameEnum from "../../../routes/screenName.enum";

// Sample data
const services = [
  { id: "1", name: "Hair Cut", types: 44 },
  { id: "2", name: "Hair Coloring", types: 12 },
  { id: "3", name: "Hair Wash", types: 4 },
  { id: "4", name: "Shaving", types: 22 },
  { id: "5", name: "Skin Care", types: 16 },
  
];

const reviews = [
  {
    id: 1,
    name: "Kadin Calzoni",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    rating: 4,
    review:
      "The workers are very professional and the results are very satisfying. I like it very much.",
  },
  {
    id: 2,
    name: "Hanna Dokidis",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    rating: 5,
    review:
      "The workers are very professional and the results are very satisfying. I like it very much.",
  },
  {
    id: 3,
    name: "Terry Siphron",
    image: "https://randomuser.me/api/portraits/men/33.jpg",
    rating: 5,
    review:
      "The workers are very professional and the results are very satisfying. I like it very much.",
  },
];


const images = [
 imageIndex.banner1, // replace with your images
 imageIndex.banner1,
 imageIndex.banner1,
];

export default function DetailScreen() {
  const [activeTab, setActiveTab] = useState("Services");
  const [activeImage, setActiveImage] = useState(0);

//   const renderService = ({ item }) => (
//     <View style={styles.serviceCard}>
//       <Text style={styles.serviceName}>{item.name}</Text>
//       <Text style={styles.serviceTypes}>{item.types} types</Text>
//       {/* <Ionicons name="chevron-forward" size={20} color="#09BFCD" /> */}
   
//     </View>
//   );


   const renderService = ({ item }) => {
   
      return (
        <TouchableOpacity
          style={[styles.card,{
            padding:17 ,
            justifyContent:"space-between"
          }]}
         
        >
         <Text>{item.name}</Text>
       
  
          {/* Radio button */}
          <View style={  {
            flexDirection:"row" ,
            alignItems:"center"
          } }>
           
            <Text style={{
              color:"#09BFCD",
              fontSize:16
            }}>22 types</Text>
             <Image 
            
            style={{
              height:22,
              width:22
            }}
            source={imageIndex.arrowright1}/>
          </View>
        </TouchableOpacity>
      );
    };
    const navigation = useNavigation()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom:100 }}>
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <Image
            source={images[activeImage]}
            style={styles.carouselImage}
            resizeMode="cover"
          />
          <View style={styles.imageIndicator}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { opacity: activeImage === index ? 1 : 0.3 },
                ]}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.carouselArrowLeft} onPress={() => navigation.goBack()}>
          <Image source={imageIndex.back} style={{height:35, width:35}}/>
             </TouchableOpacity>
          <TouchableOpacity style={styles.carouselArrowRight} onPress={() => setActiveImage((prev) => (prev + 1) % images.length)}>
           
          </TouchableOpacity>
        </View>

        {/* Barber Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.barberName}>Barbarella Inova</Text>
    <View style={styles.ratingRow}>
       
          <Image source={imageIndex.location} style={{height:18, width:18}}/>

          <Text style={styles.barberLocation}> 
            
            6993 Meadow Valley Terrace, New York</Text>
            </View>
          <View style={styles.ratingRow}>
          <Image source={imageIndex.star} style={{height:18, width:18}}/>

            <Text style={styles.ratingText}>4.8 (3,279 reviews)</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
          <Image source={imageIndex.msg} style={{height:40, width:40}}/>
            
            {/* <FontAwesome name="comment-o" size={20} color="#09BFCD" /> */}
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
          <Image source={imageIndex.call} style={{height:40, width:40}}/>
           
            {/* <Ionicons name="call-outline" size={20} color="#09BFCD" /> */}
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
          <Image source={imageIndex.locationCircle} style={{height:40, width:40}}/>

            {/* <Ionicons name="location-outline" size={20} color="#09BFCD" /> */}
            <Text style={styles.actionText}>Direction</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
          <Image source={imageIndex.share} style={{height:40, width:40}}/>

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

        {/* Services List */}
        {activeTab === "Review" && (
         <View style={{ flex: 1, paddingHorizontal: 18, paddingTop: 10 }}>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ReviewCard item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
        )}

        {activeTab === "Services" && (
            <View>

                  <View
          style={[styles.card,{
            padding:17 ,
            justifyContent:"space-between"
          }]}
         
        >
         <Text>Our Services</Text>
       
  
          {/* Radio button */}
          <View style={  {
            flexDirection:"row" ,
            alignItems:"center"
          } }>
           
            <Text onPress={()=>navigation.navigate(ScreenNameEnum.BookServies)} style={{
              color:"#09BFCD",
              fontSize:16,
              fontWeight:'bold'
            }}>See All</Text>
         
          </View>
        </View>


          <FlatList
            data={services}
            keyExtractor={(item) => item.id}
            renderItem={renderService}
            style={{ marginTop: 10 }}
          />
          </View>
        )}


        {activeTab === "About" && (
          <AboutSection/>
        )}
<View style={{width:'90%', alignSelf:'center', marginTop:20}}>
      <CustomButton title="Book Now"/>
</View>
      </ScrollView>

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
    backgroundColor: "#0004",
    padding: 6,
    borderRadius: 20,
  },
  carouselArrowRight: {
    position: "absolute",
    top: "45%",
    right: 10,
    backgroundColor: "#0004",
    padding: 6,
    borderRadius: 20,
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
    paddingBottom:15,

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
     borderColor:"#181C2E",
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
    borderRadius:25,
marginHorizontal:5
  },
  activeTabBtn: {
    borderWidth: 2,
    backgroundColor: "#09BFCD",
    borderRadius:25
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
