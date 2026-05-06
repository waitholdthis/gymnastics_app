import React, { useRef } from "react";
import { Animated, Pressable, PressableProps } from "react-native";

interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
  scaleDown?: number;
}

export function AnimatedPressable({ children, scaleDown = 0.96, onPress, style, ...props }: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, { toValue: scaleDown, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
  };

  return (
    <Pressable onPressIn={pressIn} onPressOut={pressOut} onPress={onPress} {...props}>
      <Animated.View style={[{ transform: [{ scale }] }, style as any]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
