import React, { use, useEffect, useRef } from 'react';
import { Animated, ImageBackground, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { color } from '../../../constant';
import imageIndex from '../../../assets/imageIndex';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import { styles } from './style';
import { useDispatch, useSelector } from 'react-redux';
import { restoreLogin } from '../../../redux/feature/authSlice';
import { getAuthData } from '../../../Api/apiRequest';
import font from '../../../theme/font';
import { SafeAreaView } from 'react-native-safe-area-context';

type RootStackParamList = {
  Home: undefined;
};

const Splash: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
 const userData: any = useSelector((state: any) => state.auth.userData);
console.log(userData?.role, 'userdata')
  // Animation reference
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Timer for navigation
    const timer = setTimeout(async () => {
      console.log('storedAuth')

      try {
        // const storedAuth = await getAuthData();
        // console.log(storedAuth)
          if (userData) {
            // alert('customer')
          //   navigation.replace(ScreenNameEnum.DeliveryTabNavigator);
          // } else {
            navigation.replace(ScreenNameEnum.TabNavigator);
            // navigation.replace(ScreenNameEnum.RequestLoading);
            // navigation.replace(ScreenNameEnum.RequestLoading);
          }else{
             navigation.replace(ScreenNameEnum.OnboardingScreen);
          }
       
      } catch (error) {
        console.error('Splash check failed:', error);
        navigation.replace(ScreenNameEnum.OnboardingScreen);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation, dispatch]);

  return (
    <SafeAreaView
      style={styles.container}

    >
      <StatusBarComponent backgroundColor={color.white} />


      <View style={styles.centerContent}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <FastImage
            style={styles.logo}
            source={imageIndex.appLogo}
            resizeMode={FastImage.resizeMode.contain}
          />
        </Animated.View>
      </View>


    </SafeAreaView>
  );
};

export default Splash;
