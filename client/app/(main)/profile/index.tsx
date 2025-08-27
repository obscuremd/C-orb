import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  StyleSheet,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { FeedData, storyImages } from "~/lib/constants";
import CustomCard from "~/components/ui/customCard";
import { Button } from "~/components/ui/button";
import { Globe, Heart, MapPin, MessageCircle, Send } from "lucide-react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { faker } from "@faker-js/faker";
import { Separator } from "~/components/ui/separator";
import GradientButton from "~/components/LocalComponents/GradientButton";
import { router } from "expo-router";

const tabs = [
  { label: "23 Posts", value: "23 Posts" },
  { label: "10 Tagged", value: "10 Tagged" },
  { label: "24 Wishlists", value: "24 Wishlists" },
];

export default function index() {
  const [value, setValue] = useState<string>("23 Posts");
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="items-center flex-1 gap-8 p-4">
      <View className="w-full gap-4">
        <Image
          source={{
            uri: "https://plus.unsplash.com/premium_photo-1661719880750-4c0de579cd09?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJpZW5kc3xlbnwwfHwwfHx8MA%3D%3D",
          }}
          className="w-full h-[180px] mb-[-100px] rounded-3xl"
        />
        <LinearGradient
          colors={
            isDarkColorScheme
              ? ["rgba(0,0,0,0.0)", "#000000"]
              : ["rgba(255,255,255,0.0)", "#F9F9F9"]
          }
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
          style={styles.ImageGradient}
        />
        {/* profile */}
        <View className="flex-row items-center justify-between w-full">
          <View className="flex-row items-center gap-1">
            <Image
              source={{
                uri: faker.image.avatar(),
              }}
              className="w-10 h-10 rounded-full"
            />
            <View className="gap-1">
              <Text className="font-bold text-primary text-body">
                Erhenede Mudiaga
              </Text>
              <Text className="text-primary text-caption">@obscure</Text>
            </View>
          </View>
          <Button
            variant="secondary"
            onPress={() => router.push("/(main)/profile/settings")}
          >
            <Text className="text-primary">Profile Settings</Text>
          </Button>
        </View>

        {/* profile stats */}
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-2">
            <Text className="font-bold text-primary text-body">150.7k</Text>
            <Text className="text-primary text-caption">Followers</Text>
          </View>
          <Separator orientation="vertical" />
          <View className="flex-row items-center gap-2">
            <Text className="font-bold text-primary text-body">150.7k</Text>
            <Text className="text-primary text-caption">Followers</Text>
          </View>
        </View>

        {/* profile description */}
        <Text className="text-primary text-caption">
          Content Creator | Affiliate Marketer | I talk about design and how to
          make money.
        </Text>

        {/* Location and Website */}
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-2">
            <MapPin size={16} color={isDarkColorScheme ? "white" : "black"} />
            <Text className="text-primary text-caption">Add Location</Text>
          </View>
          <Separator orientation="vertical" />
          <View className="flex-row items-center gap-2">
            <Globe size={16} color={isDarkColorScheme ? "white" : "black"} />
            <Text className="text-primary text-caption">obs-portfolio.com</Text>
          </View>
        </View>

        {/* Tab Menu */}
        <View
          style={{ alignSelf: "flex-start" }}
          className="inline-flex flex-row "
        >
          {tabs.map((tab) =>
            value === tab.value ? (
              <GradientButton
                key={tab.value}
                text={tab.label}
                onClick={() => setValue(tab.value)}
              />
            ) : (
              <Button
                key={tab.value}
                variant="ghost"
                onPress={() => setValue(tab.value)}
              >
                <Text
                  className={`text-title3 ${
                    value === tab.value
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </Text>
              </Button>
            )
          )}
        </View>

        {/* Card Content */}
        <FlatList
          data={FeedData}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item}-${index}`}
          contentContainerStyle={{ gap: 16 }}
          renderItem={({ item }) => (
            <CustomCard
              profilePicture={item.profilePicture}
              image={item.image}
              name={item.name}
              username={item.username}
              description={item.description}
              button1={
                <Button
                  variant={"secondary"}
                  className="flex-row items-center gap-1"
                >
                  <Heart
                    size={16}
                    color={isDarkColorScheme ? "white" : "black"}
                  />
                  <Text className="text-primary text-body">{item.likes}k</Text>
                </Button>
              }
              button2={
                <Button variant={"secondary"}>
                  <MessageCircle
                    size={16}
                    color={isDarkColorScheme ? "white" : "black"}
                  />
                </Button>
              }
              button3={
                <Button variant={"secondary"}>
                  <Send
                    size={16}
                    color={isDarkColorScheme ? "white" : "black"}
                  />
                </Button>
              }
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ImageGradient: {
    width: "100%",
    height: 180,
    position: "absolute",
    top: 0,
  },
});
