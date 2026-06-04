

import ScreenNameEnum from '../routes/screenName.enum';
import { loginSuccess, logout } from '../redux/feature/authSlice';
import { errorToast, successToast } from '../utils/customToast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from '../utils/Toast';
import { BASE_URL, color } from '../constant';
import { ENDPOINT } from './endpoints';
import axios from 'axios';


const handleLogout = async (dispatch: any) => {
  try {
    dispatch(logout());    // reset Redux state
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

const saveAuthData = async (userData: any, token: any) => {
  try {
    await AsyncStorage.setItem('authData', JSON.stringify({ userData, token }));
    console.log('Auth data saved successfully');
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};
const getAuthData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('authData');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading auth data:', error);
    return null;
  }
};

const LoginApi = async (
  param: any,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);

  try {
    // ✅ Create FormData object
    // const formdata = new FormData();
    // formdata.append('email', param?.email || '');
    // formdata.append('password', param?.password || '');
    // formdata.append('type', param?.type || '');

    const raw = JSON.stringify({
      "email": param?.email,
      "password": param?.password,
      "role": param?.type
    });

    // ✅ Send FormData instead of JSON
    const response = await fetch(`${BASE_URL + ENDPOINT.Login}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json"
        // ❌ Do NOT set Content-Type manually for FormData
        // The browser/react-native will handle the correct boundary automatically
      },
      body: raw,
    });

    const textResponse = await response.text();

    // ✅ Try parsing response safely
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(textResponse);
    } catch (error) {
      errorToast('Invalid server response');
      return;
    }

    // ✅ Handle API response
    if (parsedResponse?.success) {
      console.log(parsedResponse)
      successToast(parsedResponse.message);
      await AsyncStorage.setItem('token', parsedResponse?.data?.token);
      param.dispatch(loginSuccess({ userData: parsedResponse?.data?.user, token: parsedResponse?.data?.token }));
      // await saveAuthData(parsedResponse?.data?.user_data, parsedResponse?.data?.token);

      param.navigation.replace(ScreenNameEnum.TabNavigator)
      //   code: param?.code,
      //   phone: param?.phone,
      // });
      return parsedResponse;
    } else {
      errorToast(parsedResponse.message);
      return parsedResponse;
    }
  } catch (error) {
    console.error('Login error:', error);
    errorToast('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

const SignupApi = async (
  param: any,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);

  try {

    const raw = JSON.stringify({
      "email": param?.email,
      "username": param?.username,
      "phoneNumber": param?.phoneNumber,
      "password": param?.password,
      "role": param?.role
    });

    const response = await fetch(`${BASE_URL + ENDPOINT.SignUp}`, {
      method: 'POST',
      headers: {
        // Accept: 'application/json',
        "Content-Type": "application/json"
      },
      body: raw,
    });
    // console.log(body)
    const textResponse = await response.text();


    let parsedResponse = JSON.parse(textResponse);

    console.log(parsedResponse)
    // ✅ Handle API response
    if (parsedResponse?.success) {
      successToast(parsedResponse.message);
      param.navigation.navigate(ScreenNameEnum.OtpScreen, { userId: parsedResponse?.data?.userId, from: 'signup' })
      //   {
      //   code: param?.code,
      //   phone: param?.phone,
      // });
      return parsedResponse;
    } else {
      errorToast(parsedResponse.message);
      return parsedResponse;
    }

  } catch (error) {
    console.error('Login error:', error);
    errorToast('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};




export const GET_API = async (
  endpoint: string,
  token?: string,
  method: string = "GET",
  setLoading?: (val: boolean) => void
) => {
  try {
    setLoading?.(true);

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${BASE_URL}${endpoint}`;

    const response = await axios({
      method,
      url,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    setLoading?.(false);

    return response.data;
  } catch (error: any) {
    console.error(
      "API Error:",
      error?.response?.data || error?.message
    );
    return error?.response?.data || {
      success: false,
      message: "Something went wrong",
    };
  } finally {
    setLoading?.(false);
  }
};

export const POST_API = async (
  token: string,
  body: any,
  endpoint: string,
  setLoading: (v: boolean) => void,
  method?: string
) => {
  try {
    setLoading(true);
    const role = await AsyncStorage.getItem("selectedRole");

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: method || 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Accept: 'application/json',
        "Content-Type": "application/json"
        // ❌ DO NOT set Content-Type for FormData
      },
      body: JSON.stringify({ ...body, role: role == "User" ? "customer" : 'provider' }),
    });
    console.log(body, 'this is body')
    // console.log(formData, 'formadata')
    const text = await response.text();

    try {
      console.log(JSON.parse(text))
      return JSON.parse(text);
    } catch {
      console.log('Non JSON response:', text);
      return null;
    }

  } catch (error) {
    console.log('Add Invoice Error:', error);
    return null;
  } finally {
    setLoading(false);
  }
};



