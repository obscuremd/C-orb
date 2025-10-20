import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import InputOTP from "~/components/ui/input-otp";
import GradientButton from "../GradientButton";
import { X } from "lucide-react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { useModal } from "~/providers/ModalProvider";
import CustomAlert from "./CustomAlert";
import { VerifyOtp } from "~/services/AuthServices";
import { useGen } from "~/providers/GeneralProvider";

export default function Otp() {
  const { userLoginState } = useGen();
  const [code, setCode] = useState("");
  const { isDarkColorScheme } = useColorScheme();
  const { setModalVisible, setElement, setPosition } = useModal();
  const [loading, setLoading] = useState(false);

  const Verify = async () => {
    setLoading(true);
    try {
      const result = await VerifyOtp(userLoginState.email, Number(code));
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
        if (result.hasAccount) {
          router.replace("/(main)/home");
        } else {
          router.replace("/auth/registration");
        }
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
      {loading ? (
        <ActivityIndicator />
      ) : (
        <GradientButton text="Verify" onClick={() => Verify()} />
      )}
    </View>
  );
}
