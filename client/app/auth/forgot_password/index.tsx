import { View, Text } from "react-native";
import React from "react";
import { Button } from "~/components/ui/button";
import Splash from "~/components/LocalComponents/auth/Splash";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Link, useRouter } from "expo-router";

export default function index() {
  const router = useRouter();

  return (
    <View className="flex-1 gap-8">
      <View className="gap-2">
        <Text className="font-bold text-title1 text-primary">
          Forgot Password ?
        </Text>
        <Text className="font-light text-title2 text-primary">
          Please provide your email address, and a six-digit OTP will be sent to
          assist you in recovering your account.
        </Text>
      </View>
      <View className="gap-8 py-8">
        <Input
          placeholder="Email"
          aria-labelledby="inputLabel"
          aria-errormessage="inputError"
        />
        <Button
          onPress={() =>
            router.push("/auth/forgot_password/recover_password_otp")
          }
        >
          <Text className="font-light text-title2 text-primary-foreground">
            Recover
          </Text>
        </Button>
      </View>
    </View>
  );
}
