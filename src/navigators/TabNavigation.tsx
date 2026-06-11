import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform, Image } from 'react-native';
import ScreenNameEnum from '../routes/screenName.enum';
import HomeStack from './HomeStack';
import font from '../theme/font';
import SvgIndex from '../assets/svgIndex';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Orders from '../screen/BottomTab/Orders/Orders';
import UserProfile from '../screen/BottomTab/Profile/UserProfile';
import ChatInboxScreen from '../screen/BottomTab/ChatInbox/Inbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProviderDashboard from '../screen/DeliveryBottomTab/ProviderDashboard/ProviderDashboard';
import CalendarTabScreen from '../screen/DeliveryBottomTab/CalendarTab';

const Tab = createBottomTabNavigator();

const TAB_CONFIG: any = {
  [ScreenNameEnum.HomeStack]: {
    label: 'Home',
    iconActive: SvgIndex.HomeAtive,
    iconInactive: SvgIndex.Home,
  },

  Booking: {
    label: 'Booking',
    iconActive: SvgIndex.Box,
    iconInactive: SvgIndex.Box1,
  },
  'My Calendar': {
    label: 'My Calendar',
    iconActive: SvgIndex.Box,
    iconInactive: SvgIndex.Box1,
  },
  Chat: {
    label: 'Chat',
    iconActive: SvgIndex.MessageActive,
    iconInactive: SvgIndex.Message,
  },
  Profile: {
    label: 'Profile',
    iconActive: SvgIndex.UserActive,
    iconInactive: SvgIndex.User,
  },
};

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 80 : 70;
const ICON_SIZE = 26;

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState('user')
  useEffect(() => {
    (async () => {
      const role = await AsyncStorage.getItem("selectedRole")
      setRole(role ?? 'user')

    })()
  }, [])
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tab = TAB_CONFIG[route.name];
        return {
          headerShown: false,
          tabBarLabel: ({ focused }) => {
            let label = tab?.label ?? route.name;
            if (route.name === "Booking" && role?.toLowerCase() !== "user") {
              label = "My Calendar";
            }
            return (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 12,
                  color: focused ? '#09BFCD' : '#2F4858',
                  marginTop: 4,
                  fontFamily: font.MonolithRegular,
                }}
              >
                {label}
              </Text>
            );
          },
          tabBarIcon: ({ focused }) => {
            let Icon = focused ? tab?.iconActive : tab?.iconInactive;

            // Handle fallback for My Calendar icon if name is Booking
            if (route.name === "Booking" && role?.toLowerCase() !== "user") {
              const calendarTab = TAB_CONFIG["My Calendar"];
              Icon = focused ? calendarTab.iconActive : calendarTab.iconInactive;
            }

            if (!Icon) return null;
            if (typeof Icon === 'function') {
              return <Icon width={ICON_SIZE} height={ICON_SIZE} />;
            } else {
              return (
                <Image
                  source={Icon}
                  style={{
                    width: ICON_SIZE,
                    height: ICON_SIZE,
                    resizeMode: 'contain',
                  }}
                />
              );
            }
          },
          tabBarStyle: {
            position: 'absolute',
            left: 20,
            right: 20,
            backgroundColor: 'white', // your desired background
            height: TAB_BAR_HEIGHT + insets.bottom, // safe height including bottom inset
            paddingBottom: insets.bottom,
            paddingTop: 8,

            // Rounded corners
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,

            // Borders

            borderTopColor: 'rgba(125, 154, 155, 0.15)',
            borderLeftColor: 'rgba(125, 154, 155, 0.15)',
            borderRightColor: 'rgba(125, 154, 155, 0.15)',

            // Optional shadow for iOS
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,

            // Optional elevation for Android
            elevation: 4,


          },
        };
      }}
    >
      <Tab.Screen name={ScreenNameEnum.HomeStack} component={role == 'User' ? HomeStack : ProviderDashboard} />
      {/* <Tab.Screen name="MyTrack" component={MyTrack} /> */}
      <Tab.Screen name="Booking" component={role?.toLowerCase() === 'user' ? Orders : CalendarTabScreen} />
      <Tab.Screen name="Chat" component={ChatInboxScreen} />
      <Tab.Screen name="Profile" component={UserProfile} />
    </Tab.Navigator>
  );
}
