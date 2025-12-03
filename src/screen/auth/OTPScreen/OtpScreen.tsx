import {
  View,
  Text,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import {
  CodeField,
  Cursor,
  
} from 'react-native-confirmation-code-field';
 import CustomButton from '../../../compoent/CustomButton';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
 import { SafeAreaView } from 'react-native-safe-area-context';
 import { styles } from './style';
import { useOtpVerification } from './useOTPVerification';
   import { color } from '../../../constant';
import CustomHeader from '../../../compoent/CustomHeader';
import LoadingModal from '../../../utils/Loader';
import imageIndex from '../../../assets/imageIndex';
import { hp } from '../../../utils/Constant';
import ScreenNameEnum from '../../../routes/screenName.enum';

export default function OtpScreen() {
  const {
    value,
    isLoading,
    errorMessage,
    ref,
    props,
    timer,
    getCellOnLayoutHandler,
    handleChangeText,
    handleVerifyOTP,
    handleResendOTP,
    navigation, 
    data
  } = useOtpVerification()
   return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}

    >
               <StatusBarComponent />
               <CustomHeader label={"Back"}/>
        <LoadingModal visible ={isLoading}/>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerSection}>
            <Text style={styles.txtHeading}>Enter the verification code</Text>
            <Text style={styles.txtDes}>We sent you a 4-digit code to  {data?.code} {data?.mob}
            </Text>
           </View>

          <View style={styles.otpFieldContainer}>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={handleChangeText}
              cellCount={4}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <View key={index} style={styles.cellWrapper}>
                  <Text
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          </View>
 
        </ScrollView>
      <Image source={imageIndex.bag} style={{ width: '80%', height: hp(45), alignSelf: 'center', marginBottom: 30 }} />  

        <CustomButton
          title={"Continue"}
          onPress={() => {
            
              navigation.navigate(ScreenNameEnum.CreateNewPassword)

           
          }
          }
          // onPress={handleVerifyOTP}
          style={styles.submitButton}
        />

      </View>
    </SafeAreaView>
  );
}