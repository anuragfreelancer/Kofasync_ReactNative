import { useState } from 'react';
 import { useNavigation } from '@react-navigation/native';
import { POST_API } from '../../../Api/apiRequest';
import { ENDPOINT } from '../../../Api/endpoints';
import { errorToast } from '../../../utils/customToast';
import ScreenNameEnum from '../../../routes/screenName.enum';
  
 const useForgot = () => {
  const [errors, setErrors] = useState <any>({});
  // test11@gmail.com
   const navigation = useNavigation();
   const [isLoading, setisLoading] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleChange = (field:string, value:string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    setErrors((prev:any) => ({ ...prev, [field]: '' }));
    if (field === 'email') {
      if (!value.trim()) {
        setErrors((prev:any) => ({ ...prev, email: 'Email is required.' }));
      } else if (!emailRegex.test(value)) {
        setErrors((prev:any) => ({ ...prev, email: 'Enter a valid email address.' }));
      }
    }
 
  };
  const handleForgot =async () => {
    const { email } = credentials;
    let validationErrors:any = {}; 
 
    if (!email.trim()) {
      validationErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      validationErrors.email = 'Enter a valid email address.';
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
     try {
      const params = { email:email };
      const res = await POST_API('', params, ENDPOINT.ForgetPassword,setisLoading)
      if(res.success){
        console.log(res)

        navigation.navigate(ScreenNameEnum.OtpScreen, {userId:res?.data?.userId, from:'forgot'})
      }else{
        errorToast(res.message)
      }
      //  const response = await (params, setisLoading);
    } catch (error) {
     }
   };


  return {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleForgot,
    navigation,
  };
};

export default useForgot;
