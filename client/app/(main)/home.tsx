import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { storyImages } from '@/lib/constants';
import CustomCard from '@/components/ui/customCard';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Send } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import { getPosts } from '@/services/PostServices';
import { useModal } from '@/providers/ModalProvider';
import CustomAlert from '@/components/LocalComponents/ModalElements/CustomAlert';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useGen } from '@/providers/GeneralProvider';

const tabs = [
  { label: 'For You', value: 'for-you' },
  { label: 'Popular', value: 'popular' },
  { label: 'New', value: 'new' },
];

export default function index() {
  const router = useRouter();
  const { setModalVisible, setElement, setPosition } = useModal();
  const { user } = useGen();
  const [value, setValue] = useState<string>('for-you');
  const { isDarkColorScheme } = useColorScheme();

  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(false);

  const [feedData, setFeedData] = useState<Feed[]>([]);

  const fetchFeed = async () => {
    try {
      const res = await getPosts('all');
      if (res.status === 'error' || res.data.length === 0) {
        setModalVisible(true);
        setElement(
          <CustomAlert variant="destructive" title={res.title} description={res.message} />
        );
        setPosition('start');
        setTimeout(() => setModalVisible(false), 5000);
      } else {
        setFeedData(res.data);
        // console.log('data:', JSON.stringify(res.data, null, 2));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchFeed().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFeed();
    setRefreshing(false);
  };

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  function handleNavigation(id: string) {
    if (user?.id === id) {
      router.push('/(main)/profile');
    } else {
      router.push({
        pathname: '/(main)/users/[userId]',
        params: { userId: id },
      });
    }
  }

  return (
    <GestureHandlerRootView style={styles.container}>
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
                size={'sm'}
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
                  headerPress={() => handleNavigation(item.user.id)}
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
                      <Heart
                        size={16}
                        color={item.isLiked ? 'red' : isDarkColorScheme ? 'white' : 'black'}
                      />
                      <Text className="text-body text-primary">{item.likeCount}</Text>
                    </Button>
                  }
                  button2={
                    <Button
                      onPress={() => bottomSheetRef.current?.expand()}
                      variant={'ghost'}
                      size={'icon'}
                      className="flex-row items-center gap-1 p-0">
                      <MessageCircle size={16} color={isDarkColorScheme ? 'white' : 'black'} />
                      <Text className="text-body text-primary">{item.commentCount}</Text>
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
        <BottomSheet
          ref={bottomSheetRef}
          index={-1} // 👈 start closed
          snapPoints={['40%', '70%']} // 👈 add snap points
          enablePanDownToClose={true} // 👈 swipe down to close
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior="close" // 👈 close on outside press
            />
          )}>
          <BottomSheetView style={styles.contentContainer}>
            <Text>Awesome 🎉</Text>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});
