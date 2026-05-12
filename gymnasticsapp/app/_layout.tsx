import 'react-native-reanimated';
import '../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeProvider as UIThemeProvider } from '@/components/ui/theme';
import { Spinner } from '@/components/ui';
import AuthScreen from '@/components/AuthScreen';
import ProfileSetup from '@/components/ProfileSetup';
import { DemoDataProvider, api, useQuery } from '@/lib/demoData';
import { AppThemeProvider } from '@/lib/appTheme';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const user = useQuery(api.gymnasts.currentUser);

  if (user === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Spinner size="large" />
      </View>
    );
  }

  if (user === null) {
    return <AuthScreen />;
  }

  if (user && !user.username) {
    return <ProfileSetup />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="wellness-checkin" options={{ headerShown: false }} />
      <Stack.Screen name="skill-roadmap" options={{ headerShown: false }} />
      <Stack.Screen name="parent-academy" options={{ headerShown: false }} />
      <Stack.Screen name="meet-journal" options={{ headerShown: false }} />
      <Stack.Screen name="recovery-lab" options={{ headerShown: false }} />
      <Stack.Screen name="coach-connection" options={{ headerShown: false }} />
      <Stack.Screen name="export-reports" options={{ headerShown: false }} />
      <Stack.Screen name="calendar" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <UIThemeProvider>
          <ThemeProvider value={DarkTheme}>
            <DemoDataProvider>
              <AppContent />
              <StatusBar style="light" />
            </DemoDataProvider>
          </ThemeProvider>
        </UIThemeProvider>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}
