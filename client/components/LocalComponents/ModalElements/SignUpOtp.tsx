import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import InputOTP from "~/components/ui/input-otp";
import GradientButton from "../GradientButton";
import { X } from "lucide-react-native";
import { getIconColor } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { useModal } from "~/providers/ModalProvider";
import { VerifyOtpSignUp } from "~/utils/ClerkFunctions";
import { useSignUp } from "@clerk/clerk-expo";
import CustomAlert from "./CustomAlert";

export default function SignUpOtp() {
  const { isLoaded, setActive, signUp } = useSignUp();
  const [code, setCode] = useState("");
  const { isDarkColorScheme } = useColorScheme();
  const { setModalVisible, setElement, setPosition } = useModal();
  const [loading, setLoading] = useState(false);

  const Verify = async () => {
    if (!isLoaded || !signUp) return;
    setLoading(true);
    try {
      const result = await VerifyOtpSignUp(signUp, isLoaded, setActive, code);
      if (result.status === "success") {
        setTimeout(() => {
          setElement(
            <CustomAlert
              variant="success"
              title={result.title}
              description={result.message}
            />
          );
          setPosition("start");
        }, 2000);
        setModalVisible(false);
        router.replace("/(main)/home");
      } else {
        Alert.alert(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="gap-4 p-4 shadow-md rounded-2xl bg-background shadow-black/25">
      <Button
        variant={"outline"}
        size={"icon"}
        className="self-end"
        onPress={() => setModalVisible(false)}
      >
        <X color={isDarkColorScheme ? "white" : "black"} />
      </Button>
      <View className="gap-2">
        <Text className="font-bold text-title1 text-primary">Verify OTP</Text>
        <Text className="font-light text-title2 text-primary">
          Verify the 6 Digit otp sent to your email
        </Text>
      </View>
      <InputOTP length={3} setValue={setCode} />
      <Text className="font-light text-title2 text-primary">
        didn’t recieve OTP? Send Again
      </Text>
      <GradientButton text="Verify" onClick={() => Verify()} />
    </View>
  );
}
