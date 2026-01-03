import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import StatusBarCompoent from '../../../compoent/StatusBarCompoent';
import imageIndex from '../../../assets/imageIndex';
import ResponsiveSize from '../../../utils/ResponsiveSize';
import { wp } from '../../../utils/Constant';
import CustomButton from '../../../compoent/CustomButton';
import ScreenNameEnum from '../../../routes/screenName.enum';
import LoadingModal from '../../../utils/Loader';
import useLogin from './useLogin';
import TextInputField from '../../../compoent/TextInputField';

export default function Login() {
  const {
    credentials,
    errors,
    isLoading,
    navigation,
    handleChange,
    handleLogin
  } = useLogin()
  interface Option {
    team_name: string;
    id: string;
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarCompoent />
      <LoadingModal visible={isLoading} />
      <ScrollView showsVerticalScrollIndicator={false} >
        <View
          style={{
            backgroundColor: '#FFF',
            padding: 15,
            flex: 1,
            marginTop: hp(8)
          }}>

          <Image
            source={imageIndex.appLogo1}
            style={{ height: 88, width: 88, right: 15, alignSelf: 'center' }} resizeMode='cover'
          />
          <Text style={{
            color: "black",
            fontWeight: "bold",
            fontSize: 33,
            textAlign: 'center'
          }}  >
            Login
          </Text>

          <View style={{ marginTop: 5, }}>
            <Text style={{
              color: "#9DB2BF",
              textAlign: 'center',
              fontSize: 15
            }} >
              Enter your Number and password
            </Text>

          </View>
          <View style={{ marginTop: ResponsiveSize.marginTop(25), paddingVertical: hp(2), }}>
            <TextInputField
              placeholder={'Phone Number'}
              text={credentials.email}
              img={imageIndex.userLogo}

              firstLogo={true}
              onChangeText={(value: any) => handleChange('email', value)}
            />
            {errors.email ? <Text style={{ color: 'red', fontSize: 12, marginTop: 10 }}>{errors.email}</Text> : null}

            <TextInputField
              lable={"Password"}
              placeholder="Password"
              firstLogo={true}
              text={credentials.password}
              showEye={true}
              img={imageIndex.lock}
              onChangeText={(value: any) => handleChange('password', value)}

            />
            {errors.password ? <Text style={{ color: 'red', fontSize: 12, marginTop: 10 }}>{errors.password}</Text> : null}


          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate(ScreenNameEnum.PasswordReset)}
          >
            <Text style={{
              fontSize: 14,
              fontWeight: "500",
              color: "black",
              textAlign: "center",
              marginTop: 15,

              lineHeight: 18,

            }}>Forgot your password?</Text>
          </TouchableOpacity>
          <View style={{
            marginTop: 20
          }}>
            <CustomButton
              title={'Login'}
              onPress={handleLogin}

            />
          </View>
        </View>


        <Text style={{ marginTop: 20, fontSize: 16, lineHeight: 22, color: 'black', textAlign: "center", fontWeight: "500" }}>
          OR
        </Text>
        <View style={{ alignItems: 'center', marginTop: 25, flexDirection: 'row', alignSelf: 'center', borderWidth: 1, width: '90%', justifyContent: 'center', borderRadius: 10, borderColor: '#EBEBEB' }}>

          <Image
            source={imageIndex.google}
            style={{ height: 45, width: 20 }} resizeMode='contain'
          />
          <Text style={{ fontSize: 16, lineHeight: 22, color: '#909090', fontWeight: "500" }}>
            {' '}  Sign In with Google
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 40,
            alignSelf: 'center',
            justifyContent: 'flex-end', // Change this to flex-end 
          }}>
          <Text style={{ fontSize: 16, lineHeight: 22, color: '#909090', fontWeight: "500" }}>
            Don’t have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(ScreenNameEnum.Sinup)}

          >
            <Text style={Styles.text}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const Styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: 'black',
    bottom: 2
  },
  btn: {
    alignSelf: 'center',
    backgroundColor: '#E8442E',
    height: 55,

    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    width: wp(90),
  },
});


