import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import imageIndex from '../../../assets/imageIndex';


const AboutSection = () => {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* ------ DESCRIPTION ------ */}
      <Text style={styles.description}>
        Lorem ipsum dolor sit amet consectetur. Gravida dictum ut dignissim nisi donec. 
        Ut convallis vel eros in. Non mollis ullamcorper tortor sed laoreet eget orci 
        diam hendrerit fusse. Integer iaculis ultrices enim justo malesuada in sed odio. 
        Egestas arcu gravida eleifend eu in. Auctor malesuada lectus egestas lacus. 
        Tincidunt turpis erat lacus volutpat vitae etiam.
        <Text style={styles.readMore}> Read more</Text>
      </Text>


      {/* ------ WORKING HOURS ------ */}
      <Text style={styles.heading}>Working Hours</Text>

      <View style={styles.rowBetween}>
        <Text style={styles.label}>Monday - Friday</Text>
        <Text style={styles.time}>08:00 AM - 21:00 PM</Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.label}>Saturday - Sunday</Text>
        <Text style={styles.time}>10:00 AM - 20:00 PM</Text>
      </View>


      {/* ------ LOCATION ------ */}
      <Text style={[styles.heading, { marginTop: 25 }]}>Location</Text>

      <View style={styles.locationRow}>
                  <Image source={imageIndex.location} style={{height:20, width:20}}/>
        
        {/* <Icon name="map-pin" size={18} color="#09BFCD" /> */}
        <Text style={styles.locationText}>Grand Park, New York</Text>
      </View>

      {/* MAP CARD */}
      <View style={styles.mapCard}>
        <Image
          source={imageIndex.mapbg}
          style={styles.mapImg}
          resizeMode="cover"
        />

        {/* Marker */}
        {/* <View style={styles.markerContainer}>
          <View style={styles.markerDot} />
          <View style={styles.markerPin} />
        </View> */}
      </View>

    </ScrollView>
  );
};

export default AboutSection;


// ------------------------ STYLES -------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },

  description: {
    fontSize: 14,
    color: '#5A5A5A',
    lineHeight: 22,
    marginBottom: 20,
  },

  readMore: {
    color: '#09BFCD',
    fontWeight: '500',
  },

  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    marginTop: 10,
  },

  rowBetween: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginBottom: 10,
  },

  label: {
    fontSize: 15,
    color: '#5A5A5A',
    marginRight:30
  },

  time: {
    fontSize: 15,
    // fontWeight: '600',
    color: '#000',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },

  locationText: {
    fontSize: 15,
    color: '#5A5A5A',
  },

  mapCard: {
    width: '100%',
    height: 180,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 10,
    overflow: 'hidden',
    // elevation: 4,
  },

  mapImg: {
    width: '100%',
    height: '100%',
    borderRadius:20
  },

  markerContainer: {
    position: 'absolute',
    top: '45%',
    left: '47%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#09BFCD',
  },

  markerPin: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#09BFCD',
    position: 'absolute',
    top: -4,
  },
});
