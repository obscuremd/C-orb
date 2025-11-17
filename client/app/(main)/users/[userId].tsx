import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import CustomCard from '@/components/ui/customCard';
import { Button } from '@/components/ui/button';
import { Globe, Heart, MapPin, MessageCircle, Send } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import { Separator } from '@/components/ui/separator';
import GradientButton from '@/components/LocalComponents/GradientButton';
import { router, useLocalSearchParams } from 'expo-router';
import { getPosts } from '@/services/PostServices';
import { useModal } from '@/providers/ModalProvider';
import CustomAlert from '@/components/LocalComponents/ModalElements/CustomAlert';
import { GetUser } from '@/services/AuthServices';

export const unstable_settings = {
  // Disables tab bar on this screen
  tabBarStyle: { display: 'none' },
};
const tabs = [
  { label: '23 Posts', value: '23 Posts' },
  { label: '10 Tagged', value: '10 Tagged' },
  { label: '24 Wishlists', value: '24 Wishlists' },
];

export default function index() {
  const { userId } = useLocalSearchParams();
  const { setModalVisible, setElement, setPosition } = useModal();

  const [value, setValue] = useState<string>('23 Posts');
  const { isDarkColorScheme } = useColorScheme();

  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(false);

  const [feedData, setFeedData] = useState<Feed[]>([]);

  const [user, setUser] = useState<User | undefined>(undefined);

  const fetchFeed = async () => {
    try {
      const res = await getPosts(`user:${userId}`);
      if (res.status === 'error' || res.data.length === 0) {
        setModalVisible(true);
        setElement(
          <CustomAlert variant="destructive" title={res.title} description={res.message} />
        );
        setPosition('start');
        setTimeout(() => setModalVisible(false), 5000);
      } else {
        setFeedData(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  async function fetchUser() {
    const response = await GetUser();
    setUser(response.user);
  }

  useEffect(() => {
    setLoading(true);
    fetchFeed().finally(() => setLoading(false));
    fetchUser();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFeed();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 items-center gap-8 p-4">
      <View className="w-full gap-4">
        <Image
          source={{
            uri: user?.coverPicture || '',
          }}
          className="mb-[-100px] h-[180px] w-full rounded-3xl"
        />
        <LinearGradient
          colors={
            isDarkColorScheme
              ? ['rgba(0,0,0,0.0)', '#000000']
              : ['rgba(255,255,255,0.0)', '#F9F9F9']
          }
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
          style={styles.ImageGradient}
        />
        {/* profile */}
        <View className="w-full flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <Image
              source={user?.profilePicture ? { uri: user.profilePicture } : undefined}
              className="h-10 w-10 rounded-full"
            />
            <View className="gap-1">
              <Text className="text-body font-bold text-primary">{user?.email}</Text>
              <Text className="text-caption text-primary">@{user?.username}</Text>
            </View>
          </View>
          <Button variant="secondary" onPress={() => router.push('/(main)/profile/settings')}>
            <Text className="text-primary">Profile Settings</Text>
          </Button>
        </View>

        {/* profile stats */}
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-body font-bold text-primary">{user?.followersCount}</Text>
            <Text className="text-caption text-primary">Followers</Text>
          </View>
          <Separator orientation="vertical" />
          <View className="flex-row items-center gap-2">
            <Text className="text-body font-bold text-primary">{user?.followingCount}</Text>
            <Text className="text-caption text-primary">Followers</Text>
          </View>
        </View>

        {/* profile description */}
        <Text className="text-caption text-primary">{user?.bio}</Text>

        {/* Location and Website */}
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-2">
            <MapPin size={16} color={isDarkColorScheme ? 'white' : 'black'} />
            <Text className="text-caption capitalize text-primary">
              {user?.location || 'Add Location'}
            </Text>
          </View>
          <Separator orientation="vertical" />
          <View className="flex-row items-center gap-2">
            <Globe size={16} color={'#60a5fa'} />
            <Text className="text-caption text-blue-400">{user?.website || '+ Add Link'}</Text>
          </View>
        </View>

        {/* Tab Menu */}
        <View style={{ alignSelf: 'flex-start' }} className="inline-flex flex-row">
          {tabs.map((tab) =>
            value === tab.value ? (
              <GradientButton
                size="sm"
                key={tab.value}
                text={tab.label}
                onClick={() => setValue(tab.value)}
              />
            ) : (
              <Button
                size={'sm'}
                key={tab.value}
                variant="ghost"
                onPress={() => setValue(tab.value)}>
                <Text
                  className={`text-title3 ${
                    value === tab.value ? 'font-semibold text-primary' : 'text-muted-foreground'
                  }`}>
                  {tab.label}
                </Text>
              </Button>
            )
          )}
        </View>

        {/* Card Content */}
        {loading ? (
          <ActivityIndicator />
        ) : feedData.length === 0 ? (
          <Text>No Posts found</Text>
        ) : (
          <FlatList
            data={feedData}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item}-${index}`}
            contentContainerStyle={{ gap: 16, paddingBottom: 150 }}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={({ item }) => (
              <CustomCard
                profilePicture={item.user.profilePicture}
                media={item.media}
                name={item.user.username}
                username={item.location}
                description={item.description}
                button1={
                  <Button
                    variant={'ghost'}
                    size={'icon'}
                    className="flex-row items-center gap-1 p-0">
                    <Heart size={16} color={isDarkColorScheme ? 'white' : 'black'} />
                    <Text className="text-body text-primary">{item.likeCount}</Text>
                  </Button>
                }
                button2={
                  <Button variant={'ghost'} size={'icon'}>
                    <MessageCircle size={16} color={isDarkColorScheme ? 'white' : 'black'} />
                  </Button>
                }
                button3={
                  <Button variant={'ghost'} size={'icon'}>
                    <Send size={16} color={isDarkColorScheme ? 'white' : 'black'} />
                  </Button>
                }
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ImageGradient: {
    width: '100%',
    height: 180,
    position: 'absolute',
    top: 0,
  },
});
