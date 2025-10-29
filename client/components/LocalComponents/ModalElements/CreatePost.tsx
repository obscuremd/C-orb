import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Image as ImageIcon } from 'lucide-react-native';
import { Image, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useModal } from '@/providers/ModalProvider';
import { Input } from '@/components/ui/input';

export default function CreatePost() {
  const [image, setImage] = useState<string | null>(null);
  const { setModalVisible } = useModal();

  // image picker
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log(result);
    } else {
      alert('You did not select any image.');
    }
  };
  return (
    <Card>
      <CardHeader>
        <Text className="text-lg text-primary">Create Post</Text>
        <Text className="text-sm font-light text-primary">
          Share what's on your mind with everyone
        </Text>
      </CardHeader>
      <CardContent className="gap-2">
        {image === null ? (
          <Button onPress={pickImageAsync}>
            <ImageIcon />
          </Button>
        ) : (
          <Image source={{ uri: image }} className="h-20 w-20" />
        )}
        <Input placeholder="Description" />
      </CardContent>
      <CardFooter className="w-full gap-2">
        <Button className="w-1/2">
          <Text className="text-sm font-light text-secondary">Upload</Text>
        </Button>
        <Button className="w-1/2" variant={'secondary'} onPress={() => setModalVisible(false)}>
          <Text className="text-sm font-light text-primary">Close</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
