// // ProfileScreen.tsx
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   Pressable,
//    ScrollView,
// } from "react-native";
// import SvgIndex from "../../../assets/svgIndex";
// import font from "../../../theme/font";
// import imageIndex from "../../../assets/imageIndex";
// import ScreenNameEnum from "../../../routes/screenName.enum";
// import { useNavigation } from "@react-navigation/native";
// import StatusBarComponent from "../../../compoent/StatusBarCompoent";
// import LogoutModal from "../../../compoent/LogoutModal";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useDispatch, useSelector } from "react-redux";
// import { GetProfileApi, handleLogout } from "../../../Api/apiRequest";
// import { loginSuccess, logout } from "../../../redux/feature/authSlice";
// import LoadingModal from "../../../utils/Loader";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { TouchableHighlight } from "react-native";
// import CustomButton from "../../../compoent/CustomButton";
 
// type Props = {
//   onEditProfile?: () => void;
//   onAddress?: () => void;
//   onOrders?: () => void;
//   onChangePassword?: () => void;
//   onPrivacyPolicy?: () => void;
//   onTerms?: () => void;
//   onLogout?: () => void;
//   user?: {
//     name: string;
//     email: string;
//     avatarUrl?: string;
//   };
// };

//  const YELLOW_DARK = "#FDB400";
// const TEXT = "#1C1C1C";
// const SUBTLE = "#9A9A9A";
// const BORDER = "#EFEFEF";
// const BG = "#FFFFFF";

// const ListItem = ({
//   label,
//   onPress,
//   secure = false,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   onPress?: () => void;
//   secure?: boolean;
// }) => (
//   <Pressable
//     onPress={onPress}
//     style={({ pressed }) => [
//       styles.row,
//       { opacity: pressed ? 0.6 : 1, },
//     ]}
//    >
//     <View style={styles.left}>
//       {/* <View style={[styles.iconWrap, secure && styles.secureIconWrap]}>
//         {icon}
//       </View> */}
//       <Text style={styles.rowLabel}>{label}</Text>
//     </View>
//   </Pressable>
// );

// const ProfileScreen: React.FC<Props> = ({
//   user = {
//     name: "Marcus Aminoff",
//     email: "marcus.aminoff@gmail.com",
//     avatarUrl:
//       "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=256&auto=format&fit=crop",
//   },
// }) => {
//   const navigation:any = useNavigation()
//   const [Modal,setModal]= useState(false)
//       const [isLoading, setLoading] = useState(false);
 
//   const dispatch = useDispatch();
//     const isLogin:any = useSelector <any>((state) => state?.auth?.userData);
//      useEffect(() => {
//       getProfileApi();
//     }, []);
  
//   const getProfileApi = async () => {
//     try {
//       const response = await GetProfileApi(setLoading);
//        if (response) {
//          dispatch(loginSuccess({ userData: response}));
//        } 
//     } catch (error) {
//       setLoading(false)
  
//      }
//   };
//     const handleLogout = () => {
//     dispatch(logout());
//     AsyncStorage.removeItem('authData');
//     navigation.replace(ScreenNameEnum.SPLASH_SCREEN); 
//   };
//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBarComponent/>
//        {/* <LoadingModal visible ={isLoading}/> */}
//       <ScrollView 
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={styles.container}>
//         {/* Header */}
//         <Text style={styles.title}>Profile</Text>
//         <View style={styles.profileCard}>
//           <View style={styles.avatarWrap}>
//             {isLogin?.image ? (
//               <Image source={{ uri: isLogin?.image }} style={styles.avatar} />
//             ) : (
//                             <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
//             )}
//             <TouchableHighlight style={styles.statusDot}
            
//              onPress={()=>{
//               navigation.navigate(ScreenNameEnum.EditProfile)
//            }}
//             >
//               <Image source={imageIndex.eoditphots} 
              
//                style={{
//                 height:22,
//                 width:22 ,
//                }}/>
//              </TouchableHighlight>
//           </View>

//           <View style={{ flex: 1 }}>
//             <Text style={[styles.name,{
//               color:"#EF571F",
//               fontFamily:font.MonolithRegular

//             }]}>{isLogin?.firstName || "Marcus Aminoff"}</Text>
//             <Text style={[styles.email,{
//               color:"#9DB2BF" ,
//               fontFamily:font.MonolithRegular
//             }]}>{isLogin?.email ||"marcusaminoff@gmail.com"}</Text>
//           </View>
//         </View>

//         {/* Menu */}
//         <View style={styles.card}>
//           <ListItem
//             icon={<SvgIndex.Edit   />}
//             label="Edit Profile"
//             onPress={()=>{
//               navigation.navigate(ScreenNameEnum.EditProfile)
//            }}
//           />
//           <ItemDivider />
//           <ListItem
//             icon={<SvgIndex.Edit   />}
//             label="My Address"
//             onPress={()=>{
//               navigation.navigate(ScreenNameEnum.AddressScreen)
//            }}
//           />
//           <ItemDivider />
//           <ListItem
//              label="My Orders"
//             onPress={()=>{
//               navigation.navigate(ScreenNameEnum.OrdersPrfile)
//            }}          />
//           <ItemDivider />
//           <ListItem
//              label="Change Password"
//              onPress={()=>{
//               navigation.navigate(ScreenNameEnum.changePassword)
//            }}
       
