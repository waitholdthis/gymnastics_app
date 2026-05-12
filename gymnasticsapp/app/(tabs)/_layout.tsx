import { Tabs } from "expo-router";
import { Home, Compass } from "lucide-react-native";
import { Platform, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { useAppTheme } from "@/lib/appTheme";

function PremiumTabBackground() {
  const { colors } = useAppTheme();
  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: colors.bg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}
    />
  );
}

export default function TabLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: PremiumTabBackground,
        tabBarLabelPosition: "below-icon",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 0.5,
          ...Platform.select({ web: { overflow: "visible" }, default: {} }),
        },
        tabBarStyle: Platform.select({
          ios: { position: "absolute", backgroundColor: "transparent" },
          default: { backgroundColor: colors.bg, borderTopColor: colors.border },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={21} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Atlas",
          tabBarIcon: ({ color }) => <Compass size={21} color={color} />,
        }}
      />
    </Tabs>
  );
}
