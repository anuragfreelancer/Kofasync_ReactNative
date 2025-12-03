 import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/BottomTab/DashBoard/Dashboard';
import ScreenNameEnum from '../routes/screenName.enum';
import DetailScreen from '../screen/BottomTab/DashBoard/DetailScreen';
 
 type HomeStackParamList = {
  [ScreenNameEnum.DashBoardScreen]: undefined;
  [ScreenNameEnum.DashBoardTwo]: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ScreenNameEnum.DashBoardScreen} component={HomeScreen} />
        <Stack.Screen name={ScreenNameEnum.DetailScreen} component={DetailScreen} />
    </Stack.Navigator>
  );
}
