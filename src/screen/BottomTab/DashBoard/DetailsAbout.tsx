import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Platform } from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';


const AboutSection = ({ shopData }: any) => {
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMap(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={styles.container}
    >

      {/* ------ DESCRIPTION ------ */}
      <Text style={styles.description}>
        {shopData?.shopDescription || "No description available for this shop."}
      </Text>


      {/* ------ WORKING HOURS ------ */}
      <Text style={styles.heading}>Working Hours</Text>

      {shopData?.availability?.weeklySchedule ? (
        shopData.availability.weeklySchedule.map((item: any, index: number) => (
          <View key={index} style={styles.rowBetween}>
            <Text style={[styles.label, { width: 100 }]}>{item.day}</Text>
            <Text style={[styles.time, { color: item.enabled ? "#000" : "#999" }]}>
              {item.enabled ? `${item.start} - ${item.end}` : "Closed"}
            </Text>
          </View>
        ))
      ) : (
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Monday - Friday</Text>
          <Text style={styles.time}>08:00 AM - 21:00 PM</Text>
        </View>
      )}


      {/* ------ LOCATION ------ */}
      <Text style={[styles.heading, { marginTop: 25 }]}>Location</Text>

      <View style={styles.locationRow}>
        <Image source={imageIndex.location} style={{ height: 20, width: 20 }} />

        {/* <Icon name="map-pin" size={18} color="#09BFCD" /> */}
        <Text style={styles.locationText}>{shopData?.address || "Grand Park, New York"}</Text>
      </View>

      {showMap ? (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            const lat = shopData?.latitude || 19.136308;
            const lng = shopData?.longitude || 72.826697;
            const label = shopData?.shopName || "Shop Location";
            const url = Platform.select({
              ios: `maps:0,0?q=${label}@${lat},${lng}`,
              android: `geo:0,0?q=${lat},${lng}(${label})`,
            });

            if (url) {
              Linking.openURL(url).catch(() => {
                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
              });
            }
          }}
          style={styles.mapCard}
        >
          <MapView
            key={`shop-map-${shopData?._id || 'default'}`}
            style={styles.mapImg}
            provider={PROVIDER_GOOGLE}
            liteMode={Platform.OS === 'android'}
            scrollEnabled={false}
            zoomEnabled={false}
            initialRegion={{
              latitude: shopData?.latitude || 19.136308,
              longitude: shopData?.longitude || 72.826697,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Circle
              center={{
                latitude: shopData?.latitude || 19.136308,
                longitude: shopData?.longitude || 72.826697,
              }}
              radius={50}
              fillColor="rgba(9, 191, 205, 0.5)"
              strokeColor="#09BFCD"
              strokeWidth={2}
            />
          </MapView>
        </TouchableOpacity>
      ) : (
        <View style={[styles.mapCard, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: '#999' }}>Loading map...</Text>
        </View>
      )}

    </View>
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
    marginRight: 30
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
    borderRadius: 20
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
  markerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(9, 191, 205, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#09BFCD',
    borderWidth: 1,
    borderColor: 'white',
  },
});
