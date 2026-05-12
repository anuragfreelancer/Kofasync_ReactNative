import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import CustomHeader from '../../../compoent/CustomHeader';
import imageIndex from '../../../assets/imageIndex';
import CustomButton from '../../../compoent/CustomButton';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { CommonActions } from '@react-navigation/native';

const BookingSuccess = ({ navigation }) => {
  const route = useRoute()
  //   const item = route?.params?.item
  //   const typeAction = route?.params?.typeAction
  //   const [loading, setLoading] = useState(false)

  //   useEffect(() => {
  //     (async () => {
  //       if (typeAction && item?.status == "Departure") {
  //         const param = {
  //           id: item?.user_id,
  //           bookingId: item?.id,
  //           status: "Charging"
  //         }
  //         setLoading(true)
  //         await ChangeTripStatusApi(param, setLoading)
  //       }
  //     })()
  //   })
  //   const Submit = async () => {
  //     if (item?.status == "Departure") {
  //       const param = {
  //         id: item?.user_id,
  //         bookingId: item?.id,
  //         status: "Charging"
  //       }
  //       setLoading(true)
  //       await ChangeTripStatusApi(param, setLoading)
  //     navigation.navigate(ScreenNameEnum.TripMap, { item: item })

  //     }else{
  //     navigation.navigate(ScreenNameEnum.TripMap, { item: item })

  //     }
  //   }

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs */}
      {/* {loading && <LoadingModal />} */}
      {/* <StatusBarComponent /> */}
      <CustomHeader
        label={"Back"}
      />
      <View style={styles.centerView}>
        <Image source={imageIndex.bookingSuccess} style={styles.img} />
        <Text style={styles.title}>{'Congratulations!'}</Text>
        <Text style={styles.subTitle}>{'Mentoring session successfully booked. You will receive a notification email shortly conforming this booking'}</Text>
      </View>


      <CustomButton onPress={() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: ScreenNameEnum.TabNavigator,
                params: { screen: "Booking" },
              },
            ],
          })
        );
      }} title={'View Appointment'} />
      <View style={{ marginBottom: 20 }}></View>
      <CustomButton onPress={() => {
        navigation.navigate(ScreenNameEnum.TabNavigator, { screen: ScreenNameEnum.HomeStack });
      }} title={'Go to Home'} />
    </SafeAreaView>
  );

};


export default BookingSuccess;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 16
  },
  img: {
    height: 150,
    width: 150,
  },
  centerView: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 0.9
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10
  },
  subTitle: {
    fontSize: 14,
    // fontWeight: 'bold',
    marginTop: 10,
    marginHorizontal: 15,
    textAlign: 'center',
    color: '#9E9FA5'
  },

});
