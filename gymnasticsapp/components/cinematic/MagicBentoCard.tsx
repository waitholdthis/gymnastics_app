import React, { useCallback, useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useAppTheme } from "@/lib/appTheme";

// 8 particles evenly spaced in a circle
const ANGLES = Array.from({ length: 8 }, (_, i) => (i * Math.PI * 2) / 8);

function Particle({
  angle,
  color,
  trigger,
}: {
  angle: number;
  color: string;
  trigger: number;
}) {
  const dist = useSharedValue(0);
  const opacity = useSharedValue(0);
  const sz = useSharedValue(0);

  useEffect(() => {
    if (trigger === 0) return;
    dist.value = 0;
    opacity.value = 0;
    sz.value = 0;

    const radius = 26 + Math.random() * 18;
    dist.value = withTiming(radius, {
      duration: 480,
      easing: Easing.out(Easing.exp),
    });
    sz.value = withSequence(
      withTiming(1, { duration: 130 }),
      withTiming(0, { duration: 290, easing: Easing.in(Easing.ease) })
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 400 })
    );
  }, [trigger]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.cos(angle) * dist.value },
      { translateY: Math.sin(angle) * dist.value },
      { scale: sz.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 4,
          height: 4,
          marginLeft: -2,
          marginTop: -2,
          borderRadius: 2,
          backgroundColor: color,
        },
        animStyle,
      ]}
    />
  );
}

interface MagicBentoCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  /** Layout styles: flex, height, width, etc. */
  style?: object;
  glowColor?: string;
  enableTilt?: boolean;
  enableParticles?: boolean;
}

export function MagicBentoCard({
  children,
  onPress,
  style,
  glowColor,
  enableTilt = true,
  enableParticles = true,
}: MagicBentoCardProps) {
  const { colors } = useAppTheme();
  const color = glowColor ?? colors.gold;

  const scale = useSharedValue(1);
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const glowAnim = useSharedValue(0);

  const [pTrigger, setPTrigger] = useState(0);
  const cardSize = useRef({ w: 160, h: 160 });
  const isPressed = useRef(false);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 900 },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
      { scale: scale.value },
    ],
    shadowOpacity: glowAnim.value * 0.55,
  }));

  const borderGlowStyle = useAnimatedStyle(() => ({
    opacity: glowAnim.value,
  }));

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    cardSize.current = {
      w: e.nativeEvent.layout.width,
      h: e.nativeEvent.layout.height,
    };
  }, []);

  const onPressIn = useCallback(() => {
    isPressed.current = true;
    scale.value = withSpring(0.96, { damping: 22, stiffness: 400 });
    glowAnim.value = withTiming(1, { duration: 180 });
    if (enableParticles) setPTrigger((t) => t + 1);
  }, [enableParticles]);

  const onPressOut = useCallback(() => {
    isPressed.current = false;
    scale.value = withSpring(1, { damping: 15, stiffness: 180 });
    glowAnim.value = withTiming(0, { duration: 420 });
    rotateX.value = withSpring(0, { damping: 18, stiffness: 180 });
    rotateY.value = withSpring(0, { damping: 18, stiffness: 180 });
  }, []);

  const onTouchMove = useCallback(
    (e: any) => {
      if (!enableTilt || !isPressed.current) return;
      const { locationX: lx, locationY: ly } = e.nativeEvent;
      const { w, h } = cardSize.current;
      rotateX.value = withTiming(((ly / h) - 0.5) * -14, { duration: 80 });
      rotateY.value = withTiming(((lx / w) - 0.5) * 14, { duration: 80 });
    },
    [enableTilt]
  );

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onTouchMove={onTouchMove}
      style={style}
    >
      <Animated.View
        onLayout={onLayout}
        style={[
          {
            flex: 1,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 18,
          },
          cardStyle,
        ]}
      >
        {/* Animated gold border glow overlay */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: color,
            },
            borderGlowStyle,
          ]}
        />

        {children}

        {/* Gold particle burst on press */}
        {enableParticles &&
          ANGLES.map((angle, i) => (
            <Particle key={i} angle={angle} color={color} trigger={pTrigger} />
          ))}
      </Animated.View>
    </Pressable>
  );
}
