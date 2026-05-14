import React, { useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

export function GoldOrb({
  size,
  color = "rgba(212,175,55,0.20)",
  delay = 0,
  duration = 3200,
  style,
}: {
  size: number;
  color?: string;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    const id = setTimeout(() => {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.18, { duration, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: duration * 0.7, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.4, { duration: duration * 0.7, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }, delay);

    return () => clearTimeout(id);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
        animStyle,
      ]}
    />
  );
}
