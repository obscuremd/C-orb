import { Image, Text, View } from "react-native";
import { Card, CardHeader } from "./card";
import { LinearGradient } from "expo-linear-gradient";
import { Badge } from "./badge";

interface props {
  button1?: React.ReactNode;
  button2?: React.ReactNode;
  button3?: React.ReactNode;
  badgeGroupText?: string;
  badgeText?: string;
  name?: string;
  username?: string;
  description?: string;
  image?: string;
  profilePicture?: string;
  direction?: "row" | "col";
  spacing?: string;
}

export default function CustomCard({
  direction = "col",
  spacing = "gap-2",
  profilePicture,
  image,
  name,
  username,
  description,
  button1,
  button2,
  button3,
  badgeGroupText,
  badgeText,
}: props) {
  return (
    <Card className={`flex-${direction} ${spacing} p-4`}>
      {/* Header */}
      {(profilePicture || name || username) && (
        <View className={`flex-row items-center gap-1`}>
          {profilePicture && (
            <LinearGradient
              colors={["#0131A1", "#2BD3C6"]} // Border gradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: 3,
                borderRadius: 50,
                alignSelf: "flex-start",
              }}
            >
              <Image
                source={{
                  uri: profilePicture,
                }}
                className="w-10 h-10 rounded-full"
              />
            </LinearGradient>
          )}
          <View className="gap-1">
            <Text className="font-bold text-primary text-body">{name}</Text>
            <Text className="text-primary text-caption">{username}</Text>
          </View>
        </View>
      )}

      {/* Body */}
      {(image || description) && (
        <View className="gap-2">
          <Image
            className="w-full h-40 rounded-lg"
            source={{
              uri: image,
            }}
          />
          <Text className=" text-primary text-caption">{description}</Text>
        </View>
      )}

      {/* Button Group */}
      {(button1 || button2 || button3) && (
        <View className="flex-row items-center gap-2">
          {button1}
          {button2}
          {button3}
        </View>
      )}
      {/* Badge Group */}
      {(badgeGroupText || badgeText) && (
        <View className="gap-2 ">
          <Text className="text-primary text-caption">{badgeGroupText}</Text>
          <Badge style={{ alignSelf: "flex-start" }}>
            <Text className="text-caption">{badgeText}</Text>
          </Badge>
        </View>
      )}
    </Card>
  );
}
