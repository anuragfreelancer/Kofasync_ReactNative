import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import CustomButton from '../../../compoent/CustomButton';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { useNavigation } from '@react-navigation/native';
import { color } from '../../../constant';

const ApointMentCard = ({ item, type }: any) => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(ScreenNameEnum.RaceDetail, { item: item })}>
      {/* Header with profile and status */}
      <View style={styles.header}>
        <Image source={{ uri: item?.uri }} style={{ height: 70, width: 70, borderRadius: 35 }} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.name}>Talan Rhiel Madsen</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: item?.document == "null" ? '#007AFF' : '#007AFF' }]}>
          {/* <Text style={styles.badgeText}></Text> */}
        </View>
      </View>

      {/* Info rows */}
      <View style={styles.rowC}>
        <View style={styles.row1}>
          <Image style={{ height: 17, width: 17 }} source={imageIndex.calendar} />
          {/* <Icon source={imageIndex.location3} colorIcon="grey" size={25} /> */}
          <Text style={styles.infoText}>Sunday, 12 June</Text>
        </View>
        <View style={styles.row}>
          <Image style={{ height: 17, width: 17 }} source={imageIndex.clock} />

          {/* <Icon source={imageIndex.calendar3} colorIcon="grey" size={25} /> */}
          <Text style={styles.infoText}>11:00 - 12:00 AM</Text>
        </View>
      </View>
      <View style={[styles.row1, { marginBottom: 20 }]}>
        <Image style={{ height: 17, width: 17 }} source={imageIndex.info} />

        {/* <Icon source={imageIndex.location3} size={25} colorIcon="grey" /> */}
        <Text style={styles.infoText}>I have a very high fever and a severe cold.</Text>
      </View>


      {/* Action button */}
      <CustomButton
        //    onPress={()=>{
        //     if(type=="recu" || type == "All"){
        //     navigation.navigate(ScreenNameEnum.RaceDetail, {item:item})
        //     }
        //   }} 
        onPress={() => navigation.navigate(ScreenNameEnum.BookingDetail)}
        style={styles.button} title={'Detail'} height={40} textStyle={styles.buttonText} />

    </TouchableOpacity>
  );
};
export default ApointMentCard;
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // elevation: 3,
    borderWidth: 1,
    borderColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  badge: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
    flex: 0.40

  },
  row1: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
    flex: 0.62

  },
  rowC: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 12,
    color: 'grey',
    flex: 1,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#38CEFF1A'
  },
  buttonText: {
    color: color.primary,
    fontWeight: '600',
    fontSize: 14,
  }
});
