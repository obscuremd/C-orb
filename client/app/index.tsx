import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function () {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    return <Redirect href={"/(main)/profile/settings"} />;
  } else {
    return <Redirect href={"/auth/splash"} />;
  }
}
