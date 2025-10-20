import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useGen } from "~/providers/GeneralProvider";
import { GetUser } from "~/services/AuthServices";

export default function () {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);
  const { setUser } = useGen();

  useEffect(() => {
    async function CheckIsLoggedIn() {
      setLoading(true);
      try {
        const result = await GetUser();
        setIsSignedIn(result.status);
        if (result.status === true) {
          setUser(result.user);
        }
      } finally {
        setLoading(false);
      }
    }

    CheckIsLoggedIn();
  }, []);

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href={"/(main)/home"} />;
  } else {
    return <Redirect href={"/auth/splash"} />;
  }
}
