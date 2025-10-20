import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Link, router } from "expo-router";
import GradientButton from "~/components/LocalComponents/GradientButton";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "~/lib/useColorScheme";
import { useModal } from "~/providers/ModalProvider";
import Otp from "~/components/LocalComponents/ModalElements/Otp";
import CustomAlert from "~/components/LocalComponents/ModalElements/CustomAlert";
import { Authenticate } from "~/services/AuthServices";
import { useGen } from "~/providers/GeneralProvider";

export default function index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isDarkColorScheme } = useColorScheme();
  const { setModalVisible, setElement, setPosition } = useModal();
  const [loading, setLoading] = useState(false);
  const { setUserLoginState } = useGen();

  async function handleAuth() {
    setLoading(true);
    try {
      const result = await Authenticate(email, password);
      if (result.status === "success") {
        setUserLoginState((prev) => ({
          ...prev,
          email: email,
          password: password,
        }));
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
          setElement(<Otp />);
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
          className="w-full h-[200px] mb-[-100px] rounded-3xl"
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
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          aria-labelledby="inputLabel"
          aria-errormessage="inputError"
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View className="">
        {loading ? (
          <ActivityIndicator />
        ) : (
          <GradientButton text="Continue" onClick={() => handleAuth()} />
        )}
      </View>
      <Link href={"/auth/forgot_password"}>
        <Text className="font-semibold text-title2 text-primary">
          Forgot Password?
        </Text>
      </Link>

      {/* <View className="flex-row items-center justify-center w-full gap-4">
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
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  ImageGradient: {
    width: "100%",
    height: 200,
    position: "absolute",
    top: 0,
  },
});
