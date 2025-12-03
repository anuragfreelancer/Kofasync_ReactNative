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
import ScreenNameEnum from '../../../routes/screenName.enum';
import { useNavigation } from '@react-navigation/native';

const MEN_DATA = [
  { id: '1', name: 'Undercut', img: imageIndex.man1 },
  { id: '2', name: 'Quiff', img:imageIndex.man1  },
  { id: '3', name: 'Crew Cut', img:imageIndex.man1   },
  { id: '4', name: 'Regular Cut', img:imageIndex.man1 },
];

const WOMEN_DATA = [
  { id: '1', name: 'Layer Cut', img: imageIndex.man1},
  { id: '2', name: 'Feather Cut', img: imageIndex.man1 },
  { id: '3', name: 'Straight Cut', img:imageIndex.man1 },
];

export default function OurServices() {
  const [gender, setGender] = useState('Men');
  const [selected, setSelected] = useState(null);

  const finalData = gender === 'Men' ? MEN_DATA : WOMEN_DATA;

  const renderCard = ({ item }) => {
    const isSelected = selected === item.id;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setSelected(item.id)}
      >
        <Image source={item.img} style={styles.cardImg} />

        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text 
                   style={[styles.cardTitle,{
            color:"#9E9E9E" ,
            fontSize:14 ,
            marginTop:5
          }]}
                    >728 booked</Text>

          <Text style={[styles.cardTitle,{
            color:"#09BFCD" ,
            fontSize:15 ,
                        marginTop:5

          }]}>$6.50</Text>

        </View>

        {/* Radio button */}
        <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.container}>
        <StatusBarComponent/>
      <Text style={styles.heading}>Our Services</Text>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, gender === 'Men' && styles.tabActive]}
          onPress={() => setGender('Men')}
        >
          <Text style={[styles.tabTxt, gender === 'Men' && styles.tabTxtActive]}>
            Men
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, gender === 'Women' && styles.tabActive]}
          onPress={() => setGender('Women')}
        >
          <Text
            style={[styles.tabTxt, gender === 'Women' && styles.tabTxtActive]}
          >
            Women
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={finalData}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* Bottom Apply Button */}
      <View style={styles.bottomArea}>
        <CustomButton onPress={()=>navigation.navigate(ScreenNameEnum.AppointmentScreen)} title='Apply'/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
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
     borderWidth:0.2,
     borderColor:"#181C2E",
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
    width: 22,
    height: 22,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#bbb',
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
