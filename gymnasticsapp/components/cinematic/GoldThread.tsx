import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const DASH = 1200;
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

function GoldPathAnimated({
  d,
  strokeWidth,
  strokeOpacity,
  delay = 0,
}: {
  d: string;
  strokeWidth: number;
  strokeOpacity: number;
  delay?: number;
}) {
  const offset = useSharedValue(DASH);

  useEffect(() => {
    offset.value = withDelay(delay, withTiming(0, { duration: 2400, easing: EASE }));
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: offset.value,
  }));

  return (
    <AnimatedPath
      d={d}
      fill="none"
      stroke="#d4af37"
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      strokeDasharray={DASH}
      animatedProps={animatedProps}
    />
  );
}

export function GoldThread() {
  return (
    <Svg
      style={StyleSheet.absoluteFill}
      viewBox="0 0 400 280"
      preserveAspectRatio="xMidYMid slice"
      pointerEvents="none"
    >
      <GoldPathAnimated
        d="M -30 190 C 60 110, 170 240, 270 155 S 390 65, 450 108"
        strokeWidth={1.4}
        strokeOpacity={0.45}
        delay={300}
      />
      <GoldPathAnimated
        d="M -30 225 C 90 165, 210 258, 320 185 S 420 88, 450 130"
        strokeWidth={0.7}
        strokeOpacity={0.22}
        delay={700}
      />
      <GoldPathAnimated
        d="M 60 280 C 180 215, 290 272, 375 205 S 445 130, 460 162"
        strokeWidth={0.4}
        strokeOpacity={0.13}
        delay={1100}
      />
    </Svg>
  );
}
