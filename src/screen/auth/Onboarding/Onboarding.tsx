import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
  Platform,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import imageIndex from '../../../assets/imageIndex';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import { styles } from './style';
import CustomButton from '../../../compoent/CustomButton';
import { color } from '../../../constant';
import ScreenNameEnum from '../../../routes/screenName.enum';

const { width, height } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  description: string;
  img: any;
}

const slides: Slide[] = [
  {
    id: '1',
    title: 'Find and Book Services Instantly',
    description: 'From salons to clinics explore trusted professionals near you.',
    img: imageIndex.sp2,
  },
  {
    id: '2',
    title: 'Find and Book Services Instantly',
    description: 'From salons to clinics explore trusted professionals near you.',
    img: imageIndex.sp2,
  },
  {
    id: '3',
    title: 'Find and Book Services Instantly',
    description: 'From salons to clinics explore trusted professionals near you.',
    img: imageIndex.sp2,
  },
];
const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const updateCurrentIndex = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== currentIndex) setCurrentIndex(index);
  };

  const handleNextPress = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate(ScreenNameEnum.ChooseRole)
      // navigation.navigate(ScreenNameEnum.Login)
      // navigation.navigate(ScreenNameEnum.TabNavigator);
    }
  };

  const handleSkip = () => {
    navigation.navigate(ScreenNameEnum.ChooseRole);
  };

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={[styles.slide,]}>
      <View style={{ backgroundColor: '#7DBF8D15', height: '70%', width: '100%', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
        <Image source={item.img} style={{
          height: '80%',
          width: '100%',
          resizeMode: "contain"
        }} />
      </View>
      {/* Dots */}

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const isActive = currentIndex === index;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: isActive ? '#000000' : color.onBoarding,
                  width: isActive ? 13 : 8,
                  height: isActive ? 5 : 8,
                  justifyContent: "center",
                  marginHorizontal: 5,
                  borderRadius: isActive ? 8 : 5,
                  marginTop: 15



                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        {/* <Text style={styles.skipText}>Skip</Text> */}
      </TouchableOpacity>

      <Animated.FlatList

        data={slides}
        horizontal
        pagingEnabled
        ref={flatListRef}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={renderSlide}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: updateCurrentIndex }
        )}
        scrollEventThrottle={16}
      />
      <View style={{ marginHorizontal: 15, marginBottom: 15 }}>

        <CustomButton title={"Next"} onPress={handleNextPress} />

      </View>

    </SafeAreaView>
  );
};

export default OnboardingScreen;
