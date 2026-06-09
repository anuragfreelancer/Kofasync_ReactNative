import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import imageIndex from "../../../assets/imageIndex";
import { image_url } from "../../../constant";

const ReviewCard = ({ item }) => {
  return (
    <View style={styles.card}>
      {/* Top Row */}
      <View style={styles.row}>
        <Image source={ item?.user?.profileImage ?{ uri: image_url + item?.user?.profileImage } : imageIndex.profile } style={styles.avatar} />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item?.user?.username}</Text>

          {/* Stars */}
          <View style={styles.starRow}>
            {/* {Array.from({ length: item.rating }).map((_, i) => (
              <Icon key={i} name="star" size={16} color="#FFB300" />
            ))} */}
            <Image source={imageIndex.rating} style={{height:15, width:80}} resizeMode="contain"/>
          </View>
        </View>
      </View>

      {/* Review Text */}
      <Text style={styles.reviewText}>{item.review}</Text>

      {/* Divider */}
      <View style={styles.divider} />
    </View>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({
  card: {
    paddingVertical: 18,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },

  starRow: {
    // flexDirection: "row",
    position:'absolute',
    top:0,
    right:10
  },

  reviewText: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginTop: 15,
  },
});
