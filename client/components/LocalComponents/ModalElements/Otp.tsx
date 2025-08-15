import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import InputOTP from "~/components/ui/input-otp";
import GradientButton from "../GradientButton";
import { X } from "lucide-react-native";
import { getIconColor } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { useModal } from "~/providers/ModalProvider";

export default function Otp() {
  const [otp, setOtp] = useState("");
  const { isDarkColorScheme } = useColorScheme();
  const { setModalVisible } = useModal();

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
      <InputOTP length={3} setValue={setOtp} />
      <Text className="font-light text-title2 text-primary">
        didn’t recieve OTP? Send Again
      </Text>
      <GradientButton
        text="Verify"
        onClick={() => router.push("/(main)/home")}
      />
    </View>
  );
}