const Verifyotp = async (param: any, setLoading: any, dispatch: any) => {
  setLoading(true);

  try {
    // ✅ Create FormData
    const formdata = new FormData();
    formdata.append('countryCode', param?.code || '');
    formdata.append('phoneNumber', param?.phone || '');
    formdata.append('otp', param?.otp || '');
    // formdata.append('otp', "9999" || '');

    const response = await fetch(`${BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formdata,
    });

    const textResponse = await response.text();
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(textResponse);
    } catch (error) {
      errorToast('Invalid server response');
      return;
    }
    if (parsedResponse?.status == 1) {
      successToast(parsedResponse?.message);
      await AsyncStorage.setItem('token', parsedResponse?.token);
      dispatch(loginSuccess({ userData: parsedResponse, token: parsedResponse?.token }));
      await saveAuthData(parsedResponse, parsedResponse?.token);
      //  if(parsedResponse?.type === "Delivery"){
      //   param.navigation.navigate(ScreenNameEnum.DeliveryTabNavigator);
      //  }else{
      //   param.navigation.navigate(ScreenNameEnum.TabNavigator);
      //  }
      param.navigation.navigate(ScreenNameEnum.ProfileSetup);

    } else {
      errorToast(parsedResponse?.message);
    }

  } catch (error: any) {
    console.error('Login error:', error);
    errorToast('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

const Resend_otp = async (param: any, setLoading: any) => {
  setLoading(true);
  try {
    // ✅ Create FormData
    const formdata = new FormData();
    const raw = JSON.stringify({
      "userId": param?.userId,
      "otp": param?.value
    });



    // ✅ Send FormData
    const response = await fetch(`${BASE_URL + ENDPOINT.OtpVerify}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: formdata,
    });

    const textResponse = await response.text();

    // ✅ Parse safely
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(textResponse);
    } catch (error) {
      errorToast('Invalid server response');
      return;
    }

    console.log('parsedResponse', parsedResponse);

    // ✅ Handle response
    if (parsedResponse?.status === 1) {
      successToast(parsedResponse?.message);
      if (param?.rom == "signup") {
        param.navigation.navigate(ScreenNameEnum.Login)
      } else {
        param.navigation.navigate(ScreenNameEnum.CreateNewPassword)

      }
    } else {
      errorToast(parsedResponse?.message);
    }

  } catch (error: any) {
    console.error('Resend OTP error:', error);
    errorToast('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

const UpdateProfile = async (
  param: any,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);

    const token = await AsyncStorage.getItem("token");
    const role = param.role || await AsyncStorage.getItem("selectedRole");

    const formdata = new FormData();

    if (param.username || param.name) formdata.append("name", param.username || param.name);
    if (param.email) formdata.append("email", param.email);
    if (param.address) formdata.append("address", param.address);
    if (param.phone || param.phoneNumber) formdata.append("phone", param.phone || param.phoneNumber);
    if (param.specialization) formdata.append("specialization", param.specialization);
    if (param.experience) formdata.append("experience", param.experience);

    // ✅ Append image only if exists
    if (param.imagePrfoile && param.imagePrfoile.uri) {
      const fileName = param.imagePrfoile.fileName || "profile.jpg";
      const fileType = param.imagePrfoile.type || "image/jpeg";

      formdata.append("profileImage", {
        uri: param.imagePrfoile.uri,
        name: fileName,
        type: fileType,
      } as any);
    }

    const headers: any = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Use specific endpoint for providers
    const endpoint = `profile/me`
    // : `auth/edit-profile/${param?.id}`;

    const fullUrl = `${BASE_URL}${endpoint}`;
    console.log("Calling UpdateProfile URL:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "PUT",
      headers,
      body: formdata,
    });

    const textResponse = await response.text();
    console.log("Raw textResponse from UpdateProfile:", textResponse);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(textResponse);
    } catch (e) {
      console.error("JSON Parse Error in UpdateProfile. Raw text:", textResponse);
      throw new Error("Invalid server response");
    }

    if (parsedResponse.success) {
      successToast(parsedResponse.message || "Profile updated successfully");
      return parsedResponse;
    } else {
      console.log("UpdateProfile Error Response:", parsedResponse);
      errorToast(parsedResponse.message || "Failed to update profile");
      return parsedResponse;
    }
  } catch (error: any) {
    console.error("UpdateProfile Catch Error:", error);
    errorToast("Something went wrong. Please try again.");
    return null;
  } finally {
    setLoading(false);
  }
};

