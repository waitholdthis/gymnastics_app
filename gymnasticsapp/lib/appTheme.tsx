import React, { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";

export const lightColors = {
  bg: "#FFFFFF",
  bgSecondary: "#F8F8F6",
  bgTertiary: "#F0F0EE",
  surface: "#FFFFFF",
  border: "#E8E8E8",
  borderLight: "#F0F0EE",
  text: "#1A1A1A",
  textSecondary: "#555555",
  textMuted: "#888888",
  textDisabled: "#AAAAAA",
  hero: "#1A1A2E",
  heroText: "#FFFFFF",
  heroSubtext: "#9999BB",
  gold: "#D4A843",
  goldBg: "#FDF6E3",
  goldBgLight: "#FFFDF5",
  green: "#16A34A",
  greenBg: "#F0FDF4",
  blue: "#1D5BB5",
  blueBg: "#EFF6FF",
  pink: "#BE185D",
  pinkBg: "#FDF2F8",
  orange: "#C2500A",
  orangeBg: "#FFF0E8",
  red: "#E54B4B",
  redBg: "#FFF0F0",
  backBtnBg: "#F0F0EE",
  backBtnIcon: "#444444",
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
};

export const darkColors = {
  bg: "#0D0D1A",
  bgSecondary: "#1A1A2E",
  bgTertiary: "#252540",
  surface: "#1A1A2E",
  border: "#2A2A3E",
  borderLight: "#252540",
  text: "#FFFFFF",
  textSecondary: "#CCCCDD",
  textMuted: "#9999BB",
  textDisabled: "#666688",
  hero: "#080810",
  heroText: "#FFFFFF",
  heroSubtext: "#9999BB",
  gold: "#D4A843",
  goldBg: "#1E1800",
  goldBgLight: "#181200",
  green: "#22C55E",
  greenBg: "#071A0A",
  blue: "#3B82F6",
  blueBg: "#071530",
  pink: "#EC4899",
  pinkBg: "#1A0710",
  orange: "#F97316",
  orangeBg: "#1A0800",
  red: "#EF4444",
  redBg: "#1A0505",
  backBtnBg: "#252540",
  backBtnIcon: "#AAAAAA",
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
};

export type AppColors = {
  bg: string; bgSecondary: string; bgTertiary: string; surface: string;
  border: string; borderLight: string;
  text: string; textSecondary: string; textMuted: string; textDisabled: string;
  hero: string; heroText: string; heroSubtext: string;
  gold: string; goldBg: string; goldBgLight: string;
  green: string; greenBg: string; blue: string; blueBg: string;
  pink: string; pinkBg: string; orange: string; orangeBg: string;
  red: string; redBg: string;
  backBtnBg: string; backBtnIcon: string;
  shadow: { shadowColor: string; shadowOffset: { width: number; height: number }; shadowOpacity: number; shadowRadius: number; elevation: number };
};

type AppThemeContextType = {
  colors: AppColors;
  isDark: boolean;
  toggleTheme: () => void;
};

const AppThemeContext = createContext<AppThemeContextType>({
  colors: lightColors,
  isDark: false,
  toggleTheme: () => {},
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<"light" | "dark" | null>(null);

  const scheme = override ?? systemScheme ?? "light";
  const isDark = scheme === "dark";
  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = () => setOverride(isDark ? "light" : "dark");

  return (
    <AppThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(AppThemeContext);
}
