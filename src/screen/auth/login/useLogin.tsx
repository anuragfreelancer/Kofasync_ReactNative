import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
 import { RootStackParamList } from './LoginTypes';
import { useDispatch } from 'react-redux';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { LoginApi } from '../../../Api/apiRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

const useLogin = () => {
  const [errors, setErrors] = useState<any>({});
  const navigation = useNavigation<RootStackParamList>();
  const [isLoading, setisLoading] = useState(false)
interface Credentials {
  email: string;
  password: string;
}

const [credentials, setCredentials] = useState<Credentials>({
  email: '',
  password: '',
});
const dispatch = useDispatch()
const handleChange = (field: keyof Credentials, value: string) => {
  setCredentials((prev) => ({ ...prev, [field]: value }));
  setErrors((prev) => ({ ...prev, [field]: '' }));
};
  const validateFields = () => {
    const { email, password } = credentials;
    let validationErrors: any = {};
    if (!email.trim()) {
      validationErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      validationErrors.email = 'Enter a valid email address.';
    }
  
   if (!password.trim()) {
  validationErrors.password = 'Password is required.';
} else if (!passwordRegex.test(password)) {
  validationErrors.password =
    'Password must be at least 8 characters long and include 1 alphabet and 1 special character.';
}
     
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    // navigation.navigate(ScreenNameEnum.TabNavigator)
    if (!validateFields()) return; // Stop execution if validation fails
    try {
      const role = await AsyncStorage.getItem("selectedRole");
  
      const params = {
        email: credentials?.email,
        password: credentials?.password,
        type:role,
         navigation: navigation,
         dispatch:dispatch
       };
       console.log(params)
       const response = await LoginApi(params, setisLoading);
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };
  return {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleLogin,
    navigation, 
    
  };
};

export default useLogin;
