import { FlatList, Image, View, Dimensions, StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEvent } from 'expo';

interface Props {
  media: postMedia[];
}

const screenWidth = Dimensions.get('window').width;

export default function MediaCarousel({ media }: Props) {
  return (
    <FlatList
      data={media}
      horizontal
      pagingEnabled
      contentContainerStyle={{ gap: 10 }}
      renderItem={({ item }) => {
        if (item.mediaType === 'image') {
          return (
            <Image
              source={{ uri: item.url }}
              style={{ width: 300, height: 250, borderRadius: 10 }}
            />
          );
        } else {
          return <VideoPlayer uri={item.url} />;
        }
      }}
      keyExtractor={(_, index) => index.toString()}
    />
  );
}

interface VideoPlayerProps {
  uri: string;
}

export function VideoPlayer({ uri }: VideoPlayerProps) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.play();
  });

  return <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />;
}

const styles = StyleSheet.create({
  media: {
    width: screenWidth - 32,
    height: 300,
    marginRight: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: 250,
  },
});
