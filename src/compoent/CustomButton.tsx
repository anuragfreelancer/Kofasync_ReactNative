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
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        { 
          height,
          backgroundColor: bgColor,
          opacity: disabled ? 0.5 : 1,
        },
        style, // parent styles ALWAYS override internal styles
      ]}
    >
      <View style={[styles.content, { justifyContent: alignment[alignItm] }]}>
        
        {/* ICON */}
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

        {/* TITLE */}
        <Text
          allowFontScaling={false}
          style={[
            styles.text,
            { color: txtcolor },
            textStyle,
          ]}
        >
          {title}
        </Text>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CustomButton;