const GetProfileApi = async (
  setLoading: (loading: boolean) => void,
  dispatch: any
): Promise<any | null> => {
  setLoading(true);
  const token = await AsyncStorage.getItem('token');
  console.log("token", token);
  try {
    const response = await fetch(`${BASE_URL}profile/me`, {
      method: 'GET',  // agar get ho toh GET use karna
      headers: {
        // 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    console.log("responseData", responseData);

    if (responseData.success) {
      dispatch(loginSuccess({ userData: responseData?.data, token: token }));
      return responseData;
    } else {
      Toast(responseData.error || responseData.message || "Something went wrong", color.red, 10);
      return null;
    }
  } catch (error) {
    console.error("API call error:", error);
    errorToast("Network error");
    return null;
  } finally {
    setLoading(false);
  }
};


const Privacypolicy = async (setLoading: any) => {
  setLoading(true);
  try {
    const response = await fetch(`${BASE_URL}legal/privacy-policy`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const textResponse = await response.text();
    const parsedResponse = JSON.parse(textResponse);

    console.log("parsedResponse", parsedResponse);

    if (parsedResponse?.success) {
      successToast(parsedResponse?.message);
      return parsedResponse?.data; // ✅ Return the data
    } else {
      errorToast(parsedResponse?.message);
      return null; // Optional: return null on failure
    }

  } catch (error: any) {
    console.error('Privacy Policy error:', error);
    errorToast(error.message);
    return null;
  } finally {
    setLoading(false);
  }
};


const Termsconditions = async (setLoading: any) => {
  setLoading(true);
  try {
    const response = await fetch(`${BASE_URL}legal/terms-conditions`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const textResponse = await response.text();
    const parsedResponse = JSON.parse(textResponse);

    console.log("parsedResponse", parsedResponse);

    if (parsedResponse?.success) {
      successToast(parsedResponse?.message);
      return parsedResponse?.data; // ✅ Return the data
    } else {
      errorToast(parsedResponse?.message);
      return null; // Optional: return null on failure
    }

  } catch (error: any) {
    console.error('Privacy Policy error:', error);
    errorToast(error.message);
    return null;
  } finally {
    setLoading(false);
  }
};


const DeliveryAvailableRequests = async (
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  const token = await AsyncStorage.getItem('token');
  try {
    const response = await fetch(`${BASE_URL}/delivery/available-requests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    console.log("responseData", responseData);

    if (responseData.status === "1" || responseData.status === 1) {
      return responseData;
    } else {
      Toast(responseData.error || responseData.message || "Something went wrong", color.red, 10);
      return null;
    }
  } catch (error) {
    errorToast("Network error");
    return null;
  } finally {
    setLoading(false);
  }
};

export {
  LoginApi,
  SignupApi,
  Verifyotp,
  handleLogout,
  getAuthData,
  Termsconditions,
  saveAuthData,
  Resend_otp,
  GetProfileApi,
  Privacypolicy,
  UpdateProfile,
  DeliveryAvailableRequests
}  