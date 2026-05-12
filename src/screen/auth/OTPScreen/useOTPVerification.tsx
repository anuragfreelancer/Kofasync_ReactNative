import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { useDispatch } from 'react-redux';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { POST_API, Resend_otp, Verifyotp } from '../../../Api/apiRequest';
import { ENDPOINT } from '../../../Api/endpoints';
import { errorToast } from '../../../utils/customToast';

export const useOtpVerification = (cellCount: number = 4) => {
  const navigation = useNavigation();
  const route: any = useRoute();
  const { userId, from } = route.params || {};
  console.log(from, 'from')
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(0);
  // Timer countdown logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);
  const data = {
    userId: userId,
    code: value
  }
  const [errorMessage, setErrorMessage] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });
  const handleChangeText = (text: string) => {
    setValue(text);
    setErrorMessage(text.length < cellCount ? 'Please enter 4 digit otp' : '');
  };

  const handleResendOTP = async () => {
    if (timer > 0) return; // prevent multiple clicks during countdown
    setIsLoading(true);
    try {
      const params = { userId, value, from, navigation };
      await Resend_otp(params, setIsLoading);
      setTimer(30); // start 30 seconds timer
    } catch (error) {
      console.error('OTP resend error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerifyOTP = async () => {
    if (value.length !== cellCount) {
      setErrorMessage('Please enter 4 digit otp');
      return;
    }

    setIsLoading(true);
    try {
      setIsLoading(false)
      const params = { userId, otp: value, navigation };
      const url = from == 'signup' ? ENDPOINT.OtpVerify : ENDPOINT.OtpVerifyForReset
      const res = await POST_API('', params, url, setIsLoading);

      if (res.success) {
        console.log(res)
        if (from == 'signup') {
          navigation.navigate(ScreenNameEnum.Login)
        } else {

          navigation.navigate(ScreenNameEnum.CreateNewPassword, { userId: userId })
        }
      } else {
        errorToast(res.message)
      }
    } catch (error) {
      setIsLoading(false)
    }
  };

  return {
    value,
    setValue,
    isLoading,
    errorMessage,
    ref,
    props,
    getCellOnLayoutHandler,
    handleChangeText,
    handleVerifyOTP,
    navigation,
    handleResendOTP,
    data,
    timer
  };
};
