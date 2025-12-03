// SlideButton.tsx
import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import SvgIndex from "../../assets/svgIndex";
import font from "../../theme/font";
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");

interface SlideButtonProps {
  title?: string;
  onSlideSuccess: () => void;
}

const SlideButton: React.FC<SlideButtonProps> = ({
  title = "Continue",
  onSlideSuccess,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const buttonWidth = 140;
  const sliderWidth = width * 0.92;
  const maxSlide = sliderWidth - buttonWidth - 10;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx >= 0 && gesture.dx <= maxSlide) {
          translateX.setValue(gesture.dx);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > maxSlide - 40) {
          Animated.timing(translateX, {
            toValue: maxSlide,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onSlideSuccess();
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.slider}>
        {/* Slide Hint */}
        <View style={styles.arrowWrapper}>
          <Text style={styles.hintText}>Slide</Text>
          <View style={{ marginLeft: 10 }}>
            <SvgIndex.SlideArrow />
          </View>
        </View>

        {/* Sliding Button */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.buttonWrapper, { transform: [{ translateX }] }]}
        >
          <LinearGradient
            colors={["#F58D17", "#F58D17", "#09BFCD"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.9, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{title}</Text>
          </LinearGradient>
        </Animated.View>
      </View>
    </View>
  );
};

export default SlideButton;

// ============== STYLES ==================

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  slider: {
    width: "92%",
    height: 58,
    backgroundColor: "#FFF0E3",
    borderRadius: 5,
    justifyContent: "center",
    overflow: "hidden",
  },

  arrowWrapper: {
    position: "absolute",
    right: 25,
    flexDirection: "row",
    alignItems: "center",
  },

  hintText: {
    fontSize: 16,
    color: "#09BFCD",
    fontFamily: font.MonolithRegular,
  },

  buttonWrapper: {
    position: "absolute",
    left: 0,
  },

  button: {
    width: 140,
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: font.MonolithRegular,
  },
});
