/* eslint-disable import/no-unresolved */
import { Dot } from "lucide-react-native";
import { View, TextInput } from "react-native";
import { useRef, useState } from "react";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";

interface Props {
  length?: number;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function InputOTP({ length = 2, setValue }: Props) {
  const { isDarkColorScheme } = useColorScheme();

  // Create a 2D array to store the OTP values
  const [otp, setOtp] = useState(
    Array.from({ length }, () => ["", ""]) // [["", ""], ["", ""]]
  );

  // Create refs for inputs
  const inputRefs = useRef<any>([]);

  const handleChange = (value: string, rowIndex: number, colIndex: number) => {
    const newOtp = [...otp];
    newOtp[rowIndex][colIndex] = value;
    setOtp(newOtp);
    // Auto focus to the next input
    if (value && rowIndex < length) {
      const nextInputIndex = rowIndex * 2 + colIndex + 1;
      inputRefs.current[nextInputIndex]?.focus();
    }
    // Update the parent state
    setValue(newOtp.flat().join(""));
  };

  return (
    <View className="flex-row items-center">
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
