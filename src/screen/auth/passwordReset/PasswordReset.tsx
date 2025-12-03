import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
 import StatusBarCompoent from '../../../compoent/StatusBarCompoent';
import imageIndex from '../../../assets/imageIndex';
 import CustomButton from '../../../compoent/CustomButton';
import CustomHeader from '../../../compoent/CustomHeader';
import useForgot from './useForgot';
 import LoadingModal from '../../../utils/Loader';
import { TextInput } from 'react-native';
import ScreenNameEnum from '../../../routes/screenName.enum';
 
export default function PasswordReset() {
  const { credentials,
    errors,
    isLoading,
    handleChange,
    handleForgot,
    navigation, } = useForgot()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarCompoent />
      <ScrollView showsVerticalScrollIndicator={false} >
        {isLoading ? <LoadingModal /> : null}
        <View style={{ marginTop: 18 }}>
          <CustomHeader />
        </View>
        <View
          style={{
            backgroundColor: '#FFF',
             marginTop: hp(2),
             marginHorizontal:15
          }}>
          <View style={{ marginTop: 6 }}>
            <Text style={{
              fontWeight: '700',
              fontSize: 24,
              lineHeight: 36,
              color: 'rgba(0, 0, 0, 1)',
            }}>Password Reset</Text>
            <Text style={{
               fontWeight: '400',
               fontSize: 16,
                color: '#9DB2BF',
                marginTop: 4,
                lineHeight:20
            }}>
              Please put your mobile number to reset your password
            </Text>
          </View>
          <View
            // onPress={() => setType("SMS")}

            style={{
              flexDirection: 'row', alignItems: "center", justifyContent: "center", marginTop: 15,

            }}>
            <View

              style={[{
                height: hp(15),
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#EF571F",
                padding: 15,
                flexDirection: 'row',
                alignItems: "center",
                marginTop: 13
              }, {
                width: "100%",
              }]}
            >
              <Image source={imageIndex.mess} style={{ height: 55, width: 55 }} resizeMode='contain' />
              <View>
                <Text style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: 'black',
                  marginLeft: 10
                }}>SMS</Text>
                <TextInput
                  placeholder={'+91 8********7'}
                  value={credentials.email}
                  onChangeText={(value: string) => handleChange('email', value)} placeholderTextColor={"#9E9E9E"}
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: 'black',
                    marginLeft: 10 ,
                    marginTop:5

                   }}
                />
              </View>
            </View>

          </View>
                        <Text style={{
                          color:"red" ,
                          marginTop:11,
                          marginLeft:5
                        }}>{errors.email}</Text>

        </View>
      </ScrollView>
      <View style={{
        justifyContent: 'flex-start', marginBottom: 20
        ,
        marginHorizontal: 15
      }}>
        <CustomButton
          title={'Submit'}
          // onPress={() => handleForgot()

          // }
      onPress={()=>navigation.navigate(ScreenNameEnum.OtpScreen)}
         />
      </View>
    </SafeAreaView>
  );
}



