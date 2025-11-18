import { Stack, Tabs } from 'expo-router';
import { History, HomeIcon, MessageCircle, Search, ShoppingCart, Text } from 'lucide-react-native';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/LocalComponents/main/Header';
import { useColorScheme } from '@/lib/useColorScheme';
import { GetUser } from '@/services/AuthServices';
import { useGen } from '@/providers/GeneralProvider';
import { useEffect } from 'react';

const GITHUB_AVATAR_URI =
  'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg?semt=ais_hybrid';

export default function () {
  const { setUser } = useGen();
  const { isDarkColorScheme } = useColorScheme();

  async function fetchUser() {
    const response = await GetUser();
    setUser(response.user);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <Tabs
        screenOptions={{
          header: () => <Header />, // ← Custom header here
          tabBarActiveTintColor: isDarkColorScheme ? '#FAFAFA' : '#09090B',
          tabBarInactiveTintColor: isDarkColorScheme ? '#A1A1AA' : '#71717A',
          tabBarStyle: {
            // paddingTop: 100,
          },
        }}>
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused }) => (
              <HomeIcon
                size={focused ? 25 : 20}
                color={
                  isDarkColorScheme
                    ? focused
                      ? '#FAFAFA'
                      : '#A1A1AA'
                    : focused
                      ? '#09090B'
                      : '#71717A'
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ focused }) => (
              <Search
                size={focused ? 25 : 20}
                color={
                  isDarkColorScheme
                    ? focused
                      ? '#FAFAFA'
                      : '#A1A1AA'
                    : focused
                      ? '#09090B'
                      : '#71717A'
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            tabBarIcon: ({ focused }) => (
              <ShoppingCart
                size={focused ? 25 : 20}
                color={
                  isDarkColorScheme
                    ? focused
                      ? '#FAFAFA'
                      : '#A1A1AA'
                    : focused
                      ? '#09090B'
                      : '#71717A'
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={{
                  uri: 'https://plus.unsplash.com/premium_vector-1682269287900-d96e9a6c188b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8fDB8fHww',
                }}
                className={`rounded-full ${
                  focused ? 'h-7 w-7 border-2 border-primary' : 'h-5 w-5'
                }`}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
