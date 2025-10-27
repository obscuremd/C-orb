import { Slot, Stack } from 'expo-router';
import { Bike } from 'lucide-react-native';
import { View } from 'react-native';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useColorScheme } from '@/lib/useColorScheme';

export default function AuthLayout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerLeft: () => <Bike color={isDarkColorScheme ? 'white' : 'black'} />,
        headerRight: () => <ThemeToggle />,
        title: '',
        contentStyle: { paddingHorizontal: 16 },
        headerShadowVisible: false,
      }}>
      <Slot />
    </Stack>
  );
}
