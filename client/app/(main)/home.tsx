import { View, Text, Pressable, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { storyImages } from '@/lib/constants';
import CustomCard from '@/components/ui/customCard';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Send } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import { getPosts } from '@/services/PostServices';
import { useModal } from '@/providers/ModalProvider';
import CustomAlert from '@/components/LocalComponents/ModalElements/CustomAlert';

const tabs = [
  { label: 'For You', value: 'for-you' },
  { label: 'Popular', value: 'popular' },
  { label: 'New', value: 'new' },
];

export default function index() {
  const { setModalVisible, setElement, setPosition } = useModal();
  const [value, setValue] = useState<string>('for-you');
  const { isDarkColorScheme } = useColorScheme();

  const [feedData, setFeedData] = useState<Feed[]>([]);
  useEffect(() => {
    async function getFeed() {
      const res = await getPosts('all');
      if (res.status === 'error' && res.data === null) {
        setModalVisible(true);
        setElement(
          <CustomAlert variant="destructive" title={res.title} description={res.message} />
        );
        setPosition('start');
        setTimeout(() => {
          setModalVisible(false);
        }, 5000);
      } else {
        setFeedData(res.data);
      }
    }
    getFeed();
  }, []);

  return (
    <View className="flex-1 items-center gap-8 p-4">
      <View className="w-full gap-4">
        {/* Image List */}
        <FlatList
          data={storyImages}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <LinearGradient
              colors={['#0131A1', '#2BD3C6']} // Border gradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: 3,
                borderRadius: 100,
                marginRight: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={{ uri: item }} className="h-10 w-10 rounded-full" />
            </LinearGradient>
          )}
        />

        {/* Tab Menu */}
        <View
          style={{ alignSelf: 'flex-start' }}
          className="inline-flex flex-row gap-2 rounded-lg border-[1px] border-border p-1">
          {tabs.map((tab) => (
            <Button
              key={tab.value}
              variant={value === tab.value ? 'secondary' : 'ghost'}
              onPress={() => setValue(tab.value)}>
              <Text
                className={`text-title3 ${
                  value === tab.value ? 'font-semibold text-primary' : 'text-muted-foreground'
                }`}>
                {tab.label}
              </Text>
            </Button>
          ))}
        </View>

        {/* Card Content */}
        <FlatList
          data={feedData}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item}-${index}`}
          contentContainerStyle={{ gap: 16 }}
          renderItem={({ item }) => (
            <CustomCard
              profilePicture={item.user.profilePicture}
              image={item.postUrl}
              name={item.location}
              username={item.user.username}
              description={item.description}
              button1={
                <Button variant={'secondary'} className="flex-row items-center gap-1">
                  <Heart size={16} color={isDarkColorScheme ? 'white' : 'black'} />
                  <Text className="text-body text-primary">{item.likeCount}</Text>
                </Button>
              }
              button2={
                <Button variant={'secondary'}>
                  <MessageCircle size={16} color={isDarkColorScheme ? 'white' : 'black'} />
                </Button>
              }
              button3={
                <Button variant={'secondary'}>
                  <Send size={16} color={isDarkColorScheme ? 'white' : 'black'} />
                </Button>
              }
            />
          )}
        />
      </View>
    </View>
  );
}
