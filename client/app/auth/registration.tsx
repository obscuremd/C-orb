import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { avatarImages } from "~/lib/constants";
import { router } from "expo-router";

export default function index() {
  return (
    <View className="flex-1 gap-8">
      <View className="gap-2">
        <Text className="font-bold text-title1 text-primary">
          Tell us About Yourself
        </Text>
        <Text className="font-light text-title2 text-primary">
          Fill out this form so we can personalize your experience and deliver
          the best service for you.
        </Text>
      </View>
      <View className="gap-4">
        <Image
          source={{
            uri: "https://plus.unsplash.com/premium_vector-1682269287900-d96e9a6c188b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8fDB8fHww",
          }}
          className="w-10 h-10 rounded-full"
        />
        <Text className="font-semibold text-title2 text-primary">
          Select an Avatar
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row gap-4 mt-2"
        >
          {avatarImages.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              className="object-fill w-16 h-16 rounded-full"
            />
          ))}
        </ScrollView>
      </View>
      <View className="gap-4">
        <Input
          placeholder="Username"
          aria-labelledby="inputLabel"
          aria-errormessage="inputError"
        />
        <View className="flex-row items-center gap-4">
          <Input
            className="flex-1"
            placeholder="First Name"
            aria-labelledby="inputLabel"
            aria-errormessage="inputError"
          />
          <Input
            className="flex-1"
            placeholder="Last Name"
            aria-labelledby="inputLabel"
            aria-errormessage="inputError"
          />
        </View>
        <View className="flex-row items-center ">
          <Text className="pl-5 mr-2 text-base text-primary">+234</Text>
          <Input
            className="flex-1"
            placeholder="Phone Number"
            aria-labelledby="inputLabel"
            aria-errormessage="inputError"
          />
        </View>

        <Input
          placeholder="Residential Address"
          aria-labelledby="inputLabel"
          aria-errormessage="inputError"
        />
      </View>
      <Button
        onPress={() =>
          router.push("/auth/forgot_password/recover_password_otp")
        }
      >
        <Text className="font-light text-title2 text-primary-foreground">
          Continue
        </Text>
      </Button>
    </View>
  );
}
