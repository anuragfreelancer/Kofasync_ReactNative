 import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/BottomTab/DashBoard/Dashboard';
import ScreenNameEnum from '../routes/screenName.enum';
import DetailScreen from '../screen/BottomTab/DashBoard/DetailScreen';
import ProviderList from '../screen/BottomTab/DashBoard/ProviderList';
import SearchScreen from '../screen/BottomTab/DashBoard/SearchScreen';
 
 type HomeStackParamList = {
  [ScreenNameEnum.DashBoardScreen]: undefined;
  [ScreenNameEnum.DashBoardTwo]: undefined;
  [ScreenNameEnum.ProviderList]: { categoryTitle: string, categoryId?: string };
  [ScreenNameEnum.DetailScreen]: { providerData: any };
  [ScreenNameEnum.SearchScreen]: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ScreenNameEnum.DashBoardScreen} component={HomeScreen} />
        <Stack.Screen name={ScreenNameEnum.ProviderList} component={ProviderList} />
        <Stack.Screen name={ScreenNameEnum.DetailScreen} component={DetailScreen} />
        <Stack.Screen name={ScreenNameEnum.SearchScreen} component={SearchScreen} />
    </Stack.Navigator>
  );
}
