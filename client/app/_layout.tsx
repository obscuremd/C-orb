import '@/global.css';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Appearance, Platform, Text, View } from 'react-native';
import { PortalHost } from '@rn-primitives/portal';
import { useFonts } from '@expo-google-fonts/bai-jamjuree/useFonts';
import { BaiJamjuree_200ExtraLight } from '@expo-google-fonts/bai-jamjuree/200ExtraLight';
import { BaiJamjuree_200ExtraLight_Italic } from '@expo-google-fonts/bai-jamjuree/200ExtraLight_Italic';
import { BaiJamjuree_300Light } from '@expo-google-fonts/bai-jamjuree/300Light';
import { BaiJamjuree_300Light_Italic } from '@expo-google-fonts/bai-jamjuree/300Light_Italic';
import { BaiJamjuree_400Regular } from '@expo-google-fonts/bai-jamjuree/400Regular';
import { BaiJamjuree_400Regular_Italic } from '@expo-google-fonts/bai-jamjuree/400Regular_Italic';
import { BaiJamjuree_500Medium } from '@expo-google-fonts/bai-jamjuree/500Medium';
import { BaiJamjuree_500Medium_Italic } from '@expo-google-fonts/bai-jamjuree/500Medium_Italic';
import { BaiJamjuree_600SemiBold } from '@expo-google-fonts/bai-jamjuree/600SemiBold';
import { BaiJamjuree_600SemiBold_Italic } from '@expo-google-fonts/bai-jamjuree/600SemiBold_Italic';
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree/700Bold';
import { BaiJamjuree_700Bold_Italic } from '@expo-google-fonts/bai-jamjuree/700Bold_Italic';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { useColorScheme } from '@/lib/useColorScheme';
import { NAV_THEME } from '@/lib/constants';
import { GeneralProvider } from '@/providers/GeneralProvider';
import { ModalProvider, useModal } from '@/providers/ModalProvider';
import CustomModal from '@/components/LocalComponents/CustomModal';
import { setAndroidNavigationBar } from '@/lib/android-navigation-bar';
import app from '@/services/firebaseconfig';

app;

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const usePlatformSpecificSetup = Platform.select({
  web: useSetWebBackgroundClassName,
  android: useSetAndroidNavigationBar,
  default: noop,
});

export default function RootLayout() {
  usePlatformSpecificSetup();

  const [fontsLoaded] = useFonts({
    BaiJamjuree_200ExtraLight,
    BaiJamjuree_200ExtraLight_Italic,
    BaiJamjuree_300Light,
    BaiJamjuree_300Light_Italic,
    BaiJamjuree_400Regular,
    BaiJamjuree_400Regular_Italic,
    BaiJamjuree_500Medium,
    BaiJamjuree_500Medium_Italic,
    BaiJamjuree_600SemiBold,
    BaiJamjuree_600SemiBold_Italic,
    BaiJamjuree_700Bold,
    BaiJamjuree_700Bold_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <GeneralProvider>
      <ModalProvider>
        <InnerLayout />
      </ModalProvider>
    </GeneralProvider>
  );
}

function InnerLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const { modalVisible } = useModal();

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <View className="relative flex-1 font-sans text-primary">
        {modalVisible && <CustomModal />}
        <Slot />
      </View>
      <PortalHost />
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

function useSetWebBackgroundClassName() {
  useIsomorphicLayoutEffect(() => {
    // Adds the background color to the html element to prevent white background on overscroll.
    document.documentElement.classList.add('bg-background');
  }, []);
}

function useSetAndroidNavigationBar() {
  React.useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? 'light');
  }, []);
}

function noop() {}
