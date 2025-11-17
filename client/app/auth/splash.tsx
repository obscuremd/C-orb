/* eslint-disable import/no-unresolved */
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useRef, useState } from 'react';
import Swiper from 'react-native-swiper';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '@/components/LocalComponents/GradientButton';
import { onboardingData } from '@/lib/constants';

export default function Welcome() {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastIndex = activeIndex === onboardingData.length - 1;

  return (
    <SafeAreaView className="flex-1 p-4">
      <Swiper
        ref={swiperRef}
        loop={false}
        className="flex-1"
        dot={<View className="mx-1 h-[4px] w-[34px] rounded-full bg-muted-foreground" />}
        activeDot={
          <View className="mx-1 h-[4px] w-[34px] overflow-hidden rounded-full">
            <LinearGradient
              colors={['#0131A1', '#2BD3C6']} // Border gradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.outerGradient}
            />
          </View>
        }
        paginationStyle={{ bottom: -10 }}
        onIndexChanged={(index) => setActiveIndex(index)}>
        {onboardingData.map((item) => (
          <View key={item.id} className="">
            <Image
              source={item.image}
              className="h-[310px] w-full rounded-3xl"
              resizeMode="cover"
            />
            <View className="gap-4">
              <Text className="text-h2 text-center font-bold text-foreground">{item.title}</Text>
              <Text className="text-T2 font-BaiJamjureeMedium text-center text-muted-foreground">
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </Swiper>
      <View className="pb-24 pt-12">
        <GradientButton
          width={'100%'}
          text={isLastIndex ? 'Get Started' : 'Next'}
          onClick={() => {
            if (isLastIndex) {
              router.push('/auth/login');
            } else {
              swiperRef.current?.scrollBy(1);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerGradient: {
    padding: 2,
    borderRadius: 12,
  },
  innerBlur: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Add subtle tint over blur
    overflow: 'hidden', // Important for rounded corners with blur
  },
});
