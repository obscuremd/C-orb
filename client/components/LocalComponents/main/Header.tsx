// components/ui/Header.tsx
import { View, Pressable, Image } from "react-native";
import { Menu, Bike } from "lucide-react-native";
import { cn } from "~/lib/utils"; // optional if using className merging
import { useRouter } from "expo-router";
import { Button } from "~/components/ui/button";
import { useColorScheme } from "~/lib/useColorScheme";

export function Header() {
  const router = useRouter();
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="flex-row items-center justify-between h-14 px-4 bg-black">
      {/* Left: Hamburger menu */}
      <Button variant={"outline"}>
        <Menu color={isDarkColorScheme ? "white" : "black"} size={24} />
      </Button>

      {/* Center: Bike icon */}
      <Bike color="#ffffff" size={22} />

      {/* Right: Avatar */}
      <Image
        source={{
          uri: "https://plus.unsplash.com/premium_vector-1682269287900-d96e9a6c188b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8fDB8fHww",
        }}
        className="w-9 h-9 rounded-full"
      />
    </View>
  );
}
