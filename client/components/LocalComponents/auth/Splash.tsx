import { View } from "react-native";

export default function Splash() {
  return (
    <View className="flex-row gap-8 flex-wrap w-full">
      <View className="w-[200px] h-[200px] border-[1px] border-foreground rounded-full" />
      <View className="w-[100px] h-[100px] border-[1px] border-foreground rounded-full" />
      <View className="w-[100px] h-[100px] border-[1px] border-foreground rounded-full" />
      <View className="w-[200px] h-[200px] border-[1px] border-foreground rounded-full" />
    </View>
  );
}
