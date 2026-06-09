import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from './LoginTypes';
import { useDispatch } from 'react-redux';
import { LoginApi } from '../../../Api/apiRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

const useLogin = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigation = useNavigation<RootStackParamList>();
  // const role = await AsyncStorage.getItem("selectedRole");
  const route = useRoute<any>();
  const type = route.params?.type;
  console.log("route", type)
  const [isLoading, setisLoading] = useState(false)
  interface Credentials {
    email: string;
    password: string;
  }
  const [role, setRole] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Credentials>(__DEV__ ? {
    email: type == "User" ? "customer@yopmail.com" : 'newprovider@yopmail.com',
    password: type == "User" ? 'Prakash@123' : 'Provider@123',
  } : {
    email: "",
    password: "",
  });
  const dispatch = useDispatch()
  const handleChange = (field: keyof Credentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  useEffect(() => {
    const getRole = async () => {
      const storedRole = await AsyncStorage.getItem("selectedRole");
      console.log("selectedRole", storedRole)
      setRole(storedRole);
    };
    getRole();
  }, []);
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

  const getFcmToken = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      if (token) {
        await AsyncStorage.setItem('fcmToken', token);
      }
      return token;
    } catch (error) {
      console.error('FCM token error:', error);
      return undefined;
    }
  };

  const getDeviceId = async () => {
    try {
      let storedId = await AsyncStorage.getItem('deviceId');
      if (!storedId) {
        storedId = `${Platform.OS}-${Math.random().toString(36).slice(2)}-${Date.now()}`;
        await AsyncStorage.setItem('deviceId', storedId);
      }
      return storedId;
    } catch (error) {
      console.error('Device ID error:', error);
      return `unknown-device-${Platform.OS}`;
    }
  };

  const handleLogin = async () => {
    if (!validateFields()) return; // Stop execution if validation fails
    try {
      const role = await AsyncStorage.getItem('selectedRole');
      const deviceToken = await getFcmToken();
      const deviceId = await getDeviceId();

      const params = {
        email: credentials?.email,
        password: credentials?.password,
        type: role == 'User' ? 'customer' : 'provider',
        navigation: navigation,
        dispatch: dispatch,
        deviceId,
        deviceToken,
        platform: Platform.OS,
      };
      console.log(params);
      const response = await LoginApi(params, setisLoading);
    } catch (error) {
      console.error('Signup Error:', error);
    }
  };
  return {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleLogin,
    navigation,
    role
  };
};

export default useLogin;
