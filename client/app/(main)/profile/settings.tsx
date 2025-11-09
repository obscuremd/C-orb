import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { FeedData, storyImages } from '@/lib/constants';
import CustomCard from '@/components/ui/customCard';
import { Button } from '@/components/ui/button';
import {
  Globe,
  Heart,
  LogOut,
  MapPin,
  MessageCircle,
  PencilIcon,
  PencilLine,
  Send,
  Trash2,
} from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import { faker } from '@faker-js/faker';
import { Separator } from '@/components/ui/separator';
import GradientButton from '@/components/LocalComponents/GradientButton';
import { router } from 'expo-router';
import { Input } from '@/components/ui/input';
import { ScrollView } from 'moti';
import * as SecureStore from 'expo-secure-store';

export default function index() {
  const { isDarkColorScheme } = useColorScheme();
  const [isEditing, setIsEditing] = useState('');

  const [personalInfo, setPersonalInfo] = useState([
    { title: 'Display Name', content: 'obscure' },
    { title: 'Username', content: 'obscure' },
    { title: 'Bio', content: 'Bio placeholder' },
    { title: 'Email', content: 'md.erhenede@gmail.com' },
    { title: 'Password', content: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx' },
  ]);
  const authSettings = [
    {
      title: 'Apple',
      content: 'Connect your Apple account',
      isConnected: false,
    },
    {
      title: 'Google',
      content: 'Connect your google account',
      isConnected: true,
    },
    {
      title: 'Facebook',
      content: 'Connect your Facebook account',
      isConnected: true,
    },
  ];

  async function Logout() {
    try {
      await SecureStore.deleteItemAsync('UserToken');
      router.replace('/auth/splash');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <View className="flex-1 items-center gap-8 p-4">
        <ScrollView
          className="gap- w-full flex-1"
          keyboardShouldPersistTaps="handled" // Add this prop
          contentContainerStyle={{ paddingBottom: 20, gap: 32 }} // Add some bottom padding
        >
          <Image
            source={{
              uri: 'https://plus.unsplash.com/premium_photo-1661719880750-4c0de579cd09?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJpZW5kc3xlbnwwfHwwfHx8MA%3D%3D',
            }}
            className="mb-[-100px] h-[220px] w-full rounded-3xl"
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
          <View className="w-full flex-row items-center justify-center">
            <Image
              source={{
                uri: faker.image.avatar(),
              }}
              className="h-14 w-14 rounded-full"
            />
          </View>
          {/* Personal Info */}
          <View className="flex-col gap-4">
            {/* Heading */}
            <Text className="text-title2 font-bold text-primary">Personal Info</Text>
            {/* contents */}
            <View className="gap-2">
              {personalInfo.map((item, index) =>
                isEditing === item.title ? (
                  <View className="gap-2">
                    <Input
                      placeholder={item.content}
                      aria-labelledby="inputLabel"
                      aria-errormessage="inputError"
                    />
                    <Button>
                      <Text>Save Changes</Text>
                    </Button>
                  </View>
                ) : (
                  <CustomCard
                    media={[]}
                    direction="row"
                    spacing="justify-between"
                    name={item.title}
                    username={item.content}
                    button1={
                      <Button variant={'secondary'}>
                        <PencilLine
                          size={16}
                          color={isDarkColorScheme ? 'white' : 'black'}
                          onPress={() => setIsEditing(item.title)}
                        />
                      </Button>
                    }
                  />
                )
              )}
            </View>
          </View>
          {/*Authorization Settings */}
          <View className="flex-col gap-4">
            {/* Heading */}
            <Text className="text-title2 font-bold text-primary">Authorization Settings</Text>
            {/* contents */}
            <View className="gap-2">
              {authSettings.map((item, index) => (
                <CustomCard
                  media={[]}
                  direction="row"
                  spacing="justify-between"
                  name={item.title}
                  username={item.content}
                  button1={
                    item.isConnected ? (
                      <GradientButton text="Connected" />
                    ) : (
                      <Button variant={'secondary'}>
                        <Text className="text-body font-medium text-primary">Connect</Text>
                      </Button>
                    )
                  }
                />
              ))}
            </View>
          </View>
          {/* More Settings */}
          <View className="flex-col gap-4">
            {/* Heading */}
            <Text className="text-title2 font-bold text-primary">Personal Info</Text>
            {/* contents */}
            <View className="gap-2">
              <CustomCard
                media={[]}
                direction="row"
                spacing="justify-between"
                name="Log Out"
                username="Temporarily Log out of your account"
                button1={
                  <Button variant={'secondary'} onPress={() => Logout()}>
                    <LogOut size={16} color="#f59e0b" />
                  </Button>
                }
              />
              <CustomCard
                media={[]}
                direction="row"
                spacing="justify-between"
                name="Delete Account"
                username="Permanently delete your account"
                button1={
                  <Button variant={'secondary'}>
                    <Trash2 size={16} color="#dc2626" />
                  </Button>
                }
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  ImageGradient: {
    width: '100%',
    height: 220,
    position: 'absolute',
    top: 0,
  },
});
