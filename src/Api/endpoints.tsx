 
export const ENDPOINT = {
  
  SignUp:"auth/signup" ,  
    Login: "auth/login", 
  ForgetPassword:"auth/forgot-password",
  OtpVerify:"auth/verify-otp",
  OtpVerifyForReset:"auth/verify-reset-otp",
  NEW_PASSWORD:"auth/reset-password",
  changePassword:"change-password",
  getProfile:"get-profile",
  getPrivacy:"get-privacy-policy",
  getAboutUs:"get-about-us",
  updateProfile:"update-profile",
  add_coach_session:"add_coach_session",
  BLOCK_TIME: (providerId: string) => `availability/${providerId}/block-time`,
  GET_BLOCK_TIMES: (providerId: string) => `availability/${providerId}/block-times`,
  GET_BLOCK_TIMES_BY_DATE: (providerId: string) => `availability/${providerId}/block-times/date`,
  UPDATE_BLOCK_TIME: (providerId: string, blockTimeId: string) => `availability/${providerId}/block-time/${blockTimeId}`,
  DELETE_BLOCK_TIME: (providerId: string, blockTimeId: string) => `availability/${providerId}/block-time/${blockTimeId}`,
};
 