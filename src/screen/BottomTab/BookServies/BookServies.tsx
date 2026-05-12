import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomButton from '../../../compoent/CustomButton';
import CustomHeader from '../../../compoent/CustomHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { image_url } from '../../../constant';

export default function BookServies() {
  const route = useRoute<any>();
  const servicesData = route.params?.servicesData || [];
  const navigation = useNavigation<any>()
  const renderCard = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={[styles.card, {
          padding: 17,
          justifyContent: "space-between"
        }]}
        onPress={() => navigation.navigate(ScreenNameEnum.OurServices, { serviceId: item._id })}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={item.image ? { uri: image_url + item.image } : imageIndex.category1} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
          <Text>{item.name}</Text>
        </View>


        {/* Radio button */}
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
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      <CustomHeader label='Our Services' />

      {/* Tabs */}
      <View style={{
        marginHorizontal: 15
      }}>


        {/* List */}
        <View style={{
          marginTop: 20
        }}>
          <FlatList
            data={servicesData}
            renderItem={renderCard}
            keyExtractor={item => item._id}
            contentContainerStyle={{ paddingBottom: 120 }}
          />

        </View>
        {/* Bottom Apply Button */}
        <View style={styles.bottomArea}>
          {/* <CustomButton title='Apply' /> */}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 14,
  },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 4,
    borderRadius: 40,
    marginBottom: 15,
    marginTop: 15
  },

  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 40,
    alignItems: 'center',
  },

  tabActive: {
    backgroundColor: '#09BFCD',
  },

  tabTxt: {
    fontSize: 14,
    color: '#555',
  },

  tabTxtActive: {
    color: '#fff',
    fontWeight: '600',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    borderWidth: 0.2,
    borderColor: "#181C2E",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  cardImg: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '500',
  },

  radioOuter: {

    justifyContent: 'center',
    alignItems: 'center',
  },

  radioOuterActive: {
    borderColor: '#00C3E5',
  },

  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: '#00C3E5',
    borderRadius: 10,
  },

  bottomArea: {
    position: 'absolute',
    bottom: 30,
    left: 18,
    right: 18,
  },

  applyBtn: {
    backgroundColor: '#00C3E5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  applyTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
