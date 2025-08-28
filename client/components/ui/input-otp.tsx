/* eslint-disable import/no-unresolved */
import { Dot } from "lucide-react-native";
import { View, TextInput, Keyboard } from "react-native";
import { useRef, useState } from "react";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";

interface Props {
  length?: number; // number of OTP “pairs”
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function InputOTP({ length = 2, setValue }: Props) {
  const { isDarkColorScheme } = useColorScheme();

  // Determine total inputs
  const totalInputs = length <= 3 ? length * 2 : length * 2; // double for small OTP
  const rows = Math.ceil(totalInputs / 2); // 2 inputs per row

  // 2D array for OTP
  const [otp, setOtp] = useState(Array.from({ length: rows }, () => ["", ""]));

  // Refs for inputs
  const inputRefs = useRef<any[]>([]);

  const handleChange = (text: string, rowIndex: number, colIndex: number) => {
    const newOtp = [...otp];

    // Paste support
    if (text.length > 1) {
      let chars = text.split("");
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < 2; c++) {
          newOtp[r][c] = chars.shift() || "";
        }
      }
      setOtp(newOtp);
      setValue(newOtp.flat().join(""));
      if (newOtp.flat().every((char) => char !== "")) Keyboard.dismiss();
      return;
    }

    newOtp[rowIndex][colIndex] = text;
    setOtp(newOtp);
    setValue(newOtp.flat().join(""));

    // Auto focus next input
    let nextIndex = rowIndex * 2 + colIndex + 1;
    if (text && nextIndex < totalInputs) {
      let nextRow = Math.floor(nextIndex / 2);
      let nextCol = nextIndex % 2;
      inputRefs.current[nextIndex]?.focus?.();
    }

    // Dismiss keyboard if last input filled
    if (nextIndex === totalInputs) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e: any, rowIndex: number, colIndex: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[rowIndex][colIndex]) {
      let prevIndex = rowIndex * 2 + colIndex - 1;
      if (prevIndex >= 0) {
        inputRefs.current[prevIndex]?.focus?.();
      }
    }
  };

  return (
    <View className="flex-row items-center gap-2">
      {otp.map((pair, rowIndex) => (
        <View key={rowIndex} className="flex-row items-center">
          <TextInput
            ref={(el) => {
              inputRefs.current[rowIndex * 2] = el;
            }}
            inputMode="numeric"
            value={pair[0]}
            maxLength={1}
            onChangeText={(text) => handleChange(text, rowIndex, 0)}
            className={cn(
              "h-12 w-12 border border-input rounded-l-md text-center text-primary"
            )}
          />
          <TextInput
            ref={(el) => {
              inputRefs.current[rowIndex * 2 + 1] = el;
            }}
            inputMode="numeric"
            value={pair[1]}
            maxLength={1}
            onChangeText={(text) => handleChange(text, rowIndex, 1)}
            className={cn(
              "h-12 w-12 border border-input rounded-r-md text-center text-primary"
            )}
          />
          {rowIndex < otp.length - 1 && (
            <Dot size={24} color={isDarkColorScheme ? "white" : "black"} />
          )}
        </View>
      ))}
    </View>
  );
}
