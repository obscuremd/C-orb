import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      {/* Main profile page — no header */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Nested pages — only back arrow, no title */}
      <Stack.Screen
        name="settings"
        options={{ title: "", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="badges"
        options={{ title: "", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="points_details"
        options={{ title: "", headerBackTitle: "Back" }}
      />
    </Stack>
  );
}
