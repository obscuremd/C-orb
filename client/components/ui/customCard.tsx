import { Dimensions, FlatList, Image, Pressable, Text, View } from 'react-native';
import { Card, CardHeader } from './card';
import { LinearGradient } from 'expo-linear-gradient';
import { Badge } from './badge';
import MediaCarousel from '../LocalComponents/MediaCarousel';

interface props {
  headerPress?: () => void;
  button1?: React.ReactNode;
  button2?: React.ReactNode;
  button3?: React.ReactNode;
  badgeGroupText?: string;
  badgeText?: string;
  name?: string;
  username?: string;
  description?: string;
  media: postMedia[];
  profilePicture?: string;
  direction?: 'row' | 'col';
  spacing?: string;
}

export default function CustomCard({
  headerPress,
  direction = 'col',
  spacing = 'gap-2',
  profilePicture,
  media,
  name,
  username,
  description,
  button1,
  button2,
  button3,
  badgeGroupText,
  badgeText,
}: props) {
  const screenWidth = Dimensions.get('window').width;

  return (
    <Card className={`flex-${direction} ${spacing} p-4`}>
      {/* Header */}
      {(profilePicture || name || username) && (
        <Pressable onPress={headerPress} className={`flex-row items-center gap-1`}>
          {profilePicture && (
            <LinearGradient
              colors={['#0131A1', '#2BD3C6']} // Border gradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: 3,
                borderRadius: 50,
                alignSelf: 'flex-start',
              }}>
              <Image
                source={{
                  uri: profilePicture,
                }}
                className="w-10 h-10 rounded-full"
              />
            </LinearGradient>
          )}
          <View className="gap-1">
            <Text className="font-bold text-body text-primary">{name}</Text>
            <Text className="text-caption text-primary">{username}</Text>
          </View>
        </Pressable>
      )}

      {/* Body */}
      {/* Media Carousel */}
      {media?.length > 0 && <MediaCarousel media={media} />}

      {/* Description */}
      {description && <Text className="mt-2 text-caption text-primary">{description}</Text>}

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
        <View className="gap-2">
          <Text className="text-caption text-primary">{badgeGroupText}</Text>
          <Badge style={{ alignSelf: 'flex-start' }}>
            <Text className="text-caption">{badgeText}</Text>
          </Badge>
        </View>
      )}
    </Card>
  );
}
