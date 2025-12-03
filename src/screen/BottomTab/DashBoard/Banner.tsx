import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { color } from '../../../constant';
import imageIndex from '../../../assets/imageIndex';
import CustomButton from '../../../compoent/CustomButton';


const DiscountBanner = () => {
  return ( 
    <ImageBackground imageStyle={{borderRadius:20}} style={styles.bannerContainer}  source={imageIndex.banner1}>
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>Get a discount for every service available</Text>
        <Text style={styles.bannerText}>Today's Special</Text>
        <View  style={{height:30, width:'35%', marginTop:15}}>
        <CustomButton title='30% off' height={35} />
            </View>
      </View>
     
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: color.primary,
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.white,
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 14,
    color: color.white,
    opacity: 0.9,
  },
  bannerIcon: {
    width: 60,
    height: 60,
    tintColor: color.white,
  },
});

export default DiscountBanner;