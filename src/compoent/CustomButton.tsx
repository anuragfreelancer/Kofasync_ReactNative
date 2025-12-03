import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { color } from '../constant';
import font from '../theme/font';

type AlignType = 'left' | 'center' | 'right';

interface CustomButtonProps {
  title: string;
  txtcolor?: string;
  bgColor?: string;
  leftIcon?: React.ReactNode;
  alignItm?: AlignType;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  height?: number;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  txtcolor = '#FFFFFF',
  bgColor = color.primary,
  leftIcon,
  alignItm = 'center',
  style,
  textStyle,
  height = 50,
  onPress,
  disabled = false,
}) => {
  const alignment = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  } as const;

  return (
    <LinearGradient
      colors={['#F58D17', '#F58D17', '#EF571F']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.83, y: 0 }}
      style={[
        styles.gradient,
        { height: height, borderRadius: 9 },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[styles.button, { height: height }]}
        activeOpacity={0.7}
      >
        <View style={[styles.content, { justifyContent: alignment[alignItm] }]}>
          {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

          <Text
            allowFontScaling={false}
            style={[styles.text, { color: txtcolor }, textStyle]}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    width: '100%',
  },
  button: {
    width: '100%',
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
     color:"white",
    fontWeight:"bold"
  },
});

export default CustomButton;