//           />
//           <ItemDivider />
//           <ListItem
//             label="Privacy Policy"
//             onPress={()=>{
//                navigation.navigate(ScreenNameEnum.PrivacyPolicy)
//             }}
//           />
//           <ItemDivider />
//           <ListItem
//             label="Terms and Conditions"
//             onPress={()=>{
//               navigation.navigate(ScreenNameEnum.LegalPoliciesScreen)
//              }}          />
//         </View>
// <View style={{
//   marginTop:20
// }}>
//           <CustomButton
//             title={'Logout'}
//             onPress={()=>{
//             setModal(true)
//           }}
//            />
//            </View>
//         {/* Logout */}
       
//        <LogoutModal
//   visible={Modal}
//   onLogout={async () => {
//     setModal(false);
// handleLogout()
//     // ✅ Call logout function
    
//   }}
//   onCancel={() => setModal(false)}
// />

//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const ItemDivider = () => <View style={styles.divider} />;

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "white" },
//   container: { padding: 16, paddingBottom: 28 },
//   title: { fontSize: 22, fontFamily:font.MonolithRegular, color: TEXT, marginBottom: 12 },
//   profileCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: BG,
//     borderRadius: 16,
//     padding: 14,
//     marginBottom: 16,
 
//   },
//   avatarWrap: { marginRight: 15 },
//   avatar: { width: 70, height: 70, borderRadius: 10 },
//   avatarFallback: {
//     backgroundColor: "#EAEAEA",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   avatarInitials: {  fontFamily:font.MonolithRegular, fontSize: 18, color: TEXT },
//   statusDot: {
//     position: "absolute",
//     right: -2,
//     bottom: -2,
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: YELLOW_DARK,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 2,
//     borderColor: BG,
//   },
//   name: { fontSize: 16,fontFamily:font.MonolithRegular, color: TEXT },
//   email: { fontSize: 13, color: SUBTLE, marginTop: 5  ,fontFamily:font.MonolithRegular,},
//   card: {
//     backgroundColor: BG,
//     borderRadius: 16,
    
//   },
//   row: {
//     paddingVertical: 14,
//     paddingHorizontal: 14,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   left: { flexDirection: "row", alignItems: "center" },
//   iconWrap: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//      alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   secureIconWrap: {
//    },
//   rowLabel: { fontSize: 15, color: TEXT ,fontFamily:font.MonolithRegular },
//   divider: {
//     height: StyleSheet.hairlineWidth,
//     backgroundColor: BORDER,
//     marginLeft: 54,
//   },
//   logoutBtn: {
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: "#FFCC00",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 18,
//     flexDirection: "row",
//     gap: 8,
//   },
//   logoutText: { fontSize: 14,fontFamily:font.MonolithRegular, color: TEXT },
// });

// export default ProfileScreen;



import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenNameEnum from "../../../routes/screenName.enum";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const navigation = useNavigation()
  const [role, setRole ] = useState('user')
  useEffect(()=>{
    (async()=>{
 const role =  await AsyncStorage.getItem("selectedRole")
 setRole(role ?? 'user')

    })()
  },[])
  return (
    <SafeAreaView style={{flex:1}}>
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Title */}
      <Text style={styles.screenTitle}>Profile</Text>

      {/* ACCOUNT SECTION */}
      <Text style={styles.sectionTitle}>Account</Text>
      <MenuItem title="Edit Profile" onPress={()=>navigation.navigate(ScreenNameEnum.EditProfile)} />
    {role != 'user' &&
    <View>
      <MenuItem title="My Reviews" onPress={()=>navigation.navigate(ScreenNameEnum.MyReviews)}/>
    
      <MenuItem title="Availability"  onPress={()=>navigation.navigate(ScreenNameEnum.MYAvailability)}/>

    </View>
    }
    
      <MenuItem title="Payment Method" />

      {/* SETTINGS SECTION */}
      <Text style={styles.sectionTitle}>Settings</Text>
      <MenuItem title="Notifications"  onPress={()=>navigation.navigate(ScreenNameEnum.NotificationsSetting)}/>

      {/* ABOUT SECTION */}
      <Text style={styles.sectionTitle}>About</Text>
      <MenuItem title="Privacy Policy"  onPress={()=>navigation.navigate(ScreenNameEnum.PrivacyPolicy)}/>
      <MenuItem title="Terms And Conditions Of Use"  onPress={()=>navigation.navigate(ScreenNameEnum.TermsCondition)} />
      <MenuItem title="Support" />

      {/* LOGOUT */}
      <TouchableOpacity style={{ marginTop: 25 }} onPress={async()=>{
await AsyncStorage.clear()
navigation.navigate(ScreenNameEnum.ChooseRole)
      }}>
        <Text style={styles.logout}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const MenuItem = ({ title, onPress }) => (
  <View>
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.itemText}>{title}</Text>
    </TouchableOpacity>
    <View style={styles.divider} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFF",
    paddingHorizontal: 18,
    paddingTop: 20,
  },

  screenTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 12,
    color: "#000",
  },

  item: {
    paddingVertical: 12,
  },

  itemText: {
    fontSize: 16,
    color: "#333",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
  },

  logout: {
    fontSize: 16,
    fontWeight: "600",
    color: "red",
  },
});
