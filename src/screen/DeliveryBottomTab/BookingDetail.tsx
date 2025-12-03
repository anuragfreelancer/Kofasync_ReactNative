import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import imageIndex from '../../assets/imageIndex';
import Header from '../../compoent/Header';
import CustomHeader from '../../compoent/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const BookingDetailScreen = () => {
  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#fff'}}>
      <CustomHeader label=' Appointments Details'/>

    <ScrollView style={styles.container}>      
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/81' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>Davis Mango</Text>
      </View>

      {/* Date */}
      <View style={styles.row}>
        <Image source={imageIndex.calendar} style={styles.icon} />
        <Text style={styles.rowText}>Sunday, 12 June</Text>
      </View>

      {/* Time */}
      <View style={styles.row}>
        <Image source={imageIndex.clock} style={styles.icon} />
        <Text style={styles.rowText}>11:00 - 12:00 AM</Text>
      </View>

      {/* Note */}
      <View style={styles.row}>
        <Image source={imageIndex.info} style={styles.icon} />
        <Text style={[styles.rowText,]}>Please keep the fade sharp and beard well-lined.</Text>
      </View>

      {/* Details */}
      <View style={styles.detailBlock}>
        <View style={styles.row1}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>Davis Mango</Text>
</View>
<View style={styles.row1}>
        <Text style={styles.label}>Phone Number</Text>
        <Text style={styles.value}>+91 98765 43210</Text>
</View>
        
<View style={styles.row1}>
        <Text style={styles.label}>Hair Type</Text>
        <Text style={styles.value}>Curly</Text>
</View>
<View style={styles.row1}>
        <Text style={styles.label}>Beard Style Preference</Text>
        <Text style={styles.value}>Short Boxed Beard</Text>
</View>
<View style={styles.row1}>
        <Text style={styles.label}>Includes</Text>
        <Text style={styles.value}>Haircut, Beard Trim, Head Massage</Text>
    </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.declineBtn}>
          <Text style={styles.btnText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmBtn}>
          <Text style={styles.btnText}>Confirmed</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  rowText: {
    fontSize: 15,
    color: '#8696BB',
  },
  detailBlock: {
    marginTop: 25,
  },
  label: {

    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginTop: 3,
  },
  value: {
    
    fontSize: 14,
    // color: '#767676',
    marginTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 30,
  },
  declineBtn: {
    width: '45%',
    backgroundColor: '#FF3B30',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  confirmBtn: {
    width: '45%',
    backgroundColor: '#09BFCD',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  row1:{
    flexDirection:'row', 
    justifyContent:'space-between',
    marginBottom:10
}
});

export default BookingDetailScreen;
