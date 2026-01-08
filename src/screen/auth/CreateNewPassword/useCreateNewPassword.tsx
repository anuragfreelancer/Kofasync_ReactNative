import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import { Alert } from 'react-native';
import { POST_API } from '../../../Api/apiRequest';
import { ENDPOINT } from '../../../Api/endpoints';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { errorToast } from '../../../utils/customToast';
 

const useCreateNewPassword = () => {
  const [credentials, setCredentials] = useState <any>({
    password: '',
    confirmPassword: '',
  });
  const route:any = useRoute();
  const { userId } = route.params || ''; // Provide a fallback if route.params is undefined
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setisLoading] = useState(false);
  const navigation = useNavigation<any>();
  const handleChange = (field:string, value:string) => {
    setCredentials((prev:any) => ({ ...prev, [field]: value }));
    setErrors((prev:any) => ({ ...prev, [field]: '' }));
    if (field === "password" && value.length < 5) {
      setErrors((prev:any) => ({ ...prev, password: "Password must be at least 5 characters." }));
    }
    if (field === "confirmPassword" && value !== credentials.password) {
      setErrors((prev:any) => ({ ...prev, confirmPassword: "Passwords do not match." }));
    }

  };

  const handleResetPass = async () => {
    //  navigation.navigate(ScreenNameEnum.Login)
    const { password, confirmPassword } = credentials;
    let validationErrors:any = {};
    if (!password.trim()) validationErrors.password = 'Password is required.';
    if (!confirmPassword.trim()) validationErrors.confirmPassword = 'Confirm Password is required.';
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    const params = {
      newPassword: password,
      confirmPassword: confirmPassword,
      userId: userId,
      // navigation: navigation,
    };

      const res =  await POST_API('', params, ENDPOINT.NEW_PASSWORD,setisLoading);
    
    if(res.success){
       console.log(res)
        navigation.navigate(ScreenNameEnum.Login)
      }else{
        errorToast(res.message)
      }

  };

  return {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleResetPass,
    navigation,
  };
};

export default useCreateNewPassword;
