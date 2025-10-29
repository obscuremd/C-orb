// components/ui/Header.tsx
import { View, Pressable, Image, Text } from 'react-native';
import { Menu, Bike, Plus, MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { useColorScheme } from '@/lib/useColorScheme';
import { useModal } from '@/providers/ModalProvider';
import CreatePost from '../ModalElements/CreatePost';

export function Header() {
  const router = useRouter();
  const { isDarkColorScheme } = useColorScheme();
  const { setModalVisible, setElement, setPosition } = useModal();

  return (
    <View className="h-14 flex-row items-center justify-between bg-black px-4">
      <View className="flex-row items-center gap-2">
        <Image
          source={require('../../../assets/images/favicon.png')}
          className="h-9 w-9 rounded-full"
        />
        <Text className="text-title1 font-bold text-primary">C-Orb</Text>
      </View>
      {/* Left: Hamburger menu */}
      <View className="flex-row gap-3 pt-4">
        <Button
          onPress={() => [setModalVisible(true), setElement(<CreatePost />), setPosition('center')]}
          size={'icon'}
          variant={'outline'}>
          <Plus color={isDarkColorScheme ? 'white' : 'black'} size={24} />
        </Button>
        <Button size={'icon'} variant={'outline'}>
          <MessageCircle color={isDarkColorScheme ? 'white' : 'black'} size={24} />
        </Button>
      </View>
    </View>
  );
}
