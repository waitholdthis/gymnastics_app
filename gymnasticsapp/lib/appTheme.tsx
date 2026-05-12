import React, { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";

export const darkColors = {
  bg: "#08080E",
  bgSecondary: "#0D0D1A",
  bgTertiary: "#141428",
  surface: "#0D0D1C",
  glass: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.09)",
  border: "rgba(255,255,255,0.09)",
  borderLight: "rgba(255,255,255,0.05)",
  text: "#F5F5F5",
  textSecondary: "#CCCCDD",
  textMuted: "#9999BB",
  textDisabled: "#555577",
  hero: "#05050C",
  heroText: "#F5F5F5",
  heroSubtext: "rgba(245,245,245,0.55)",
  gold: "#D4AF37",
  goldBg: "rgba(212,175,55,0.10)",
  goldBgLight: "rgba(212,175,55,0.05)",
  goldGlow: "rgba(212,175,55,0.20)",
  green: "#22C55E",
  greenBg: "rgba(34,197,94,0.10)",
  blue: "#3B82F6",
  blueBg: "rgba(59,130,246,0.10)",
  pink: "#EC4899",
  pinkBg: "rgba(236,72,153,0.10)",
  orange: "#F97316",
  orangeBg: "rgba(249,115,22,0.10)",
  red: "#EF4444",
  redBg: "rgba(239,68,68,0.10)",
  backBtnBg: "rgba(255,255,255,0.07)",
  backBtnIcon: "#AAAACC",
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
};

export const lightColors = {
  bg: "#FAFAFA",
  bgSecondary: "#F4F4F6",
  bgTertiary: "#ECECEF",
  surface: "#FFFFFF",
  glass: "rgba(0,0,0,0.02)",
  glassBorder: "rgba(0,0,0,0.07)",
  border: "rgba(0,0,0,0.08)",
  borderLight: "rgba(0,0,0,0.04)",
  text: "#0A0A0E",
  textSecondary: "#44445A",
  textMuted: "#7777AA",
  textDisabled: "#AAAACC",
  hero: "#0A0A1A",
  heroText: "#F5F5F5",
  heroSubtext: "rgba(245,245,245,0.55)",
  gold: "#B8921E",
  goldBg: "rgba(184,146,30,0.08)",
  goldBgLight: "rgba(184,146,30,0.04)",
  goldGlow: "rgba(184,146,30,0.15)",
  green: "#16A34A",
  greenBg: "rgba(22,163,74,0.08)",
  blue: "#1D4ED8",
  blueBg: "rgba(29,78,216,0.08)",
  pink: "#BE185D",
  pinkBg: "rgba(190,24,93,0.08)",
  orange: "#C2500A",
  orangeBg: "rgba(194,80,10,0.08)",
  red: "#DC2626",
  redBg: "rgba(220,38,38,0.08)",
  backBtnBg: "rgba(0,0,0,0.06)",
  backBtnIcon: "#333344",
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
};

export type AppColors = typeof darkColors;

type AppThemeContextType = {
  colors: AppColors;
  isDark: boolean;
  toggleTheme: () => void;
};

const AppThemeContext = createContext<AppThemeContextType>({
  colors: darkColors,
  isDark: true,
  toggleTheme: () => {},
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<"light" | "dark" | null>("dark");

  const scheme = override ?? systemScheme ?? "dark";
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
