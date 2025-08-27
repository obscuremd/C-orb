import { View, Text, Image, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Link, router } from "expo-router";
import GradientButton from "~/components/LocalComponents/GradientButton";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "~/lib/useColorScheme";
import { useModal } from "~/providers/ModalProvider";
import Otp from "~/components/LocalComponents/ModalElements/SignUpOtp";
import { SignUp } from "~/utils/ClerkFunctions";
import { useSignUp } from "@clerk/clerk-expo";
import SignUpOtp from "~/components/LocalComponents/ModalElements/SignUpOtp";
import CustomAlert from "~/components/LocalComponents/ModalElements/CustomAlert";
import LoaderKitView from "react-native-loader-kit";

export default function index() {
  const { isLoaded, signUp } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const { isDarkColorScheme } = useColorScheme();
  const { setModalVisible, setElement, setPosition } = useModal();
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setLoading(true);
    try {
      const result = await SignUp(signUp, isLoaded, emailAddress, password);
      if (result.status === "success") {
        setModalVisible(true);
        setElement(
          <CustomAlert
            variant="success"
            title={result.title}
            description={result.message}
          />
        );
        setPosition("start");
        setTimeout(() => {
          setPosition("center");
          setElement(<SignUpOtp />);
        }, 2000);
      } else if (result.status === "error") {
        setModalVisible(true);
        setPosition("start");
        setElement(
          <CustomAlert
            variant="destructive"
            title={result.title}
            description={result.message}
          />
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 gap-8 ">
      <View className="gap-2">
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
          end={{ x: 0.5, y: 1 }}
          style={styles.ImageGradient}
        />
        <Text className="font-bold text-title1 text-primary">C-Orb</Text>
        <Text className="font-light text-title2 text-primary">
          Join C-Orb today and discover a community like no other
        </Text>
      </View>
      <View className="gap-4">
        <Input
          placeholder="Email"
          aria-labelledby="inputLabel"
          aria-errormessage="inputError"
          onChangeText={(text) => setEmailAddress(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          aria-labelledby="inputLabel"
          aria-errormessage="inputError"
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View className="flex-row items-center justify-center w-full gap-4">
        {loading ? (
          <LoaderKitView
            style={{ width: 50, height: 50 }}
            name={"BallPulse"}
            animationSpeedMultiplier={1.0} // speed up/slow down animation, default: 1.0, larger is faster
            color={"red"} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
          />
        ) : (
          <>
            <GradientButton
              text="Login"
              width={"50%"}
              onClick={() => {
                [
                  setModalVisible(true),
                  setElement(<Otp />),
                  setPosition("center"),
                ];
              }}
            />

            <Button
              variant={"secondary"}
              className="w-[45%]"
              onPress={() => handleSignUp()}
            >
              <Text className="font-light text-title2 text-primary">
                Sign Up
              </Text>
            </Button>
          </>
        )}
      </View>
      <Link href={"/auth/forgot_password"}>
        <Text className="font-semibold text-title2 text-primary">
          Forgot Password?
        </Text>
      </Link>

      <View className="flex-row items-center justify-center w-full gap-4">
        <Separator />
        <Text className="font-semibold text-title2 text-primary">Or</Text>
        <Separator />
      </View>

      <View className="justify-center w-full gap-4 ">
        <Button variant={"secondary"}>
          <Text className="font-light text-title2 text-primary">
            Continue with Google
          </Text>
        </Button>
        <Button variant={"secondary"}>
          <Text className="font-light text-title2 text-primary">
            Continue with Facebook
          </Text>
        </Button>
        <Button variant={"secondary"}>
          <Text className="font-light text-title2 text-primary">
            Continue with Apple
          </Text>
        </Button>
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
