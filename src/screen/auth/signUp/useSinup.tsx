import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SignupApi } from '../../../Api/apiRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';
  
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10,15}$/;

interface Credentials {
  email: string;
  password: string;
  mobile: string;
  fullName?: string;
  city?: string;
  country?: string;
  confirmPassword?:string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  mobile?: string;
  fullName?: string;
  selectedOption?: string;
  confirmPassword?:string
}

const useSignup = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [countyModal, setCountyModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: '',
    mobile: '',
    fullName: '',
    city: '',
    country: '',
    confirmPassword:''
  });

  const handleChange = (field: keyof Credentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;


  const validateFields = (): boolean => {
    const { email, password, mobile, fullName,  confirmPassword} = credentials;
    const validationErrors: ValidationErrors = {};

    // Full Name validation
    if (!fullName?.trim()) {
      validationErrors.fullName = 'Full name is required.';
    }

    // Email validation
    if (!email.trim()) {
      validationErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      validationErrors.email = 'Enter a valid email address.';
    }

    // Mobile validation
    if (!mobile.trim()) {
      validationErrors.mobile = 'Mobile number is required.';
    } else if (!mobileRegex.test(mobile.replace(/\D/g, ''))) {
      validationErrors.mobile = 'Enter a valid mobile number.';
    }

    // Password validation
  if (!password.trim()) {
  validationErrors.password = 'Password is required.';
} else if (!passwordRegex.test(password)) {
  validationErrors.password =
    'Password must be at least 8 characters long and include 1 alphabet and 1 special character.';
}

if (!confirmPassword.trim()) {
  validationErrors.confirmPassword = 'Confirm Password is required.';
} else if (password.trim() !== confirmPassword.trim()) {
  validationErrors.confirmPassword = 'Passwords do not match.';
}

    // Option selection validation
    // if (!selectedOption) {
    //   validationErrors.selectedOption = 'Please select an option.';
    // }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateFields()) return;
const role = await AsyncStorage.getItem("selectedRole");
    try {
      const params = {
        ...credentials,
        phoneNumber:   credentials.mobile,
        username: credentials.fullName,
        navigation: navigation,
        // county : selectedCountryCode,
        role:role == 'User' ? 'customer' :'provider'
      };
       
     const response = await SignupApi(params, setIsLoading);
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  const handleCountryCodeSelect = (item: any) => {
    setSelectedCountryCode(`${item.code}`);
    setCountyModal(false);
  };

  return {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleSignup,
    navigation,
    selectedOption,
    setSelectedOption,
    dropOpen,
    setDropOpen,
    selectedCountryCode,
    setSelectedCountryCode,
    countyModal,
    setCountyModal,
    handleCountryCodeSelect,
  };
};

export default useSignup;