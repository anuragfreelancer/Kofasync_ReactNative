import OnboardingScreen from "../screen/auth/Onboarding/Onboarding";
import ScreenNameEnum from "./screenName.enum";
import TabNavigator from "../navigators/TabNavigation";
import NotificationsScreen from "../screen/Notification/Notification";
import ChangePassword from "../screen/Profile/ChangePassword/ChangePassword";
import Splash from "../screen/auth/Splash/Splash";
import OtpScreen from "../screen/auth/OTPScreen/OtpScreen";
import ProfileSetup from "../screen/auth/ProfileSetup/ProfileSetup";
import PickupFromLocation from "../screen/BottomTab/DashBoard/PickupFromLocation";
import ViewDetails from "../screen/BottomTab/Orders/ViewDetails";
import PrivacyPolicy from "../screen/Profile/PrivacyPolicy";
import EditProfile from "../screen/Profile/EditProfile/EditProfile";
import ChatScreen from "../screen/BottomTab/ChatInbox/ChatScreen";
import OrdersPrfile from "../screen/Profile/OrdersPrfile/OrdersPrfile";
import DeliveryTabNavigator from "../navigators/DeliveryTabNavigator";
import ChooseRole from "../screen/auth/ChooseRole/ChooseRole";
import RequestLoading from "../screen/BottomTab/DashBoard/RequestLoading";
import Login from "../screen/auth/login/Login";
import SignUp from "../screen/auth/signUp/SignUp";
import PasswordReset from "../screen/auth/passwordReset/forgotPassword";
import OurServices from "../screen/BottomTab/OurServices/OurServices";
import BookServies from "../screen/BottomTab/BookServies/BookServies";
import TermsConditon from "../screen/Profile/TermsConditon";
import BookingSuccess from "../screen/BottomTab/DashBoard/BookingSuccess";
import BookingDetailScreen from "../screen/DeliveryBottomTab/BookingDetail";
import MyReviews from "../screen/DeliveryBottomTab/MyReviews";
import MYAvailability from "../screen/DeliveryBottomTab/MYAvailability";
import CreateNewPassword from "../screen/auth/CreateNewPassword/CreateNewPassword";
import ProviderList from "../screen/BottomTab/DashBoard/ProviderList";
import DetailScreen from "../screen/BottomTab/DashBoard/DetailScreen";
import NotificationsSetting from "../screen/Profile/NotificationsSetting/NotificationsSetting";
import HelpSupport from "../screen/Profile/HelpSupport/HelpSupport";
import AppointmentScreen from "../screen/BottomTab/AppointmentScreen/AppointmentScreen";
import BookingDetails from "../screen/BottomTab/Orders/BookingDetails";
const _routes: any = {
  REGISTRATION_ROUTE: [
    {
      name: ScreenNameEnum.SPLASH_SCREEN,
      Component: Splash,
    },

    {
      name: ScreenNameEnum.BookServies,
      Component: BookServies,
    },
    {
      name: ScreenNameEnum.TermsCondition,
      Component: TermsConditon,
    },
    {
      name: ScreenNameEnum.BookingSuccess,
      Component: BookingSuccess,
    },

    {
      name: ScreenNameEnum.OurServices,
      Component: OurServices,
    },

    {
      name: ScreenNameEnum.PasswordReset,
      Component: PasswordReset,
    },
    {
      name: ScreenNameEnum.Sinup,
      Component: SignUp,
    },
    {
      name: ScreenNameEnum.CreateNewPassword,
      Component: CreateNewPassword,
    },
    {
      name: ScreenNameEnum.NotificationsScreen,
      Component: NotificationsScreen,
    },
    {
      name: ScreenNameEnum.Login,
      Component: Login,
    },
    {
      name: ScreenNameEnum.ChooseRole,
      Component: ChooseRole,
    },


    {
      name: ScreenNameEnum.PickupLocation,
      Component: PickupFromLocation,
    },

    {
      name: ScreenNameEnum.HelpSupport,
      Component: HelpSupport,
    },

    {
      name: ScreenNameEnum.ProfileSetup,
      Component: ProfileSetup,
    },

    {
      name: ScreenNameEnum.NotificationsSetting,
      Component: NotificationsSetting,
    },
    {
      name: ScreenNameEnum.OnboardingScreen,
      Component: OnboardingScreen,
    },

    {
      name: ScreenNameEnum.OrdersPrfile,
      Component: OrdersPrfile,
    },
    {
      name: ScreenNameEnum.AppointmentScreen,
      Component: AppointmentScreen,
    },
    {
      name: ScreenNameEnum.ChatScreen,
      Component: ChatScreen,
    },
    {
      name: ScreenNameEnum.EditProfile,
      Component: EditProfile,
    },
    {
      name: ScreenNameEnum.OtpScreen,
      Component: OtpScreen,
    },



    {
      name: ScreenNameEnum.changePassword,
      Component: ChangePassword,
    },

    {
      name: ScreenNameEnum.TabNavigator,
      Component: TabNavigator,
    },

    {
      name: ScreenNameEnum.PrivacyPolicy,
      Component: PrivacyPolicy,
    },

    {
      name: ScreenNameEnum.ViewDetails,
      Component: ViewDetails,
    },


    {
      name: ScreenNameEnum.MyReviews,
      Component: MyReviews,
    },


    {
      name: ScreenNameEnum.MYAvailability,
      Component: MYAvailability,
    },
    {
      name: ScreenNameEnum.DeliveryTabNavigator,
      Component: DeliveryTabNavigator,
    },

    {
      name: ScreenNameEnum.RequestLoading,
      Component: RequestLoading,
    },
    {
      name: ScreenNameEnum.BookingDetail,
      Component: BookingDetailScreen,
    },
    {
      name: ScreenNameEnum.ProviderList,
      Component: ProviderList,
    },
    {
      name: ScreenNameEnum.DetailScreen,
      Component: DetailScreen,
    },
    {
      name: ScreenNameEnum.BookingDetails,
      Component: BookingDetails,
    },
  ],


};

export default _routes;
