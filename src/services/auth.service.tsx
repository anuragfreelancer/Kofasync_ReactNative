import { apiRequest } from "../Api/apiHelper";

 

interface SignupPayload {
  user_name: string;
  mobile_number: string;
  email: string;
  password: string;
  type: string;
}

export const AuthService = {
  signup: (payload: SignupPayload) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return apiRequest({
      method: 'POST',
      url: '/auth/signup',
      data: formData,
    });
  },
};
