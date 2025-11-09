import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Image as ImageIcon } from 'lucide-react-native';
import { Image, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useModal } from '@/providers/ModalProvider';
import { Input } from '@/components/ui/input';
import { createPost } from '@/services/PostServices';
import CustomAlert from './CustomAlert';

export default function CreatePost() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const { setModalVisible, setElement, setPosition } = useModal();

  const [loading, setLoading] = useState(false);

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
  const isDisabled = loading || !image || description.length < 10 || location.length < 5;

  async function makePost() {
    setLoading(true);
    try {
      const res = await createPost({
        Description: description,
        Post: image!, // ✅ MUST pass the image uri here
        Location: location,
        TagIds: [1, 2, 3, 4, 5, 6], // ✅
      });
      if (res.status === 'error') {
        setModalVisible(true);
        setElement(
          <CustomAlert variant="destructive" title={res.title} description={res.message} />
        );
        setPosition('start');
        setTimeout(() => setModalVisible(false), 5000);
      } else {
        setModalVisible(true);
        setElement(<CustomAlert variant="success" title={res.title} description={res.message} />);
        setPosition('start');
        setTimeout(() => setModalVisible(false), 5000);
        setImage(null);
        setDescription('');
        setLocation('');
      }
    } finally {
      setLoading(false);
    }
  }
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
        <Input
          placeholder="Description (min 10 chars)"
          value={description}
          onChangeText={setDescription}
        />
        <Input placeholder="Location" onChangeText={setLocation} />
      </CardContent>
      <CardFooter className="w-full gap-2">
        <Button className="w-1/2" onPress={makePost} disabled={isDisabled}>
          <Text className="text-sm font-light text-secondary">
            {loading ? 'Uploading...' : 'Upload'}
          </Text>
        </Button>
        <Button className="w-1/2" variant={'secondary'} onPress={() => setModalVisible(false)}>
          <Text className="text-sm font-light text-primary">Close</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
